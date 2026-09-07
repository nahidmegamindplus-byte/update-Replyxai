'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Bot,
  Users,
  Layers,
  Settings,
  LogOut,
  Sparkles,
  ArrowLeft,
  X,
  Database,
  Cpu,
  Package as PackageIcon,
  CreditCard,
  FileCheck2,
  Key,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface AdminSidebarProps {
  user?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  } | null;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ user, isOpenMobile, onCloseMobile }: AdminSidebarProps) {
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
    { href: '/admin', label: 'অ্যাডমিন ড্যাশবোর্ড', icon: ShieldAlert },
    { href: '/admin/licenses', label: '🔑 লাইসেন্স কি জেনারেটর', icon: Key },
    { href: '/admin/package-orders', label: 'প্যাকেজ অর্ডার ও ভেরিফিকেশন', icon: FileCheck2 },
    { href: '/admin/packages', label: 'প্যাকেজসমূহ (Packages)', icon: PackageIcon },
    { href: '/admin/payment-methods', label: 'পেমেন্ট মেথডস (bKash/Nagad)', icon: CreditCard },
    { href: '/admin/ai-settings', label: 'AI ও API সেটিংস', icon: Cpu },
    { href: '/admin/subscriptions', label: 'সাবস্ক্রিপশন ও ব্যবহার ট্র্যাকিং', icon: Sparkles },
    { href: '/admin/users', label: 'ব্যবহারকারী পরিচালনা', icon: Users },
    { href: '/admin/pages', label: 'গ্লোবাল পেজ সমূহ', icon: Layers },
    { href: '/admin/settings', label: 'সিস্টেম সেটিংস', icon: Database },
  ];

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200/80 shadow-xs flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-500/20">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  ReplyX <span className="text-purple-600 font-extrabold">ADMIN</span>
                </h1>
                <p className="text-[10px] text-purple-600 font-medium">সিস্টেম কন্ট্রোল প্যানেল</p>
              </div>
            </Link>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-purple-700 uppercase">
              অ্যাডমিন প্রশাসন
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onCloseMobile && onCloseMobile()}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link
                href="/dashboard"
                onClick={() => onCloseMobile && onCloseMobile()}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-indigo-600 hover:bg-indigo-50 border border-indigo-200/80 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ইউজার ড্যাশবোর্ডে ফিরুন</span>
              </Link>
            </div>
          </nav>
        </div>

        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                A
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-800 truncate">{user?.fullName || 'Super Admin'}</p>
                <p className="text-[11px] text-purple-600 font-mono font-medium">ROLE: ADMIN</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="সাইন আউট"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
