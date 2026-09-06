'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  X as CloseIcon,
  Send,
  ExternalLink,
  ChevronUp,
} from 'lucide-react';

interface SocialWidgetSettings {
  enabled: boolean;
  whatsappNumber: string;
  whatsappMessage: string;
  instagramUsername?: string;
  telegramUsername?: string;
  xHandle?: string;
  facebookPage?: string;
  position: 'LEFT' | 'RIGHT';
}

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<SocialWidgetSettings>({
    enabled: true,
    whatsappNumber: '+8801521716613',
    whatsappMessage: 'আসসালামু আলাইকুম, আমি ReplyX AI সম্পর্কে তথ্য জানতে চাই।',
    instagramUsername: 'replyx.ai',
    telegramUsername: 'replyx_support_bot',
    xHandle: 'ReplyX_AI',
    facebookPage: 'replyx.ai',
    position: 'RIGHT',
  });

  useEffect(() => {
    setMounted(true);

    async function loadSettings() {
      try {
        const res = await fetch('/api/settings/whatsapp');
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings((prev) => ({
            ...prev,
            ...data.settings,
            whatsappNumber: data.settings.number || prev.whatsappNumber,
            whatsappMessage: data.settings.message || prev.whatsappMessage,
          }));
        }
      } catch (e) {
        // Fallback default
      }
    }

    loadSettings();
  }, []);

  if (!mounted || settings.enabled === false) {
    return null;
  }

  const openWhatsApp = () => {
    let rawDigits = (settings.whatsappNumber || '').replace(/[^\d]/g, '');
    if (rawDigits.startsWith('01')) {
      rawDigits = '88' + rawDigits;
    }
    const encodedText = encodeURIComponent(settings.whatsappMessage || 'আসসালামু আলাইকুম');
    const isMobile =
      typeof navigator !== 'undefined' &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const url = isMobile
      ? `https://api.whatsapp.com/send?phone=${rawDigits}&text=${encodedText}`
      : `https://web.whatsapp.com/send?phone=${rawDigits}&text=${encodedText}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openInstagram = () => {
    const handle = settings.instagramUsername || 'replyx.ai';
    window.open(`https://instagram.com/${handle.replace('@', '')}`, '_blank', 'noopener,noreferrer');
  };

  const openFacebook = () => {
    const page = settings.facebookPage || 'replyx.ai';
    window.open(`https://m.me/${page}`, '_blank', 'noopener,noreferrer');
  };

  const openTelegram = () => {
    const bot = settings.telegramUsername || 'replyx_support_bot';
    window.open(`https://t.me/${bot.replace('@', '')}`, '_blank', 'noopener,noreferrer');
  };

  const openX = () => {
    const handle = settings.xHandle || 'ReplyX_AI';
    window.open(`https://x.com/${handle.replace('@', '')}`, '_blank', 'noopener,noreferrer');
  };

  const positionClasses =
    settings.position === 'LEFT' ? 'left-5 sm:left-6' : 'right-5 sm:right-6';

  return (
    <div
      translate="no"
      suppressHydrationWarning
      className={`notranslate fixed bottom-5 sm:bottom-6 z-50 flex flex-col items-end gap-3 ${positionClasses}`}
    >
      {/* Expanded Multi-Channel Tray */}
      {isOpen && (
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 p-4 rounded-2xl shadow-2xl w-64 space-y-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              সোশ্যাল মিডিয়া সাপোর্ট
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-tight">
            যেকোনো চ্যানেলে আমাদের সাথে যোগাযোগ করুন, AI দ্রুত উত্তর দেবে:
          </p>

          <div className="space-y-1.5">
            {/* WhatsApp */}
            <button
              onClick={openWhatsApp}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>WhatsApp চ্যাট</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Facebook Messenger */}
            <button
              onClick={openFacebook}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Facebook Messenger</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Instagram */}
            <button
              onClick={openInstagram}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-700 text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                <span>Instagram DM</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Telegram */}
            <button
              onClick={openTelegram}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                <span>Telegram Bot</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* X (Twitter) */}
            <button
              onClick={openX}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                <span>X (Twitter) DM</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Main Button */}
      <div className="flex items-center gap-3">
        {/* Tooltip */}
        {!isOpen && (
          <div className="hidden sm:block bg-white/95 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 shadow-xl backdrop-blur-md whitespace-nowrap">
            সোশ্যাল মিডিয়ায় চ্যাট করুন
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Omnichannel Social Support"
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#25D366] via-indigo-600 to-pink-500 text-white flex items-center justify-center shadow-2xl transition-transform duration-300 transform hover:scale-110 active:scale-95 focus:outline-none"
        >
          {/* Pulsing Outer Ring */}
          <span className="absolute inset-0 rounded-full bg-indigo-500 opacity-40 animate-ping pointer-events-none"></span>

          {isOpen ? (
            <CloseIcon className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" />
          ) : (
            <svg className="w-8 h-8 sm:w-9 sm:h-9 fill-current relative z-10" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          )}

          {/* Live Active Status Indicator */}
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </button>
      </div>
    </div>
  );
}
