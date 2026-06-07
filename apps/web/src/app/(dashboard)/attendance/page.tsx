'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Download, Settings, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import toast from 'react-hot-toast';

const MOCK_ATTENDANCE = [
  { id: 'a1', date: '2024-01-22', employeeName: 'Sardor Toshmatov', dept: 'IT', checkIn: '08:52', checkOut: '18:05', workHours: 9.2, method: 'GPS', status: 'PRESENT', late: 0 },
  { id: 'a2', date: '2024-01-22', employeeName: 'Malika Yusupova', dept: 'HR', checkIn: '08:45', checkOut: '18:00', workHours: 9.25, method: 'Face ID', status: 'PRESENT', late: 0 },
  { id: 'a3', date: '2024-01-22', employeeName: 'Bobur Rakhimov', dept: 'Moliya', checkIn: '09:35', checkOut: '18:30', workHours: 8.9, method: 'QR', status: 'LATE', late: 35 },
  { id: 'a4', date: '2024-01-22', employeeName: 'Jasur Mirzayev', dept: 'Savdo', checkIn: null, checkOut: null, workHours: 0, method: '-', status: 'ABSENT', late: 0 },
  { id: 'a5', date: '2024-01-22', employeeName: 'Dilnoza Karimova', dept: 'Marketing', checkIn: '08:58', checkOut: '17:55', workHours: 8.95, method: 'NFC', status: 'PRESENT', late: 0 },
  { id: 'a6', date: '2024-01-22', employeeName: 'Sherzod Nazarov', dept: 'Savdo', checkIn: '09:02', checkOut: '18:10', workHours: 9.1, method: 'GPS', status: 'PRESENT', late: 2 },
  { id: 'a7', date: '2024-01-22', employeeName: 'Nilufar Hasanova', dept: 'IT', checkIn: null, checkOut: null, workHours: 0, method: '-', status: 'ABSENT', late: 0 },
  { id: 'a8', date: '2024-01-22', employeeName: 'Otabek Sobirov', dept: 'IT', checkIn: '08:30', checkOut: '18:05', workHours: 9.6, method: 'Face ID', status: 'PRESENT', late: 0 },
  { id: 'a9', date: '2024-01-22', employeeName: 'Gulnora Tursunova', dept: 'Moliya', checkIn: '09:48', checkOut: '18:15', workHours: 8.4, method: 'QR', status: 'LATE', late: 48 },
  { id: 'a10', date: '2024-01-22', employeeName: 'Kamola Ergasheva', dept: 'Admin', checkIn: '08:55', checkOut: '17:58', workHours: 9.05, method: 'NFC', status: 'PRESENT', late: 0 },
];

const WEEKLY_DATA = [
  { day: 'Du', keldi: 120, kech: 12, kelmadi: 8 },
  { day: 'Se', keldi: 124, kech: 10, kelmadi: 6 },
  { day: 'Ch', keldi: 118, kech: 14, kelmadi: 10 },
  { day: 'Pa', keldi: 122, kech: 11, kelmadi: 7 },
  { day: 'Ju', keldi: 115, kech: 16, kelmadi: 9 },
];

const DEPTS = ['Barchasi', 'IT', 'HR', 'Moliya', 'Savdo', 'Marketing', 'Admin'];
const STATUSES = ['Barchasi', 'PRESENT', 'LATE', 'ABSENT'];

const METHOD_COLORS: Record<string, string> = {
  'GPS': 'bg-green-100 text-green-700',
  'Face ID': 'bg-purple-100 text-purple-700',
  'QR': 'bg-blue-100 text-blue-700',
  'NFC': 'bg-orange-100 text-orange-700',
  '-': 'bg-gray-100 text-gray-500',
};

function exportCSV(data: typeof MOCK_ATTENDANCE) {
  const headers = ['ID', 'Sana', 'Xodim', 'Bo\'lim', 'Kelish', 'Ketish', 'Ish soati', 'Usul', 'Holat', 'Kechikish (min)'];
  const rows = data.map(r => [
    r.id, r.date, r.employeeName, r.dept,
    r.checkIn ?? '-', r.checkOut ?? '-',
    r.workHours, r.method, r.status, r.late,
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'davomat.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function AttendancePage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('2024-01-22');
  const [deptFilter, setDeptFilter] = useState('Barchasi');
  const [statusFilter, setStatusFilter] = useState('Barchasi');
  const [search, setSearch] = useState('');
  const [todayStr, setTodayStr] = useState('22.01.2024');

  useEffect(() => {
    setTodayStr(new Date().toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' }));
    setMounted(true);
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = MOCK_ATTENDANCE.filter(r => {
    if (deptFilter !== 'Barchasi' && r.dept !== deptFilter) return false;
    if (statusFilter !== 'Barchasi' && r.status !== statusFilter) return false;
    if (search && !r.employeeName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const total = 156;
  const present = 128;
  const late = 14;
  const absent = 14;

  const stats = [
    { label: 'Jami', value: total, sub: '100%', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-blue-500' },
    { label: 'Keldi', value: present, sub: `${Math.round((present / total) * 100)}%`, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-l-green-500' },
    { label: 'Kech', value: late, sub: `${Math.round((late / total) * 100)}%`, icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-l-yellow-500' },
    { label: 'Kelmadi', value: absent, sub: `${Math.round((absent / total) * 100)}%`, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-l-red-500' },
  ];

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
          <h1 className="page-title">Davomat</h1>
          <p className="page-subtitle">Bugun: {todayStr}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/attendance/settings" className="btn-secondary">
            <Settings className="w-4 h-4" />
            Davomat sozlamalari
          </Link>
          <button
            className="btn-secondary"
            onClick={() => {
              exportCSV(filtered);
              toast.success('CSV fayl yuklab olindi');
            }}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={cn('card p-5 border-l-4', s.border)}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
              </div>
              <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', s.bg)}>
                <s.icon className={cn('w-5 h-5', s.color)} />
              </div>
            </div>
            <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all', {
                  'bg-blue-500': s.label === 'Jami',
                  'bg-green-500': s.label === 'Keldi',
                  'bg-yellow-500': s.label === 'Kech',
                  'bg-red-500': s.label === 'Kelmadi',
                })}
                style={{ width: s.sub }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      {mounted && (
        <div className="card p-5">
          <h3 className="font-semibold text-sm text-gray-900 mb-4">Haftalik davomat</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WEEKLY_DATA} barSize={18} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Bar dataKey="keldi" name="Keldi" fill="#22C55E" radius={[3, 3, 0, 0]} />
              <Bar dataKey="kech" name="Kech" fill="#EAB308" radius={[3, 3, 0, 0]} />
              <Bar dataKey="kelmadi" name="Kelmadi" fill="#EF4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Filter bar */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Filtr:</span>
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {DEPTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Xodim qidirish..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} ta natija</span>
        </div>
      </div>

      {/* Attendance table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-sm text-gray-900">Davomat jadvali</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="table-header">Xodim</th>
                <th className="table-header">Kelish vaqti</th>
                <th className="table-header">Ketish vaqti</th>
                <th className="table-header">Ish soati</th>
                <th className="table-header">Usul</th>
                <th className="table-header">Holat</th>
                <th className="table-header">Kechikish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((emp) => (
                <tr
                  key={emp.id}
                  className={cn('transition-colors', {
                    'bg-yellow-50/60 hover:bg-yellow-50': emp.status === 'LATE',
                    'bg-red-50/50 hover:bg-red-50': emp.status === 'ABSENT',
                    'hover:bg-gray-50/50': emp.status === 'PRESENT',
                  })}
                >
                  <td className="table-cell">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {emp.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{emp.employeeName}</div>
                        <div className="text-xs text-gray-400">{emp.dept}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    {emp.checkIn ? (
                      <span className={cn('text-sm font-mono font-semibold', emp.late > 0 ? 'text-yellow-700' : 'text-gray-800')}>
                        {emp.checkIn}
                      </span>
                    ) : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="table-cell">
                    {emp.checkOut
                      ? <span className="text-sm font-mono font-semibold text-gray-800">{emp.checkOut}</span>
                      : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="table-cell">
                    <span className="text-sm font-mono text-gray-700">
                      {emp.workHours > 0 ? `${emp.workHours}h` : '-'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', METHOD_COLORS[emp.method] ?? 'bg-gray-100 text-gray-500')}>
                      {emp.method}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={cn({
                      'badge-green': emp.status === 'PRESENT',
                      'badge-yellow': emp.status === 'LATE',
                      'badge-red': emp.status === 'ABSENT',
                    })}>
                      {emp.status === 'PRESENT' ? 'Keldi' : emp.status === 'LATE' ? 'Kech' : 'Kelmadi'}
                    </span>
                  </td>
                  <td className="table-cell">
                    {emp.late > 0
                      ? <span className="text-sm font-semibold text-yellow-700">{emp.late} daq</span>
                      : <span className="text-gray-400">-</span>}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                    Natija topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
