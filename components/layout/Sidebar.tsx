'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Package,
  Bot,
  MessageSquare,
  ShoppingCart,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  X,
  Clock,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface SidebarProps {
  user?: {
    id: string;
    fullName: string;
    businessName: string;
    email: string;
    role: string;
  } | null;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ user, isOpenMobile, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('সফলভাবে লগআউট হয়েছে!');
      router.push('/login');
      router.refresh();
    } catch (e) {
      toast.error('লগআউট করতে ব্যর্থ হয়েছে।');
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'ওভারভিউ', icon: LayoutDashboard },
    { href: '/dashboard/pages', label: 'সোশ্যাল চ্যানেল', icon: Layers },
    { href: '/dashboard/products', label: 'প্রোডাক্ট ইনভেন্টরি', icon: Package },
    { href: '/dashboard/ai-rules', label: 'AI নিয়মাবলী', icon: Bot },
    { href: '/dashboard/follow-up', label: 'AI ফলো-আপ অটোমেশন ও শিডিউল', icon: Clock },
    { href: '/dashboard/conversations', label: 'কথোপকথন', icon: MessageSquare },
    { href: '/dashboard/orders', label: 'অর্ডারসমূহ', icon: ShoppingCart },
    { href: '/dashboard/reports', label: 'রিপোর্ট ও অ্যানালিটিক্স', icon: BarChart3 },
    { href: '/dashboard/settings', label: 'ব্যবসার সেটিংস', icon: Settings },
    { href: '/dashboard/support', label: 'সাপোর্ট গাইড', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 h-full bg-white border-r border-slate-200/80 shadow-xs flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0 bg-white">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                ReplyX <span className="text-indigo-600 font-extrabold">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide truncate">সোশ্যাল অটোমেশন প্ল্যাটফর্ম</p>
            </div>
          </Link>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links with isolated vertical scroll */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0 scrollbar-thin bg-white">
          <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            মেনু
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onCloseMobile && onCloseMobile()}
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-indigo-50/90 text-indigo-700 border border-indigo-200/70 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/90 shrink-0">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{user?.fullName || 'ব্যবহারকারী'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.businessName || user?.email || 'Business'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="সাইন আউট"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
