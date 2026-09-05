'use client';

import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobile?: () => void;
}

export default function Header({ title, subtitle, onOpenMobile }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 bg-white/85 backdrop-blur-md border-b border-slate-200/80 w-full min-w-0 shadow-2xs">
      <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
        {onOpenMobile && (
          <button
            onClick={onOpenMobile}
            className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs shrink-0"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>AI ইঞ্জিন সক্রিয়</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs relative"
            title="নোটিফিকেশন"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
