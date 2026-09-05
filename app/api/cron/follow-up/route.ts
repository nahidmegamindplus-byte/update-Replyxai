import { NextRequest, NextResponse } from 'next/server';
import { runFollowUpAutomation } from '@/lib/follow-up';
import { requireAuth } from '@/lib/auth';

/**
 * Trigger / Execute Follow-Up Automation
 * Can be called by dashboard client, internal interval, or external cron job.
 */
export async function POST(req: NextRequest) {
  try {
    // Optional secret key check for external cron runners
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'replax_internal_cron';

    if (authHeader && authHeader === `Bearer ${cronSecret}`) {
      const summary = await runFollowUpAutomation();
      return NextResponse.json({ success: true, ...summary });
    }

    // Otherwise require logged-in user
    const auth = await requireAuth(req);
    if ('response' in auth) return auth.response;

    const summary = await runFollowUpAutomation();
    return NextResponse.json({
      success: true,
      message: `ফলো-আপ সম্পন্ন: ${summary.sentCount} টি মেসেজ সফলভাবে পাঠানো হয়েছে।`,
      ...summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'ফলো-আপ প্রক্রিয়া চালাতে সমস্যা হয়েছে।' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
