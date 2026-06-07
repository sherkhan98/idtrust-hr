'use client';

import { useState } from 'react';
import {
  DollarSign, RefreshCw, Download, Plus, TrendingUp, TrendingDown,
  ToggleLeft, ToggleRight, Pencil, Bell, BellOff, X, Check, AlertTriangle,
  ChevronDown, Globe
} from 'lucide-react';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number;
  lastUpdated: string;
  active: boolean;
  isBase?: boolean;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  contractCurrency: string;
  paymentCurrency: string;
  amount: number;
  uzsEquivalent: number;
}

const MONTHS = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];

const RATE_HISTORY = [
  { month: 'Dek', rate: 12320 },
  { month: 'Yan', rate: 12480 },
  { month: 'Fev', rate: 12590 },
  { month: 'Mar', rate: 12680 },
  { month: 'Apr', rate: 12720 },
  { month: 'May', rate: 12750 },
];

const MIN_RATE = Math.min(...RATE_HISTORY.map(r => r.rate));
const MAX_RATE = Math.max(...RATE_HISTORY.map(r => r.rate));

const TAX_NOTES: Record<string, string> = {
  UZS: "UZS maoshi: 12% daromad solig'i + 4% INPS to'lovi",
  USD: "Xorijiy valyutadagi maosh: avval UZS ga aylantiriladi, so'ng soliq hisoblanadi",
  EUR: "EUR maoshi: CBU kursi bo'yicha UZS ga konvertatsiya + standart soliq",
  RUB: "RUB maoshi: Markaziy bank kursi bilan kunlik yangilanadi",
};

export default function MultiCurrencyPage() {
  const [currencies, setCurrencies] = useState<Currency[]>([
    { code: 'UZS', symbol: "so'm", name: "O'zbek so'mi", rate: 1, lastUpdated: '2025-05-28', active: true, isBase: true },
    { code: 'USD', symbol: '$', name: 'AQSh dollari', rate: 12750, lastUpdated: '2025-05-28', active: true },
    { code: 'EUR', symbol: '€', name: 'Evro', rate: 13890, lastUpdated: '2025-05-28', active: true },
    { code: 'RUB', symbol: '₽', name: 'Rossiya rubli', rate: 140, lastUpdated: '2025-05-27', active: false },
    { code: 'GBP', symbol: '£', name: 'Britaniya funt sterlingi', rate: 16100, lastUpdated: '2025-05-26', active: false },
  ]);

  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', name: 'John Smith', department: 'IT', contractCurrency: 'USD', paymentCurrency: 'USD', amount: 2000, uzsEquivalent: 25500000 },
    { id: '2', name: 'Alisher Toshmatov', department: 'IT', contractCurrency: 'UZS', paymentCurrency: 'UZS', amount: 8000000, uzsEquivalent: 8000000 },
    { id: '3', name: 'Maria Weber', department: 'Marketing', contractCurrency: 'EUR', paymentCurrency: 'EUR', amount: 1500, uzsEquivalent: 20835000 },
    { id: '4', name: 'Malika Yusupova', department: 'HR', contractCurrency: 'UZS', paymentCurrency: 'UZS', amount: 5000000, uzsEquivalent: 5000000 },
    { id: '5', name: 'Dmitry Volkov', department: 'Finance', contractCurrency: 'USD', paymentCurrency: 'UZS', amount: 1200, uzsEquivalent: 15300000 },
    { id: '6', name: 'Zulfiya Karimova', department: 'Finance', contractCurrency: 'UZS', paymentCurrency: 'UZS', amount: 4500000, uzsEquivalent: 4500000 },
    { id: '7', name: 'Chen Wei', department: 'IT', contractCurrency: 'USD', paymentCurrency: 'USD', amount: 3500, uzsEquivalent: 44625000 },
    { id: '8', name: 'Bobur Rahimov', department: 'Sales', contractCurrency: 'UZS', paymentCurrency: 'UZS', amount: 6500000, uzsEquivalent: 6500000 },
  ]);

  const [selectedMonth, setSelectedMonth] = useState(4);
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(13000);
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [showAddCurrency, setShowAddCurrency] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const toggleCurrency = (code: string) => {
    setCurrencies(prev => prev.map(c => c.code === code && !c.isBase ? { ...c, active: !c.active } : c));
  };

  const handleRefreshRates = () => {
    setRefreshing(true);
    setTimeout(() => {
      setCurrencies(prev => prev.map(c => {
        if (c.isBase) return c;
        const delta = (Math.random() - 0.5) * 50;
        return { ...c, rate: Math.round(c.rate + delta), lastUpdated: '2025-05-28' };
      }));
      setRefreshing(false);
    }, 1500);
  };

  const totalUZS = employees.reduce((sum, e) => sum + e.uzsEquivalent, 0);
  const totalUSD = Math.round(totalUZS / 12750);
  const totalEUR = Math.round(totalUZS / 13890);

  const formatUZS = (v: number) => v.toLocaleString('uz-UZ') + " so'm";
  const formatAmount = (emp: Employee) => {
    if (emp.paymentCurrency === 'UZS') return formatUZS(emp.amount);
    const curr = currencies.find(c => c.code === emp.paymentCurrency);
    return `${curr?.symbol || ''}${emp.amount.toLocaleString()}`;
  };

  const chartHeight = 80;
  const chartRange = MAX_RATE - MIN_RATE || 1;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ko'p Valyutali Maosh</h1>
          <p className="text-sm text-gray-500 mt-1">Valyuta sozlamalari va maosh hisob-kitobi</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshRates}
            className={`flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all ${refreshing ? 'opacity-60' : ''}`}
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            CBU dan avtomatik
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all">
            <Download size={15} />Hisobot yuklash
          </button>
        </div>
      </div>

      {/* SECTION 1: Currency Configuration */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">Valyuta Konfiguratsiyasi</h2>
          </div>
          <button
            onClick={() => setShowAddCurrency(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <Plus size={15} />Valyuta qo'shish
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valyuta</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Belgi</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">UZS kursi</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Oxirgi yangilanish</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currencies.map(curr => (
                <tr key={curr.code} className={`hover:bg-gray-50 transition-colors ${!curr.active && !curr.isBase ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                        curr.code === 'UZS' ? 'bg-blue-100 text-blue-700' :
                        curr.code === 'USD' ? 'bg-green-100 text-green-700' :
                        curr.code === 'EUR' ? 'bg-purple-100 text-purple-700' :
                        curr.code === 'RUB' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{curr.code}</div>
                      <div>
                        <p className="font-semibold text-gray-800">{curr.code}</p>
                        <p className="text-xs text-gray-400">{curr.name}</p>
                      </div>
                      {curr.isBase && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">Asosiy</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-700">{curr.symbol}</td>
                  <td className="px-6 py-4 text-right">
                    {curr.isBase ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      <div>
                        <span className="font-semibold text-gray-900">1 {curr.code} = {curr.rate.toLocaleString()} so'm</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{curr.lastUpdated}</td>
                  <td className="px-6 py-4 text-center">
                    {curr.isBase ? (
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">Har doim faol</span>
                    ) : (
                      <button
                        onClick={() => toggleCurrency(curr.code)}
                        className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium transition-all ${curr.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                      >
                        {curr.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        {curr.active ? 'Faol' : "Nofaol"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Employee Currency Assignment */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Xodim Valyuta Tayinlash</h2>
          <span className="text-sm text-gray-500">{employees.length} xodim</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Xodim', "Bo'lim", 'Shartnoma valyutasi', "To'lov valyutasi", 'Miqdor', 'UZS ekvivalenti', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-medium text-gray-800 whitespace-nowrap">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{emp.department}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      emp.contractCurrency === 'USD' ? 'bg-green-100 text-green-700' :
                      emp.contractCurrency === 'EUR' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{emp.contractCurrency}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      emp.paymentCurrency === 'USD' ? 'bg-green-100 text-green-700' :
                      emp.paymentCurrency === 'EUR' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{emp.paymentCurrency}</span>
                  </td>
                  <td className="px-5 py-3.5 font-mono font-semibold text-gray-800 whitespace-nowrap">{formatAmount(emp)}</td>
                  <td className="px-5 py-3.5 font-mono text-gray-600 whitespace-nowrap">{formatUZS(emp.uzsEquivalent)}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setEditingEmployee(emp.id === editingEmployee ? null : emp.id)}
                      className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil size={14} className="text-gray-400 hover:text-blue-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Exchange Rate History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-gray-900">USD/UZS Kurs Tarixi</h2>
              <p className="text-sm text-gray-500 mt-0.5">So'nggi 6 oy</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
              <TrendingUp size={14} />+3.5% (6 oy)
            </div>
          </div>

          {/* CSS-only bar chart */}
          <div className="flex items-end gap-4 h-24 px-2">
            {RATE_HISTORY.map((item, i) => {
              const heightPct = ((item.rate - MIN_RATE) / chartRange) * 65 + 20;
              const isLast = i === RATE_HISTORY.length - 1;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
                  <div className="relative w-full flex flex-col items-center justify-end" style={{ height: `${chartHeight}px` }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                      {item.rate.toLocaleString()} so'm
                    </div>
                    <div
                      className={`w-full rounded-t-lg transition-all ${isLast ? 'bg-blue-500' : 'bg-blue-200 group-hover:bg-blue-300'}`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${isLast ? 'text-blue-600' : 'text-gray-400'}`}>{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">Min: <span className="font-semibold text-gray-700">{MIN_RATE.toLocaleString()} so'm</span></span>
            <span className="text-gray-500">Hozir: <span className="font-semibold text-blue-600">12,750 so'm</span></span>
            <span className="text-gray-500">Maks: <span className="font-semibold text-gray-700">{MAX_RATE.toLocaleString()} so'm</span></span>
          </div>
        </div>

        {/* Rate Alert */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} className="text-amber-500" />
            <h2 className="text-base font-semibold text-gray-900">Kurs Ogohlantirishlari</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-amber-800">USD kurs ogohlantirishi</p>
                  <p className="text-xs text-amber-600 mt-1">USD &gt; {alertThreshold.toLocaleString()} bo'lsa xabar ber</p>
                </div>
                <button
                  onClick={() => setAlertEnabled(!alertEnabled)}
                  className={`p-1 rounded-lg transition-colors ${alertEnabled ? 'text-amber-600' : 'text-gray-400'}`}
                >
                  {alertEnabled ? <Bell size={18} /> : <BellOff size={18} />}
                </button>
              </div>
              <input
                type="range"
                min={12000}
                max={15000}
                step={50}
                value={alertThreshold}
                onChange={e => setAlertThreshold(Number(e.target.value))}
                className="w-full accent-amber-500"
                disabled={!alertEnabled}
              />
              <div className="flex justify-between text-xs text-amber-600 mt-1">
                <span>12,000</span>
                <span className="font-bold">{alertThreshold.toLocaleString()}</span>
                <span>15,000</span>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Email xabari', enabled: true },
                { label: 'Telegram xabari', enabled: true },
                { label: 'Dashboard ogohlantirish', enabled: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <div className={`w-9 h-5 rounded-full transition-colors cursor-pointer ${item.enabled ? 'bg-amber-400' : 'bg-gray-200'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Payroll Preview */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Maosh Ko'rinishi</h2>
          <div className="flex items-center gap-3">
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>{m} 2025</option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm">
              <Download size={15} />Excel yuklash
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Jami UZS da", value: formatUZS(totalUZS), icon: <span className="text-lg font-bold">so'm</span>, color: 'blue' },
              { label: 'USD ekvivalenti', value: `$${totalUSD.toLocaleString()}`, icon: <DollarSign size={20} />, color: 'green' },
              { label: 'EUR ekvivalenti', value: `€${totalEUR.toLocaleString()}`, icon: <span className="text-lg font-bold">€</span>, color: 'purple' },
            ].map((card, i) => (
              <div key={i} className={`p-4 rounded-xl border ${
                card.color === 'blue' ? 'bg-blue-50 border-blue-100' :
                card.color === 'green' ? 'bg-green-50 border-green-100' :
                'bg-purple-50 border-purple-100'
              }`}>
                <p className={`text-xs font-semibold uppercase tracking-wider ${
                  card.color === 'blue' ? 'text-blue-500' :
                  card.color === 'green' ? 'text-green-500' :
                  'text-purple-500'
                }`}>{card.label}</p>
                <p className={`text-xl font-bold mt-1 ${
                  card.color === 'blue' ? 'text-blue-800' :
                  card.color === 'green' ? 'text-green-800' :
                  'text-purple-800'
                }`}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* Tax implications */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-500" />
              Soliq hisob-kitobi eslatmalari
            </h3>
            {Object.entries(TAX_NOTES).map(([code, note]) => (
              <div key={code} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                  code === 'UZS' ? 'bg-blue-100 text-blue-700' :
                  code === 'USD' ? 'bg-green-100 text-green-700' :
                  code === 'EUR' ? 'bg-purple-100 text-purple-700' :
                  'bg-red-100 text-red-700'
                }`}>{code}</span>
                <p className="text-sm text-gray-600">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Currency Modal */}
      {showAddCurrency && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Yangi valyuta qo'shish</h3>
              <button onClick={() => setShowAddCurrency(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Valyuta kodi</label>
                <input placeholder="e.g. CNY" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Belgi</label>
                <input placeholder="e.g. ¥" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">UZS kursi</label>
                <input type="number" placeholder="e.g. 1760" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowAddCurrency(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Bekor</button>
                <button onClick={() => setShowAddCurrency(false)} className="flex-1 py-2.5 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700">Qo'shish</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
