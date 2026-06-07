'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Download, Play, Users, TrendingUp, CheckCircle, Clock, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const MOCK_PAYROLL = [
  { id: 'p1', period: 'Yanvar 2024', status: 'PAID', totalGross: 420000000, totalNet: 357000000, employeeCount: 50, paidAt: '2024-01-25', taxTotal: 42000000 },
  { id: 'p2', period: 'Dekabr 2023', status: 'PAID', totalGross: 418000000, totalNet: 355300000, employeeCount: 50, paidAt: '2023-12-25', taxTotal: 41800000 },
  { id: 'p3', period: 'Noyabr 2023', status: 'PAID', totalGross: 412000000, totalNet: 350200000, employeeCount: 49, paidAt: '2023-11-25', taxTotal: 41200000 },
  { id: 'p4', period: 'Fevral 2024', status: 'PROCESSING', totalGross: 0, totalNet: 0, employeeCount: 51, paidAt: null, taxTotal: 0 },
];

const MOCK_EMPLOYEE_PAYROLL = Array.from({ length: 10 }, (_, i) => ({
  id: `ep${i}`,
  name: ['Sardor Toshmatov', 'Malika Yusupova', 'Bobur Rakhimov', 'Jasur Mirzayev', 'Dilnoza Karimova', 'Sherzod Nazarov', 'Nilufar Hasanova', 'Otabek Sobirov', 'Gulnora Tursunova', 'Kamola Ergasheva'][i],
  dept: ['IT', 'HR', 'Moliya', 'Savdo', 'Marketing', 'Savdo', 'IT', 'IT', 'Moliya', 'Admin'][i],
  gross: [8500000, 7200000, 6800000, 9500000, 7000000, 11000000, 5500000, 12000000, 6200000, 5000000][i],
  net: [7225000, 6120000, 5780000, 8075000, 5950000, 9350000, 4675000, 10200000, 5270000, 4250000][i],
  bonus: [500000, 0, 0, 1500000, 0, 2000000, 0, 2000000, 0, 0][i],
  tax: [850000, 720000, 680000, 950000, 700000, 1100000, 550000, 1200000, 620000, 500000][i],
  status: 'PAID',
}));

const TREND_DATA = [
  { month: 'Avg', gross: 285, net: 230 },
  { month: 'Sen', gross: 290, net: 235 },
  { month: 'Okt', gross: 295, net: 238 },
  { month: 'Noy', gross: 412, net: 350 },
  { month: 'Dek', gross: 418, net: 355 },
  { month: 'Yan', gross: 420, net: 357 },
];

const TREND_MAX = Math.max(...TREND_DATA.map(d => d.gross));

function fmt(n: number): string {
  if (n === 0) return '-';
  return new Intl.NumberFormat('ru-RU').format(n) + " so'm";
}

function fmtM(n: number): string {
  if (n === 0) return '-';
  return (n / 1000000).toFixed(1) + 'M';
}

const STATUS_BADGE: Record<string, string> = {
  PAID: 'badge-green',
  PROCESSING: 'badge-yellow',
  DRAFT: 'badge-gray',
};

const STATUS_LABEL: Record<string, string> = {
  PAID: 'To\'langan',
  PROCESSING: 'Jarayonda',
  DRAFT: 'Qoralama',
};

export default function PayrollPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState(MOCK_PAYROLL[0]);
  const [expandedPeriod, setExpandedPeriod] = useState<string | null>('p1');

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const currentPeriod = MOCK_PAYROLL[0];
  const totalGross = currentPeriod.totalGross;
  const totalNet = currentPeriod.totalNet;
  const taxTotal = currentPeriod.taxTotal;
  const empCount = currentPeriod.employeeCount;

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
          <h1 className="page-title">Maosh boshqaruvi</h1>
          <p className="page-subtitle">Oylik hisoblash va to'lov boshqaruvi</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-secondary"
            onClick={() => toast.success('Bank fayli tayyorlandi')}
          >
            <Download className="w-4 h-4" />
            Bankka export
          </button>
          <button
            className="btn-primary"
            onClick={() => toast.success('Hisoblash boshlandi...')}
          >
            <Play className="w-4 h-4" />
            Yangi hisoblash
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card border-l-4 border-l-blue-500">
          <p className="text-xs text-gray-500 font-medium">Bu oy umumiy maosh</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{fmtM(totalGross)}</p>
          <p className="text-xs text-gray-400 mt-0.5">UZS</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600 font-medium">
            <TrendingUp className="w-3 h-3" /><span>+0.5% o'tgan oyga</span>
          </div>
        </div>
        <div className="stat-card border-l-4 border-l-green-500">
          <p className="text-xs text-gray-500 font-medium">Sof maosh</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{fmtM(totalNet)}</p>
          <p className="text-xs text-gray-400 mt-0.5">UZS (soliqdan keyin)</p>
        </div>
        <div className="stat-card border-l-4 border-l-red-400">
          <p className="text-xs text-gray-500 font-medium">Soliq ushlanmasi</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{fmtM(taxTotal)}</p>
          <p className="text-xs text-gray-400 mt-0.5">12% daromad solig'i</p>
        </div>
        <div className="stat-card border-l-4 border-l-purple-500">
          <p className="text-xs text-gray-500 font-medium">To'langan xodimlar</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{empCount}/50</p>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(empCount / 50) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Trend chart (CSS bars) + Periods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Payroll periods */}
        <div className="card">
          <div className="px-4 py-3.5 border-b border-gray-100">
            <h3 className="font-semibold text-sm text-gray-900">To'lov davrlari</h3>
          </div>
          <div className="p-2 space-y-1">
            {MOCK_PAYROLL.map((period) => (
              <div key={period.id}>
                <button
                  onClick={() => {
                    setActivePeriod(period);
                    setExpandedPeriod(expandedPeriod === period.id ? null : period.id);
                  }}
                  className={cn(
                    'w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors',
                    activePeriod.id === period.id && 'bg-blue-50 border border-blue-100',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">{period.period}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={STATUS_BADGE[period.status]}>{STATUS_LABEL[period.status]}</span>
                      {expandedPeriod === period.id ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                    </div>
                  </div>
                  {period.totalGross > 0 && (
                    <div className="mt-1 text-xs text-gray-500">
                      {period.employeeCount} xodim · {fmtM(period.totalGross)} umumiy
                    </div>
                  )}
                  {period.totalGross === 0 && (
                    <div className="mt-1 text-xs text-gray-400">{period.employeeCount} xodim · Hisoblash jarayonda</div>
                  )}
                </button>
              </div>
            ))}
          </div>
          <div className="px-4 pb-4">
            <button
              className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
              onClick={() => toast('Yangi davr yaratish tez kunda', { icon: '🕐' })}
            >
              + Yangi davr yaratish
            </button>
          </div>
        </div>

        {/* CSS-only bar chart trend */}
        {mounted && (
          <div className="lg:col-span-2 card p-5">
            <h3 className="font-semibold text-sm text-gray-900 mb-5">6 oylik maosh trendi (mln UZS)</h3>
            <div className="flex items-end gap-3 h-44">
              {TREND_DATA.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center gap-0.5" style={{ height: '140px', justifyContent: 'flex-end' }}>
                    <div className="text-xs text-gray-500 font-mono">{d.gross}M</div>
                    <div className="w-full flex gap-0.5 items-end" style={{ height: '110px' }}>
                      <div
                        className="flex-1 bg-blue-500 rounded-t"
                        style={{ height: `${(d.gross / TREND_MAX) * 100}%` }}
                        title={`Gross: ${d.gross}M`}
                      />
                      <div
                        className="flex-1 bg-emerald-500 rounded-t"
                        style={{ height: `${(d.net / TREND_MAX) * 100}%` }}
                        title={`Net: ${d.net}M`}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{d.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-500" /><span className="text-xs text-gray-500">Brutto</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-500" /><span className="text-xs text-gray-500">Netto</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Employee payroll detail */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-sm text-gray-900">
            {activePeriod.period} — Xodimlar maoshi
          </h3>
          <button
            className="btn-secondary text-xs"
            onClick={() => toast.success('Maosh jadvali yuklab olindi')}
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="table-header">Xodim</th>
                <th className="table-header">Bo'lim</th>
                <th className="table-header text-right">Brutto</th>
                <th className="table-header text-right">Bonus</th>
                <th className="table-header text-right">Soliq</th>
                <th className="table-header text-right">Netto</th>
                <th className="table-header">Holat</th>
                <th className="table-header">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_EMPLOYEE_PAYROLL.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {row.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{row.name}</span>
                    </div>
                  </td>
                  <td className="table-cell text-gray-500 text-sm">{row.dept}</td>
                  <td className="table-cell text-right text-sm text-gray-700">{fmtM(row.gross)}</td>
                  <td className="table-cell text-right text-sm text-blue-600">
                    {row.bonus > 0 ? `+${fmtM(row.bonus)}` : <span className="text-gray-300">-</span>}
                  </td>
                  <td className="table-cell text-right text-sm text-red-500">-{fmtM(row.tax)}</td>
                  <td className="table-cell text-right font-bold text-emerald-600">{fmt(row.net)}</td>
                  <td className="table-cell">
                    <span className="badge-green">
                      <CheckCircle className="inline w-3 h-3 mr-1" />
                      To'langan
                    </span>
                  </td>
                  <td className="table-cell">
                    <button
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      onClick={() => toast.success(`${row.name} maosh varaqasi yuklab olindi`)}
                    >
                      <FileText className="w-3 h-3" />
                      Varaqcha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t-2 border-gray-200">
                <td className="table-cell font-bold text-gray-900" colSpan={2}>Jami</td>
                <td className="table-cell text-right font-bold text-gray-900">{fmtM(MOCK_EMPLOYEE_PAYROLL.reduce((s, r) => s + r.gross, 0))}</td>
                <td className="table-cell text-right font-bold text-blue-600">+{fmtM(MOCK_EMPLOYEE_PAYROLL.reduce((s, r) => s + r.bonus, 0))}</td>
                <td className="table-cell text-right font-bold text-red-500">-{fmtM(MOCK_EMPLOYEE_PAYROLL.reduce((s, r) => s + r.tax, 0))}</td>
                <td className="table-cell text-right font-bold text-emerald-600">{fmt(MOCK_EMPLOYEE_PAYROLL.reduce((s, r) => s + r.net, 0))}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
