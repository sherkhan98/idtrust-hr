'use client';

import Link from 'next/link';
import { BookOpen, Package, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';

const MODULES = [
  {
    icon: BookOpen,
    title: 'Buxgalteriya',
    subtitle: 'Accounting',
    desc: 'Hisob jadvali, jurnal yozuvlari, balans hisoboti, daromad/xarajat tahlili',
    href: '/erp/accounting',
    color: 'from-indigo-600 to-violet-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    features: ['Ikki yoqlamali hisob', 'Balans hisoboti', 'P&L hisoboti', 'DXH eksport'],
    tag: '1C o\'rniga',
  },
  {
    icon: Package,
    title: 'Omborxona',
    subtitle: 'Warehouse',
    desc: 'Mahsulotlar, zaxira nazorati, kirim/chiqim, kam zaxira ogohlantirish',
    href: '/erp/warehouse',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    features: ['Real-vaqt zaxira', 'Barcode/QR', 'Kam zaxira alert', 'Yetkazib beruvchi'],
    tag: 'Omborxona',
  },
  {
    icon: TrendingUp,
    title: 'Savdo & CRM',
    subtitle: 'Sales',
    desc: 'Mijozlar, kelishuvlar, pipeline, faoliyat tarixini boshqarish',
    href: '/erp/sales',
    color: 'from-emerald-600 to-green-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    features: ['Kanban pipeline', 'Mijoz kartasi', 'Deal tracking', 'Savdo hisoboti'],
    tag: 'CRM',
  },
];

export default function ErpPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">🏭</div>
          <div>
            <h1 className="text-2xl font-bold">IDTrust ERP</h1>
            <p className="text-slate-300 text-sm">O&#39;zbekistondagi birinchi to&#39;liq ERP — 1C ni almashtiring</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[['HR', 'Xodimlar va maosh'], ['Buxgalteriya', 'Hisobot va jurnal'], ['Omborxona + Savdo', 'ERP modüllari']].map(([t,d]) => (
            <div key={t} className="bg-white/10 rounded-xl p-3">
              <p className="font-bold text-sm">{t}</p>
              <p className="text-slate-300 text-xs mt-0.5">{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-3 gap-5">
        {MODULES.map(m => (
          <div key={m.title} className={`bg-white rounded-2xl border-2 ${m.border} overflow-hidden hover:shadow-xl transition-all`}>
            <div className={`bg-gradient-to-br ${m.color} p-5 text-white`}>
              <div className="flex items-center justify-between mb-2">
                <m.icon className="w-8 h-8" />
                <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">{m.tag}</span>
              </div>
              <h2 className="text-xl font-bold">{m.title}</h2>
              <p className="text-white/70 text-sm">{m.subtitle}</p>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-4">{m.desc}</p>
              <ul className="space-y-2 mb-5">
                {m.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={m.href}
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold ${m.bg} hover:opacity-90 transition-all`}>
                Ochish <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon modules */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-sm font-bold text-gray-700 mb-3">🚀 Tez orada</p>
        <div className="flex gap-3 flex-wrap">
          {['Ishlab chiqarish (Manufacturing)', 'Loyiha boshqaruvi (Projects)', 'Ta\'minot zanjiri (SCM)', 'Byudjet rejalash'].map(m => (
            <span key={m} className="text-xs bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full font-medium">{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
