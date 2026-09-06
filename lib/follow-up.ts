import prisma from '@/lib/db';
import { decrypt } from '@/lib/crypto';
import { sendChannelMessage, SocialChannel } from '@/lib/social';
import { serverLogger, logActivity } from '@/lib/logger';

// Global singleton to prevent duplicate workers across Next.js reloads
const globalForFollowUp = globalThis as unknown as {
  followUpWorkerInterval?: NodeJS.Timeout | null;
  isFollowUpWorkerRunning?: boolean;
};

/**
 * Check active pages with followUpEnabled and dispatch automated follow-up messages
 * to customers who have seen/read the last response or remained inactive for the configured wait time.
 */
export async function runFollowUpAutomation(targetPageId?: string): Promise<{
  scannedPages: number;
  sentCount: number;
  results: Array<{ pageId: string; conversationId: string; customer: string; status: string; channel: string }>;
}> {
  const results: Array<{ pageId: string; conversationId: string; customer: string; status: string; channel: string }> = [];
  let sentCount = 0;

  try {
    const pageFilter: any = {
      followUpEnabled: true,
      connectionStatus: { not: 'DISCONNECTED' },
    };

    if (targetPageId) {
      pageFilter.id = targetPageId;
    }

    const activePages = await prisma.page.findMany({
      where: pageFilter,
    });

    for (const page of activePages) {
      const waitMinutes = Math.max(1, page.followUpWaitMinutes || 30);
      const cutoffTime = new Date(Date.now() - waitMinutes * 60 * 1000);

      // Determine recurrence interval
      // ONCE: only send 1 time ever
      // DAILY: 24 hours gap between subsequent messages
      // CUSTOM_INTERVAL: user-defined hours gap (e.g. 6, 12, 48 hours)
      const intervalHours =
        page.followUpFrequency === 'DAILY'
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

      // Find candidate conversations
      const candidates = await prisma.conversation.findMany({
        where: {
          pageId: page.id,
          status: 'ACTIVE',
          aiEnabled: true,
          lastMessageAt: { lte: cutoffTime },
        },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 2,
          },
          orders: {
            where: {
              createdAt: { gte: new Date(Date.now() - 48 * 60 * 60 * 1000) },
            },
            take: 1,
          },
        },
        take: 50,
      });

      for (const conv of candidates) {
        const channel = (conv.channel || page.channel || 'FACEBOOK') as SocialChannel;
        const customerName = conv.customerName || conv.senderPsid;

        // 1. If customer already placed an order in this conversation in the last 48h, skip sales follow-up
        if (conv.orders && conv.orders.length > 0) {
          continue;
        }

        // 2. Check maximum follow-up count condition in JavaScript (immune to SQLite null issues)
        const currentSentCount = conv.followUpSentCount || 0;
        if (currentSentCount >= maxCount) {
          continue;
        }

        // 3. Check recurrence gap if already followed up previously
        if (conv.lastFollowUpSentAt && conv.lastFollowUpSentAt > minGapTime) {
          continue;
        }

        // 4. Last message must be OUTGOING (Store/AI replied and customer didn't answer)
        const lastMsg = conv.messages[0];
        if (!lastMsg || lastMsg.direction !== 'OUTGOING') {
          continue;
        }

        // 5. Seen / Read vs Unseen condition evaluation
        if (page.followUpOnlySeen) {
          if (conv.lastSeenAt) {
            // Seen timestamp must have happened at least waitMinutes ago
            if (conv.lastSeenAt > cutoffTime) {
              continue; // viewed recently, give customer more time
            }
          } else {
            // Read receipt not reported by platform:
            // Telegram, X, and basic Instagram webhooks do not support read receipts.
            const supportsReadReceipts = channel === 'FACEBOOK' || channel === 'WHATSAPP';
            if (supportsReadReceipts) {
              // For Facebook/WhatsApp, if read receipt wasn't fired, wait for 2x wait time before sending
              const doubleCutoff = new Date(Date.now() - waitMinutes * 2 * 60 * 1000);
              if (conv.lastMessageAt > doubleCutoff) {
                continue;
              }
            } else {
              // For Telegram/X/Instagram, use lastMessageAt directly
              if (conv.lastMessageAt > cutoffTime) {
                continue;
              }
            }
          }
        } else {
          // followUpOnlySeen is OFF (Recommended "Super Conversion"):
          const effectiveLastActivity =
            conv.lastSeenAt && conv.lastSeenAt > conv.lastMessageAt
              ? conv.lastSeenAt
              : conv.lastMessageAt;

          if (effectiveLastActivity > cutoffTime) {
            continue;
          }
        }

        // 6. Craft personalized follow-up message
        const customerDisplayName = conv.customerName?.split(' ')[0] || 'স্যার/ম্যাম';
        let followUpText = page.followUpMessage?.trim();

        if (!followUpText) {
          if (page.replyLanguage === 'ENGLISH') {
            followUpText = `Hi ${customerDisplayName}, just following up to see if you have any questions or need help placing your order? We're right here to assist you! 😊`;
          } else if (page.replyLanguage === 'BANGLISH') {
            followUpText = `Assalamu Alaikum ${customerDisplayName}! Apnar product ti niye kono proshno chilo kina jante chailam? Kono help lagle kindly bolben, amra order confirm kore dibo! 😊`;
          } else {
            followUpText = `আসসালামু আলাইকুম ${customerDisplayName}! আপনার পছন্দের পণ্যটি নিয়ে কোনো প্রশ্ন বা তথ্যের প্রয়োজন ছিল কি? কোনো জিজ্ঞাসা থাকলে জানাতে পারেন, আমরা অর্ডারটি কনফার্ম করে দিচ্ছি! 😊🛍️`;
          }
        } else {
          followUpText = followUpText
            .replace(/{name}/g, customerDisplayName)
            .replace(/{customer}/g, customerDisplayName)
            .replace(/{channel}/g, page.pageName);
        }

        // 7. Dispatch follow-up message to customer via social channel
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

          // Record outgoing message in database
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

          // Update conversation lastFollowUpSentAt, lastMessage, and increment count
          await prisma.conversation.update({
            where: { id: conv.id },
            data: {
              lastFollowUpSentAt: new Date(),
              lastMessage: followUpText,
              lastMessageAt: new Date(),
              followUpSentCount: { increment: 1 },
            },
          });

          await logActivity({
            userId: page.userId,
            pageId: page.id,
            action: 'FOLLOW_UP_SENT',
            description: `স্বয়ংক্রিয় ফলো-আপ বার্তা পাঠানো হয়েছে গ্রাহক ${customerDisplayName} (${conv.senderPsid})-কে (${channel})`,
          });

          results.push({
            pageId: page.id,
            conversationId: conv.id,
            customer: customerName,
            status: 'SENT',
            channel,
          });

          serverLogger.info(
            `Automated follow-up message sent to ${customerName} via ${channel}`
          );
        } else {
          results.push({
            pageId: page.id,
            conversationId: conv.id,
            customer: customerName,
            status: `FAILED: ${(sendRes as any).error || 'API Error'}`,
            channel,
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

/**
 * Start background timer daemon for continuous follow-up checks (runs every 60s)
 */
export function startFollowUpWorker(intervalMs = 60000) {
  if (globalForFollowUp.followUpWorkerInterval) {
    return; // Already initialized
  }

  serverLogger.info(`[Follow-Up Worker] Background automation engine active (interval: ${intervalMs / 1000}s)`);

  globalForFollowUp.followUpWorkerInterval = setInterval(async () => {
    if (globalForFollowUp.isFollowUpWorkerRunning) return;
    globalForFollowUp.isFollowUpWorkerRunning = true;
    try {
      const summary = await runFollowUpAutomation();
      if (summary.sentCount > 0) {
        serverLogger.info(`[Follow-Up Worker] Dispatched ${summary.sentCount} follow-up message(s)`);
      }
    } catch (err) {
      serverLogger.error('[Follow-Up Worker] Scheduled run error:', err);
    } finally {
      globalForFollowUp.isFollowUpWorkerRunning = false;
    }
  }, intervalMs);

  if (globalForFollowUp.followUpWorkerInterval && typeof globalForFollowUp.followUpWorkerInterval.unref === 'function') {
    globalForFollowUp.followUpWorkerInterval.unref();
  }
}

