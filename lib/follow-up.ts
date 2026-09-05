import prisma from '@/lib/db';
import { decrypt } from '@/lib/crypto';
import { sendChannelMessage, SocialChannel } from '@/lib/social';
import { serverLogger } from '@/lib/logger';

/**
 * Check all active pages with followUpEnabled and dispatch automated follow-up messages
 * to customers who have seen/read the last response or remained inactive for the configured wait time.
 */
export async function runFollowUpAutomation(): Promise<{
  scannedPages: number;
  sentCount: number;
  results: Array<{ pageId: string; conversationId: string; customer: string; status: string }>;
}> {
  const results: Array<{ pageId: string; conversationId: string; customer: string; status: string }> = [];
  let sentCount = 0;

  try {
    const activePages = await prisma.page.findMany({
      where: {
        followUpEnabled: true,
        connectionStatus: 'CONNECTED',
      },
    });

    for (const page of activePages) {
      const waitMinutes = page.followUpWaitMinutes || 30;
      const cutoffTime = new Date(Date.now() - waitMinutes * 60 * 1000);

      // Determine recurrence interval
      // ONCE: only send 1 time ever
      // DAILY: 24 hours gap between subsequent messages
      // CUSTOM_INTERVAL: user-defined hours gap (e.g. 6, 12, 48 hours)
      const intervalHours = page.followUpFrequency === 'DAILY'
        ? 24
        : page.followUpFrequency === 'CUSTOM_INTERVAL'
        ? (page.followUpIntervalHours || 24)
        : 87600; // ~10 years for ONCE
      const minGapTime = new Date(Date.now() - intervalHours * 60 * 60 * 1000);
      const maxCount = page.followUpMaxCount || 1;

      const pageAccessToken = decrypt(page.pageAccessTokenEncrypted);
      if (!pageAccessToken) continue;

      let extraConfig = {};
      if (page.extraConfig) {
        try {
          extraConfig = JSON.parse(page.extraConfig);
        } catch (_) {}
      }

      // Find candidates for this page
      const candidates = await prisma.conversation.findMany({
        where: {
          pageId: page.id,
          status: 'ACTIVE',
          aiEnabled: true,
          // Has seen/read or last message was before cutoff
          lastMessageAt: { lte: cutoffTime },
          // Maximum follow-up count condition
          followUpSentCount: { lt: maxCount },
          OR: [
            { lastFollowUpSentAt: null },
            { lastFollowUpSentAt: { lte: minGapTime } },
          ],
        },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        take: 20, // process in safe batches
      });

      for (const conv of candidates) {
        const lastMsg = conv.messages[0];

        // Only send follow-up if the LAST message was OUTGOING (the store replied, and customer didn't respond)
        if (!lastMsg || lastMsg.direction !== 'OUTGOING') {
          continue;
        }

        // If followUpOnlySeen is ON, ensure customer actually viewed/seen the message
        if (page.followUpOnlySeen) {
          if (!conv.lastSeenAt) {
            continue; // Skip because customer hasn't seen it yet
          }
          // If seen, ensure the seen timestamp occurred before or at cutoff time
          if (conv.lastSeenAt > cutoffTime) {
            continue; // Customer viewed it recently, give them more time
          }
        } else {
          // followUpOnlySeen is OFF: Follow up on ALL unreplied customers (Seen or Unseen) after waitMinutes
          const effectiveLastActivity = conv.lastSeenAt && conv.lastSeenAt > conv.lastMessageAt
            ? conv.lastSeenAt
            : conv.lastMessageAt;

          if (effectiveLastActivity > cutoffTime) {
            continue; // Not enough time has passed since last activity
          }
        }

        // Craft friendly personalized follow-up message
        const customerDisplayName = conv.customerName?.split(' ')[0] || 'স্যার/ম্যাম';
        let followUpText = page.followUpMessage?.trim();

        if (!followUpText) {
          // Default human-like sales follow-up templates based on reply language
          if (page.replyLanguage === 'ENGLISH') {
            followUpText = `Hi ${customerDisplayName}, just following up to see if you have any questions or need help placing your order? We're right here to assist you! 😊`;
          } else if (page.replyLanguage === 'BANGLISH') {
            followUpText = `Assalamu Alaikum ${customerDisplayName}! Apnar product ti niye kono proshno chilo kina jante chailam? Kono help lagle kindly bolben, amra delivery confirm kore dibo! 😊`;
          } else {
            followUpText = `আসসালামু আলাইকুম ${customerDisplayName}! আপনার পছন্দের পণ্যটি নিয়ে কোনো প্রশ্ন বা তথ্যের প্রয়োজন ছিল কি? কোনো জিজ্ঞাসা থাকলে জানাতে পারেন, আমরা অর্ডারটি কনফার্ম করে দিচ্ছি! 😊🛍️`;
          }
        } else {
          // Replace placeholders if present
          followUpText = followUpText
            .replace(/{name}/g, customerDisplayName)
            .replace(/{customer}/g, customerDisplayName)
            .replace(/{channel}/g, page.pageName);
        }

        // Dispatch message to channel
        const channel = (conv.channel || page.channel || 'FACEBOOK') as SocialChannel;
        const sendRes = await sendChannelMessage({
          channel,
          recipientId: conv.senderPsid,
          text: followUpText,
          accessToken: pageAccessToken,
          channelIdentifier: page.channelIdentifier || page.facebookPageId,
          extraConfig,
        });

        if (sendRes.success) {
          sentCount++;
          // Save outgoing follow-up message to DB
          await prisma.message.create({
            data: {
              conversationId: conv.id,
              userId: page.userId,
              pageId: page.id,
              senderPsid: conv.senderPsid,
              direction: 'OUTGOING',
              messageType: 'TEXT',
              messageText: followUpText,
              aiGenerated: true,
              aiModel: 'FOLLOW_UP_BOT',
            },
          });

          // Update conversation lastFollowUpSentAt and increment followUpSentCount
          await prisma.conversation.update({
            where: { id: conv.id },
            data: {
              lastFollowUpSentAt: new Date(),
              lastMessage: followUpText,
              lastMessageAt: new Date(),
              followUpSentCount: { increment: 1 },
            },
          });

          results.push({
            pageId: page.id,
            conversationId: conv.id,
            customer: conv.customerName || conv.senderPsid,
            status: 'SENT',
          });

          serverLogger.info(
            `Automated follow-up message sent to ${conv.customerName || conv.senderPsid} via ${channel}`
          );
        } else {
          results.push({
            pageId: page.id,
            conversationId: conv.id,
            customer: conv.customerName || conv.senderPsid,
            status: `FAILED: ${(sendRes as any).error}`,
          });
        }
      }
    }

    return {
      scannedPages: activePages.length,
      sentCount,
      results,
    };
  } catch (error: any) {
    serverLogger.error('Error running follow-up automation:', error);
    return {
      scannedPages: 0,
      sentCount: 0,
      results,
    };
  }
}
