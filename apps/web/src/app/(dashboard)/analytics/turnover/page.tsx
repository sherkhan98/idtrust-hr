'use client';

import { useState } from 'react';
import { AlertTriangle, TrendingDown, Users, X, Calendar, DollarSign, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPLOYEES = [
  { id:'e1', name:'Sardor Toshmatov', dept:'IT', role:'Senior Dev', risk:87, factors:['Maosh past (bozordan 30% kam)',"2 yil promo yo'q",'Raqib takliflari bor'], tenure:3.2, salary:8000000, lastRaise:'18 oy oldin', sentiment:-0.3, avatar:'ST' },
  { id:'e2', name:'Malika Yusupova', dept:'HR', role:'HR Manager', risk:23, factors:["Kompaniyaga sodiq",'Yaqinda ko\'tarildi'], tenure:5.1, salary:7200000, lastRaise:'3 oy oldin', sentiment:0.7, avatar:'MY' },
  { id:'e3', name:'Bobur Rakhimov', dept:'Moliya', role:'Accountant', risk:65, factors:["Ish yuki juda og'ir",'Ortiqcha soatlar','Ko\'p kechikish'], tenure:1.8, salary:6800000, lastRaise:'12 oy oldin', sentiment:-0.1, avatar:'BR' },
  { id:'e4', name:'Jasur Mirzayev', dept:'Savdo', role:'Sales Lead', risk:91, factors:['Raqibdan taklif bor','Maosh kelishuvi muhlati o\'tdi','Kayfiyat pastlashdi'], tenure:2.5, salary:9500000, lastRaise:'20 oy oldin', sentiment:-0.5, avatar:'JM' },
  { id:'e5', name:'Dilnoza Karimova', dept:'Marketing', role:'Designer', risk:34, factors:['Rivojlanish imkoniyatlari yaxshi'], tenure:4.0, salary:7000000, lastRaise:'6 oy oldin', sentiment:0.4, avatar:'DK' },
  { id:'e6', name:'Otabek Sobirov', dept:'IT', role:'PM', risk:52, factors:["Ish-hayot balansi past",'Dam olish kunlari ishlaydi'], tenure:2.1, salary:12000000, lastRaise:'8 oy oldin', sentiment:0.0, avatar:'OS' },
  { id:'e7', name:'Nilufar Hasanova', dept:'IT', role:'Junior Dev', risk:45, factors:["O'sish imkoniyati cheklangan"], tenure:1.2, salary:5500000, lastRaise:"Hech qachon", sentiment:0.1, avatar:'NH' },
  { id:'e8', name:'Gulnora Tursunova', dept:'Moliya', role:'Analyst', risk:78, factors:['Kayfiyati keskin tushdi','Ko\'p shikoyatlar','Davomat muammolari'], tenure:3.5, salary:6200000, lastRaise:'14 oy oldin', sentiment:-0.4, avatar:'GT' },
  { id:'e9', name:'Sherzod Nazarov', dept:'Savdo', role:'Sales', risk:29, factors:['Yaxshi bonus oldi','Mamnun'], tenure:2.8, salary:11000000, lastRaise:'2 oy oldin', sentiment:0.6, avatar:'SN' },
  { id:'e10', name:'Kamola Ergasheva', dept:'Admin', role:'Assistant', risk:18, factors:['Barqaror va mamnun'], tenure:6.0, salary:5000000, lastRaise:'4 oy oldin', sentiment:0.8, avatar:'KE' },
  { id:'e11', name:'Humoyun Yusupov', dept:'IT', role:'DevOps', risk:73, factors:["Maosh past","Remote ish yo'q"], tenure:1.5, salary:8500000, lastRaise:"Hech qachon", sentiment:-0.2, avatar:'HY' },
  { id:'e12', name:'Barno Ergasheva', dept:'Marketing', role:'Manager', risk:41, factors:["O'rta xavf"], tenure:3.3, salary:8200000, lastRaise:'9 oy oldin', sentiment:0.2, avatar:'BE' },
];

const DEPTS = ['Barchasi', 'IT', 'HR', 'Moliya', 'Savdo', 'Marketing', 'Admin'];

function riskColor(r: number) {
  if (r >= 80) return 'bg-red-500';
  if (r >= 60) return 'bg-orange-400';
  if (r >= 40) return 'bg-yellow-400';
  if (r >= 20) return 'bg-lime-400';
  return 'bg-green-500';
}
function riskBg(r: number) {
  if (r >= 80) return 'bg-red-50 border-red-200';
  if (r >= 60) return 'bg-orange-50 border-orange-200';
  if (r >= 40) return 'bg-yellow-50 border-yellow-200';
  return 'bg-green-50 border-green-200';
}
function riskLabel(r: number) {
  if (r >= 80) return { text: 'Kritik', color: 'text-red-700 bg-red-100' };
  if (r >= 60) return { text: 'Yuqori', color: 'text-orange-700 bg-orange-100' };
  if (r >= 40) return { text: "O'rta", color: 'text-yellow-700 bg-yellow-100' };
  return { text: 'Past', color: 'text-green-700 bg-green-100' };
}

export default function TurnoverHeatmapPage() {
  const [deptFilter, setDeptFilter] = useState('Barchasi');
  const [riskFilter, setRiskFilter] = useState('Barchasi');
  const [selected, setSelected] = useState<typeof EMPLOYEES[0] | null>(null);
  const [sortBy, setSortBy] = useState<'risk' | 'name' | 'tenure'>('risk');

  const filtered = EMPLOYEES
    .filter(e => deptFilter === 'Barchasi' || e.dept === deptFilter)
    .filter(e => {
      if (riskFilter === 'Kritik') return e.risk >= 80;
      if (riskFilter === 'Yuqori') return e.risk >= 60 && e.risk < 80;
      if (riskFilter === "O'rta") return e.risk >= 40 && e.risk < 60;
      if (riskFilter === 'Past') return e.risk < 40;
      return true;
    })
    .sort((a, b) => sortBy === 'risk' ? b.risk - a.risk : sortBy === 'tenure' ? a.tenure - b.tenure : a.name.localeCompare(b.name));

  const byDept = DEPTS.slice(1).map(dept => ({
    dept,
    employees: EMPLOYEES.filter(e => e.dept === dept),
  })).filter(d => d.employees.length > 0);

  const critical = EMPLOYEES.filter(e => e.risk >= 80).length;
  const high = EMPLOYEES.filter(e => e.risk >= 60 && e.risk < 80).length;
  const medium = EMPLOYEES.filter(e => e.risk >= 40 && e.risk < 60).length;
  const low = EMPLOYEES.filter(e => e.risk < 40).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Ketish Xavfi Xaritasi</h1>
            <p className="text-xs text-gray-500">AI tahlil • {EMPLOYEES.length} xodim kuzatilmoqda</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Kritik (≥80%)', value: critical, color: 'bg-red-50 border-red-200 text-red-700', dot: 'bg-red-500' },
          { label: 'Yuqori (60-79%)', value: high, color: 'bg-orange-50 border-orange-200 text-orange-700', dot: 'bg-orange-400' },
          { label: "O'rta (40-59%)", value: medium, color: 'bg-yellow-50 border-yellow-200 text-yellow-700', dot: 'bg-yellow-400' },
          { label: 'Past (<40%)', value: low, color: 'bg-green-50 border-green-200 text-green-700', dot: 'bg-green-500' },
        ].map(s => (
          <div key={s.label} className={`border rounded-xl p-4 ${s.color}`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-3 h-3 rounded-full ${s.dot}`} />
              <span className="text-xs font-medium opacity-80">{s.label}</span>
            </div>
            <p className="text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-sm font-bold text-gray-800 mb-4">Bo&#39;limlar bo&#39;yicha issiqlik xaritasi</p>
        <div className="space-y-5">
          {byDept.map(({ dept, employees }) => (
            <div key={dept}>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{dept}</p>
              <div className="flex flex-wrap gap-3">
                {employees.map(emp => {
                  const sz = emp.risk >= 80 ? 'w-16 h-16' : emp.risk >= 60 ? 'w-14 h-14' : emp.risk >= 40 ? 'w-12 h-12' : 'w-10 h-10';
                  return (
                    <button
                      key={emp.id}
                      onClick={() => setSelected(emp)}
                      title={`${emp.name} — ${emp.risk}% xavf`}
                      className={`${sz} ${riskColor(emp.risk)} rounded-xl flex flex-col items-center justify-center text-white hover:scale-110 transition-transform shadow-md cursor-pointer`}
                    >
                      <span className="font-bold text-xs leading-none">{emp.avatar}</span>
                      <span className="text-[10px] font-bold leading-none mt-0.5">{emp.risk}%</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">
          <span className="font-medium">Kattalik:</span>
          <span>Katta = Yuqori xavf</span>
          {[['bg-red-500','Kritik 80+'],['bg-orange-400','Yuqori 60-79'],['bg-yellow-400',"O'rta 40-59"],['bg-green-500','Past &lt;40']].map(([c,l]) => (
            <span key={l} className="flex items-center gap-1">
              <span className={`w-3 h-3 rounded ${c}`} />
              <span dangerouslySetInnerHTML={{__html: l}} />
            </span>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="input-field w-40 text-sm">
          {DEPTS.map(d => <option key={d}>{d}</option>)}
        </select>
        <div className="flex gap-1">
          {['Barchasi','Kritik','Yuqori',"O'rta",'Past'].map(f => (
            <button key={f} onClick={() => setRiskFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${riskFilter===f?'bg-gray-900 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {f}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="input-field w-40 text-sm ml-auto">
          <option value="risk">Xavf bo&#39;yicha</option>
          <option value="name">Ism bo&#39;yicha</option>
          <option value="tenure">Ish staji bo&#39;yicha</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Xodim','Bo\'lim','Xavf darajasi','Asosiy sabab','Ish staji','Oxirgi ko\'tarilish','Amal'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(emp => {
              const rl = riskLabel(emp.risk);
              return (
                <tr key={emp.id} className={`hover:bg-gray-50 cursor-pointer ${riskBg(emp.risk).includes('red') && emp.risk>=80?'bg-red-50/30':''}`}
                  onClick={() => setSelected(emp)}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 ${riskColor(emp.risk)} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>{emp.avatar}</div>
                      <div>
                        <p className="font-semibold text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-400">{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{emp.dept}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${riskColor(emp.risk)} rounded-full`} style={{width:`${emp.risk}%`}} />
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${rl.color}`}>{emp.risk}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-500 max-w-xs">
                    <span className="truncate block">{emp.factors[0]}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{emp.tenure} yil</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{emp.lastRaise}</td>
                  <td className="py-3 px-4">
                    <button onClick={e=>{e.stopPropagation();toast.success(`${emp.name} bilan suhbat rejalandi`);}}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${emp.risk>=70?'bg-red-100 text-red-700 hover:bg-red-200':emp.risk>=50?'bg-yellow-100 text-yellow-700 hover:bg-yellow-200':'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                      Suhbat
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className={`p-5 ${selected.risk>=80?'bg-red-50':selected.risk>=60?'bg-orange-50':selected.risk>=40?'bg-yellow-50':'bg-green-50'} rounded-t-2xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${riskColor(selected.risk)} rounded-xl flex items-center justify-center text-white font-bold`}>{selected.avatar}</div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{selected.name}</p>
                    <p className="text-sm text-gray-600">{selected.role} • {selected.dept}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              {/* Risk gauge */}
              <div className="mt-4 flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none"
                      stroke={selected.risk>=80?'#ef4444':selected.risk>=60?'#f97316':selected.risk>=40?'#eab308':'#22c55e'}
                      strokeWidth="3" strokeDasharray={`${selected.risk} ${100-selected.risk}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold ${selected.risk>=80?'text-red-600':selected.risk>=60?'text-orange-600':selected.risk>=40?'text-yellow-600':'text-green-600'}`}>{selected.risk}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Ketish xavfi</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${riskLabel(selected.risk).color}`}>{riskLabel(selected.risk).text}</span>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">⚠️ Asosiy sabablar</p>
                <div className="space-y-1.5">
                  {selected.factors.map((f,i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</span>
                      <span className="text-gray-700">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Maosh</p>
                  <p className="font-bold text-gray-800 text-sm">{(selected.salary/1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Staj</p>
                  <p className="font-bold text-gray-800 text-sm">{selected.tenure} yil</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Ko&#39;tarilish</p>
                  <p className="font-bold text-gray-800 text-sm">{selected.lastRaise}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">💡 Tavsiyalar</p>
                <div className="space-y-1.5">
                  {[
                    selected.risk >= 70 ? '🔴 DARHOL suhbat o\'tkazing' : null,
                    selected.salary < 8000000 ? '💰 Maoshni bozor darajasiga ko\'taring' : null,
                    selected.sentiment < 0 ? '😔 Kayfiyat sabablari haqida suhbat' : null,
                    '📈 Karyera rivojlanish rejasi tuzing',
                  ].filter(Boolean).map((rec, i) => (
                    <p key={i} className="text-sm text-gray-600">{rec}</p>
                  ))}
                </div>
              </div>

              <button onClick={() => { toast.success('Suhbat rejalandi'); setSelected(null); }}
                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 text-sm">
                Suhbat rejalash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
