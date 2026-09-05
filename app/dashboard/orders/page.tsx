'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  ShoppingCart,
  Search,
  Plus,
  Bot,
  User,
  Phone,
  MapPin,
  X,
  Trash2,
  Edit2,
  Copy,
  MessageCircle,
  Eye,
  RefreshCw,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function OrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({
    ALL: 0,
    PENDING: 0,
    CONFIRMED: 0,
    PROCESSING: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedPageId, setSelectedPageId] = useState('ALL');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Add Form State
  const [addForm, setAddForm] = useState({
    pageId: '',
    customerName: '',
    phone: '',
    address: '',
    product: '',
    quantity: '1',
    price: '',
    notes: '',
    status: 'PENDING',
  });

  // Edit Form State
  const [editForm, setEditForm] = useState({
    id: '',
    customerName: '',
    phone: '',
    address: '',
    product: '',
    quantity: '1',
    totalPrice: '',
    notes: '',
    status: 'PENDING',
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (selectedPageId !== 'ALL') params.append('pageId', selectedPageId);

      const [orderRes, pageRes] = await Promise.all([
        fetch(`/api/orders?${params.toString()}`),
        fetch('/api/pages'),
      ]);

      const orderData = await orderRes.json();
      const pageData = await pageRes.json();

      if (orderData.success) {
        setOrders(orderData.orders || []);
        if (orderData.counts) setCounts(orderData.counts);
      }
      if (pageData.success && pageData.pages?.length > 0) {
        setPages(pageData.pages);
        if (!addForm.pageId) {
          setAddForm((prev) => ({ ...prev, pageId: pageData.pages[0].id }));
        }
      }
    } catch (e) {
      toast.error('অর্ডার তালিকা লোড করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter, selectedPageId]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} কপি করা হয়েছে!`);
  };

  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`অর্ডার স্ট্যাটাস আপডেট হয়েছে: ${nextStatus}`);
        fetchOrders();
      } else {
        toast.error(data.error || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।');
      }
    } catch (e) {
      toast.error('সার্ভার ত্রুটি।');
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.customerName.trim() || !addForm.phone.trim() || !addForm.address.trim()) {
      toast.error('গ্রাহকের নাম, মোবাইল নম্বর এবং ঠিকানা পূরণ করুন।');
      return;
    }

    setSaving(true);
    try {
      const qty = parseInt(addForm.quantity || '1', 10);
      const prc = parseFloat(addForm.price || '0');

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...addForm,
          quantity: qty,
          price: prc,
          totalPrice: prc * qty,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('অর্ডার তৈরি হয়েছে!');
        setShowAddModal(false);
        setAddForm({
          pageId: pages[0]?.id || '',
          customerName: '',
          phone: '',
          address: '',
          product: '',
          quantity: '1',
          price: '',
          notes: '',
          status: 'PENDING',
        });
        fetchOrders();
      } else {
        toast.error(data.error || 'অর্ডার তৈরি ব্যর্থ হয়েছে।');
      }
    } catch (e) {
      toast.error('সার্ভার ত্রুটি।');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEdit = (order: any) => {
    setEditForm({
      id: order.id,
      customerName: order.customerName || '',
      phone: order.phone || '',
      address: order.address || '',
      product: order.product || '',
      quantity: order.quantity ? order.quantity.toString() : '1',
      totalPrice: order.totalPrice ? order.totalPrice.toString() : '0',
      notes: order.notes || '',
      status: order.status || 'PENDING',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.id) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${editForm.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: editForm.customerName.trim(),
          phone: editForm.phone.trim(),
          address: editForm.address.trim(),
          product: editForm.product.trim(),
          quantity: parseInt(editForm.quantity || '1', 10),
          totalPrice: parseFloat(editForm.totalPrice || '0'),
          notes: editForm.notes.trim() || null,
          status: editForm.status,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('অর্ডার সফলভাবে আপডেট হয়েছে!');
        setShowEditModal(false);
        fetchOrders();
      } else {
        toast.error(data.error || 'আপডেট ব্যর্থ হয়েছে।');
      }
    } catch (e) {
      toast.error('সার্ভার ত্রুটি।');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('আপনি কি এই অর্ডারটি মুছে ফেলতে চান?')) return;

    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('অর্ডার মুছে ফেলা হয়েছে।');
        fetchOrders();
        setShowDetailModal(false);
      }
    } catch (e) {
      toast.error('অর্ডার মুছতে সমস্যা হয়েছে।');
    }
  };

  return (
    <DashboardLayout
      title="অর্ডার ম্যানেজমেন্ট"
      subtitle="AI ও মেসেঞ্জার থেকে ক্যাপচার করা সমস্ত কাস্টমার অর্ডার মনিটর, এডিট ও পরিচালনা করুন"
    >
      {/* Top Status Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { id: 'ALL', label: 'সকল অর্ডার', count: counts.ALL, color: 'text-slate-800' },
          { id: 'PENDING', label: 'পেন্ডিং', count: counts.PENDING, color: 'text-amber-600' },
          { id: 'CONFIRMED', label: 'কনফার্মড', count: counts.CONFIRMED, color: 'text-blue-600' },
          { id: 'PROCESSING', label: 'প্রসেসিং', count: counts.PROCESSING, color: 'text-purple-600' },
          { id: 'DELIVERED', label: 'ডেলিভার্ড', count: counts.DELIVERED, color: 'text-emerald-600' },
          { id: 'CANCELLED', label: 'বাতিল', count: counts.CANCELLED, color: 'text-rose-600' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              statusFilter === tab.id
                ? 'bg-indigo-50/70 border-indigo-300 shadow-xs ring-1 ring-indigo-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
            }`}
          >
            <span className="text-[11px] font-medium text-slate-500 block">{tab.label}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-xl font-extrabold ${tab.color}`}>{tab.count || 0}</span>
              <span className="text-[10px] text-slate-400">টি</span>
            </div>
          </button>
        ))}
      </div>

      {/* Filter and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="গ্রাহকের নাম, ফোন, ঠিকানা বা পণ্য..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <select
            value={selectedPageId}
            onChange={(e) => setSelectedPageId(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">সকল পেজ</option>
            {pages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.pageName}
              </option>
            ))}
          </select>

          <button
            onClick={fetchOrders}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>ম্যানুয়াল অর্ডার তৈরি করুন</span>
        </button>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">অর্ডার লোড হচ্ছে...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">কোনো অর্ডার পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            গ্রাহক মেসেঞ্জারে ক্রয়ের আগ্রহ প্রকাশ করলে AI স্বয়ংক্রিয়ভাবে তথ্য সংগ্রহ করে এখানে অর্ডার যুক্ত করবে।
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" /> নতুন অর্ডার যুক্ত করুন
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">অর্ডার নং ও পেজ</th>
                  <th className="py-3.5 px-4 font-semibold">গ্রাহক ও ফোন</th>
                  <th className="py-3.5 px-4 font-semibold">পণ্য ও পরিমাণ</th>
                  <th className="py-3.5 px-4 font-semibold">মূল্য</th>
                  <th className="py-3.5 px-4 font-semibold">উৎস (Source)</th>
                  <th className="py-3.5 px-4 font-semibold">স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 font-semibold">তারিখ</th>
                  <th className="py-3.5 px-4 font-semibold text-right">একশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-indigo-600">#{o.id.slice(0, 8)}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                        {o.page?.pageName || 'Facebook Page'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{o.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <span>{o.phone}</span>
                        {o.phone && (
                          <a
                            href={`https://wa.me/${o.phone.replace(/[^\d]/g, '').replace(/^01/, '8801')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            title="WhatsApp চ্যাট"
                          >
                            <MessageCircle className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{o.product}</div>
                      <div className="text-[11px] text-slate-500">{o.quantity} টি</div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      {o.totalPrice} ৳
                    </td>

                    <td className="py-3.5 px-4">
                      {o.source === 'WHATSAPP_AI' ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200 inline-flex items-center gap-1">
                          <Bot className="w-3 h-3" /> WhatsApp AI
                        </span>
                      ) : o.source === 'INSTAGRAM_AI' ? (
                        <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 text-[10px] font-semibold border border-pink-200 inline-flex items-center gap-1">
                          <Bot className="w-3 h-3" /> Instagram AI
                        </span>
                      ) : o.source === 'X_AI' ? (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-semibold border border-slate-200 inline-flex items-center gap-1">
                          <Bot className="w-3 h-3" /> X AI
                        </span>
                      ) : o.source === 'TELEGRAM_AI' ? (
                        <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[10px] font-semibold border border-sky-200 inline-flex items-center gap-1">
                          <Bot className="w-3 h-3" /> Telegram AI
                        </span>
                      ) : o.source === 'MESSENGER_AI' ? (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200 inline-flex items-center gap-1">
                          <Bot className="w-3 h-3" /> Messenger AI
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold border border-slate-200 inline-flex items-center gap-1">
                          <User className="w-3 h-3" /> Manual
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border focus:outline-none cursor-pointer ${
                          o.status === 'CONFIRMED'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : o.status === 'DELIVERED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : o.status === 'PROCESSING'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : o.status === 'CANCELLED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="PENDING">পেন্ডিং (Pending)</option>
                        <option value="CONFIRMED">কনফার্মড (Confirmed)</option>
                        <option value="PROCESSING">প্রসেসিং (Processing)</option>
                        <option value="DELIVERED">ডেলিভার্ড (Delivered)</option>
                        <option value="CANCELLED">বাতিল (Cancelled)</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(o.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedOrder(o);
                            setShowDetailModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200/80 transition-colors"
                          title="বিস্তারিত দেখুন"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(o)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-cyan-50 text-slate-600 hover:text-cyan-700 border border-slate-200/80 transition-colors"
                          title="সম্পাদনা করুন"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteOrder(o.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200/80 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-indigo-600 font-bold">#{selectedOrder.id.slice(0, 8)}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">অর্ডার বিস্তারিত</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-6">{selectedOrder.customerName}</h3>

            <div className="space-y-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">মোবাইল নম্বর:</span>
                    <span className="text-slate-900 font-mono text-sm font-semibold">{selectedOrder.phone}</span>
                  </div>
                </div>

                {selectedOrder.phone && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(selectedOrder.phone, 'ফোন নম্বর')}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      title="কপি করুন"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`https://wa.me/${selectedOrder.phone.replace(/[^\d]/g, '').replace(/^01/, '8801')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block text-[11px]">ডেলিভারি ঠিকানা:</span>
                  <span className="text-slate-800 leading-relaxed font-medium">{selectedOrder.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-slate-200 pt-3">
                <ShoppingCart className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block text-[11px]">অর্ডারকৃত পণ্য:</span>
                  <span className="text-slate-900 font-bold">{selectedOrder.product}</span>
                  <span className="text-slate-500 ml-2">({selectedOrder.quantity} টি)</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-sm">
                <span className="text-slate-600 font-medium">মোট প্রদেয় মূল্য (COD):</span>
                <span className="text-indigo-600 font-extrabold font-mono text-base">
                  {selectedOrder.totalPrice} ৳
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleDeleteOrder(selectedOrder.id)}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold transition-colors"
              >
                মুছে ফেলুন
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const target = selectedOrder;
                    setShowDetailModal(false);
                    handleOpenEdit(target);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  এডিট করুন
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">অর্ডার তথ্য সম্পাদনা (Edit Order)</h3>
            <p className="text-xs text-slate-500 mb-6">#{editForm.id.slice(0, 8)}</p>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">গ্রাহকের নাম *</label>
                <input
                  type="text"
                  required
                  value={editForm.customerName}
                  onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">মোবাইল ফোন নম্বর *</label>
                <input
                  type="tel"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ডেলিভারির পূর্ণ ঠিকানা *</label>
                <textarea
                  rows={2}
                  required
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">পণ্য (Product) *</label>
                <input
                  type="text"
                  required
                  value={editForm.product}
                  onChange={(e) => setEditForm({ ...editForm, product: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">পরিমাণ</label>
                  <input
                    type="number"
                    value={editForm.quantity}
                    onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">মোট মূল্য (৳)</label>
                  <input
                    type="number"
                    value={editForm.totalPrice}
                    onChange={(e) => setEditForm({ ...editForm, totalPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">স্ট্যাটাস</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">নোট / বিশেষ নির্দেশনা</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs disabled:opacity-50 transition-colors"
                >
                  {saving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Manual Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">ম্যানুয়াল অর্ডার তৈরি করুন</h3>
            <p className="text-xs text-slate-500 mb-6">কাস্টমারের তথ্য ও পণ্যের বিবরণ দিয়ে অর্ডার বুক করুন</p>

            <form onSubmit={handleCreateOrder} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ফেসবুক পেজ *</label>
                <select
                  required
                  value={addForm.pageId}
                  onChange={(e) => setAddForm({ ...addForm, pageId: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                >
                  {pages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.pageName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">গ্রাহকের নাম *</label>
                <input
                  type="text"
                  required
                  value={addForm.customerName}
                  onChange={(e) => setAddForm({ ...addForm, customerName: e.target.value })}
                  placeholder="যেমন: তানভীর রহমান"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">মোবাইল ফোন নম্বর *</label>
                <input
                  type="tel"
                  required
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ডেলিভারির পূর্ণ ঠিকানা *</label>
                <textarea
                  rows={2}
                  required
                  value={addForm.address}
                  onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
                  placeholder="হাউজ নং, রোড, এরিয়া, জেলা"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">পণ্য (Product) *</label>
                <input
                  type="text"
                  required
                  value={addForm.product}
                  onChange={(e) => setAddForm({ ...addForm, product: e.target.value })}
                  placeholder="পণ্যের নাম ও সাইজ"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">পরিমাণ</label>
                  <input
                    type="number"
                    value={addForm.quantity}
                    onChange={(e) => setAddForm({ ...addForm, quantity: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">একক মূল্য (৳)</label>
                  <input
                    type="number"
                    value={addForm.price}
                    onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                    placeholder="যেমন: 1490"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs disabled:opacity-50 transition-colors"
                >
                  {saving ? 'সংরক্ষণ হচ্ছে...' : 'অর্ডার সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
