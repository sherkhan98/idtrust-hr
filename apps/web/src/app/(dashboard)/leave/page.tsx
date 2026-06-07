'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, CheckCircle, XCircle, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface LeaveRequest {
  id: string;
  employee: string;
  dept: string;
  type: string;
  from: string;
  to: string;
  days: number;
  status: LeaveStatus;
  reason: string;
  avatar: string;
}

const INITIAL_LEAVES: LeaveRequest[] = [
  { id: 'l1', employee: 'Sardor Toshmatov', dept: 'IT', type: "Yillik ta'til", from: '2024-01-25', to: '2024-02-01', days: 8, status: 'PENDING', reason: "Oilaviy ta'til", avatar: 'ST' },
  { id: 'l2', employee: 'Malika Yusupova', dept: 'HR', type: "Kasal ta'til", from: '2024-01-23', to: '2024-01-24', days: 2, status: 'APPROVED', reason: 'ARVI', avatar: 'MY' },
  { id: 'l3', employee: 'Bobur Rakhimov', dept: 'Moliya', type: 'Xizmat safari', from: '2024-01-28', to: '2024-01-30', days: 3, status: 'PENDING', reason: 'Samarqand audit', avatar: 'BR' },
  { id: 'l4', employee: 'Jasur Mirzayev', dept: 'Savdo', type: 'Masofaviy', from: '2024-01-22', to: '2024-01-22', days: 1, status: 'APPROVED', reason: 'Mijoz uchrashuvi', avatar: 'JM' },
  { id: 'l5', employee: 'Dilnoza Karimova', dept: 'Marketing', type: "Yillik ta'til", from: '2024-02-05', to: '2024-02-09', days: 5, status: 'REJECTED', reason: '', avatar: 'DK' },
  { id: 'l6', employee: 'Kamola Ergasheva', dept: 'Admin', type: "Yillik ta'til", from: '2024-02-15', to: '2024-02-20', days: 6, status: 'PENDING', reason: '', avatar: 'KE' },
];

const LEAVE_TYPES_LIST = ["Yillik ta'til", "Kasal ta'til", 'Xizmat safari', 'Masofaviy', "Haqsiz ta'til"];

const EMPLOYEES = [
  'Sardor Toshmatov', 'Malika Yusupova', 'Bobur Rakhimov',
  'Jasur Mirzayev', 'Dilnoza Karimova', 'Sherzod Nazarov',
  'Nilufar Hasanova', 'Otabek Sobirov', 'Gulnora Tursunova', 'Kamola Ergasheva',
];

const LEAVE_BALANCE = [
  { type: "Yillik ta'til", color: '#3B82F6', total: 24, used: 7 },
  { type: "Kasal ta'til", color: '#EF4444', total: 15, used: 2 },
  { type: 'Xizmat safari', color: '#F59E0B', total: 10, used: 3 },
  { type: 'Masofaviy', color: '#8B5CF6', total: 12, used: 1 },
];

const STATUS_CONFIG: Record<LeaveStatus, { badge: string; icon: typeof CheckCircle; label: string }> = {
  APPROVED: { badge: 'badge-green', icon: CheckCircle, label: 'Tasdiqlangan' },
  PENDING: { badge: 'badge-yellow', icon: Clock, label: 'Kutilmoqda' },
  REJECTED: { badge: 'badge-red', icon: XCircle, label: "Rad etilgan" },
};

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
  'bg-teal-500', 'bg-pink-500', 'bg-indigo-500', 'bg-red-500',
  'bg-yellow-500', 'bg-cyan-500',
];

const FILTER_TABS = [
  { key: 'ALL', label: 'Barchasi' },
  { key: 'PENDING', label: 'Kutilmoqda' },
  { key: 'APPROVED', label: 'Tasdiqlangan' },
  { key: 'REJECTED', label: "Rad etilgan" },
];

function getColor(avatar: string): string {
  const idx = avatar.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export default function LeavePage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [leaves, setLeaves] = useState<LeaveRequest[]>(INITIAL_LEAVES);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    employee: EMPLOYEES[0],
    type: LEAVE_TYPES_LIST[0],
    from: '',
    to: '',
    reason: '',
  });

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleApprove = (id: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'APPROVED' } : l));
    toast.success("Ta'til so'rovi tasdiqlandi");
  };

  const handleReject = (id: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'REJECTED' } : l));
    toast.error("Ta'til so'rovi rad etildi");
  };

  const handleSubmitForm = () => {
    if (!form.from || !form.to) {
      toast.error('Sanalarni kiriting');
      return;
    }
    const fromDate = new Date(form.from);
    const toDate = new Date(form.to);
    const days = Math.max(1, Math.ceil((toDate.getTime() - fromDate.getTime()) / 86400000) + 1);
    const initials = form.employee.split(' ').map(n => n[0]).join('').slice(0, 2);
    const newLeave: LeaveRequest = {
      id: `l${Date.now()}`,
      employee: form.employee,
      dept: 'Noma\'lum',
      type: form.type,
      from: form.from,
      to: form.to,
      days,
      status: 'PENDING',
      reason: form.reason,
      avatar: initials,
    };
    setLeaves(prev => [newLeave, ...prev]);
    setShowModal(false);
    setForm({ employee: EMPLOYEES[0], type: LEAVE_TYPES_LIST[0], from: '', to: '', reason: '' });
    toast.success("Yangi ta'til so'rovi qo'shildi");
  };

  const filtered = filter === 'ALL' ? leaves : leaves.filter(l => l.status === filter);

  const totalCount = leaves.length;
  const pendingCount = leaves.filter(l => l.status === 'PENDING').length;
  const approvedCount = leaves.filter(l => l.status === 'APPROVED').length;
  const rejectedCount = leaves.filter(l => l.status === 'REJECTED').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Ta'til boshqaruvi</h1>
          <p className="page-subtitle">Xodimlar ta'til so'rovlarini boshqaring</p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn-secondary"
            onClick={() => toast("Ta'til kalendariga o'tish tez kunda", { icon: '📅' })}
          >
            <Calendar className="w-4 h-4" />
            Kalendar
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Yangi ta'til so'rovi
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Jami', value: totalCount, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-blue-500', icon: Calendar },
          { label: 'Kutilmoqda', value: pendingCount, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-l-yellow-500', icon: Clock },
          { label: 'Tasdiqlangan', value: approvedCount, color: 'text-green-600', bg: 'bg-green-50', border: 'border-l-green-500', icon: CheckCircle },
          { label: "Rad etilgan", value: rejectedCount, color: 'text-red-600', bg: 'bg-red-50', border: 'border-l-red-500', icon: XCircle },
        ].map((s) => (
          <div key={s.label} className={cn('card p-5 border-l-4', s.border)}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
              </div>
              <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', s.bg)}>
                <s.icon className={cn('w-5 h-5', s.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main layout: table + balance widget */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Leave requests - takes 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filter tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {FILTER_TABS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                  filter === f.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50',
                )}
              >
                {f.label}
                {f.key === 'PENDING' && pendingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-orange-100 text-orange-600 rounded-full">{pendingCount}</span>
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="table-header">Xodim</th>
                    <th className="table-header">Ta'til turi</th>
                    <th className="table-header">Sana</th>
                    <th className="table-header">Kunlar</th>
                    <th className="table-header">Holat</th>
                    <th className="table-header">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((leave) => {
                    const cfg = STATUS_CONFIG[leave.status];
                    return (
                      <tr key={leave.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="table-cell">
                          <div className="flex items-center gap-2.5">
                            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0', getColor(leave.avatar))}>
                              {leave.avatar}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-800">{leave.employee}</div>
                              <div className="text-xs text-gray-400">{leave.dept}</div>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {leave.type}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="text-sm text-gray-700">{leave.from}</div>
                          <div className="text-xs text-gray-400">— {leave.to}</div>
                          {leave.reason ? <div className="text-xs text-gray-400 mt-0.5 italic">{leave.reason}</div> : null}
                        </td>
                        <td className="table-cell">
                          <span className="text-sm font-semibold text-gray-900">{leave.days}</span>
                          <span className="text-xs text-gray-400 ml-1">kun</span>
                        </td>
                        <td className="table-cell">
                          <span className={cfg.badge}>
                            <cfg.icon className="inline w-3 h-3 mr-1" />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="table-cell">
                          {leave.status === 'PENDING' && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleApprove(leave.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                              >
                                <CheckCircle className="w-3 h-3" />Tasdiqlash
                              </button>
                              <button
                                onClick={() => handleReject(leave.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <XCircle className="w-3 h-3" />Rad etish
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                        So'rovlar topilmadi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Leave balance widget */}
        <div className="card p-5 h-fit">
          <h3 className="font-semibold text-sm text-gray-900 mb-4">Ta'til balansi</h3>
          <div className="space-y-4">
            {LEAVE_BALANCE.map((lb) => (
              <div key={lb.type}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-700">{lb.type}</span>
                  <span className="text-xs text-gray-500">{lb.total - lb.used}/{lb.total}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(lb.used / lb.total) * 100}%`, background: lb.color }}
                  />
                </div>
                <div className="flex justify-between mt-0.5">
                  <span className="text-xs text-gray-400">Ishlatildi: {lb.used}</span>
                  <span className="text-xs font-semibold" style={{ color: lb.color }}>Qoldi: {lb.total - lb.used}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-3 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-700 font-medium">Keyingi ta'til</p>
            <p className="text-sm font-semibold text-blue-900 mt-0.5">Yanvar 25 — Fevral 1</p>
            <p className="text-xs text-blue-600">Sardor Toshmatov · 8 kun</p>
          </div>
        </div>
      </div>

      {/* New leave request modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Yangi ta'til so'rovi</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Xodim</label>
                <select
                  value={form.employee}
                  onChange={e => setForm(f => ({ ...f, employee: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {EMPLOYEES.map(emp => <option key={emp}>{emp}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Ta'til turi</label>
                <select
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {LEAVE_TYPES_LIST.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Boshlash</label>
                  <input
                    type="date"
                    value={form.from}
                    onChange={e => setForm(f => ({ ...f, from: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tugash</label>
                  <input
                    type="date"
                    value={form.to}
                    onChange={e => setForm(f => ({ ...f, to: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sabab (ixtiyoriy)</label>
                <textarea
                  value={form.reason}
                  onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                  rows={3}
                  placeholder="Ta'til sababi..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 pb-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 btn-secondary justify-center"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSubmitForm}
                className="flex-1 btn-primary justify-center"
              >
                Yuborish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
