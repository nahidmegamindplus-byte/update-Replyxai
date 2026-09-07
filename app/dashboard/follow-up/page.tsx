'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useToast } from '@/components/ui/Toast';
import {
  Clock,
  Send,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  Play,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Eye,
  X,
  ArrowRight,
  Settings2,
} from 'lucide-react';

interface ScheduleStep {
  id?: string;
  stepNumber: number;
  dayOffset: number;
  timeOfDay: string;
  title: string;
  guidelinePrompt?: string | null;
  isEnabled: boolean;
}

interface FollowUpLogItem {
  id: string;
  stepNumber: number;
  dayOffset: number;
  scheduledTime?: string;
  messageText: string;
  channel: string;
  customerName?: string;
  senderPsid: string;
  status: string;
  aiModel?: string;
  createdAt: string;
  page?: { id: string; pageName: string; channel: string };
  conversation?: {
    id: string;
    customerName?: string;
    followUpStatus: string;
    currentFollowUpStep: number;
  };
}

interface ConversationItem {
  id: string;
  customerName?: string;
  senderPsid: string;
  channel: string;
  followUpStatus: string;
  currentFollowUpStep: number;
  nextFollowUpDueAt?: string;
  lastFollowUpSentAt?: string;
  lastMessage?: string;
  lastMessageAt: string;
  createdAt: string;
  page?: { id: string; pageName: string; channel: string };
  followUpLogs?: FollowUpLogItem[];
}

export default function FollowUpPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [runningManual, setRunningManual] = useState(false);
  const [savingSteps, setSavingSteps] = useState(false);

  // Data states
  const [steps, setSteps] = useState<ScheduleStep[]>([]);
  const [metrics, setMetrics] = useState({
    totalConversations: 0,
    inProgressCount: 0,
    repliedCount: 0,
    convertedCount: 0,
    completedCount: 0,
    totalSentLogs: 0,
    conversionRate: 0,
  });
  const [recentLogs, setRecentLogs] = useState<FollowUpLogItem[]>([]);
  const [activeConversations, setActiveConversations] = useState<ConversationItem[]>([]);
  const [pages, setPages] = useState<Array<{ id: string; pageName: string; channel: string; followUpEnabled: boolean }>>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'schedule' | 'pipeline' | 'logs'>('schedule');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Step Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [stepFormData, setStepFormData] = useState({
    dayOffset: 1,
    timeOfDay: '10:00',
    title: '',
    guidelinePrompt: '',
    isEnabled: true,
  });

  // History Modal
  const [historyModalConv, setHistoryModalConv] = useState<ConversationItem | null>(null);

  const fetchFollowUpData = async (pageId?: string) => {
    try {
      setLoading(true);
      const url = pageId ? `/api/follow-up?pageId=${pageId}` : '/api/follow-up';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setSteps(data.steps || []);
        setMetrics(data.metrics || {});
        setRecentLogs(data.recentLogs || []);
        setActiveConversations(data.activeConversations || []);
        setPages(data.pages || []);
      } else {
        toast.error(data.error || 'ডাটা লোড করতে ব্যর্থ হয়েছে');
      }
    } catch (e: any) {
      toast.error('সার্ভার কানেকশন ত্রুটি');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUpData(selectedPageId || undefined);
  }, [selectedPageId]);

  // Run Manual Follow-up Check
  const handleRunManual = async () => {
    try {
      setRunningManual(true);
      const res = await fetch('/api/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TRIGGER', pageId: selectedPageId || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'ফলো-আপ চেক সফলভাবে সম্পন্ন হয়েছে!');
        fetchFollowUpData(selectedPageId || undefined);
      } else {
        toast.error(data.error || 'প্রক্রিয়া চালাতে সমস্যা হয়েছে');
      }
    } catch (e) {
      toast.error('সার্ভার এরর');
    } finally {
      setRunningManual(false);
    }
  };

  // Open Step Modal
  const openAddStepModal = () => {
    const nextStepNum = steps.length + 1;
    const lastDay = steps.length > 0 ? steps[steps.length - 1].dayOffset : 0;
    const suggestedDay = lastDay === 0 ? 1 : lastDay < 3 ? 3 : lastDay < 7 ? 7 : lastDay < 15 ? 15 : 25;

    setEditingStepIndex(null);
    setStepFormData({
      dayOffset: suggestedDay,
      timeOfDay: '10:00',
      title: `${nextStepNum}ম ফলো-আপ (${suggestedDay} দিন পর)`,
      guidelinePrompt: '',
      isEnabled: true,
    });
    setModalOpen(true);
  };

  const openEditStepModal = (index: number) => {
    const target = steps[index];
    setEditingStepIndex(index);
    setStepFormData({
      dayOffset: target.dayOffset,
      timeOfDay: target.timeOfDay,
      title: target.title,
      guidelinePrompt: target.guidelinePrompt || '',
      isEnabled: target.isEnabled,
    });
    setModalOpen(true);
  };

  // Save Step (Add / Edit local list and persist)
  const handleSaveStepModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSteps = [...steps];

    if (editingStepIndex !== null) {
      updatedSteps[editingStepIndex] = {
        ...updatedSteps[editingStepIndex],
        dayOffset: Number(stepFormData.dayOffset),
        timeOfDay: stepFormData.timeOfDay,
        title: stepFormData.title || `ধাপ #${editingStepIndex + 1}`,
        guidelinePrompt: stepFormData.guidelinePrompt,
        isEnabled: stepFormData.isEnabled,
      };
    } else {
      updatedSteps.push({
        stepNumber: updatedSteps.length + 1,
        dayOffset: Number(stepFormData.dayOffset),
        timeOfDay: stepFormData.timeOfDay,
        title: stepFormData.title || `ধাপ #${updatedSteps.length + 1}`,
        guidelinePrompt: stepFormData.guidelinePrompt,
        isEnabled: stepFormData.isEnabled,
      });
    }

    // Sort by dayOffset
    updatedSteps.sort((a, b) => a.dayOffset - b.dayOffset);
    // Re-index stepNumbers
    const finalSteps = updatedSteps.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));

    setSteps(finalSteps);
    setModalOpen(false);
    await persistSteps(finalSteps);
  };

  // Delete Step
  const handleDeleteStep = async (index: number) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ফলো-আপ ধাপটি মুছে ফেলতে চান?')) return;
    const filtered = steps.filter((_, idx) => idx !== index);
    const finalSteps = filtered.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setSteps(finalSteps);
    await persistSteps(finalSteps);
  };

  // Toggle Step Enable/Disable
  const handleToggleStep = async (index: number) => {
    const updated = [...steps];
    updated[index].isEnabled = !updated[index].isEnabled;
    setSteps(updated);
    await persistSteps(updated);
  };

  // Save steps to backend
  const persistSteps = async (stepsToSave: ScheduleStep[]) => {
    try {
      setSavingSteps(true);
      const res = await fetch('/api/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SAVE_STEPS',
          pageId: selectedPageId || undefined,
          steps: stepsToSave,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('শিডিউল সংরক্ষিত হয়েছে!');
      } else {
        toast.error(data.error || 'সংরক্ষণ ব্যর্থ হয়েছে');
      }
    } catch (e) {
      toast.error('সার্ভার কানেকশন ত্রুটি');
    } finally {
      setSavingSteps(false);
    }
  };

  // Reset to default 5-step schedule
  const handleResetToDefault = async () => {
    if (!confirm('ডিফল্ট ৫-ধাপের রেকমেন্ডেড শিডিউলে রিসেট করতে চান?')) return;
    const defaultSteps: ScheduleStep[] = [
      {
        stepNumber: 1,
        dayOffset: 1,
        timeOfDay: '10:00',
        title: '১ম ফলো-আপ (১ দিন পর - সকাল ১০টা)',
        guidelinePrompt: 'পছন্দের পণ্য নিয়ে কোনো প্রশ্ন আছে কিনা নম্রভাবে ও আন্তরিকভাবে জানতে চান।',
        isEnabled: true,
      },
      {
        stepNumber: 2,
        dayOffset: 3,
        timeOfDay: '16:00',
        title: '২য় ফলো-আপ (৩ দিন পর - বিকাল ৪টা)',
        guidelinePrompt: 'পণ্যের প্রিমিয়াম কোয়ালিটি ও ক্যাশ অন ডেলিভারি (COD) সুবিধার কথা মনে করিয়ে দিন।',
        isEnabled: true,
      },
      {
        stepNumber: 3,
        dayOffset: 7,
        timeOfDay: '20:00',
        title: '৩য় ফলো-আপ (৭ দিন পর - রাত ৮টা)',
        guidelinePrompt: 'স্টক সীমিত হতে পারে এমন বন্ধুত্বপূর্ণ রিমাইন্ডার দিন।',
        isEnabled: true,
      },
      {
        stepNumber: 4,
        dayOffset: 15,
        timeOfDay: '11:00',
        title: '৪র্থ ফলো-আপ (১৫ দিন পর - সকাল ১১টা)',
        guidelinePrompt: 'কোনো সাহায্য লাগবে কিনা বা পছন্দের অন্য পণ্য দেখতে চান কিনা জানতে চান।',
        isEnabled: true,
      },
      {
        stepNumber: 5,
        dayOffset: 25,
        timeOfDay: '17:00',
        title: '৫ম ফলো-আপ (২৫ দিন পর - বিকাল ৫টা)',
        guidelinePrompt: 'মাসের সমাপনী আন্তরিক সম্ভাষণ ও যেকোনো প্রয়োজনে যোগাযোগের আহ্বান জানান।',
        isEnabled: true,
      },
    ];

    setSteps(defaultSteps);
    await persistSteps(defaultSteps);
  };

  // Format Time Helper
  const formatTimeDisplay = (time24: string) => {
    if (!time24) return '১০:০০ AM';
    const [hStr, mStr] = time24.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><RefreshCw className="w-3 h-3 animate-spin text-amber-600" /> ফলো-আপ চলছে</span>;
      case 'CUSTOMER_REPLIED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> রিপ্লাই করেছে</span>;
      case 'ORDER_PLACED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"><ShoppingBag className="w-3 h-3 text-indigo-600" /> অর্ডার সম্পন্ন</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"><ShieldCheck className="w-3 h-3 text-slate-500" /> সমাপ্ত</span>;
      case 'PAUSED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">পজ করা</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">অপেক্ষমাণ</span>;
    }
  };

  const filteredConversations = activeConversations.filter((c) => {
    if (statusFilter === 'ALL') return true;
    return c.followUpStatus === statusFilter;
  });

  return (
    <DashboardLayout
      title="AI ফলো-আপ অটোমেশন ও শিডিউল"
      subtitle="১ মাসের মধ্যে যেসব গ্রাহক অর্ডার করেননি তাদের সাথে শিডিউল অনুযায়ী স্বয়ংক্রিয় AI মেসেজ পাঠিয়ে রিকভার করুন।"
    >
      <div className="space-y-8">
        {/* Page Top Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  AI ফলো-আপ অটোমেশন ও শিডিউল
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                    ৩০ দিনের স্মার্ট রিকভারি
                  </span>
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  ১ মাসের মধ্যে যেসব গ্রাহক অর্ডার করেননি, তাদের সাথে শিডিউল অনুযায়ী পার্সোনালাইজড AI মেসেজ দিয়ে ফলো-আপ করুন।
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Page Filter */}
            {pages.length > 0 && (
              <select
                value={selectedPageId}
                onChange={(e) => setSelectedPageId(e.target.value)}
                className="text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
              >
                <option value="">সকল পেজ ও চ্যানেল</option>
                {pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.pageName} ({p.channel})
                  </option>
                ))}
              </select>
            )}

            {/* Run Automation Now */}
            <button
              onClick={handleRunManual}
              disabled={runningManual}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${runningManual ? 'animate-spin' : ''}`} />
              {runningManual ? 'ফলো-আপ চলছে...' : 'এখনই চেক ও সেন্ড করুন'}
            </button>
          </div>
        </div>

        {/* Funnel & Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">ফলো-আপ পাইপলাইন</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{metrics.inProgressCount || 0}</h3>
              <p className="text-xs text-amber-600 font-medium mt-0.5">গ্রাহক চলমান ধাপে আছেন</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">রিপ্লাই করেছে</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{metrics.repliedCount || 0}</h3>
              <p className="text-xs text-slate-400 mt-0.5">ফলো-আপের পর আবার চ্যাট করেছে</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">অর্ডার সম্পন্ন</p>
              <h3 className="text-2xl font-bold text-indigo-600 mt-1">{metrics.convertedCount || 0}</h3>
              <p className="text-xs text-indigo-600 font-medium mt-0.5">সফল কনভার্সন</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">মোট পাঠানো মেসেজ</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{metrics.totalSentLogs || 0}</h3>
              <p className="text-xs text-slate-400 mt-0.5">অটোমেটিক AI ফলো-আপ</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Send className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">কনভার্সন রেট</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{metrics.conversionRate || 0}%</h3>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">সফল ফলো-আপ রেট</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-6">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`pb-4 px-1 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'schedule'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              ফলো-আপ শিডিউল ও সেটিংস ({steps.length} টি ধাপ)
            </button>

            <button
              onClick={() => setActiveTab('pipeline')}
              className={`pb-4 px-1 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'pipeline'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              লাইভ ফলো-আপ পাইপলাইন ({activeConversations.length})
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`pb-4 px-1 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'logs'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Send className="w-4 h-4" />
              মেসেজ হিস্ট্রি ও অডিট লগ ({recentLogs.length})
            </button>
          </nav>
        </div>

        {/* TAB 1: SCHEDULE BUILDER */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    কাস্টমাইজেবল ফলো-আপ শিডিউল
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                      সম্পূর্ণ ডাইনামিক
                    </span>
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    ১ মাসের মধ্যে কবে, কখন এবং কয়টি ফলো-আপ যাবে তা ইচ্ছামতো যোগ, এডিট, রিমুভ ও চালু/বন্ধ করুন।
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleResetToDefault}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    ডিফল্ট শিডিউলে রিসেট
                  </button>

                  <button
                    onClick={openAddStepModal}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    নতুন ফলো-আপ ধাপ যোগ করুন
                  </button>
                </div>
              </div>

              {/* Steps Cards List */}
              {loading ? (
                <div className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-600" />
                  শিডিউল লোড হচ্ছে...
                </div>
              ) : steps.length === 0 ? (
                <div className="py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">কোনো ফলো-আপ শিডিউল তৈরি করা নেই</p>
                  <p className="text-xs text-slate-500 mt-1">
                    উপরের &quot;নতুন ফলো-আপ ধাপ যোগ করুন&quot; বাটনে ক্লিক করে শিডিউল তৈরি করুন।
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {steps.map((step, idx) => (
                    <div
                      key={step.id || idx}
                      className={`p-5 rounded-xl border transition-all ${
                        step.isEnabled
                          ? 'bg-white border-slate-200/90 shadow-xs hover:border-purple-300'
                          : 'bg-slate-50/70 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 font-bold shrink-0">
                            #{step.stepNumber}
                          </div>
                          <div>
                            <div className="flex items-center gap-2.5">
                              <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                                {step.dayOffset} দিন পর
                              </span>
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-200 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimeDisplay(step.timeOfDay)}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span className="font-semibold text-slate-700">AI নির্দেশিকা:</span>
                              {step.guidelinePrompt || 'স্বাভাবিক ও আন্তরিক ভঙ্গিতে ফলো-আপ করুন।'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {/* Toggle active */}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={step.isEnabled}
                              onChange={() => handleToggleStep(idx)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>

                          {/* Edit */}
                          <button
                            onClick={() => openEditStepModal(idx)}
                            className="p-2 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                            title="এডিট করুন"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteStep(idx)}
                            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Smart Information Callout */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-100 flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">AI মেমরি ও নন-রিপিটিশন সুরক্ষা (Zero Repetition Guarantee)</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  আমাদের AI সিস্টেম প্রতিবার মেসেজ পাঠানোর আগে গ্রাহকের পূর্ববর্তী সব চ্যাট হিস্ট্রি এবং আগে পাঠানো সকল ফলো-আপ মেসেজ বিশ্লেষণ করে। ফলে একই গ্রাহককে কখনোই একই মেসেজ দুইবার পাঠানো হয় না; প্রতিটি ফলো-আপ হয় সম্পূর্ণ ইউনিক ও আকর্ষণীয়। গ্রাহক রিপ্লাই দিলে বা অর্ডার করলে ফলো-আপ স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যায়।
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">গ্রাহক ফলো-আপ পাইপলাইন</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  গত ৩০ দিনে যেসব গ্রাহকের সাথে ফলো-আপ চলছে বা সম্পন্ন হয়েছে তাদের বর্তমান স্ট্যাটাস।
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { key: 'ALL', label: 'সকল' },
                  { key: 'IN_PROGRESS', label: 'চলমান' },
                  { key: 'CUSTOMER_REPLIED', label: 'রিপ্লাই করেছে' },
                  { key: 'ORDER_PLACED', label: 'অর্ডার সম্পন্ন' },
                  { key: 'COMPLETED', label: 'সমাপ্ত' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      statusFilter === tab.key
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pipeline Table */}
            {filteredConversations.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">এই ক্যাটাগরিতে কোনো গ্রাহক নেই</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-600 font-semibold text-xs">
                      <th className="py-3.5 px-4 rounded-l-xl">গ্রাহক ও চ্যানেল</th>
                      <th className="py-3.5 px-4">বর্তমান ধাপ</th>
                      <th className="py-3.5 px-4">স্ট্যাটাস</th>
                      <th className="py-3.5 px-4">সর্বশেষ ফলো-আপ</th>
                      <th className="py-3.5 px-4 rounded-r-xl text-right">মেসেজ হিস্ট্রি</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredConversations.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-900">{c.customerName || c.senderPsid}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                              {c.channel}
                            </span>
                            {c.page?.pageName && <span>• {c.page.pageName}</span>}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            ধাপ #{c.currentFollowUpStep} / {steps.length || 5}
                          </span>
                        </td>

                        <td className="py-4 px-4">{getStatusBadge(c.followUpStatus)}</td>

                        <td className="py-4 px-4 text-xs text-slate-500">
                          {c.lastFollowUpSentAt
                            ? new Date(c.lastFollowUpSentAt).toLocaleString('bn-BD', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'এখনো পাঠানো হয়নি'}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => setHistoryModalConv(c)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            মেসেজ দেখুন
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">ফলো-আপ মেসেজ হিস্ট্রি ও অডিট লগ</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                প্রতিটি স্বয়ংক্রিয় ফলো-আপ মেসেজের বিস্তারিত লগ এবং AI মডেল ট্র্যাকিং।
              </p>
            </div>

            {recentLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Send className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">কোনো ফলো-আপ লগ পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/30 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{log.customerName || log.senderPsid}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                          ধাপ #{log.stepNumber} ({log.dayOffset} দিন পর)
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {log.channel}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(log.createdAt).toLocaleString('bn-BD', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200/60 leading-relaxed">
                      &ldquo;{log.messageText}&rdquo;
                    </p>

                    <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                      <span>মডেল: {log.aiModel || 'Smart AI'}</span>
                      <span className="text-emerald-600 font-semibold">সফলভাবে প্রেরিত ✓</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      {/* STEP ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingStepIndex !== null ? 'ফলো-আপ ধাপ সম্পাদনা করুন' : 'নতুন ফলো-আপ ধাপ যুক্ত করুন'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              কত দিন পর এবং কয়টার সময় মেসেজ যাবে ও AI-এর জন্য বিশেষ নির্দেশিকা সেট করুন।
            </p>

            <form onSubmit={handleSaveStepModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    কয় দিন পর? (Day Offset)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={stepFormData.dayOffset}
                    onChange={(e) => setStepFormData({ ...stepFormData, dayOffset: parseInt(e.target.value, 10) || 1 })}
                    className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    placeholder="যেমন: 3"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    কখন পাঠাবে? (Time of Day)
                  </label>
                  <input
                    type="time"
                    required
                    value={stepFormData.timeOfDay}
                    onChange={(e) => setStepFormData({ ...stepFormData, timeOfDay: e.target.value })}
                    className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ধাপের নাম / টাইটেল
                </label>
                <input
                  type="text"
                  required
                  value={stepFormData.title}
                  onChange={(e) => setStepFormData({ ...stepFormData, title: e.target.value })}
                  className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  placeholder="যেমন: ২য় ফলো-আপ (৩ দিন পর)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  AI ফলো-আপ নির্দেশনা (Custom AI Guideline)
                </label>
                <textarea
                  rows={3}
                  value={stepFormData.guidelinePrompt}
                  onChange={(e) => setStepFormData({ ...stepFormData, guidelinePrompt: e.target.value })}
                  className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  placeholder="যেমন: ক্যাশ অন ডেলিভারি এবং দ্রুত ডেলিভারির সুবিধা মনে করিয়ে দিয়ে নম্রভাবে জানতে চান..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isEnabledCheckbox"
                  checked={stepFormData.isEnabled}
                  onChange={(e) => setStepFormData({ ...stepFormData, isEnabled: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                />
                <label htmlFor="isEnabledCheckbox" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  এই ধাপটি সক্রিয় রাখুন
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={savingSteps}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all"
                >
                  {savingSteps ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMER HISTORY & MEMORY MODAL */}
      {historyModalConv && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
            <button
              onClick={() => setHistoryModalConv(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {historyModalConv.customerName || historyModalConv.senderPsid}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                  {historyModalConv.channel}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                এই গ্রাহকের সাথে হওয়া সমস্ত ফলো-আপ মেসেজের মেমরি রেকর্ড।
              </p>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {!historyModalConv.followUpLogs || historyModalConv.followUpLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  কোনো পূর্ববর্তী ফলো-আপ লগ নেই।
                </div>
              ) : (
                historyModalConv.followUpLogs.map((log, idx) => (
                  <div key={log.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-purple-700">ধাপ #{log.stepNumber} ফলো-আপ</span>
                      <span className="text-slate-400">
                        {new Date(log.createdAt).toLocaleString('bn-BD', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium bg-white p-2.5 rounded-lg border border-slate-200/60">
                      &ldquo;{log.messageText}&rdquo;
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setHistoryModalConv(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}
