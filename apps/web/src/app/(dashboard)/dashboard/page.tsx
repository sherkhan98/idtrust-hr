'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import {
  Users, Clock, DollarSign, Calendar, Target,
  TrendingUp, UserCheck, UserX, Briefcase, AlertCircle,
  CheckCircle, ArrowUpRight, Building2,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { dashboardApi } from '@/lib/api';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { formatDate, cn } from '@/lib/utils';
import Link from 'next/link';

const ATTENDANCE_TREND = [
  { day: 'Mon', present: 45, absent: 3, late: 5 },
  { day: 'Tue', present: 47, absent: 2, late: 3 },
  { day: 'Wed', present: 44, absent: 4, late: 4 },
  { day: 'Thu', present: 46, absent: 3, late: 3 },
  { day: 'Fri', present: 43, absent: 5, late: 4 },
  { day: 'Sat', present: 20, absent: 30, late: 2 },
  { day: 'Sun', present: 5, absent: 47, late: 1 },
];

const DEPT_HEADCOUNT = [
  { name: 'IT', count: 14, fill: '#3B82F6' },
  { name: 'Sales', count: 11, fill: '#10B981' },
  { name: 'Finance', count: 7, fill: '#F59E0B' },
  { name: 'HR', count: 5, fill: '#8B5CF6' },
  { name: 'Ops', count: 8, fill: '#EC4899' },
  { name: 'Logistics', count: 5, fill: '#14B8A6' },
];

const PAYROLL_TREND = [
  { month: 'Jan', gross: 285000000, net: 230000000 },
  { month: 'Feb', gross: 290000000, net: 235000000 },
  { month: 'Mar', gross: 295000000, net: 238000000 },
  { month: 'Apr', gross: 288000000, net: 233000000 },
  { month: 'May', gross: 302000000, net: 242000000 },
  { month: 'Jun', gross: 310000000, net: 249000000 },
];

const RECENT_EMPLOYEES = [
  { id: '1', name: 'Alisher Toshmatov', dept: 'IT', role: 'Frontend Developer', date: '2024-05-15', avatar: 'AT' },
  { id: '2', name: 'Malika Yusupova', dept: 'HR', role: 'HR Specialist', date: '2024-05-12', avatar: 'MY' },
  { id: '3', name: 'Jasur Nazarov', dept: 'Sales', role: 'Sales Manager', date: '2024-05-10', avatar: 'JN' },
  { id: '4', name: 'Zulfiya Karimova', dept: 'Finance', role: 'Accountant', date: '2024-05-08', avatar: 'ZK' },
];

const PENDING_LEAVES = [
  { id: '1', name: 'Bobur Rahimov', type: 'Annual Leave', days: 5, from: '2024-06-10', dept: 'IT' },
  { id: '2', name: 'Nilufar Xasanova', type: 'Sick Leave', days: 3, from: '2024-06-05', dept: 'Sales' },
  { id: '3', name: 'Timur Sultanov', type: 'Business Trip', days: 7, from: '2024-06-12', dept: 'Ops' },
];

const AVATARCOLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
  'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
];

export default function CEODashboardPage() {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState('Xayrli kun');
  const [today, setToday] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Xayrli tong' : h < 18 ? 'Xayrli kun' : 'Xayrli kech');
    setToday(formatDate(new Date(), 'DD.MM.YYYY'));
    setMounted(true);
  }, []);

  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard', 'ceo'],
    queryFn: () => dashboardApi.ceo(),
    staleTime: 2 * 60 * 1000,
  });

  const stats = (dashboardData as any)?.stats;
  const userName = (session?.user as any)?.firstName || 'User';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{greeting}, {userName}! 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {today} · Kompaniyangizning umumiy ko&apos;rinishi
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/employees/new" className="btn-secondary">
            <Users className="w-4 h-4" />
            Add Employee
          </Link>
          <Link href="/analytics" className="btn-primary">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Employees" value={stats?.totalEmployees ?? 50} subtitle="employees" icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" trend={{ value: 8, label: 'vs last month' }} onClick={() => { window.location.href = '/employees'; }} />
        <StatsCard title="Present Today" value={stats?.todayPresent ?? 43} subtitle={`of ${stats?.activeEmployees ?? 50}`} icon={UserCheck} iconColor="text-green-600" iconBg="bg-green-50" trend={{ value: stats?.attendanceRate ?? 86, label: 'attendance rate' }} />
        <StatsCard title="Pending Leaves" value={stats?.pendingLeaves ?? 3} subtitle="requests" icon={Calendar} iconColor="text-orange-500" iconBg="bg-orange-50" onClick={() => { window.location.href = '/leave'; }} />
        <StatsCard title="Open Vacancies" value={stats?.openVacancies ?? 2} subtitle="positions" icon={Briefcase} iconColor="text-purple-600" iconBg="bg-purple-50" onClick={() => { window.location.href = '/recruitment'; }} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Monthly Payroll" value="302M" subtitle="UZS" icon={DollarSign} iconColor="text-emerald-600" iconBg="bg-emerald-50" trend={{ value: 4.1, label: 'vs last month' }} />
        <StatsCard title="Absent Today" value={stats?.todayAbsent ?? 7} subtitle="employees" icon={UserX} iconColor="text-red-500" iconBg="bg-red-50" />
        <StatsCard title="Open Tickets" value={stats?.openTickets ?? 5} subtitle="requests" icon={AlertCircle} iconColor="text-yellow-600" iconBg="bg-yellow-50" onClick={() => { window.location.href = '/helpdesk'; }} />
        <StatsCard title="Turnover Rate" value={`${stats?.turnoverRate ?? 3.2}%`} subtitle="this year" icon={TrendingUp} iconColor="text-indigo-600" iconBg="bg-indigo-50" trend={{ value: -0.8, label: 'vs last year' }} />
      </div>

      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Weekly Attendance</h3>
                <p className="text-xs text-gray-400 mt-0.5">Last 7 days overview</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />Present</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />Late</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />Absent</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ATTENDANCE_TREND} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                <Bar dataKey="present" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="#FB923C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#F87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 text-sm">By Department</h3>
              <p className="text-xs text-gray-400 mt-0.5">Employee distribution</p>
            </div>
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={DEPT_HEADCOUNT} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="count">
                  {DEPT_HEADCOUNT.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {DEPT_HEADCOUNT.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.fill }} />
                  <span className="text-xs text-gray-600 truncate">{d.name}</span>
                  <span className="text-xs font-semibold text-gray-800 ml-auto">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mounted && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Payroll Overview</h3>
              <p className="text-xs text-gray-400 mt-0.5">6 months gross vs net salary (UZS)</p>
            </div>
            <Link href="/payroll" className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
              View details <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={PAYROLL_TREND}>
              <defs>
                <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`${(v / 1000000).toFixed(1)}M UZS`]} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Area type="monotone" dataKey="gross" name="Gross" stroke="#3B82F6" strokeWidth={2} fill="url(#colorGross)" />
              <Area type="monotone" dataKey="net" name="Net" stroke="#10B981" strokeWidth={2} fill="url(#colorNet)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Recent Hires</h3>
            <Link href="/employees" className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">View all <ArrowUpRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_EMPLOYEES.map((emp, i) => (
              <div key={emp.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0', AVATARCOLORS[i % AVATARCOLORS.length])}>{emp.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{emp.name}</div>
                  <div className="text-xs text-gray-500 truncate">{emp.role} · {emp.dept}</div>
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0">{formatDate(emp.date)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Pending Leave Requests</h3>
            <Link href="/leave" className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">View all <ArrowUpRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-gray-50">
            {PENDING_LEAVES.map((leave, i) => (
              <div key={leave.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50">
                <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0', AVATARCOLORS[(i + 3) % AVATARCOLORS.length])}>
                  {leave.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{leave.name}</div>
                  <div className="text-xs text-gray-500">{leave.type} · {leave.days} days · from {formatDate(leave.from)}</div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center hover:bg-green-100 transition-colors">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  </button>
                  <button className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors">
                    <UserX className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
