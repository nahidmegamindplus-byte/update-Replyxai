'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { ToastProvider } from '@/components/ui/Toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (data.success && data.user) {
          // Gating: If normal user does not have an active package, redirect to /subscribe
          if (data.user.role !== 'ADMIN' && data.user.planStatus !== 'ACTIVE') {
            router.push('/subscribe');
            return;
          }
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">ReplyX AI লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
        <Sidebar
          user={user}
          isOpenMobile={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <div className="lg:pl-64 flex-1 flex flex-col min-h-screen w-full min-w-0 max-w-full overflow-x-hidden">
          <Header
            title={title}
            subtitle={subtitle}
            onOpenMobile={() => setMobileOpen(true)}
          />

          <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
