import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import WhatsAppWidget from '@/components/ui/WhatsAppWidget';

export const metadata: Metadata = {
  title: 'ReplyX AI — AI-Powered Facebook Messenger Automation',
  description: 'আপনার Facebook Messenger-এর জন্য স্মার্ট AI Sales & Customer Care Assistant। বাংলা, ইংলিশ ও ব্যাংলিশ সাপোর্ট সহ সম্পূর্ণ অটোমেশন।',
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    google: 'notranslate',
  },
};

import fs from 'fs';
import path from 'path';

let inlinedTailwindCss = '';
try {
  const cssPath = path.join(process.cwd(), 'global.css');
  if (fs.existsSync(cssPath)) {
    inlinedTailwindCss = fs.readFileSync(cssPath, 'utf8');
  }
} catch (_) {}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="light notranslate" translate="no" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
        {inlinedTailwindCss ? (
          <style
            id="inlined-tailwind-css"
            dangerouslySetInnerHTML={{ __html: inlinedTailwindCss }}
          />
        ) : null}
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="/global.css" />
      </head>
      <body
        className="notranslate bg-[#f8fafc] text-slate-900 antialiased selection:bg-indigo-500/20 selection:text-indigo-700"
        suppressHydrationWarning
      >
        <ToastProvider>
          {children}
          <WhatsAppWidget />
        </ToastProvider>
      </body>
    </html>
  );
}
