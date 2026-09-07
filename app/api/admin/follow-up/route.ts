import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { DEFAULT_SCHEDULE_STEPS, runFollowUpAutomation, startFollowUpWorker } from '@/lib/follow-up';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    let globalSteps = await prisma.followUpScheduleStep.findMany({
      where: { isGlobalDefault: true },
      orderBy: { stepNumber: 'asc' },
    });

    if (globalSteps.length === 0) {
      // Seed default global template steps
      const created = [];
      for (const item of DEFAULT_SCHEDULE_STEPS) {
        const s = await prisma.followUpScheduleStep.create({
          data: {
            stepNumber: item.stepNumber,
            dayOffset: item.dayOffset,
            timeOfDay: item.timeOfDay,
            title: item.title,
            guidelinePrompt: item.guidelinePrompt,
            isEnabled: true,
            isGlobalDefault: true,
          },
        });
        created.push(s);
      }
      globalSteps = created;
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalLogs,
      activePagesCount,
      inProgressCount,
      repliedCount,
      convertedCount,
      recentLogs,
    ] = await Promise.all([
      prisma.followUpLog.count(),
      prisma.page.count({ where: { followUpEnabled: true } }),
      prisma.conversation.count({
        where: { createdAt: { gte: thirtyDaysAgo }, followUpStatus: 'IN_PROGRESS' },
      }),
      prisma.conversation.count({
        where: { createdAt: { gte: thirtyDaysAgo }, followUpStatus: 'CUSTOMER_REPLIED' },
      }),
      prisma.conversation.count({
        where: { createdAt: { gte: thirtyDaysAgo }, followUpStatus: 'ORDER_PLACED' },
      }),
      prisma.followUpLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 60,
        include: {
          user: { select: { id: true, fullName: true, email: true } },
          page: { select: { id: true, pageName: true, channel: true } },
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
    ]);

    return NextResponse.json({
      success: true,
      globalSteps,
      stats: {
        totalLogs,
        activePagesCount,
        inProgressCount,
        repliedCount,
        convertedCount,
      },
      recentLogs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch admin follow-up data.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    const body = await req.json();
    const { action } = body;

    // 1. Trigger System-wide Automation Check
    if (action === 'TRIGGER_ALL') {
      startFollowUpWorker();
      const summary = await runFollowUpAutomation();
      return NextResponse.json({
        success: true,
        message:
          summary.sentCount > 0
            ? `সিস্টেম-ওয়াইড ফলো-আপ সম্পন্ন: ${summary.sentCount} টি মেসেজ পাঠানো হয়েছে (${summary.scannedPages} টি পেজ স্ক্যান করা হয়েছে)।`
            : `সিস্টেম স্ক্যান সম্পন্ন: কোনো পেজে মেসেজ পাঠানোর বাকি নেই।`,
        summary,
      });
    }

    // 2. Save Global Default Schedule Steps
    if (action === 'SAVE_GLOBAL_STEPS' || Array.isArray(body.steps)) {
      const stepsList = (body.steps || []) as Array<{
        id?: string;
        stepNumber: number;
        dayOffset: number;
        timeOfDay: string;
        title: string;
        guidelinePrompt?: string;
        isEnabled?: boolean;
      }>;

      // Delete old global defaults
      await prisma.followUpScheduleStep.deleteMany({
        where: { isGlobalDefault: true },
      });

      const created = [];
      for (let i = 0; i < stepsList.length; i++) {
        const item = stepsList[i];
        const step = await prisma.followUpScheduleStep.create({
          data: {
            stepNumber: i + 1,
            dayOffset: Number(item.dayOffset) || 1,
            timeOfDay: item.timeOfDay || '10:00',
            title: item.title || `ধাপ #${i + 1} (${item.dayOffset} দিন পর)`,
            guidelinePrompt: item.guidelinePrompt || null,
            isEnabled: item.isEnabled !== false,
            isGlobalDefault: true,
          },
        });
        created.push(step);
      }

      return NextResponse.json({
        success: true,
        message: 'গ্লোবাল ডিফল্ট ফলো-আপ শিডিউল সফলভাবে সংরক্ষণ করা হয়েছে।',
        globalSteps: created,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update admin follow-up.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    const { searchParams } = new URL(req.url);
    const stepId = searchParams.get('id');

    if (!stepId) {
      return NextResponse.json({ success: false, error: 'Step ID required.' }, { status: 400 });
    }

    await prisma.followUpScheduleStep.deleteMany({
      where: { id: stepId, isGlobalDefault: true },
    });

    return NextResponse.json({ success: true, message: 'গ্লোবাল ধাপটি সফলভাবে মুছে ফেলা হয়েছে।' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete global step.' },
      { status: 500 }
    );
  }
}
