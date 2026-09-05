'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate password reset request flow
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে (যদি একাউন্ট থাকে)।');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              ReplyX <span className="text-indigo-600">AI</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">পাসওয়ার্ড রিসেট</h2>
          <p className="text-sm text-slate-500 mt-1">আপনার রেজিস্টার্ড ইমেইল অ্যাড্রেসটি প্রদান করুন</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">ইমেইল পাঠানো হয়েছে</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                আপনার ইমেইল অ্যাড্রেসে পাসওয়ার্ড রিসেট করার লিংক পাঠানো হয়েছে। ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করুন।
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> লগইন পেজে ফিরে যান
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  ইমেইল অ্যাড্রেস
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="আপনার অ্যাকাউন্টের ইমেইল দিন"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>প্রসেস করা হচ্ছে...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>রিসেট লিংক পাঠান</span>
                  </>
                )}
              </button>

              <div className="pt-4 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> লগইন পেজে ফিরে যান
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
