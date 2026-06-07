'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import {
  Clock, Calendar, DollarSign, CheckSquare, Bell,
  MapPin, TrendingUp, Lock, ChevronRight, X, Send,
  LogIn, LogOut, AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Demo permissions — in production these come from API
const DEMO_PERMISSIONS = {
  viewAttendance: true,
  viewSalary: false,   // Admin has not enabled salary view
  requestLeave: true,
  viewKpi: true,
  downloadDocuments: false,
  viewColleagues: true,
};

const ANNOUNCEMENTS = [
  { id: '1', title: "Oylik maosh 25-yanvar kuni to'ldi", time: '2 soat oldin', icon: '💰', urgent: false },
  { id: '2', title: "28-yanvar — Qodir kecha, dam olish kuni", time: 'Kecha', icon: '🎉', urgent: false },
  { id: '3', title: "Xavfsizlik briefingi — 30-yanvar, 10:00", time: '3 kun oldin', icon: '⚠️', urgent: true },
];

const LEAVE_BALANCE = [
  { type: "Yillik ta'til", used: 10, total: 24, color: 'bg-blue-500', icon: '🏖' },
  { type: "Kasal ta'til", used: 3, total: 15, color: 'bg-red-400', icon: '🏥' },
  { type: 'Xizmat safari', used: 2, total: 10, color: 'bg-purple-500', icon: '✈️' },
];

const KPI_DATA = [
  { name: 'Vazifalar', score: 85, target: 90, color: 'bg-blue-500' },
  { name: 'Davomat', score: 92, target: 95, color: 'bg-green-500' },
  { name: 'Sifat', score: 78, target: 85, color: 'bg-orange-400' },
];

export default function MyProfilePage() {
  const { data: session } = useSession();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveType, setLeaveType] = useState("Yillik ta'til");
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Generate attendance data client-side only to avoid hydration mismatch
  // (Math.random() produces different values on server vs client)
  const DEMO_ATTENDANCE = useMemo(() => Array.from({ length: 28 }, (_, i) => {
    const day = i + 1;
    const isWeekend = new Date(2024, 0, day).getDay() % 6 === 0;
    if (isWeekend) return { day, type: 'weekend' };
    if (day === 8) return { day, type: 'absent' };
    if (day === 15) return { day, type: 'late', checkIn: '09:22' };
    if (day > 22) return { day, type: 'future' };
    return { day, type: 'present', checkIn: '08:' + String(40 + Math.floor(Math.random() * 20)).padStart(2, '0') };
  }), []);

  const firstName = (session?.user as any)?.firstName || 'Sardor';
  const hour = mounted ? new Date().getHours() : 9;
  const greeting = hour < 12 ? 'Xayrli tong' : hour < 17 ? 'Xayrli kun' : 'Xayrli kech';

  const presentDays = DEMO_ATTENDANCE.filter((d) => d.type === 'present' || d.type === 'late').length;
  const lateDays = DEMO_ATTENDANCE.filter((d) => d.type === 'late').length;
  const absentDays = DEMO_ATTENDANCE.filter((d) => d.type === 'absent').length;
  const workHours = presentDays * 8 + lateDays * 0.5;

  const submitLeave = () => {
    if (!leaveFrom || !leaveTo) { toast.error("Sanalarni kiriting"); return; }
    toast.success("Ta'til so'rovi yuborildi! Rahbari ko'rib chiqadi.");
    setShowLeaveModal(false);
    setLeaveFrom(''); setLeaveTo(''); setLeaveReason('');
  };

  const dayColor = (type: string) => {
    if (type === 'present') return 'bg-green-100 text-green-700 border-green-200';
    if (type === 'late') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (type === 'absent') return 'bg-red-100 text-red-600 border-red-200';
    if (type === 'weekend') return 'bg-gray-50 text-gray-300 border-gray-100';
    return 'bg-white text-gray-400 border-dashed border-gray-200';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <p className="text-blue-200 text-sm">{greeting},</p>
        <h1 className="text-2xl font-bold mt-0.5">{firstName} 👋</h1>
        <p className="text-blue-100 text-sm mt-2">
          Bu oy: <strong>{presentDays} kun</strong> keldingiz •
          <strong> {workHours.toFixed(0)} soat</strong> ishladingiz
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Clock, label: 'Davomat', color: 'bg-blue-50 text-blue-600', href: '/attendance' },
          { icon: DollarSign, label: 'Maoshim', color: 'bg-green-50 text-green-600', href: '#salary' },
          { icon: Calendar, label: "Ta'til so'rash", color: 'bg-purple-50 text-purple-600', action: () => setShowLeaveModal(true) },
          { icon: CheckSquare, label: 'Vazifalar', color: 'bg-orange-50 text-orange-600', href: '/tasks' },
        ].map((item) => (
          <button key={item.label}
            onClick={item.action || (() => {})}
            className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all text-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-gray-700">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Attendance Calendar */}
      {DEMO_PERMISSIONS.viewAttendance && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-900">Yanvar 2024 — Davomat</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                <span className="text-green-600 font-semibold">{presentDays} keldi</span> •
                <span className="text-yellow-600 font-semibold"> {lateDays} kech</span> •
                <span className="text-red-500 font-semibold"> {absentDays} kelmadi</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{workHours.toFixed(0)}h</p>
              <p className="text-xs text-gray-400">ish soati</p>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
            ))}
            {/* Padding for first week */}
            {Array.from({ length: 0 }).map((_, i) => <div key={`pad-${i}`} />)}
            {DEMO_ATTENDANCE.map((d) => (
              <div key={d.day} className={`aspect-square rounded-lg border flex items-center justify-center text-xs font-semibold ${dayColor(d.type)}`}>
                {d.type === 'future' ? <span className="text-gray-200">{d.day}</span> : d.day}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            {[
              { color: 'bg-green-100', label: 'Keldi' },
              { color: 'bg-yellow-100', label: 'Kech' },
              { color: 'bg-red-100', label: 'Kelmadi' },
              { color: 'bg-gray-50', label: 'Dam olish' },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1">
                <span className={`w-3 h-3 rounded ${l.color}`} /> {l.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Leave Balance */}
      {DEMO_PERMISSIONS.requestLeave && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Ta&#39;til balansi</h2>
            <button onClick={() => setShowLeaveModal(true)}
              className="flex items-center gap-1.5 text-sm text-blue-600 font-semibold hover:text-blue-700">
              + So&#39;rov yuborish
            </button>
          </div>
          <div className="space-y-3">
            {LEAVE_BALANCE.map((lb) => (
              <div key={lb.type} className="flex items-center gap-3">
                <span className="text-xl">{lb.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{lb.type}</span>
                    <span className="text-gray-500">{lb.total - lb.used} kun qoldi</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${lb.color} rounded-full`} style={{ width: `${(lb.used / lb.total) * 100}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{lb.used}/{lb.total} kun ishlatildi</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Salary — locked if no permission */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5" id="salary">
        <h2 className="font-bold text-gray-900 mb-4">Oxirgi maosh</h2>
        {DEMO_PERMISSIONS.viewSalary ? (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Yanvar 2024</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">7,225,000 <span className="text-sm font-normal text-gray-400">so&#39;m</span></p>
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span>Yalpi: 8,500,000</span>
              <span>Soliq: -1,025,000</span>
              <span className="text-green-600 font-semibold">Toza: 7,225,000</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-gray-400" />
            </div>
            <p className="font-semibold text-gray-700">Maosh ma&#39;lumotlari yashirilgan</p>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              Maosh ma&#39;lumotlarini ko&#39;rish uchun admin bilan bog&#39;laning
            </p>
          </div>
        )}
      </div>

      {/* KPI */}
      {DEMO_PERMISSIONS.viewKpi && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4">KPI natijalarim</h2>
          <div className="space-y-4">
            {KPI_DATA.map((k) => (
              <div key={k.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700">{k.name}</span>
                  <span className={`font-bold ${k.score >= k.target ? 'text-green-600' : 'text-orange-500'}`}>{k.score}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${k.color} rounded-full transition-all`} style={{ width: `${k.score}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">Maqsad: {k.target}%</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Announcements — always visible */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-bold text-gray-900 mb-4">Muhim e&#39;lonlar</h2>
        <div className="space-y-3">
          {ANNOUNCEMENTS.map((a) => (
            <div key={a.id} className={`flex items-start gap-3 p-3 rounded-xl ${a.urgent ? 'bg-red-50 border border-red-100' : 'bg-gray-50'}`}>
              <span className="text-xl">{a.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{a.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
              </div>
              {a.urgent && <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
            </div>
          ))}
        </div>
      </div>

      {/* Leave Request Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Ta&#39;til so&#39;rovi</h3>
              <button onClick={() => setShowLeaveModal(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ta&#39;til turi</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Yillik ta'til", "Kasal ta'til", "Xizmat safari", "Masofaviy ish"].map((t) => (
                    <button key={t} type="button"
                      onClick={() => setLeaveType(t)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${leaveType === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Boshlanish *</label>
                  <input type="date" value={leaveFrom} onChange={(e) => setLeaveFrom(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tugash *</label>
                  <input type="date" value={leaveTo} onChange={(e) => setLeaveTo(e.target.value)} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sabab</label>
                <textarea rows={3} value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)}
                  className="input-field resize-none" placeholder="Izohlang..." />
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={() => setShowLeaveModal(false)} className="flex-1 btn-secondary">Bekor qilish</button>
              <button onClick={submitLeave} className="flex-1 btn-primary flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Yuborish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
