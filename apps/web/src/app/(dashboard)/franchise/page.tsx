'use client';

import { useState } from 'react';
import {
  Building2, Users, AlertTriangle, CheckCircle2, TrendingUp,
  ChevronRight, MessageSquare, Eye, Plus, Send, X, BarChart2,
  Shield, FileText, Bell, MapPin, Settings, ArrowUpDown,
} from 'lucide-react';

// ─── Demo Data ────────────────────────────────────────────────────────────────

const FRANCHISOR = { name: 'Nexus Group (Markaziy)', branches: 8, totalEmployees: 312 };

interface Branch {
  id: string;
  name: string;
  manager: string;
  employees: number;
  compliance: number;
  attendanceRate: number;
  avgKpi: number;
  openIssues: number;
  status: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
  city: string;
}

const BRANCHES: Branch[] = [
  { id: 'b1', name: 'Toshkent Chilonzor', manager: 'Alisher Karimov', employees: 42, compliance: 94, attendanceRate: 91, avgKpi: 87, openIssues: 2, status: 'GOOD', city: 'Toshkent' },
  { id: 'b2', name: 'Toshkent Yunusobod', manager: 'Malika Yusupova', employees: 38, compliance: 78, attendanceRate: 85, avgKpi: 72, openIssues: 7, status: 'WARNING', city: 'Toshkent' },
  { id: 'b3', name: 'Samarqand Markaz', manager: 'Bobur Rakhimov', employees: 35, compliance: 96, attendanceRate: 93, avgKpi: 91, openIssues: 0, status: 'EXCELLENT', city: 'Samarqand' },
  { id: 'b4', name: 'Namangan', manager: 'Jasur Mirzayev', employees: 28, compliance: 65, attendanceRate: 78, avgKpi: 68, openIssues: 12, status: 'CRITICAL', city: 'Namangan' },
  { id: 'b5', name: 'Buxoro', manager: 'Dilnoza Karimova', employees: 31, compliance: 88, attendanceRate: 89, avgKpi: 83, openIssues: 3, status: 'GOOD', city: 'Buxoro' },
  { id: 'b6', name: 'Andijon', manager: 'Otabek Sobirov', employees: 29, compliance: 92, attendanceRate: 90, avgKpi: 88, openIssues: 1, status: 'GOOD', city: 'Andijon' },
  { id: 'b7', name: "Farg'ona", manager: 'Gulnora Tursunova', employees: 33, compliance: 85, attendanceRate: 87, avgKpi: 80, openIssues: 4, status: 'GOOD', city: "Farg'ona" },
  { id: 'b8', name: 'Nukus', manager: 'Sherzod Nazarov', employees: 36, compliance: 71, attendanceRate: 82, avgKpi: 74, openIssues: 9, status: 'WARNING', city: 'Nukus' },
];

interface Policy {
  id: string;
  name: string;
  desc: string;
  scope: string;
  mandatory: boolean;
  lastUpdated: string;
}

const POLICIES: Policy[] = [
  { id: 'pol1', name: 'Ish vaqti qoidasi', desc: '9:00-18:00, dush-juma, tushlik 1 soat', scope: 'ALL', mandatory: true, lastUpdated: '2024-01-15' },
  { id: 'pol2', name: "Ta'til qoidasi", desc: "Yillik 24 kun, 14 kun ketma-ket, 6 oy ishlagandan", scope: 'ALL', mandatory: true, lastUpdated: '2024-01-10' },
  { id: 'pol3', name: 'Kiyinish kodi', desc: 'Business casual, juma kuni casual', scope: 'ALL', mandatory: false, lastUpdated: '2023-12-01' },
  { id: 'pol4', name: 'Maosh shkalasi', desc: 'Lavozim va tajriba asosida 5 daraja', scope: 'ALL', mandatory: true, lastUpdated: '2024-01-20' },
  { id: 'pol5', name: 'Bonos qoidasi', desc: 'KPI 90%+ = 20% bonus, 80-90% = 10%', scope: 'SALES', mandatory: true, lastUpdated: '2024-01-05' },
];

const BRANCH_ISSUES: Record<string, { severity: 'HIGH' | 'MEDIUM' | 'LOW'; text: string }[]> = {
  b1: [{ severity: 'MEDIUM', text: "Ta'til hisobida 2 xodim ortiqcha" }, { severity: 'LOW', text: 'KPI hisoboti kechikdi' }],
  b2: [{ severity: 'HIGH', text: "Compliance audit muvaffaqiyatsiz o'tdi" }, { severity: 'HIGH', text: "5 xodim davomatsizlik (3 kun)" }, { severity: 'MEDIUM', text: 'Maosh hisob-kitobi xatosi' }, { severity: 'MEDIUM', text: "Onboarding hujjat yetishmaydi" }, { severity: 'LOW', text: 'Jadval to\'qnashuvi (2 xodim)' }, { severity: 'LOW', text: "Mehnat xavfsizligi o'qitish muddati" }, { severity: 'LOW', text: 'Hisobot kechikishi' }],
  b3: [],
  b4: [{ severity: 'HIGH', text: "Qonunga xilof mehnat shartnomasi (3 ta)" }, { severity: 'HIGH', text: "Soliq to'lovida kechikish" }, { severity: 'HIGH', text: "3 xodim meditsinada xodim holda ishladi" }, { severity: 'HIGH', text: 'Ish joyi xavfsizligi tekshiruvi muvaffaqiyatsiz' }, { severity: 'MEDIUM', text: "GDPR compliance buzilishi" }, { severity: 'MEDIUM', text: "Yillik ta'til to'lanmadi" }, { severity: 'MEDIUM', text: "Ish vaqti hisobi noto'g'ri" }, { severity: 'LOW', text: "Kiyinish kodi buzilishi (4 xodim)" }, { severity: 'LOW', text: "Onboarding hujjatlar to'liq emas" }, { severity: 'LOW', text: 'Joriy oy hisoboti kechikdi' }, { severity: 'LOW', text: "Davomatsizlik sababsiz (1 kishi)" }, { severity: 'LOW', text: "Jihozlar inventarizatsiyasi o'tkazilmadi" }],
  b5: [{ severity: 'MEDIUM', text: "Jadval o'zgarishi bildirilmadi" }, { severity: 'LOW', text: 'KPI target yangilanmadi' }, { severity: 'LOW', text: "2 xodim sertifikat yangilanishi kechikdi" }],
  b6: [{ severity: 'LOW', text: "Oylik hisobot 1 kun kechikdi" }],
  b7: [{ severity: 'MEDIUM', text: "2 xodim onboarding to'liq emas" }, { severity: 'MEDIUM', text: 'Maosh hisob-kitobi tuzatish kerak' }, { severity: 'LOW', text: "Mehnat shartnomasi yangilanmadi" }, { severity: 'LOW', text: 'Jadval xatosi' }],
  b8: [{ severity: 'HIGH', text: "Compliance audit: 5 muhim xato" }, { severity: 'HIGH', text: "Ish vaqti qoidasi tizimli buzilmoqda" }, { severity: 'MEDIUM', text: "3 xodim ta'til qoidasini bilmaydi" }, { severity: 'MEDIUM', text: "Onboarding jarayoni mavjud emas" }, { severity: 'MEDIUM', text: 'KPI tizimi joriy etilmagan' }, { severity: 'LOW', text: "Hisobot shakli eskirgan" }, { severity: 'LOW', text: "Kiyinish kodi e'lon qilinmagan" }, { severity: 'LOW', text: 'Inventar tekshiruvi kechikdi' }, { severity: 'LOW', text: "Mehnat xavfsizligi o'qitish o'tkazilmagan" }],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function getStatusConfig(status: Branch['status']) {
  switch (status) {
    case 'EXCELLENT': return { label: 'Ajoyib', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
    case 'GOOD': return { label: 'Yaxshi', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' };
    case 'WARNING': return { label: 'Ogohlantirish', bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' };
    case 'CRITICAL': return { label: 'Kritik', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' };
  }
}

function getBarColor(val: number) {
  if (val >= 90) return 'bg-emerald-500';
  if (val >= 80) return 'bg-green-500';
  if (val >= 70) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getSeverityConfig(sev: 'HIGH' | 'MEDIUM' | 'LOW') {
  switch (sev) {
    case 'HIGH': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Yuqori' };
    case 'MEDIUM': return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: "O'rta" };
    case 'LOW': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Past' };
  }
}

const AVATAR_COLORS = [
  'bg-amber-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500',
  'bg-amber-600', 'bg-orange-600', 'bg-yellow-600', 'bg-amber-700',
];

// ─── Sub-Components ──────────────────────────────────────────────────────────

function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{label}</span>
        <span className="font-medium text-gray-700">{value}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function BranchCard({ branch, onView, onMessage }: { branch: Branch; onView: (b: Branch) => void; onMessage: (b: Branch) => void }) {
  const st = getStatusConfig(branch.status);
  const avatarColor = AVATAR_COLORS[BRANCHES.indexOf(branch) % AVATAR_COLORS.length];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 truncate">{branch.name}</h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
              <MapPin className="w-3 h-3" />{branch.city}
            </span>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text} border ${st.border} ml-2 whitespace-nowrap`}>
          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
          {st.label}
        </span>
      </div>

      {/* Manager */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
          {getInitials(branch.manager)}
        </div>
        <div>
          <p className="text-xs text-gray-400">Filial menejeri</p>
          <p className="text-sm font-medium text-gray-700">{branch.manager}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-gray-400">Xodimlar</p>
          <p className="text-sm font-bold text-gray-900">{branch.employees}</p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-2.5 mb-4">
        <ProgressBar label="Compliance" value={branch.compliance} color={getBarColor(branch.compliance)} />
        <ProgressBar label="Davomat" value={branch.attendanceRate} color={getBarColor(branch.attendanceRate)} />
        <ProgressBar label="KPI o'rtacha" value={branch.avgKpi} color={getBarColor(branch.avgKpi)} />
      </div>

      {/* Issues + Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {branch.openIssues > 0 ? (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${branch.openIssues > 5 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
            <AlertTriangle className="w-3 h-3" />
            {branch.openIssues} muammo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-3 h-3" />Muammo yo'q
          </span>
        )}
        <div className="flex gap-1.5">
          <button onClick={() => onView(branch)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100 transition-colors border border-amber-200">
            <Eye className="w-3 h-3" />Ko'rish
          </button>
          <button onClick={() => onMessage(branch)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium hover:bg-gray-100 transition-colors border border-gray-200">
            <MessageSquare className="w-3 h-3" />Xabar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Branch Detail Modal ──────────────────────────────────────────────────────

function BranchDetailModal({ branch, onClose }: { branch: Branch; onClose: () => void }) {
  const [directive, setDirective] = useState('');
  const [sent, setSent] = useState(false);
  const issues = BRANCH_ISSUES[branch.id] || [];
  const st = getStatusConfig(branch.status);

  const handleSend = () => {
    if (!directive.trim()) return;
    setSent(true);
    setTimeout(() => { setSent(false); setDirective(''); }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{branch.name}</h2>
            <p className="text-sm text-gray-500">{branch.city} • {branch.manager}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${st.bg} ${st.text} border ${st.border}`}>
              <span className={`w-2 h-2 rounded-full ${st.dot}`} />
              {st.label}
            </span>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Xodimlar', value: branch.employees, suffix: '' },
              { label: 'Compliance', value: branch.compliance, suffix: '%' },
              { label: 'Davomat', value: branch.attendanceRate, suffix: '%' },
              { label: 'KPI', value: branch.avgKpi, suffix: '%' },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xl font-bold text-amber-700">{s.value}{s.suffix}</p>
                <p className="text-xs text-amber-600 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Issues */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Muammolar ro'yxati ({issues.length})
            </h3>
            {issues.length === 0 ? (
              <div className="flex items-center gap-2 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <p className="text-sm text-emerald-700 font-medium">Hech qanday muammo yo'q. Ajoyib!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {issues.map((issue, i) => {
                  const sc = getSeverityConfig(issue.severity);
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text} whitespace-nowrap mt-0.5`}>{sc.label}</span>
                      <p className="text-sm text-gray-700">{issue.text}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Send Directive */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Send className="w-4 h-4 text-amber-600" />
              Yangi ko'rsatma yuborish
            </h3>
            <textarea
              value={directive}
              onChange={(e) => setDirective(e.target.value)}
              placeholder={`${branch.manager}ga ko'rsatma yozing...`}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-amber-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
            <button
              onClick={handleSend}
              className={`mt-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${sent ? 'bg-emerald-500 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}`}
            >
              {sent ? '✓ Yuborildi!' : "Ko'rsatma yuborish"}
            </button>
          </div>

          {/* Recent Compliance Violations */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              Oxirgi compliance buzilishlari
            </h3>
            <div className="space-y-2">
              {(issues.filter((i) => i.severity === 'HIGH').length === 0 ? issues.slice(0, 3) : issues.filter((i) => i.severity === 'HIGH')).map((issue, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-red-50 rounded-lg border border-red-100">
                  <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{issue.text}</p>
                  <span className="ml-auto text-xs text-red-400 whitespace-nowrap">{i + 1} kun oldin</span>
                </div>
              ))}
              {issues.length === 0 && (
                <p className="text-sm text-gray-400 italic">Hozircha buzilish qayd etilmagan</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Message Modal ────────────────────────────────────────────────────────────

function MessageModal({ branch, onClose }: { branch: Branch; onClose: () => void }) {
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!msg.trim()) return;
    setSent(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Xabar yuborish — {branch.name}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">{getInitials(branch.manager)}</div>
            <div>
              <p className="font-medium text-gray-800 text-sm">{branch.manager}</p>
              <p className="text-xs text-gray-500">{branch.name} menejeri</p>
            </div>
          </div>
          <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Xabar matnini kiriting..." rows={4} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
          <button onClick={handleSend} className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${sent ? 'bg-emerald-500 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}`}>
            {sent ? '✓ Yuborildi!' : 'Yuborish'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── New Policy Modal ─────────────────────────────────────────────────────────

function NewPolicyModal({ onClose, onSave }: { onClose: () => void; onSave: (p: Policy) => void }) {
  const [form, setForm] = useState({ name: '', desc: '', scope: 'ALL', mandatory: false });

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({ id: `pol${Date.now()}`, lastUpdated: new Date().toISOString().split('T')[0], ...form });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Yangi qoida qo'shish</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Qoida nomi *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Masalan: Mehnat tartib-intizom qoidasi" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tavsif</label>
            <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Qoida tafsilotlarini kiriting..." rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Qo'llanish doirasi</label>
            <select value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
              <option value="ALL">Barcha xodimlar</option>
              <option value="SALES">Savdo bo'limi</option>
              <option value="IT">IT bo'limi</option>
              <option value="HR">HR bo'limi</option>
              <option value="MANAGEMENT">Boshqaruv</option>
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-10 h-6 rounded-full transition-colors relative ${form.mandatory ? 'bg-amber-500' : 'bg-gray-200'}`} onClick={() => setForm({ ...form, mandatory: !form.mandatory })}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.mandatory ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            <span className="text-sm text-gray-700">Majburiy qoida</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Bekor qilish</button>
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors">Saqlash</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = 'branches' | 'policies' | 'compliance';

export default function FranchisePage() {
  const [activeTab, setActiveTab] = useState<Tab>('branches');
  const [detailBranch, setDetailBranch] = useState<Branch | null>(null);
  const [messageBranch, setMessageBranch] = useState<Branch | null>(null);
  const [showNewPolicy, setShowNewPolicy] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>(POLICIES);
  const [bulkSent, setBulkSent] = useState(false);
  const [sortWorst, setSortWorst] = useState(false);

  const avgCompliance = Math.round(BRANCHES.reduce((s, b) => s + b.compliance, 0) / BRANCHES.length);
  const totalIssues = BRANCHES.reduce((s, b) => s + b.openIssues, 0);
  const criticalCount = BRANCHES.filter((b) => b.status === 'CRITICAL' || b.status === 'WARNING').length;

  const handleBulkWarn = () => {
    setBulkSent(true);
    setTimeout(() => setBulkSent(false), 2000);
  };

  const sortedBranches = sortWorst
    ? [...BRANCHES].sort((a, b) => a.compliance - b.compliance)
    : BRANCHES;

  const complianceSorted = [...BRANCHES].sort((a, b) => a.compliance - b.compliance);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Franchise Boshqaruvi</h1>
                <p className="text-sm text-gray-500">{FRANCHISOR.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-200">
                {FRANCHISOR.branches} filial
              </span>
              <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-200">
                {FRANCHISOR.totalEmployees} xodim
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {([
              { key: 'branches', label: 'Filiallar', icon: Building2 },
              { key: 'policies', label: 'Qoidalar', icon: FileText },
              { key: 'compliance', label: 'Compliance', icon: Shield },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === key ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700'}`}
              >
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* ── Overview Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Best branch */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Eng yaxshi</span>
            </div>
            <p className="text-lg font-bold text-gray-900">Samarqand Markaz</p>
            <p className="text-sm text-emerald-600 font-medium mt-0.5">96% compliance</p>
          </div>

          {/* Problem branches */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Muammo</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{criticalCount} ta</p>
            <p className="text-sm text-red-600 font-medium mt-0.5">Namangan <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full text-xs ml-1">KRITIK</span></p>
          </div>

          {/* Avg compliance */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">O'rtacha</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{avgCompliance}%</p>
            <p className="text-sm text-amber-600 font-medium mt-0.5">Compliance darajasi</p>
          </div>

          {/* Open issues */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Jami muammo</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalIssues}</p>
            <p className="text-sm text-orange-600 font-medium mt-0.5">Ochiq muammolar</p>
          </div>
        </div>

        {/* ── TAB: Branches ── */}
        {activeTab === 'branches' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Barcha filiallar ({BRANCHES.length})</h2>
              <button
                onClick={() => setSortWorst((p) => !p)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ArrowUpDown className="w-4 h-4" />
                {sortWorst ? 'Standart tartib' : 'Eng yomoni birinchi'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedBranches.map((b) => (
                <BranchCard
                  key={b.id}
                  branch={b}
                  onView={setDetailBranch}
                  onMessage={setMessageBranch}
                />
              ))}
            </div>
          </>
        )}

        {/* ── TAB: Policies ── */}
        {activeTab === 'policies' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Markaziy qoidalar ({policies.length})</h2>
              <button
                onClick={() => setShowNewPolicy(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />Yangi qoida
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Qoida nomi</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Qo'llanish</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Majburiy?</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Yangilanish</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {policies.map((pol) => (
                    <tr key={pol.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900 text-sm">{pol.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5 max-w-xs">{pol.desc}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                          {pol.scope === 'ALL' ? 'Barchaga' : pol.scope}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {pol.mandatory ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold"><CheckCircle2 className="w-3 h-3" />Ha</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">Yo'q</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">{pol.lastUpdated}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-1.5">
                          <button className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium transition-colors">
                            <Settings className="w-3.5 h-3.5" />
                          </button>
                          <button className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-medium transition-colors flex items-center gap-1">
                            <Send className="w-3 h-3" />Yuborish
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── TAB: Compliance ── */}
        {activeTab === 'compliance' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Compliance Dashboard</h2>
              <button
                onClick={handleBulkWarn}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm ${bulkSent ? 'bg-emerald-500 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
              >
                <Bell className="w-4 h-4" />
                {bulkSent ? '✓ Ogohlantirishlar yuborildi!' : "Ogohlantirishlar yuborish (80% dan past)"}
              </button>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-700 mb-6 text-sm">Filiallar compliance darajasi (eng pastdan yuqoriga)</h3>
              <div className="space-y-3">
                {complianceSorted.map((b) => {
                  const st2 = getStatusConfig(b.status);
                  return (
                    <div key={b.id} className="flex items-center gap-4">
                      <div className="w-36 text-right flex-shrink-0">
                        <span className="text-sm font-medium text-gray-700 truncate block">{b.name}</span>
                      </div>
                      <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                        <div
                          className={`h-full rounded-lg ${getBarColor(b.compliance)} transition-all flex items-center justify-end pr-2`}
                          style={{ width: `${b.compliance}%` }}
                        >
                          <span className="text-white text-xs font-bold">{b.compliance}%</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${st2.bg} ${st2.text} border ${st2.border} w-24 text-center flex-shrink-0`}>
                        {st2.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* 80% threshold line hint */}
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <span className="w-4 h-0.5 bg-red-400 inline-block" />
                <span>80% — Ogohlantirish chegara</span>
                <span className="w-4 h-0.5 bg-emerald-400 inline-block ml-4" />
                <span>90% — Maqsad darajasi</span>
              </div>
            </div>

            {/* Summary table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Filial</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Compliance</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Muammolar</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {complianceSorted.map((b) => {
                    const st2 = getStatusConfig(b.status);
                    const needsWarning = b.compliance < 80;
                    return (
                      <tr key={b.id} className={`hover:bg-amber-50/20 transition-colors ${needsWarning ? 'bg-red-50/30' : ''}`}>
                        <td className="px-4 py-3 font-medium text-gray-900 text-sm">{b.name}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-bold text-sm ${b.compliance >= 80 ? 'text-emerald-600' : 'text-red-600'}`}>{b.compliance}%</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {b.openIssues > 0 ? (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${b.openIssues > 5 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.openIssues}</span>
                          ) : <span className="text-gray-300 text-xs">—</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${st2.bg} ${st2.text} border ${st2.border}`}>{st2.label}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {needsWarning && (
                            <button className="px-2.5 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium transition-colors flex items-center gap-1 ml-auto">
                              <Bell className="w-3 h-3" />Ogohlantirish
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ── Modals ── */}
      {detailBranch && <BranchDetailModal branch={detailBranch} onClose={() => setDetailBranch(null)} />}
      {messageBranch && <MessageModal branch={messageBranch} onClose={() => setMessageBranch(null)} />}
      {showNewPolicy && <NewPolicyModal onClose={() => setShowNewPolicy(false)} onSave={(p) => setPolicies((prev) => [...prev, p])} />}
    </div>
  );
}
