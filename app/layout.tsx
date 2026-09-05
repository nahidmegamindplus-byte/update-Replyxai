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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="light" suppressHydrationWarning>
      <body
        className="bg-[#f8fafc] text-slate-900 antialiased selection:bg-indigo-500/20 selection:text-indigo-700"
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
