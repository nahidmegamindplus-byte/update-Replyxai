import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { DEFAULT_SCHEDULE_STEPS, runFollowUpAutomation, startFollowUpWorker } from '@/lib/follow-up';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ('response' in auth) return auth.response;
    const userId = auth.user.id;

    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get('pageId') || undefined;

    // Fetch user schedule steps or fallback/seed defaults
    let steps = await prisma.followUpScheduleStep.findMany({
      where: pageId ? { pageId } : { userId, pageId: null },
      orderBy: { stepNumber: 'asc' },
    });

    if (steps.length === 0) {
      // Check global defaults
      const globalSteps = await prisma.followUpScheduleStep.findMany({
        where: { isGlobalDefault: true },
        orderBy: { stepNumber: 'asc' },
      });

      if (globalSteps.length > 0) {
        steps = globalSteps;
      } else {
        // Return in-memory default steps
        steps = DEFAULT_SCHEDULE_STEPS as any;
      }
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Funnel & Performance Metrics
    const convWhere: any = {
      userId,
      createdAt: { gte: thirtyDaysAgo },
    };
    if (pageId) convWhere.pageId = pageId;

    const [
      totalConversations,
      inProgressCount,
      repliedCount,
      convertedCount,
      completedCount,
      totalSentLogs,
      recentLogs,
      activeConversations,
      pages,
    ] = await Promise.all([
      prisma.conversation.count({ where: convWhere }),
      prisma.conversation.count({ where: { ...convWhere, followUpStatus: 'IN_PROGRESS' } }),
      prisma.conversation.count({ where: { ...convWhere, followUpStatus: 'CUSTOMER_REPLIED' } }),
      prisma.conversation.count({ where: { ...convWhere, followUpStatus: 'ORDER_PLACED' } }),
      prisma.conversation.count({ where: { ...convWhere, followUpStatus: 'COMPLETED' } }),
      prisma.followUpLog.count({
        where: pageId ? { userId, pageId } : { userId },
      }),
      prisma.followUpLog.findMany({
        where: pageId ? { userId, pageId } : { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          page: {
            select: { id: true, pageName: true, channel: true },
          },
          conversation: {
            select: {
              id: true,
              customerName: true,
              senderPsid: true,
              followUpStatus: true,
              currentFollowUpStep: true,
            },
          },
        },
      }),
      prisma.conversation.findMany({
        where: {
          ...convWhere,
          followUpStatus: { in: ['IN_PROGRESS', 'CUSTOMER_REPLIED', 'ORDER_PLACED', 'COMPLETED', 'PAUSED'] },
        },
        orderBy: { updatedAt: 'desc' },
        take: 50,
        include: {
          page: { select: { id: true, pageName: true, channel: true } },
          followUpLogs: { orderBy: { createdAt: 'desc' }, take: 5 },
        },
      }),
      prisma.page.findMany({
        where: { userId },
        select: { id: true, pageName: true, channel: true, followUpEnabled: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      steps,
      metrics: {
        totalConversations,
        inProgressCount,
        repliedCount,
        convertedCount,
        completedCount,
        totalSentLogs,
        conversionRate:
          totalConversations > 0
            ? Math.round(((convertedCount + repliedCount) / totalConversations) * 100)
            : 0,
      },
      recentLogs,
      activeConversations,
      pages,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch follow-up data.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ('response' in auth) return auth.response;
    const userId = auth.user.id;

    const body = await req.json();
    const { action, pageId } = body;

    // 1. Trigger Automation Run
    if (action === 'TRIGGER') {
      startFollowUpWorker();
      const summary = await runFollowUpAutomation(pageId || undefined);
      return NextResponse.json({
        success: true,
        message:
          summary.sentCount > 0
            ? `সফলভাবে ${summary.sentCount} টি ফলো-আপ বার্তা পাঠানো হয়েছে।`
            : `চেক সম্পন্ন: বর্তমান সময়ে কোনো নতুন ফলো-আপ বার্তা পাঠানোর প্রয়োজন নেই।`,
        summary,
      });
    }

    // 2. Update Conversation Status (Pause / Resume / Reset)
    if (action === 'UPDATE_CONVERSATION_STATUS') {
      const { conversationId, status } = body;
      if (!conversationId || !status) {
        return NextResponse.json({ success: false, error: 'Missing parameters.' }, { status: 400 });
      }

      await prisma.conversation.updateMany({
        where: { id: conversationId, userId },
        data: { followUpStatus: status },
      });

      return NextResponse.json({ success: true, message: 'গ্রাহকের ফলো-আপ স্ট্যাটাস আপডেট হয়েছে।' });
    }

    // 3. Save / Upsert All Schedule Steps (Custom Schedule Builder)
    if (action === 'SAVE_STEPS' || Array.isArray(body.steps)) {
      const stepsList = (body.steps || []) as Array<{
        id?: string;
        stepNumber: number;
        dayOffset: number;
        timeOfDay: string;
        title: string;
        guidelinePrompt?: string;
        isEnabled?: boolean;
      }>;

      // Delete existing steps for this user/page scope
      await prisma.followUpScheduleStep.deleteMany({
        where: pageId ? { pageId, userId } : { userId, pageId: null },
      });

      // Insert fresh steps
      const created = [];
      for (let i = 0; i < stepsList.length; i++) {
        const item = stepsList[i];
        const step = await prisma.followUpScheduleStep.create({
          data: {
            userId,
            pageId: pageId || null,
            stepNumber: i + 1,
            dayOffset: Number(item.dayOffset) || 1,
            timeOfDay: item.timeOfDay || '10:00',
            title: item.title || `ধাপ #${i + 1} (${item.dayOffset} দিন পর)`,
            guidelinePrompt: item.guidelinePrompt || null,
            isEnabled: item.isEnabled !== false,
            isGlobalDefault: false,
          },
        });
        created.push(step);
      }

      return NextResponse.json({
        success: true,
        message: 'ফলো-আপ শিডিউল সফলভাবে সংরক্ষণ করা হয়েছে।',
        steps: created,
      });
    }

    // 4. Add Single Step
    if (action === 'ADD_STEP') {
      const { dayOffset, timeOfDay, title, guidelinePrompt, isEnabled } = body;
      const count = await prisma.followUpScheduleStep.count({
        where: pageId ? { pageId, userId } : { userId, pageId: null },
      });

      const newStep = await prisma.followUpScheduleStep.create({
        data: {
          userId,
          pageId: pageId || null,
          stepNumber: count + 1,
          dayOffset: Number(dayOffset) || 1,
          timeOfDay: timeOfDay || '10:00',
          title: title || `${count + 1}ম ফলো-আপ (${dayOffset} দিন পর)`,
          guidelinePrompt: guidelinePrompt || null,
          isEnabled: isEnabled !== false,
          isGlobalDefault: false,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'নতুন ফলো-আপ ধাপ যুক্ত হয়েছে।',
        step: newStep,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update schedule.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ('response' in auth) return auth.response;
    const userId = auth.user.id;

    const { searchParams } = new URL(req.url);
    const stepId = searchParams.get('id');

    if (!stepId) {
      return NextResponse.json({ success: false, error: 'Step ID is required.' }, { status: 400 });
    }

    await prisma.followUpScheduleStep.deleteMany({
      where: { id: stepId, userId },
    });

    return NextResponse.json({ success: true, message: 'ফলো-আপ ধাপটি সফলভাবে মুছে ফেলা হয়েছে।' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete step.' },
      { status: 500 }
    );
  }
}
