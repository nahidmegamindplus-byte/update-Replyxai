import type { Metadata } from 'next';
import './globals.css';
import '@/lib/dom-guard';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="light notranslate" translate="no" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
        <link rel="stylesheet" href="/global.css" />
        <script
          id="dom-safe-guard"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined' && typeof Node !== 'undefined') {
                  var origInsertBefore = Node.prototype.insertBefore;
                  Node.prototype.insertBefore = function(newNode, refNode) {
                    if (refNode && refNode.parentNode !== this) {
                      if (refNode.parentNode) {
                        return refNode.parentNode.insertBefore(newNode, refNode);
                      }
                      return this.appendChild(newNode);
                    }
                    return origInsertBefore.apply(this, arguments);
                  };

                  var origRemoveChild = Node.prototype.removeChild;
                  Node.prototype.removeChild = function(child) {
                    if (child.parentNode !== this) {
                      if (child.parentNode) {
                        return child.parentNode.removeChild(child);
                      }
                      return child;
                    }
                    return origRemoveChild.apply(this, arguments);
                  };
                }
              })();
            `,
          }}
        />
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
