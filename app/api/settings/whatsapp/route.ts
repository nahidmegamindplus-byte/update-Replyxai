import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ensureDatabaseReady } from '@/lib/db-init';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseReady();
    const settingsList = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: [
            'whatsapp_enabled',
            'whatsapp_number',
            'whatsapp_message',
            'whatsapp_position',
            'instagram_username',
            'telegram_username',
            'x_handle',
            'facebook_page',
          ],
        },
      },
    });

    const settingsMap: Record<string, string> = {};
    settingsList.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    const isExplicitlyDisabled = settingsMap['whatsapp_enabled'] === 'false';
    const isEnabled = !isExplicitlyDisabled;

    return NextResponse.json({
      success: true,
      settings: {
        enabled: isEnabled,
        number: settingsMap['whatsapp_number'] || '+8801521716613',
        message:
          settingsMap['whatsapp_message'] ||
          'আসসালামু আলাইকুম, আমি ReplyX AI সম্পর্কে তথ্য জানতে চাই।',
        position: settingsMap['whatsapp_position'] || 'RIGHT',
        instagramUsername: settingsMap['instagram_username'] || 'replyx.ai',
        telegramUsername: settingsMap['telegram_username'] || 'replyx_support_bot',
        xHandle: settingsMap['x_handle'] || 'ReplyX_AI',
        facebookPage: settingsMap['facebook_page'] || 'replyx.ai',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: true,
        settings: {
          enabled: true,
          number: '+8801521716613',
          message: 'আসসালামু আলাইকুম, আমি ReplyX AI সম্পর্কে তথ্য জানতে চাই।',
          position: 'RIGHT',
          instagramUsername: 'replyx.ai',
          telegramUsername: 'replyx_support_bot',
          xHandle: 'ReplyX_AI',
          facebookPage: 'replyx.ai',
        },
      },
      { status: 200 }
    );
  }
}
