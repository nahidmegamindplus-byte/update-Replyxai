import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { generateAIReply } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('response' in auth) return auth.response;

  try {
    const body = await req.json();
    const { pageId, message, imageUrl, history = [] } = body;

    let targetPageId = pageId;
    if (!targetPageId || targetPageId === 'ALL') {
      const firstPage = await prisma.page.findFirst({
        where: { userId: auth.user.id },
      });
      if (firstPage) {
        targetPageId = firstPage.id;
      } else {
        const anyPage = await prisma.page.findFirst();
        if (anyPage) targetPageId = anyPage.id;
      }
    }

    if (!targetPageId) {
      return NextResponse.json(
        {
          success: false,
          error: 'কোনো পেজ বা চ্যানেল সংযুক্ত করা হয়নি। অনুগ্রহ করে প্রথমে "পেজ ও চ্যানেল" সেকশন থেকে আপনার পেজ যুক্ত করুন।',
        },
        { status: 400 }
      );
    }

    const aiResult = await generateAIReply({
      userId: auth.user.id,
      pageId: targetPageId,
      senderPsid: 'sandbox_test_user',
      incomingText: message || '',
      incomingImageUrl: imageUrl || undefined,
      conversationHistory: history,
      canSendProductImage: true,
    });

    return NextResponse.json({
      success: true,
      reply: aiResult.replyText,
      matchedProduct: aiResult.matchedProduct,
      detectedOrder: aiResult.detectedOrder,
      model: aiResult.aiModel,
      provider: aiResult.provider,
    });
  } catch (error: any) {
    console.error('Test chat error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'AI টেস্ট চ্যাটে ত্রুটি হয়েছে।' },
      { status: 500 }
    );
  }
}
