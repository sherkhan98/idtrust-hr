'use client';

import { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, Minus, Plus, Award, BarChart2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const MOCK_KPIS = [
  { id: 'k1', name: 'Vazifalar bajarish', dept: 'Barchasi', unit: '%', target: 90, actual: 85, score: 94, trend: 'up' as const },
  { id: 'k2', name: 'Davomat foizi', dept: 'Barchasi', unit: '%', target: 95, actual: 92, score: 97, trend: 'stable' as const },
  { id: 'k3', name: 'Mijoz mamnuniyati', dept: 'Savdo', unit: 'ball', target: 4.5, actual: 4.2, score: 93, trend: 'up' as const },
  { id: 'k4', name: 'Sotuv rejasi', dept: 'Savdo', unit: '%', target: 100, actual: 87, score: 87, trend: 'down' as const },
  { id: 'k5', name: 'Kod sifati', dept: 'IT', unit: '%', target: 85, actual: 91, score: 107, trend: 'up' as const },
  { id: 'k6', name: "Hujjat aniqligi", dept: 'Moliya', unit: '%', target: 99, actual: 97, score: 98, trend: 'stable' as const },
];

const MOCK_TOP_PERFORMERS = [
  { name: 'Sardor Toshmatov', dept: 'IT', score: 107, avatar: 'ST', rank: 1 },
  { name: 'Otabek Sobirov', dept: 'IT', score: 103, avatar: 'OS', rank: 2 },
  { name: 'Malika Yusupova', dept: 'HR', score: 99, avatar: 'MY', rank: 3 },
  { name: 'Kamola Ergasheva', dept: 'Admin', score: 98, avatar: 'KE', rank: 4 },
  { name: 'Jasur Mirzayev', dept: 'Savdo', score: 95, avatar: 'JM', rank: 5 },
];

const DEPT_SCORES = [
  { dept: 'IT', avg: 100 },
  { dept: 'HR', avg: 97 },
  { dept: 'Moliya', avg: 98 },
  { dept: 'Savdo', avg: 90 },
  { dept: 'Admin', avg: 98 },
];

const AVATAR_COLORS: Record<string, string> = {
  ST: 'from-blue-500 to-indigo-600',
  OS: 'from-purple-500 to-violet-600',
  MY: 'from-pink-500 to-rose-600',
  KE: 'from-orange-500 to-amber-600',
  JM: 'from-green-500 to-emerald-600',
};

const DEPT_MAX = Math.max(...DEPT_SCORES.map(d => d.avg));

function scoreColor(score: number): string {
  if (score > 100) return 'badge-green';
  if (score >= 80) return 'badge-yellow';
  return 'badge-red';
}

function progressColor(score: number): string {
  if (score > 100) return 'bg-green-500';
  if (score >= 80) return 'bg-yellow-500';
  return 'bg-red-500';
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-green-600" />;
  if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
  return <Minus className="w-3.5 h-3.5 text-gray-400" />;
}

function ScoreRing({ score, size = 52 }: { score: number; size?: number }) {
  const clampedScore = Math.min(score, 100);
  const color = score > 100 ? '#22C55E' : score >= 80 ? '#EAB308' : '#EF4444';
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={5} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
      </svg>
      <span className="absolute text-xs font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

interface NewKPIForm {
  name: string;
  dept: string;
  unit: string;
  target: string;
}

export default function KPIPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [kpis, setKpis] = useState(MOCK_KPIS);
  const [showModal, setShowModal] = useState(false);
  const [newKPI, setNewKPI] = useState<NewKPIForm>({ name: '', dept: 'Barchasi', unit: '%', target: '90' });

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const avgScore = Math.round(kpis.reduce((s, k) => s + k.score, 0) / kpis.length);
  const aboveTarget = kpis.filter(k => k.score >= 100).length;
  const belowTarget = kpis.filter(k => k.score < 80).length;
  const deptCount = new Set(kpis.map(k => k.dept)).size;

  const handleAddKPI = () => {
    if (!newKPI.name.trim()) {
      toast.error('KPI nomini kiriting');
      return;
    }
    const kpi = {
      id: `k${Date.now()}`,
      name: newKPI.name,
      dept: newKPI.dept,
      unit: newKPI.unit,
      target: Number(newKPI.target) || 90,
      actual: 0,
      score: 0,
      trend: 'stable' as const,
    };
    setKpis(prev => [...prev, kpi]);
    setShowModal(false);
    setNewKPI({ name: '', dept: 'Barchasi', unit: '%', target: '90' });
    toast.success("Yangi KPI qo'shildi");
  };

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
          <h1 className="page-title">KPI boshqaruvi</h1>
          <p className="page-subtitle">Yanvar 2024 ish samaradorligi ko'rsatkichlari</p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn-secondary"
            onClick={() => toast('Hisobot tayyorlanmoqda...', { icon: '📊' })}
          >
            <TrendingUp className="w-4 h-4" />
            Hisobotlar
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Yangi KPI qo'shish
          </button>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "O'rtacha ball", value: `${avgScore}%`, sub: 'Umumiy KPI', color: 'text-green-600', bg: 'bg-green-50', border: 'border-l-green-500', icon: Target },
          { label: "Maqsaddan yuqori", value: String(aboveTarget), sub: 'KPI ko\'rsatkich', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-blue-500', icon: TrendingUp },
          { label: "Maqsaddan past", value: String(belowTarget), sub: "Yaxshilash kerak", color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-l-orange-500', icon: TrendingDown },
          { label: "Kuzatiladigan bo'limlar", value: String(deptCount), sub: "Faol bo'limlar", color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-l-purple-500', icon: BarChart2 },
        ].map((s) => (
          <div key={s.label} className={cn('card p-5 border-l-4', s.border)}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                <p className={cn('text-2xl font-bold mt-1', s.color)}>{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
              </div>
              <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', s.bg)}>
                <s.icon className={cn('w-5 h-5', s.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* KPI Cards grid */}
      <div>
        <h2 className="font-semibold text-sm text-gray-800 mb-3">KPI ko'rsatkichlari</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi) => {
            const pct = Math.min((kpi.actual / kpi.target) * 100, 100);
            return (
              <div key={kpi.id} className="card p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800">{kpi.name}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {kpi.dept}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <TrendIcon trend={kpi.trend} />
                    <span className={scoreColor(kpi.score)}>{kpi.score}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Haqiqiy: {kpi.actual}{kpi.unit}</span>
                    <span>Maqsad: {kpi.target}{kpi.unit}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', progressColor(kpi.score))}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 text-right">{pct.toFixed(0)}% bajarildi</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom: Top performers + Dept comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top performers */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-sm text-gray-900">Top xodimlar</h3>
            <Award className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="divide-y divide-gray-50">
            {MOCK_TOP_PERFORMERS.map((emp) => (
              <div key={emp.name} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50">
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0',
                  emp.rank === 1 ? 'bg-yellow-400' : emp.rank === 2 ? 'bg-gray-400' : emp.rank === 3 ? 'bg-orange-600' : 'bg-gray-200 text-gray-600',
                )}>
                  {emp.rank}
                </div>
                <div className={cn('w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold flex-shrink-0', AVATAR_COLORS[emp.avatar] ?? 'from-blue-500 to-indigo-600')}>
                  {emp.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800">{emp.name}</div>
                  <div className="text-xs text-gray-500">{emp.dept}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', progressColor(emp.score))}
                      style={{ width: `${Math.min(emp.score, 100)}%` }}
                    />
                  </div>
                  <ScoreRing score={emp.score} size={48} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department comparison - CSS bars */}
        {mounted && (
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-gray-900 mb-5">Bo'limlar bo'yicha o'rtacha ball</h3>
            <div className="space-y-3">
              {DEPT_SCORES.map((d) => (
                <div key={d.dept} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">{d.dept}</span>
                  <div className="flex-1 h-7 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div
                      className={cn('h-full rounded-lg transition-all', progressColor(d.avg))}
                      style={{ width: `${(d.avg / DEPT_MAX) * 100}%` }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-700">{d.avg}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 p-3 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-700 font-medium">Eng yuqori ko'rsatkich</p>
              <p className="text-sm font-semibold text-blue-900 mt-0.5">IT bo'limi — 100%</p>
              <p className="text-xs text-blue-600">Sardor Toshmatov, Otabek Sobirov</p>
            </div>
          </div>
        )}
      </div>

      {/* Add KPI modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Yangi KPI qo'shish</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">KPI nomi *</label>
                <input
                  type="text"
                  value={newKPI.name}
                  onChange={e => setNewKPI(f => ({ ...f, name: e.target.value }))}
                  placeholder="Masalan: Loyiha bajarish foizi"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Bo'lim</label>
                  <select
                    value={newKPI.dept}
                    onChange={e => setNewKPI(f => ({ ...f, dept: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {['Barchasi', 'IT', 'HR', 'Moliya', 'Savdo', 'Marketing', 'Admin'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">O'lchov birligi</label>
                  <select
                    value={newKPI.unit}
                    onChange={e => setNewKPI(f => ({ ...f, unit: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {['%', 'ball', 'dona', 'so\'m'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Maqsad qiymat</label>
                <input
                  type="number"
                  value={newKPI.target}
                  onChange={e => setNewKPI(f => ({ ...f, target: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 pb-6">
              <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary justify-center">
                Bekor qilish
              </button>
              <button onClick={handleAddKPI} className="flex-1 btn-primary justify-center">
                Qo'shish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
