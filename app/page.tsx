'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Bot,
  MessageSquare,
  Zap,
  ShieldCheck,
  Package,
  Layers,
  Camera,
  Mic,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Headphones,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: Bot,
      title: 'বাংলা, ইংলিশ ও ব্যাংলিশ বোঝে',
      desc: 'কাস্টমার যেভাবে খুশি মেসেজ দিক (যেমন: "eita koto?", "দাম কত?", "How much?"), ReplyX AI স্বাভাবিক মানুষের মতোই দ্রুত উত্তর দেয়।',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: ShoppingBag,
      title: 'স্বয়ংক্রিয় অর্ডার ক্যাপচার',
      desc: 'কাস্টমারের কেনার আগ্রহ বুঝে স্বয়ংক্রিয়ভাবে নাম, ফোন নম্বর ও ডেলিভারি ঠিকানা সংগ্রহ করে অর্ডার তৈরি করে।',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Camera,
      title: 'কাস্টমারের ছবি ও প্রোডাক্ট রিকগনিশন',
      desc: 'কাস্টমার কোনো পণ্যের ছবি পাঠালে ভিশন এআই ছবি বিশ্লেষণ করে ইনভেন্টরির সঠিক পণ্যের স্টক ও দাম জানিয়ে দেয়।',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Mic,
      title: 'ভয়েস মেসেজ আন্ডারস্ট্যান্ডিং',
      desc: 'গ্রাহকের অডিও বা ভয়েস মেসেজ স্বয়ংক্রিয়ভাবে টেক্সটে রূপান্তর করে নির্ভুল উত্তর প্রদান করে।',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Package,
      title: 'ইনভেন্টরি ও ছবি পাঠানো',
      desc: 'আপনার সব প্রোডাক্টের বিবরণ ও দাম ডাটাবেজে সংরক্ষিত থাকে। কাস্টমার জিজ্ঞেস করলেই ছবিসহ সঠিক তথ্য চলে যায়।',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Layers,
      title: 'মাল্টি-চ্যানেল ও হিউম্যান হ্যান্ডঅফ',
      desc: 'Facebook Messenger, WhatsApp, Instagram, X এবং Telegram এক ড্যাশবোর্ড থেকে পরিচালনা করুন। জটিল পরিস্থিতিতে এক ক্লিকেই লাইভ চ্যাট টেকওভার করুন।',
      color: 'from-emerald-500 to-cyan-500',
    },
  ];

  const faqs = [
    {
      q: 'ReplyX AI কি ফেসবুকে পেজের মেসেজের উত্তর স্বয়ংক্রিয়ভাবে পাঠাতে পারে?',
      a: 'হ্যাঁ! ফেসবুকের অফিসিয়াল মেসেঞ্জার গ্রাফ এপিআই এবং সিকিউর ওয়েবহুকের মাধ্যমে যেকোনো কাস্টমারের মেসেজে ১-৩ সেকেন্ডের মধ্যে স্বয়ংক্রিয় ও নির্ভুল উত্তর প্রদান করা হয়।',
    },
    {
      q: 'AI কি কাল্পনিক কোনো দাম বা স্টক তথ্য বানিয়ে বলবে?',
      a: 'কখনোই না! ReplyX AI-তে রয়েছে কঠোর প্রম্পট গার্ড এবং ইনভেন্টরি ভেরিফিকেশন ইঞ্জিন। আপনার প্রোডাক্ট লিস্টে উল্লেখিত সঠিক দাম ও স্টক ছাড়া এটি অন্য কোনো মনগড়া তথ্য দেয় না।',
    },
    {
      q: 'গ্রাহক ব্যাংলিশে (Banglish) লিখলে AI বুঝতে পারে?',
      a: 'জি, শতভাগ! আমাদের এআই মডেলগুলো বাংলাদেশি ব্যবহারকারীদের স্বাভাবিক ভাষা, যেমন: "vai delivery charge koto?" বা "Dhakar baire kobe pabo?" খুব সহজে বোঝে।',
    },
    {
      q: 'কোন কোন AI প্রোভাইডার ব্যবহার করা যায়?',
      a: 'আপনি Google Gemini (1.5 Flash / Pro) এবং OpenAI (GPT-4o / GPT-4o-mini) উভয় প্রোভাইডার নির্বাচন করতে পারবেন।',
    },
    {
      q: 'আমরা কি নিজে নিজে সার্ভারে এটি হোস্ট করতে পারবো?',
      a: 'হ্যাঁ, ReplyX AI সম্পূর্ণ সেলফ-হোস্টেবল এবং প্রোডাকশন-রেডি। আপনি ভিপিএস, ক্লাউড রান বা যেকোনো প্ল্যাটফর্মে খুব সহজে ডাটাবেজ সহ চালাতে পারবেন।',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-700">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              ReplyX <span className="text-indigo-600">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">ফিচারসমূহ</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">কীভাবে কাজ করে</a>
            <a href="#preview" className="hover:text-indigo-600 transition-colors">লাইভ ডেমো</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">প্রশ্নোত্তর</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              লগইন
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all"
            >
              ফ্রি শুরু করুন
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background ambient soft glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs">
            <Zap className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
            <span>AI-Powered Omnichannel Social Automation (WhatsApp, Instagram, X, Telegram & Facebook)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-6">
            আপনার সোশ্যাল মিডিয়ার জন্য <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              স্মার্ট ওমনিচ্যানেল AI Sales Assistant
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            WhatsApp, Instagram, Facebook Messenger, X এবং Telegram—সব চ্যানেল থেকে আসা কাস্টমারের মেসেজ বুঝে তাৎক্ষণিক উত্তর দেবে, প্রোডাক্টের সঠিক ছবি পাঠাবে এবং স্বয়ংক্রিয়ভাবে অর্ডার নিশ্চিত করবে।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>বিনামূল্যে শুরু করুন</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-base transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>ডেমো অ্যাকাউন্টে প্রবেশ করুন</span>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>বাংলা, ইংলিশ ও ব্যাংলিশ সাপোর্ট</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>২৪/৭ ইনস্ট্যান্ট রিপ্লাই</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>জিরো কনফিগ সেলফ-হোস্টিং</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Messenger Simulation Preview */}
      <section id="preview" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm">
                SF
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">স্টাইলিশ ফ্যাশন বিডি</h4>
                <p className="text-xs text-emerald-600 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> ReplyX AI সক্রিয়
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
              লাইভ মেসেঞ্জার ডেমো
            </div>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            {/* Customer Message 1 */}
            <div className="flex justify-start">
              <div className="bg-slate-100 text-slate-800 px-4 py-3 rounded-2xl rounded-tl-none max-w-md text-sm border border-slate-200/80">
                ভাইয়া কটন পাঞ্জাবির দাম কত? ঢাকার মধ্যে ডেলিভারি চার্জ কত?
              </div>
            </div>

            {/* AI Reply 1 */}
            <div className="flex justify-end">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-2xl rounded-tr-none max-w-md text-sm shadow-md">
                নমস্কার! আমাদের প্রিমিয়াম কটন পাঞ্জাবির বর্তমান অফার মূল্য ১,৪৯০ টাকা (নিয়মিত ১,৮৫০ টাকা)। ঢাকার মধ্যে ডেলিভারি চার্জ ৭০ টাকা এবং ক্যাশ অন ডেলিভারি সুবিধা আছে। আপনি কি অর্ডার করতে চান? 😊
              </div>
            </div>

            {/* Customer Message 2 */}
            <div className="flex justify-start">
              <div className="bg-slate-100 text-slate-800 px-4 py-3 rounded-2xl rounded-tl-none max-w-md text-sm border border-slate-200/80">
                ha order korbo. Name: Rakib, Phone: 01819887766, Address: Dhanmondi, Dhaka.
              </div>
            </div>

            {/* AI Reply 2 */}
            <div className="flex justify-end">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-2xl rounded-tr-none max-w-md text-sm shadow-md space-y-2">
                <p>ধন্যবাদ রাকিব সাহেব! 🎉 আপনার অর্ডারটি গ্রহণ করা হয়েছে।</p>
                <div className="bg-black/20 p-2.5 rounded-xl text-xs space-y-1 border border-white/20">
                  <p>📦 <strong>পণ্য:</strong> প্রিমিয়াম কটন পাঞ্জাবি (১টি)</p>
                  <p>💰 <strong>মোট:</strong> ১,৪৯০ + ৭০ = ১,৫৬০ টাকা (COD)</p>
                  <p>📍 <strong>ঠিকানা:</strong> ধানমন্ডি, ঢাকা</p>
                </div>
                <p className="text-xs">আমাদের প্রতিনিধি দ্রুতই ডেলিভারির জন্য যোগাযোগ করবেন।</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            ব্যবসা বৃদ্ধির জন্য প্রয়োজনীয় সবকিছু
          </h2>
          <p className="text-base text-slate-600">
            ReplyX AI আপনার পুরো মেসেঞ্জার ইনবক্সকে একটি পূর্ণাঙ্গ সেলস ও সাপোর্ট সেন্টারে রূপান্তর করে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-white border border-slate-200/80 hover:border-indigo-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white mb-5 shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            ৩টি সহজ ধাপে চালু করুন
          </h2>
          <p className="text-base text-slate-600">কোনো কোডিং জ্ঞান ছাড়াই কয়েক মিনিটে ফেসবুক পেজে AI সেটআপ করুন।</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 relative shadow-xs">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-sm">
              ১
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Facebook Page কানেক্ট করুন</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              ড্যাশবোর্ডে আপনার Facebook Page ID ও Access Token দিন। স্বয়ংক্রিয়ভাবে ওয়েবহুক লিংক জেনারেট হবে।
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 relative shadow-xs">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-sm">
              ২
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">প্রোডাক্ট ও AI রুলস সেট করুন</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              আপনার ইনভেন্টরির পণ্যগুলো যোগ করুন এবং ১৪টি সহজ প্রশ্নের উত্তর দিয়ে অথবা কাস্টম প্রম্পট দিয়ে এআই ট্রেন করুন।
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 relative shadow-xs">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-sm">
              ৩
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">অটোমেটিক রিপ্লাই ও সেলস শুরু</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              এখন থেকে যেকোনো কাস্টমার মেসেজ দিলে AI তাৎক্ষণিক উত্তর দেবে এবং রিয়েল-টাইমে অর্ডার ক্যাপচার করবে।
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200/80">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
          </h2>
          <p className="text-sm text-slate-600">ReplyX AI সম্পর্কে সাধারণ প্রশ্নের উত্তরসমূহ</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-colors shadow-xs"
            >
              <button
                onClick={() => toggleFaq(i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left text-base font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp className="w-5 h-5 text-indigo-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-10 sm:p-16 text-center text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6">
              আজই আপনার ব্যবসার সোশ্যাল চ্যানেলে <br />
              <span className="text-emerald-300">AI সেলস অটোমেশন</span> যুক্ত করুন
            </h2>
            <p className="text-base text-indigo-100 mb-8 max-w-2xl mx-auto">
              ReplyX AI দিয়ে ২৪/৭ কাস্টমারদের দ্রুততম সেবা দিন, সেলস বাড়ান এবং ব্যবসার সময় বাঁচান।
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 font-bold text-base shadow-xl shadow-black/10 transition-all transform hover:-translate-y-0.5"
            >
              <span>এখনই শুরু করুন</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-800">ReplyX AI</span>
            <span>— AI-Powered Omnichannel Social Automation</span>
          </div>
          <p>© <span suppressHydrationWarning>{new Date().getFullYear()}</span> ReplyX AI. সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </footer>
    </div>
  );
}
