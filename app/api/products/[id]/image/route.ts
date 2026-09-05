import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAppUrl } from '@/lib/url';

/**
 * Public Endpoint to serve product image cleanly for Facebook Messenger,
 * WhatsApp, Instagram, Telegram, and frontend web previews.
 * Handles:
 * 1. Base64 data URLs (decoded into raw binary buffer with correct Content-Type).
 * 2. External HTTP/HTTPS URLs (redirected or proxied).
 * 3. Local relative paths.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      select: { imageUrl: true, name: true },
    });

    if (!product || !product.imageUrl) {
      return new NextResponse('Product image not found', { status: 404 });
    }

    const img = product.imageUrl.trim();

    // 1. If stored as Base64 Data URL (e.g. data:image/png;base64,...)
    if (img.startsWith('data:image/')) {
      const match = img.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, 'base64');

        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': mimeType,
            'Content-Length': buffer.length.toString(),
            'Cache-Control': 'public, max-age=86400, immutable',
          },
        });
      }
    }

    // 2. If valid HTTP/HTTPS URL, redirect directly
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return NextResponse.redirect(img, 302);
    }

    // 3. If relative path
    const appUrl = getAppUrl(req);
    const fullUrl = `${appUrl}${img.startsWith('/') ? '' : '/'}${img}`;
    return NextResponse.redirect(fullUrl, 302);
  } catch (error: any) {
    console.error('Error serving product image:', error);
    return new NextResponse('Failed to serve image', { status: 500 });
  }
}
