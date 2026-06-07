'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Clock, Download } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const HEADCOUNT_TREND = [
  { month: 'Jan', total: 42, new: 3, left: 1 },
  { month: 'Feb', total: 44, new: 4, left: 2 },
  { month: 'Mar', total: 46, new: 3, left: 1 },
  { month: 'Apr', total: 47, new: 2, left: 1 },
  { month: 'May', total: 48, new: 3, left: 2 },
  { month: 'Jun', total: 50, new: 4, left: 2 },
];

const TURNOVER = [
  { month: 'Jan', rate: 2.1 },
  { month: 'Feb', rate: 1.8 },
  { month: 'Mar', rate: 2.3 },
  { month: 'Apr', rate: 1.5 },
  { month: 'May', rate: 3.2 },
  { month: 'Jun', rate: 2.1 },
];

const SALARY_BAND = [
  { band: '2-3M', count: 8 },
  { band: '3-5M', count: 15 },
  { band: '5-8M', count: 14 },
  { band: '8-12M', count: 9 },
  { band: '12M+', count: 4 },
];

const ATTENDANCE_MONTHLY = [
  { month: 'Jan', rate: 91 },
  { month: 'Feb', rate: 89 },
  { month: 'Mar', rate: 93 },
  { month: 'Apr', rate: 90 },
  { month: 'May', rate: 87 },
  { month: 'Jun', rate: 92 },
];

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">HR Analytics</h1>
          <p className="page-subtitle">Workforce insights and reporting</p>
        </div>
        <div className="flex gap-2">
          <select className="input-field w-32">
            <option>2024</option>
            <option>2023</option>
          </select>
          <button className="btn-primary"><Download className="w-4 h-4" />Export</button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Tenure', value: '2.4 yrs', trend: '+0.3', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Avg Salary', value: '6.0M UZS', trend: '+8.2%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Turnover Rate', value: '3.2%', trend: '-0.8%', icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Avg Work Hours', value: '8.5h/day', trend: '+0.2', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((m) => (
          <div key={m.label} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">{m.label}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{m.value}</p>
                <p className={`text-xs mt-0.5 font-medium ${m.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{m.trend} this year</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.bg}`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      {mounted && <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-sm text-gray-900 mb-4">Headcount Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={HEADCOUNT_TREND}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Area type="monotone" dataKey="total" name="Total" stroke="#3B82F6" fill="url(#totalGrad)" strokeWidth={2} />
              <Line type="monotone" dataKey="new" name="New Hires" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="left" name="Exits" stroke="#EF4444" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-sm text-gray-900 mb-4">Salary Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={SALARY_BAND} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="band" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Bar dataKey="count" name="Employees" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-sm text-gray-900 mb-4">Monthly Attendance Rate (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ATTENDANCE_MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Line type="monotone" dataKey="rate" name="Attendance %" stroke="#22C55E" strokeWidth={2.5} dot={{ fill: '#22C55E', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-sm text-gray-900 mb-4">Turnover Rate (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={TURNOVER}>
              <defs>
                <linearGradient id="turnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Area type="monotone" dataKey="rate" name="Turnover %" stroke="#EF4444" fill="url(#turnGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>}
    </div>
  );
}
