'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { ToastProvider } from '@/components/ui/Toast';
import { apiFetch } from '@/lib/api-client';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

// In-memory module cache for instant sub-page navigation without blocking loading spinner
let cachedDashboardUser: any = null;

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(cachedDashboardUser);
  const [loading, setLoading] = useState(!cachedDashboardUser);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const data = await apiFetch<any>('/api/auth/me', { retries: 2, retryDelayMs: 400, timeoutMs: 8000 });
        if (!isMounted) return;

        if (data && data.success && data.user) {
          cachedDashboardUser = data.user;
          // Gating: If normal user does not have an active package, redirect to /subscribe
          if (data.user.role !== 'ADMIN' && data.user.planStatus !== 'ACTIVE') {
            router.push('/subscribe');
            return;
          }
          setUser(data.user);
        } else {
          cachedDashboardUser = null;
          router.push('/login');
        }
      } catch (err) {
        if (!cachedDashboardUser) {
          router.push('/login');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading && !user) {
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
