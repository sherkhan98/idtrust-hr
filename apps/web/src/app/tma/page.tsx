'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Clock, Calendar, DollarSign, User, CheckCircle2,
  XCircle, MapPin, LogIn, LogOut, Send, ChevronRight,
  Loader2, Bell, Star, FileText, ArrowLeft,
} from 'lucide-react';

// ─── Telegram WebApp types ────────────────────────────────────────────────────
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready(): void;
        expand(): void;
        close(): void;
        initData: string;
        initDataUnsafe: {
          user?: { id: number; first_name: string; last_name?: string; username?: string };
          start_param?: string;
        };
        colorScheme: 'light' | 'dark';
        themeParams: Record<string, string>;
        MainButton: {
          text: string; show(): void; hide(): void; enable(): void; disable(): void;
          onClick(fn: () => void): void; offClick(fn: () => void): void;
          isVisible: boolean; isActive: boolean;
          setParams(params: { text?: string; color?: string; text_color?: string }): void;
        };
        BackButton: { show(): void; hide(): void; onClick(fn: () => void): void; offClick(fn: () => void): void };
        HapticFeedback: {
          impactOccurred(style: 'light'|'medium'|'heavy'|'rigid'|'soft'): void;
          notificationOccurred(type: 'error'|'success'|'warning'): void;
        };
        showAlert(message: string, callback?: () => void): void;
        showConfirm(message: string, callback: (ok: boolean) => void): void;
        sendData(data: string): void;
      };
    };
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = 'home' | 'attendance' | 'leave' | 'salary' | 'leave-form' | 'profile';
type CheckStatus = 'idle' | 'checking' | 'checked-in' | 'checked-out';

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_USER = {
  name: 'Sardor Toshmatov',
  position: 'Senior Dasturchi',
  department: 'IT Bo\'limi',
  employeeCode: 'EMP0001',
  avatar: 'ST',
};

const MOCK_ATTENDANCE = [
  { date: 'Bugun', checkIn: null, checkOut: null, status: 'pending' },
  { date: 'Kecha', checkIn: '08:52', checkOut: '18:05', hours: 9.2, status: 'present' },
  { date: '29-May', checkIn: '09:15', checkOut: '18:30', hours: 9.3, status: 'late' },
  { date: '28-May', checkIn: '08:45', checkOut: '17:58', hours: 9.2, status: 'present' },
  { date: '27-May', checkIn: null, checkOut: null, hours: 0, status: 'absent' },
];

const MOCK_SALARY = {
  month: 'May 2024',
  gross: 8500000,
  tax: 850000,
  bonus: 500000,
  deductions: 425000,
  net: 7225000,
  paidAt: '25-May',
  status: 'paid',
  items: [
    { label: 'Asosiy maosh', amount: 8000000, type: 'income' },
    { label: 'Bonus', amount: 500000, type: 'income' },
    { label: 'JSHIR (10%)', amount: -800000, type: 'deduction' },
    { label: 'INPS (1%)', amount: -80000, type: 'deduction' },
    { label: 'Sug\'urta', amount: -50000, type: 'deduction' },
    { label: 'Kechikish jarima', amount: -25000, type: 'deduction' },
  ],
};

const LEAVE_BALANCE = [
  { type: "Yillik ta'til", used: 10, total: 24, remaining: 14, color: '#2563EB', emoji: '🌴' },
  { type: "Kasal ta'til", used: 3, total: 15, remaining: 12, color: '#DC2626', emoji: '🏥' },
  { type: 'Xizmat safari', used: 4, total: 10, remaining: 6, color: '#7C3AED', emoji: '✈️' },
];

function fmt(n: number) {
  return Math.abs(n).toLocaleString('uz-UZ') + ' so\'m';
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TMAPage() {
  const [screen, setScreen] = useState<Screen>('home');
  const [tgUser, setTgUser] = useState<{first_name: string; username?: string} | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [checkStatus, setCheckStatus] = useState<CheckStatus>('idle');
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Leave form state
  const [leaveType, setLeaveType] = useState("Yillik ta'til");
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      setTgUser(tg.initDataUnsafe?.user || null);
      setIsDark(tg.colorScheme === 'dark');
    }
  }, []);

  const goBack = useCallback(() => {
    window.Telegram?.WebApp.HapticFeedback?.impactOccurred('light');
    setScreen('home');
    setLeaveSubmitted(false);
    window.Telegram?.WebApp.BackButton?.hide();
  }, []);

  const navigate = (s: Screen) => {
    window.Telegram?.WebApp.HapticFeedback?.impactOccurred('light');
    setScreen(s);
    if (s !== 'home') {
      window.Telegram?.WebApp.BackButton?.show();
      window.Telegram?.WebApp.BackButton?.onClick(goBack);
    }
  };

  const doCheckIn = async () => {
    setIsLoading(true);
    window.Telegram?.WebApp.HapticFeedback?.impactOccurred('medium');
    await new Promise(r => setTimeout(r, 1200));
    const now = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    setCheckInTime(now);
    setCheckStatus('checked-in');
    setIsLoading(false);
    window.Telegram?.WebApp.HapticFeedback?.notificationOccurred('success');
    window.Telegram?.WebApp.showAlert?.('✅ Kelish muvaffaqiyatli belgilandi!\nVaqt: ' + now);
  };

  const doCheckOut = async () => {
    setIsLoading(true);
    window.Telegram?.WebApp.HapticFeedback?.impactOccurred('medium');
    await new Promise(r => setTimeout(r, 1200));
    const now = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    setCheckStatus('checked-out');
    setIsLoading(false);
    window.Telegram?.WebApp.HapticFeedback?.notificationOccurred('success');
    window.Telegram?.WebApp.showAlert?.('🏠 Ketish belgilandi!\nVaqt: ' + now);
  };

  const submitLeave = async () => {
    if (!leaveFrom || !leaveTo) {
      window.Telegram?.WebApp.showAlert?.('Sanalarni kiriting');
      return;
    }
    window.Telegram?.WebApp.showConfirm?.("Ta'til so'rovini yuborasizmi?", async (ok) => {
      if (!ok) return;
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 1000));
      setIsLoading(false);
      setLeaveSubmitted(true);
      window.Telegram?.WebApp.HapticFeedback?.notificationOccurred('success');
    });
  };

  if (!mounted) return null;

  const displayName = tgUser?.first_name || MOCK_USER.name.split(' ')[0];

  // ─── HOME ──────────────────────────────────────────────────────────────────
  if (screen === 'home') {
    return (
      <div className="min-h-screen p-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pt-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {MOCK_USER.avatar}
          </div>
          <div>
            <p className="text-xs text-gray-400">Salom,</p>
            <p className="font-bold text-gray-900 text-lg leading-none">{displayName} 👋</p>
            <p className="text-xs text-gray-500 mt-0.5">{MOCK_USER.position}</p>
          </div>
          <button onClick={() => navigate('profile')} className="ml-auto p-2 rounded-xl bg-gray-100">
            <User className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Quick check-in card */}
        <div className={`rounded-2xl p-4 mb-4 text-white ${
          checkStatus === 'checked-out'
            ? 'bg-gradient-to-br from-gray-500 to-gray-600'
            : checkStatus === 'checked-in'
            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
            : 'bg-gradient-to-br from-blue-600 to-violet-600'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white/70 text-xs">Bugungi davomat</p>
              <p className="font-bold text-lg">
                {checkStatus === 'checked-out' ? 'Tugallandi ✓' :
                 checkStatus === 'checked-in' ? `Keldi — ${checkInTime}` : 'Belgilanmagan'}
              </p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          {checkStatus !== 'checked-out' && (
            <button
              onClick={checkStatus === 'checked-in' ? doCheckOut : doCheckIn}
              disabled={isLoading}
              className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> :
               checkStatus === 'checked-in' ? <><LogOut className="w-4 h-4" /> Ketishni belgilash</> :
               <><LogIn className="w-4 h-4" /> Kelishni belgilash</>}
            </button>
          )}
        </div>

        {/* Main nav grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { screen: 'attendance' as Screen, icon: Clock, label: 'Davomat', sub: 'Tarixi va holat', color: 'bg-blue-50 border-blue-200', iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
            { screen: 'leave' as Screen, icon: Calendar, label: "Ta'til", sub: "So'rov va balans", color: 'bg-green-50 border-green-200', iconColor: 'text-green-600', iconBg: 'bg-green-100' },
            { screen: 'salary' as Screen, icon: DollarSign, label: 'Maosh', sub: 'Oxirgi to\'lov', color: 'bg-violet-50 border-violet-200', iconColor: 'text-violet-600', iconBg: 'bg-violet-100' },
            { screen: 'leave-form' as Screen, icon: Send, label: "Ta'til so'rash", sub: 'Yangi so\'rov', color: 'bg-orange-50 border-orange-200', iconColor: 'text-orange-600', iconBg: 'bg-orange-100' },
          ].map(item => (
            <button key={item.screen} onClick={() => navigate(item.screen)}
              className={`${item.color} border rounded-2xl p-4 text-left hover:shadow-md transition-all active:scale-95`}>
              <div className={`w-10 h-10 ${item.iconBg} rounded-xl flex items-center justify-center mb-2`}>
                <item.icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
              <p className="font-bold text-gray-900 text-sm">{item.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
            </button>
          ))}
        </div>

        {/* This month mini stats */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Bu oy</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Keldi', value: '18', color: 'text-green-600' },
              { label: 'Kech', value: '2', color: 'text-yellow-600' },
              { label: 'Ish soat', value: '163h', color: 'text-blue-600' },
            ].map(s => (
              <div key={s.label}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── ATTENDANCE ────────────────────────────────────────────────────────────
  if (screen === 'attendance') {
    return (
      <div className="min-h-screen p-4 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-5 pt-2">
          <button onClick={goBack} className="p-2 rounded-xl bg-gray-100"><ArrowLeft className="w-4 h-4 text-gray-600" /></button>
          <h1 className="font-bold text-gray-900 text-lg">Davomat tarixi</h1>
        </div>

        {/* Today status */}
        <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-4 text-white mb-4">
          <p className="text-white/70 text-xs mb-1">Bugun</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-xl">
                {checkStatus === 'checked-in' ? `Keldi — ${checkInTime}` :
                 checkStatus === 'checked-out' ? 'Tugallandi' : 'Belgilanmagan'}
              </p>
              <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Asosiy ofis
              </p>
            </div>
            {checkStatus === 'checked-in'
              ? <div className="w-10 h-10 bg-green-400 rounded-xl flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-white" /></div>
              : checkStatus === 'checked-out'
              ? <div className="w-10 h-10 bg-gray-400 rounded-xl flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-white" /></div>
              : <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Clock className="w-5 h-5" /></div>}
          </div>
        </div>

        {/* History */}
        <div className="space-y-2">
          {MOCK_ATTENDANCE.slice(1).map((rec, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-3.5 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                rec.status === 'present' ? 'bg-green-100' :
                rec.status === 'late' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                {rec.status === 'absent'
                  ? <XCircle className="w-5 h-5 text-red-500" />
                  : <CheckCircle2 className={`w-5 h-5 ${rec.status === 'late' ? 'text-yellow-500' : 'text-green-500'}`} />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{rec.date}</p>
                {rec.checkIn
                  ? <p className="text-xs text-gray-400">{rec.checkIn} → {rec.checkOut} • {rec.hours}h</p>
                  : <p className="text-xs text-red-400">Kelmadi</p>}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                rec.status === 'present' ? 'bg-green-100 text-green-700' :
                rec.status === 'late' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>
                {rec.status === 'present' ? 'Keldi' : rec.status === 'late' ? 'Kech' : 'Yo\'q'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── LEAVE ─────────────────────────────────────────────────────────────────
  if (screen === 'leave') {
    return (
      <div className="min-h-screen p-4 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-5 pt-2">
          <button onClick={goBack} className="p-2 rounded-xl bg-gray-100"><ArrowLeft className="w-4 h-4 text-gray-600" /></button>
          <h1 className="font-bold text-gray-900 text-lg">Ta&#39;til balansi</h1>
        </div>

        <div className="space-y-3 mb-5">
          {LEAVE_BALANCE.map(lb => (
            <div key={lb.type} className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{lb.emoji}</span>
                  <p className="font-semibold text-gray-900">{lb.type}</p>
                </div>
                <span className="text-lg font-bold" style={{ color: lb.color }}>{lb.remaining} kun</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(lb.used/lb.total)*100}%`, backgroundColor: lb.color }} />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-gray-400">Ishlatildi: {lb.used} kun</span>
                <span className="text-xs text-gray-400">Jami: {lb.total} kun</span>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('leave-form')}
          className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-95 transition-all">
          <Send className="w-4 h-4" /> Yangi ta&#39;til so&#39;rash
        </button>
      </div>
    );
  }

  // ─── LEAVE FORM ────────────────────────────────────────────────────────────
  if (screen === 'leave-form') {
    if (leaveSubmitted) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">So&#39;rov yuborildi!</h2>
          <p className="text-gray-500 text-sm mb-6">HR menejer ko&#39;rib chiqadi. Telegram orqali xabar olasiz.</p>
          <button onClick={goBack} className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl">
            Bosh sahifaga
          </button>
        </div>
      );
    }
    return (
      <div className="min-h-screen p-4 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-5 pt-2">
          <button onClick={goBack} className="p-2 rounded-xl bg-gray-100"><ArrowLeft className="w-4 h-4 text-gray-600" /></button>
          <h1 className="font-bold text-gray-900 text-lg">Ta&#39;til so&#39;rash</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ta&#39;til turi</label>
            <div className="grid grid-cols-2 gap-2">
              {LEAVE_BALANCE.map(lb => (
                <button key={lb.type} onClick={() => setLeaveType(lb.type)}
                  className={`p-3 rounded-xl border text-left transition-all ${leaveType===lb.type?'border-blue-500 bg-blue-50':'border-gray-200 bg-white'}`}>
                  <span className="text-xl block mb-0.5">{lb.emoji}</span>
                  <span className="text-xs font-semibold text-gray-800 block leading-tight">{lb.type}</span>
                  <span className="text-[10px] text-gray-400">{lb.remaining} kun qoldi</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Boshlanish</label>
              <input type="date" value={leaveFrom} onChange={e => setLeaveFrom(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tugash</label>
              <input type="date" value={leaveTo} onChange={e => setLeaveTo(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sabab (ixtiyoriy)</label>
            <textarea value={leaveReason} onChange={e => setLeaveReason(e.target.value)} rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 resize-none"
              placeholder="Izohlang..." />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
            ⚡ So&#39;rov HR menejeriga Telegram orqali xabar sifatida yuboriladi
          </div>

          <button onClick={submitLeave} disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-95 transition-all disabled:opacity-60">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Yuborish</>}
          </button>
        </div>
      </div>
    );
  }

  // ─── SALARY ────────────────────────────────────────────────────────────────
  if (screen === 'salary') {
    return (
      <div className="min-h-screen p-4 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-5 pt-2">
          <button onClick={goBack} className="p-2 rounded-xl bg-gray-100"><ArrowLeft className="w-4 h-4 text-gray-600" /></button>
          <h1 className="font-bold text-gray-900 text-lg">Maosh ma&#39;lumoti</h1>
        </div>

        {/* Net salary card */}
        <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-5 text-white mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/70 text-sm">{MOCK_SALARY.month}</p>
            <span className="bg-green-400 text-green-900 text-xs font-bold px-2.5 py-1 rounded-full">
              ✓ To&#39;langan
            </span>
          </div>
          <p className="text-white/70 text-xs">Toza maosh</p>
          <p className="text-3xl font-bold mt-1">{fmt(MOCK_SALARY.net)}</p>
          <p className="text-white/60 text-xs mt-1">{MOCK_SALARY.paidAt} da to&#39;langan</p>
        </div>

        {/* Breakdown */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
          <p className="font-bold text-gray-800 text-sm">Tafsilot</p>
          {MOCK_SALARY.items.map((item, i) => {
            const isIncome = item.type === 'income';
            return (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
                    <span className={`text-xs font-bold ${isIncome ? 'text-green-600' : 'text-red-500'}`}>{isIncome ? '+' : '−'}</span>
                  </div>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className={`text-sm font-semibold ${isIncome ? 'text-green-600' : 'text-red-500'}`}>
                  {isIncome ? '+' : '−'} {fmt(item.amount)}
                </span>
              </div>
            );
          })}
          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <span className="font-bold text-gray-900">Toza maosh</span>
            <span className="font-bold text-violet-600">{fmt(MOCK_SALARY.net)}</span>
          </div>
        </div>

        <button className="w-full mt-4 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all">
          <FileText className="w-4 h-4" /> Maosh varaqasini yuklab olish
        </button>
      </div>
    );
  }

  // ─── PROFILE ───────────────────────────────────────────────────────────────
  if (screen === 'profile') {
    return (
      <div className="min-h-screen p-4 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-5 pt-2">
          <button onClick={goBack} className="p-2 rounded-xl bg-gray-100"><ArrowLeft className="w-4 h-4 text-gray-600" /></button>
          <h1 className="font-bold text-gray-900 text-lg">Mening profilim</h1>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-5 text-white mb-4 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-2">
            {MOCK_USER.avatar}
          </div>
          <p className="font-bold text-xl">{displayName}</p>
          <p className="text-white/70 text-sm">{MOCK_USER.position}</p>
          <p className="text-white/60 text-xs mt-0.5">{MOCK_USER.department}</p>
          <div className="mt-3 bg-white/20 rounded-xl px-3 py-1.5 inline-block">
            <p className="text-xs font-bold">{MOCK_USER.employeeCode}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {[
            { label: "Bu oy ish soati", value: "163 soat" },
            { label: "Davomat foizi", value: "94%" },
            { label: "Qolgan ta'til", value: "14 kun" },
            { label: "Oxirgi maosh", value: fmt(MOCK_SALARY.net) },
          ].map((item, i, arr) => (
            <div key={item.label} className={`flex items-center justify-between p-4 ${i < arr.length-1 ? 'border-b border-gray-50' : ''}`}>
              <span className="text-sm text-gray-500">{item.label}</span>
              <span className="text-sm font-bold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>

        {tgUser && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 text-center">
            Telegram: @{tgUser.username || 'foydalanuvchi'} orqali ulangan
          </div>
        )}
      </div>
    );
  }

  return null;
}
