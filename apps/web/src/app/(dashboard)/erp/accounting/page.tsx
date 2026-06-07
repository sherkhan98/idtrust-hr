'use client';

import { useState } from 'react';
import {
  BookOpen, TrendingUp, TrendingDown, DollarSign,
  FileText, Download, Plus, Search, Filter, Eye,
  ChevronDown, X, CheckCircle, Clock, BarChart2,
  PieChart, ArrowUpRight, ArrowDownRight, Layers,
  Building2, CreditCard, Wallet, Receipt,
} from 'lucide-react';

// ─── Demo Data ───────────────────────────────────────────────
const ACCOUNTS = [
  { code: '1010', name: "Kassa (naqd pul)", type: 'ASSET', balance: 45200000, currency: 'UZS' },
  { code: '1020', name: 'Kapitalbank hisob', type: 'ASSET', balance: 287500000, currency: 'UZS' },
  { code: '1210', name: "Debitorlik qarzdorlik", type: 'ASSET', balance: 125000000, currency: 'UZS' },
  { code: '2110', name: "Asosiy vositalar", type: 'ASSET', balance: 890000000, currency: 'UZS' },
  { code: '3110', name: "Kreditorlik qarzdorlik", type: 'LIABILITY', balance: 78000000, currency: 'UZS' },
  { code: '3210', name: 'Bank krediti', type: 'LIABILITY', balance: 200000000, currency: 'UZS' },
  { code: '4110', name: 'Ustav kapitali', type: 'EQUITY', balance: 500000000, currency: 'UZS' },
  { code: '5110', name: "Mahsulot sotishdan daromad", type: 'REVENUE', balance: 1250000000, currency: 'UZS' },
  { code: '6110', name: "Xarajatlar (asosiy)", type: 'EXPENSE', balance: 890000000, currency: 'UZS' },
  { code: '6120', name: 'Maosh xarajati', type: 'EXPENSE', balance: 125000000, currency: 'UZS' },
];

const TRANSACTIONS = [
  { id: 't1', date: '2024-01-28', doc: 'INV-2024-001', desc: 'Nexus Solutions ga xizmat', debit: '1020', credit: '5110', amount: 45000000, status: 'POSTED' },
  { id: 't2', date: '2024-01-27', doc: 'PAY-2024-012', desc: 'Maosh yanvar 2024', debit: '6120', credit: '1020', amount: 87500000, status: 'POSTED' },
  { id: 't3', date: '2024-01-26', doc: 'INV-2024-002', desc: 'IT uskunalar xarid', debit: '2110', credit: '3110', amount: 23000000, status: 'POSTED' },
  { id: 't4', date: '2024-01-25', doc: 'REC-2024-005', desc: "Mijozdan to'lov", debit: '1020', credit: '1210', amount: 30000000, status: 'POSTED' },
  { id: 't5', date: '2024-01-24', doc: 'EXP-2024-008', desc: 'Ofis ijarasi', debit: '6110', credit: '1020', amount: 8500000, status: 'POSTED' },
  { id: 't6', date: '2024-01-23', doc: 'INV-2024-003', desc: 'Yangi loyiha boshlanish', debit: '1210', credit: '5110', amount: 120000000, status: 'DRAFT' },
];

// ─── Helpers ─────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}
function fmtFull(n: number) {
  return new Intl.NumberFormat('uz-UZ').format(n) + " so'm";
}
function getAccName(code: string) {
  return ACCOUNTS.find(a => a.code === code)?.name ?? code;
}

// ─── Modal ────────────────────────────────────────────────────
interface NewEntryModalProps { onClose: () => void }
function NewEntryModal({ onClose }: NewEntryModalProps) {
  const [form, setForm] = useState({ date: '2024-01-29', desc: '', debit: '', credit: '', amount: '', notes: '' });
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Yangi jurnal yozuvi</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Sana</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Miqdor (so'm)</label>
              <input type="number" placeholder="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Tavsif</label>
            <input placeholder="Operatsiya tavsifi..." value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Debet hisobi</label>
              <select value={form.debit} onChange={e => setForm({ ...form, debit: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Tanlang...</option>
                {ACCOUNTS.map(a => <option key={a.code} value={a.code}>{a.code} — {a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Kredit hisobi</label>
              <select value={form.credit} onChange={e => setForm({ ...form, credit: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Tanlang...</option>
                {ACCOUNTS.map(a => <option key={a.code} value={a.code}>{a.code} — {a.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Izoh</label>
            <textarea placeholder="Qo'shimcha izoh..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">Bekor qilish</button>
          <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Saqlash</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AccountingPage() {
  const [tab, setTab] = useState<'balance' | 'journal' | 'reports'>('balance');
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const assets = ACCOUNTS.filter(a => a.type === 'ASSET');
  const liabilities = ACCOUNTS.filter(a => a.type === 'LIABILITY');
  const equity = ACCOUNTS.filter(a => a.type === 'EQUITY');
  const revenue = ACCOUNTS.filter(a => a.type === 'REVENUE');
  const expenses = ACCOUNTS.filter(a => a.type === 'EXPENSE');

  const totalAssets = assets.reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = liabilities.reduce((s, a) => s + a.balance, 0);
  const totalEquity = equity.reduce((s, a) => s + a.balance, 0);
  const totalPassiv = totalLiabilities + totalEquity;
  const totalRevenue = revenue.reduce((s, a) => s + a.balance, 0);
  const totalExpenses = expenses.reduce((s, a) => s + a.balance, 0);
  const netProfit = totalRevenue - totalExpenses;

  const filteredTx = TRANSACTIONS.filter(t => {
    const matchSearch = search === '' || t.desc.toLowerCase().includes(search.toLowerCase()) || t.doc.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const tabs = [
    { id: 'balance', label: 'Hisobot jadvali', icon: Layers },
    { id: 'journal', label: 'Jurnal', icon: BookOpen },
    { id: 'reports', label: 'Hisobotlar', icon: BarChart2 },
  ] as const;

  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
  const revenueData = [85, 92, 78, 110, 95, 130, 115, 125, 108, 140, 118, 125];
  const expenseData = [70, 80, 72, 88, 82, 95, 90, 92, 85, 100, 88, 95];
  const maxBar = 150;

  return (
    <div className="min-h-screen bg-slate-50">
      {showModal && <NewEntryModal onClose={() => setShowModal(false)} />}

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Buxgalteriya</h1>
                <p className="text-sm text-slate-500">Moliyaviy hisobot va jurnal — IDTrust ERP</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
                <Download size={15} /> Excel
              </button>
              <button className="flex items-center gap-2 border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
                <FileText size={15} /> PDF
              </button>
              <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
                <Plus size={15} /> Yangi yozuv
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4 mt-5">
            {[
              { label: 'Jami aktiv', value: fmtFull(totalAssets), icon: Wallet, color: 'indigo', change: '+12.5%' },
              { label: 'Daromad (YTD)', value: fmtFull(totalRevenue), icon: TrendingUp, color: 'green', change: '+8.2%' },
              { label: 'Xarajat (YTD)', value: fmtFull(totalExpenses), icon: TrendingDown, color: 'red', change: '+5.1%' },
              { label: 'Sof foyda', value: fmtFull(netProfit), icon: DollarSign, color: 'emerald', change: '+18.3%' },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 font-medium">{s.label}</span>
                  <span className={`text-xs font-semibold ${s.color === 'red' ? 'text-red-500' : 'text-emerald-600'}`}>{s.change}</span>
                </div>
                <p className="text-lg font-bold text-slate-800">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                <t.icon size={15} />{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">

        {/* ── TAB 1: Balance Sheet ── */}
        {tab === 'balance' && (
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">StaffFlow Technologies LLC</h2>
                  <p className="text-sm text-slate-500">Balans hisobi — 28 yanvar 2024</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-50"><Download size={14} /> Excel yuklab olish</button>
                  <button className="flex items-center gap-2 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-50"><FileText size={14} /> PDF</button>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-slate-100">
                {/* AKTIV */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">AKTIV</h3>
                  </div>
                  <div className="space-y-2">
                    {assets.map(a => (
                      <div key={a.code} className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">{a.code}</span>
                          <span className="text-sm text-slate-700">{a.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{fmt(a.balance)} so'm</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-3 mt-2 border-t-2 border-indigo-200">
                      <span className="text-sm font-bold text-indigo-700">Jami aktiv</span>
                      <span className="text-base font-bold text-indigo-700">{fmt(totalAssets)} so'm</span>
                    </div>
                  </div>
                </div>
                {/* PASSIV */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-slate-600 rounded-full" />
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">PASSIV</h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Majburiyatlar</p>
                    {liabilities.map(a => (
                      <div key={a.code} className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded">{a.code}</span>
                          <span className="text-sm text-slate-700">{a.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{fmt(a.balance)} so'm</span>
                      </div>
                    ))}
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-3 mb-2">Kapital</p>
                    {equity.map(a => (
                      <div key={a.code} className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">{a.code}</span>
                          <span className="text-sm text-slate-700">{a.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{fmt(a.balance)} so'm</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-3 mt-2 border-t-2 border-slate-300">
                      <span className="text-sm font-bold text-slate-700">Jami passiv</span>
                      <span className="text-base font-bold text-slate-700">{fmt(totalPassiv)} so'm</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Balance check */}
              <div className={`mx-6 mb-6 p-4 rounded-xl flex items-center gap-3 ${totalAssets === totalPassiv ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                <CheckCircle size={18} className={totalAssets === totalPassiv ? 'text-emerald-600' : 'text-amber-600'} />
                <span className="text-sm font-medium text-slate-700">
                  Balans {totalAssets === totalPassiv ? 'muvozanatda' : 'muvozanatda emas'} —
                  Aktiv: <strong>{fmt(totalAssets)}</strong> | Passiv: <strong>{fmt(totalPassiv)}</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: Journal ── */}
        {tab === 'journal' && (
          <div>
            <div className="bg-white rounded-2xl border border-slate-200">
              <div className="p-5 border-b border-slate-100 flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-48">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input placeholder="Qidirish..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="ALL">Barcha holat</option>
                  <option value="POSTED">Posted</option>
                  <option value="DRAFT">Draft</option>
                </select>
                <input type="date" defaultValue="2024-01-01"
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input type="date" defaultValue="2024-01-31"
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 ml-auto">
                  <Plus size={15} /> Yangi yozuv
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sana</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hujjat</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tavsif</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Debet</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kredit</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Miqdor</th>
                      <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Holat</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTx.map(tx => (
                      <>
                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3.5 text-sm text-slate-600">{tx.date}</td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">{tx.doc}</span>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-slate-700 max-w-48">{tx.desc}</td>
                          <td className="px-5 py-3.5">
                            <div>
                              <span className="text-xs font-mono text-slate-500">{tx.debit}</span>
                              <p className="text-xs text-slate-600 truncate max-w-32">{getAccName(tx.debit)}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div>
                              <span className="text-xs font-mono text-slate-500">{tx.credit}</span>
                              <p className="text-xs text-slate-600 truncate max-w-32">{getAccName(tx.credit)}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-800">{fmt(tx.amount)} so'm</td>
                          <td className="px-5 py-3.5 text-center">
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${tx.status === 'POSTED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                              {tx.status === 'POSTED' ? <CheckCircle size={11} /> : <Clock size={11} />}
                              {tx.status === 'POSTED' ? 'Posted' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <button onClick={() => setExpandedRow(expandedRow === tx.id ? null : tx.id)} className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium">
                              <Eye size={13} /> Ko'rish
                              <ChevronDown size={12} className={`transition-transform ${expandedRow === tx.id ? 'rotate-180' : ''}`} />
                            </button>
                          </td>
                        </tr>
                        {expandedRow === tx.id && (
                          <tr key={`${tx.id}-detail`} className="bg-indigo-50/50">
                            <td colSpan={8} className="px-5 py-4">
                              <div className="grid grid-cols-4 gap-4 text-sm">
                                <div><span className="text-slate-500 text-xs">Hujjat raqami</span><p className="font-semibold text-slate-800">{tx.doc}</p></div>
                                <div><span className="text-slate-500 text-xs">Sana</span><p className="font-semibold text-slate-800">{tx.date}</p></div>
                                <div><span className="text-slate-500 text-xs">Miqdor</span><p className="font-semibold text-emerald-700">{fmtFull(tx.amount)}</p></div>
                                <div><span className="text-slate-500 text-xs">Holat</span><p className="font-semibold text-slate-800">{tx.status}</p></div>
                                <div className="col-span-2"><span className="text-slate-500 text-xs">Debet hisobi</span><p className="font-semibold text-slate-800">{tx.debit} — {getAccName(tx.debit)}</p></div>
                                <div className="col-span-2"><span className="text-slate-500 text-xs">Kredit hisobi</span><p className="font-semibold text-slate-800">{tx.credit} — {getAccName(tx.credit)}</p></div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <span>{filteredTx.length} ta yozuv</span>
                <span>Jami miqdor: <strong className="text-slate-800">{fmt(filteredTx.reduce((s, t) => s + t.amount, 0))} so'm</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: Reports ── */}
        {tab === 'reports' && (
          <div className="space-y-6">
            {/* P&L Summary banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Daromad va Xarajat — Yanvar 2024</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-indigo-200 text-xs">Daromad</p>
                  <p className="text-2xl font-bold mt-1">1.25B so'm</p>
                  <p className="text-emerald-300 text-xs mt-1">▲ +8.2% o'tgan oyga nisbatan</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-indigo-200 text-xs">Xarajat</p>
                  <p className="text-2xl font-bold mt-1">1.01B so'm</p>
                  <p className="text-rose-300 text-xs mt-1">▲ +5.1% o'tgan oyga nisbatan</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-indigo-200 text-xs">Sof foyda</p>
                  <p className="text-2xl font-bold text-emerald-300 mt-1">240M so'm</p>
                  <p className="text-emerald-300 text-xs mt-1">▲ +18.3% o'tgan oyga nisbatan</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* P&L Bar Chart */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Daromad va Xarajat hisoboti</h3>
                    <p className="text-xs text-slate-500 mt-0.5">2024-yil oylik ko'rsatkichlar</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs hover:bg-slate-50 flex items-center gap-1"><Eye size={12} /> Ko'rish</button>
                    <button className="border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs hover:bg-slate-50 flex items-center gap-1"><Download size={12} /> Excel</button>
                  </div>
                </div>
                <div className="flex items-end gap-1 h-40">
                  {months.map((m, i) => (
                    <div key={m} className="flex-1 flex flex-col items-center gap-0.5">
                      <div className="w-full flex flex-col-reverse gap-0.5">
                        <div className="w-full bg-rose-400 rounded-sm" style={{ height: `${(expenseData[i] / maxBar) * 120}px` }} />
                        <div className="w-full bg-indigo-500 rounded-sm" style={{ height: `${(revenueData[i] / maxBar) * 120}px` }} />
                      </div>
                      <span className="text-xs text-slate-400">{m}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-indigo-500 rounded-sm" /><span className="text-xs text-slate-600">Daromad</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-rose-400 rounded-sm" /><span className="text-xs text-slate-600">Xarajat</span></div>
                </div>
              </div>

              {/* Balance Sheet Pie */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Balans tarkibi</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Aktiv taqsimoti</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs hover:bg-slate-50 flex items-center gap-1"><Eye size={12} /> Ko'rish</button>
                    <button className="border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs hover:bg-slate-50 flex items-center gap-1"><Download size={12} /> Excel</button>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6366f1" strokeWidth="3"
                        strokeDasharray="65 35" strokeDashoffset="0" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#06b6d4" strokeWidth="3"
                        strokeDasharray="20 80" strokeDashoffset="-65" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3"
                        strokeDasharray="9 91" strokeDashoffset="-85" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3"
                        strokeDasharray="6 94" strokeDashoffset="-94" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-slate-700">Aktiv</span>
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    {[
                      { label: 'Asosiy vositalar', val: '65%', color: 'bg-indigo-500' },
                      { label: 'Bank hisobi', val: '20%', color: 'bg-cyan-500' },
                      { label: 'Debitorlik', val: '9%', color: 'bg-emerald-500' },
                      { label: 'Kassa', val: '3%', color: 'bg-amber-500' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                          <span className="text-xs text-slate-600">{item.label}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cash Flow */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Pul oqimi (Cash Flow)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">So'nggi 7 kun</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs hover:bg-slate-50 flex items-center gap-1"><Eye size={12} /> Ko'rish</button>
                    <button className="border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs hover:bg-slate-50 flex items-center gap-1"><Download size={12} /> Excel</button>
                  </div>
                </div>
                {(() => {
                  const cf = [45, 78, 32, 95, 67, 88, 72];
                  const days = ['Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan', 'Yak'];
                  const cfMax = 100;
                  return (
                    <div className="relative h-36">
                      <svg className="w-full h-full" viewBox={`0 0 ${cf.length * 50} 100`} preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <polyline
                          points={cf.map((v, i) => `${i * 50 + 25},${100 - (v / cfMax) * 90}`).join(' ')}
                          fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
                        <polygon
                          points={`25,100 ${cf.map((v, i) => `${i * 50 + 25},${100 - (v / cfMax) * 90}`).join(' ')} ${(cf.length - 1) * 50 + 25},100`}
                          fill="url(#cfGrad)" />
                        {cf.map((v, i) => (
                          <circle key={i} cx={i * 50 + 25} cy={100 - (v / cfMax) * 90} r="3" fill="#6366f1" />
                        ))}
                      </svg>
                      <div className="flex justify-between mt-1">
                        {days.map(d => <span key={d} className="text-xs text-slate-400">{d}</span>)}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Debitor/Kreditor */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Debitor / Kreditor</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Qarzdorlik holati</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs hover:bg-slate-50 flex items-center gap-1"><Eye size={12} /> Ko'rish</button>
                    <button className="border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs hover:bg-slate-50 flex items-center gap-1"><Download size={12} /> Excel</button>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Nexus Holding', type: 'Debitor', amount: 75000000, days: 15, color: 'text-emerald-700' },
                    { name: 'UzTech Solutions', type: 'Debitor', amount: 30000000, days: 32, color: 'text-amber-700' },
                    { name: 'GlobalMart', type: 'Debitor', amount: 20000000, days: 48, color: 'text-rose-700' },
                    { name: 'Apple Uzbekistan', type: 'Kreditor', amount: 48000000, days: 12, color: 'text-slate-700' },
                    { name: 'IKEA Tashkent', type: 'Kreditor', amount: 30000000, days: 25, color: 'text-slate-700' },
                  ].map(r => (
                    <div key={r.name} className="flex items-center justify-between py-2 border-b border-slate-50">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{r.name}</p>
                        <p className="text-xs text-slate-400">{r.type} · {r.days} kun</p>
                      </div>
                      <span className={`text-sm font-semibold ${r.color}`}>{fmt(r.amount)} so'm</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
