'use client';

import { useState, useEffect } from 'react';
import {
  Camera, Users, CheckCircle2, XCircle, Clock, Bell, MapPin,
  Upload, Search, Filter, RefreshCw, Settings, Plus, AlertTriangle,
  Eye, Download, Send, ChevronRight, Monitor, Wifi, WifiOff,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Demo Data ───────────────────────────────────────────────────────────────

const DEMO_SCHOOLS = [
  { id: 's1', name: '1-sonli Umumta\'lim Maktabi', classes: 24, students: 720, cameras: 6 },
  { id: 's2', name: '15-sonli Litseyasi', classes: 18, students: 540, cameras: 4 },
];

const DEMO_CAMERAS = [
  { id: 'c1', name: 'Kirish darvozasi', ip: '192.168.1.101', location: 'ENTRANCE', isOnline: true, lastEvent: '08:52:14', school: '1-sonli Maktab' },
  { id: 'c2', name: 'Chiqish darvozasi', ip: '192.168.1.102', location: 'EXIT', isOnline: true, lastEvent: '08:47:33', school: '1-sonli Maktab' },
  { id: 'c3', name: '1-qavat koridor', ip: '192.168.1.103', location: 'CORRIDOR', isOnline: true, lastEvent: '08:55:01', school: '1-sonli Maktab' },
  { id: 'c4', name: '2-qavat koridor', ip: '192.168.1.104', location: 'CORRIDOR', isOnline: false, lastEvent: '07:22:10', school: '1-sonli Maktab' },
  { id: 'c5', name: 'Litseyasi kirish', ip: '192.168.1.201', location: 'ENTRANCE', isOnline: true, lastEvent: '08:50:44', school: '15-Litseyasi' },
];

const DEMO_CLASSES = [
  { id: 'cl1', name: '5A', grade: 5, students: 28, teacher: 'Gulnora Nazarova' },
  { id: 'cl2', name: '5B', grade: 5, students: 30, teacher: 'Malika Yusupova' },
  { id: 'cl3', name: '6A', grade: 6, students: 27, teacher: 'Sardor Toshmatov' },
  { id: 'cl4', name: '7A', grade: 7, students: 31, teacher: 'Bobur Rakhimov' },
  { id: 'cl5', name: '8B', grade: 8, students: 29, teacher: 'Dilnoza Karimova' },
  { id: 'cl6', name: '9A', grade: 9, students: 25, teacher: 'Jasur Mirzayev' },
];

const DEMO_STUDENTS = [
  { id: 'st1', name: 'Zafar Toshmatov', class: '5A', arrived: '08:42', left: null, photo: null, avatar: 'ZT', status: 'ARRIVED' },
  { id: 'st2', name: 'Malika Yusupova', class: '5A', arrived: '08:45', left: null, photo: null, avatar: 'MY', status: 'ARRIVED' },
  { id: 'st3', name: 'Bobur Nazarov', class: '5B', arrived: null, left: null, photo: null, avatar: 'BN', status: 'ABSENT' },
  { id: 'st4', name: 'Gulnora Karimova', class: '5B', arrived: '08:50', left: null, photo: null, avatar: 'GK', status: 'ARRIVED' },
  { id: 'st5', name: 'Jasur Mirzayev', class: '6A', arrived: '08:39', left: '13:55', photo: null, avatar: 'JM', status: 'DEPARTED' },
  { id: 'st6', name: 'Dilnoza Rashidova', class: '6A', arrived: null, left: null, photo: null, avatar: 'DR', status: 'ABSENT' },
  { id: 'st7', name: 'Sardor Xolmatov', class: '7A', arrived: '08:55', left: null, photo: null, avatar: 'SX', status: 'ARRIVED' },
  { id: 'st8', name: 'Nilufar Ergasheva', class: '8B', arrived: '08:48', left: null, photo: null, avatar: 'NE', status: 'ARRIVED' },
];

const DEMO_NOTIF_LOGS = [
  { id: 'n1', student: 'Zafar Toshmatov', parent: 'Toshmatov Akbar', event: 'ARRIVAL', time: '08:42', channel: 'Telegram+SMS', status: 'SENT', photo: true },
  { id: 'n2', student: 'Malika Yusupova', parent: 'Yusupov Doniyor', event: 'ARRIVAL', time: '08:45', channel: 'Telegram+SMS', status: 'SENT', photo: true },
  { id: 'n3', student: 'Jasur Mirzayev', parent: 'Mirzayev Sardor', event: 'DEPARTURE', time: '13:55', channel: 'Telegram+SMS', status: 'SENT', photo: true },
  { id: 'n4', student: 'Bobur Nazarov', parent: 'Nazarov Zafar', event: 'ABSENT', time: '09:00', channel: 'Telegram+SMS', status: 'SENT', photo: false },
  { id: 'n5', student: 'Dilnoza Rashidova', parent: 'Rashidov Alisher', event: 'ABSENT', time: '09:00', channel: 'SMS', status: 'SENT', photo: false },
  { id: 'n6', student: 'Sardor Xolmatov', parent: 'Xolmatov Nodir', event: 'ARRIVAL', time: '08:55', channel: 'Telegram+SMS', status: 'SENT', photo: true },
  { id: 'n7', student: 'Nilufar Ergasheva', parent: 'Ergashev Hamid', event: 'ARRIVAL', time: '08:48', channel: 'Telegram', status: 'DELIVERED', photo: true },
];

type Tab = 'dashboard' | 'cameras' | 'students' | 'attendance' | 'notifications' | 'settings';

function StatusBadge({ status }: { status: string }) {
  if (status === 'ARRIVED') return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Keldi ✓</span>;
  if (status === 'DEPARTED') return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Ketdi →</span>;
  return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Kelmadi ✗</span>;
}

export default function SchoolPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('s1');
  const [liveEvents, setLiveEvents] = useState<{ id: string; name: string; event: string; time: string; class: string }[]>([]);
  const [students, setStudents] = useState(DEMO_STUDENTS);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Simulate live face detection events
  useEffect(() => {
    const names = ['Ahmad Karimov', 'Sevara Nazarova', 'Otabek Mirzayev', 'Barno Tursunova', 'Husan Ergashev'];
    const classes = ['5A', '5B', '6A', '7A', '8B'];
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const name = names[Math.floor(Math.random() * names.length)];
      const cls = classes[Math.floor(Math.random() * classes.length)];
      const event = Math.random() > 0.2 ? 'ARRIVAL' : 'DEPARTURE';
      setLiveEvents((prev) => [{ id: Date.now().toString(), name, event, time: timeStr, class: cls }, ...prev.slice(0, 6)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const refresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsRefreshing(false);
    toast.success("Ma'lumotlar yangilandi");
  };

  const arrived = students.filter((s) => s.status === 'ARRIVED' || s.status === 'DEPARTED').length;
  const absent = students.filter((s) => s.status === 'ABSENT').length;
  const departed = students.filter((s) => s.status === 'DEPARTED').length;
  const total = students.length;
  const camerasOnline = DEMO_CAMERAS.filter((c) => c.isOnline).length;

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase())
  );

  const TABS: { key: Tab; label: string; icon: any }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: Monitor },
    { key: 'cameras', label: 'Kameralar', icon: Camera },
    { key: 'students', label: 'O\'quvchilar', icon: Users },
    { key: 'attendance', label: 'Davomat', icon: CheckCircle2 },
    { key: 'notifications', label: 'Xabarnomalar', icon: Bell },
    { key: 'settings', label: 'Sozlamalar', icon: Settings },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Smart Maktab Tizimi</h1>
            <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">Hikvision AI</span>
          </div>
          <p className="text-sm text-gray-500">Yuz tanish texnologiyasi orqali avtomatik davomat</p>
        </div>
        <div className="flex gap-2">
          <button onClick={refresh} className={`btn-secondary flex items-center gap-1.5 ${isRefreshing ? 'opacity-60' : ''}`}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Yangilash
          </button>
          <button onClick={() => setShowRegisterModal(true)} className="btn-primary flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> O&#39;quvchi qo&#39;shish
          </button>
        </div>
      </div>

      {/* School selector */}
      <div className="flex gap-2">
        {DEMO_SCHOOLS.map((s) => (
          <button key={s.id} onClick={() => setSelectedSchool(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${selectedSchool === s.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}>
            {s.name}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${tab === t.key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        {/* ─── DASHBOARD TAB ─── */}
        {tab === 'dashboard' && (
          <div className="p-5 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-5 gap-4">
              {[
                { label: 'Jami o\'quvchi', value: total, icon: Users, color: 'text-gray-700', bg: 'bg-gray-50' },
                { label: 'Keldi', value: arrived, icon: CheckCircle2, color: 'text-green-700', bg: 'bg-green-50' },
                { label: 'Ketdi', value: departed, icon: ChevronRight, color: 'text-blue-700', bg: 'bg-blue-50' },
                { label: 'Kelmadi', value: absent, icon: XCircle, color: 'text-red-700', bg: 'bg-red-50' },
                { label: 'Kamera (online)', value: `${camerasOnline}/${DEMO_CAMERAS.length}`, icon: Camera, color: 'text-indigo-700', bg: 'bg-indigo-50' },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                    <span className="text-xs text-gray-500">{s.label}</span>
                  </div>
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  {typeof s.value === 'number' && total > 0 && (
                    <p className="text-xs text-gray-400 mt-1">{Math.round((s.value / total) * 100)}%</p>
                  )}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Bugungi davomat</span>
                <span className="font-bold text-indigo-600">{Math.round((arrived / total) * 100)}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all"
                  style={{ width: `${Math.round((arrived / total) * 100)}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Live feed */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-gray-800">LIVE — Yuz tanish hodisalari</span>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {liveEvents.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-6">Kutilmoqda...</p>
                  )}
                  {liveEvents.map((ev) => (
                    <div key={ev.id} className={`flex items-center gap-3 p-2.5 rounded-xl border text-sm ${ev.event === 'ARRIVAL' ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${ev.event === 'ARRIVAL' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
                        {ev.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{ev.name}</p>
                        <p className="text-xs text-gray-500">{ev.class} • {ev.event === 'ARRIVAL' ? '✅ Keldi' : '🏠 Ketdi'}</p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{ev.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Absent alert */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold text-gray-800">Kelmagan o&#39;quvchilar</span>
                  <span className="text-xs bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-full">{absent}</span>
                </div>
                <div className="space-y-2">
                  {students.filter((s) => s.status === 'ABSENT').map((s) => (
                    <div key={s.id} className="flex items-center gap-3 p-2.5 bg-red-50 border border-red-100 rounded-xl">
                      <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center text-xs font-bold text-red-800">{s.avatar}</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.class}</p>
                      </div>
                      <button className="text-xs text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-0.5">
                        <Send className="w-3 h-3" /> SMS
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── CAMERAS TAB ─── */}
        {tab === 'cameras' && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-gray-700">{DEMO_CAMERAS.length} ta kamera • {camerasOnline} ta online</p>
              <button className="btn-primary flex items-center gap-1.5 text-sm">
                <Plus className="w-4 h-4" /> Kamera qo&#39;shish
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {DEMO_CAMERAS.map((cam) => (
                <div key={cam.id} className={`rounded-xl border p-4 ${cam.isOnline ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{cam.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{cam.ip} • {cam.location}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${cam.isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {cam.isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                      {cam.isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>
                  {/* Camera preview placeholder */}
                  <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
                    {cam.isOnline ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
                        <div className="relative z-10 text-center">
                          <Camera className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-400">LIVE RTSP Stream</p>
                          <p className="text-[10px] text-gray-500">rtsp://192.168.1.{cam.id === 'c1' ? '101' : '102'}/stream</p>
                        </div>
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-[10px] text-white font-bold">REC</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <WifiOff className="w-8 h-8 text-gray-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Ulanmagan</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Oxirgi hodisa: {cam.lastEvent}</span>
                    <div className="flex gap-1">
                      <button className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-100">Ko&#39;rish</button>
                      <button className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200">Test</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── STUDENTS TAB ─── */}
        {tab === 'students' && (
          <div className="p-5">
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-9" placeholder="O'quvchi qidirish..." />
              </div>
              <select className="input-field w-40">
                <option>Barcha sinflar</option>
                {DEMO_CLASSES.map((c) => <option key={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="divide-y divide-gray-50">
              {filteredStudents.map((s) => (
                <div key={s.id} className="py-3 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${s.status === 'ABSENT' ? 'bg-red-100 text-red-700' : s.status === 'DEPARTED' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {s.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.class}</p>
                  </div>
                  <StatusBadge status={s.status} />
                  {s.arrived && <span className="text-xs text-gray-400">Keldi: {s.arrived}</span>}
                  {s.left && <span className="text-xs text-gray-400">Ketdi: {s.left}</span>}
                  <button className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 font-semibold">
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── ATTENDANCE TAB ─── */}
        {tab === 'attendance' && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="input-field w-44" />
                <select className="input-field w-36">
                  <option>Barcha sinflar</option>
                  {DEMO_CLASSES.map((c) => <option key={c.id}>{c.name}</option>)}
                </select>
              </div>
              <button className="btn-secondary flex items-center gap-1.5 text-sm">
                <Download className="w-4 h-4" /> Excel
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["O'quvchi", 'Sinf', 'Kelish', 'Ketish', 'Holat', 'Kamera', 'Xabarnoma'].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map((s) => (
                  <tr key={s.id} className={`hover:bg-gray-50 ${s.status === 'ABSENT' ? 'bg-red-50/50' : ''}`}>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${s.status === 'ABSENT' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{s.avatar}</div>
                        <span className="font-medium text-gray-800">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-gray-500">{s.class}</td>
                    <td className="py-2.5 px-3 text-gray-700 font-mono">{s.arrived || '—'}</td>
                    <td className="py-2.5 px-3 text-gray-700 font-mono">{s.left || '—'}</td>
                    <td className="py-2.5 px-3"><StatusBadge status={s.status} /></td>
                    <td className="py-2.5 px-3 text-xs text-gray-400">Kirish kamerasi</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${s.status === 'ABSENT' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                        {s.status === 'ABSENT' ? 'Yuborildi ⚠️' : 'Yuborildi ✓'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── NOTIFICATIONS TAB ─── */}
        {tab === 'notifications' && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-2">
              {[
                { label: 'Bugun yuborildi', value: DEMO_NOTIF_LOGS.length, color: 'text-blue-600 bg-blue-50' },
                { label: 'Telegram', value: DEMO_NOTIF_LOGS.filter((n) => n.channel.includes('Telegram')).length, color: 'text-indigo-600 bg-indigo-50' },
                { label: 'SMS', value: DEMO_NOTIF_LOGS.length, color: 'text-green-600 bg-green-50' },
              ].map((s) => (
                <div key={s.label} className={`${s.color.split(' ')[1]} rounded-xl p-4`}>
                  <p className={`text-2xl font-bold ${s.color.split(' ')[0]}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-800 mb-1">Telegram xabarnoma namunasi:</p>
              <div className="bg-white rounded-lg p-3 text-xs text-gray-700 font-mono space-y-0.5">
                <p>✅ <strong>Zafar Toshmatov</strong></p>
                <p>📚 Maktab: 1-sonli Umumta&#39;lim Maktabi</p>
                <p>📋 Holat: <strong>Maktabga keldi</strong></p>
                <p>🕐 Vaqt: 08:42</p>
                <p>📅 Sana: 29 May 2026</p>
                <p className="text-gray-400 mt-1">[Foto: 📷 Kirish kamerasi]</p>
              </div>
            </div>
            <div className="space-y-2">
              {DEMO_NOTIF_LOGS.map((n) => (
                <div key={n.id} className={`flex items-center gap-3 p-3 rounded-xl border text-sm ${n.event === 'ARRIVAL' ? 'bg-green-50 border-green-100' : n.event === 'DEPARTURE' ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
                  <span className="text-lg">{n.event === 'ARRIVAL' ? '✅' : n.event === 'DEPARTURE' ? '🏠' : '⚠️'}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{n.student}</p>
                    <p className="text-xs text-gray-500">{n.parent} • {n.channel}{n.photo ? ' • 📷 foto' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-gray-600">{n.time}</p>
                    <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded">{n.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── SETTINGS TAB ─── */}
        {tab === 'settings' && (
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Telegram Bot sozlamalari</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bot Token</label>
                  <input type="password" className="input-field" defaultValue="7834521098:AAHxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Test Chat ID</label>
                  <input className="input-field" defaultValue="123456789" />
                </div>
                <button className="btn-secondary text-sm flex items-center gap-1.5">
                  <Send className="w-4 h-4" /> Test xabar yuborish
                </button>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Xabarnoma qoidalari</h3>
                {[
                  { label: "Kelishda Telegram + foto yuborish", default: true },
                  { label: "Ketishda Telegram + foto yuborish", default: true },
                  { label: "09:00 dan kechiksa ogohlantirish", default: true },
                  { label: "Kelmagan o'quvchilar uchun SMS", default: true },
                  { label: "Kun oxirida umumiy hisobot", default: false },
                ].map((rule, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked={rule.default} className="w-4 h-4 rounded text-indigo-600" />
                    <span className="text-sm text-gray-700">{rule.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 pt-5">
              <h3 className="font-semibold text-gray-800 mb-4">Kamera RTSP sozlamalari</h3>
              <div className="bg-gray-50 rounded-xl p-4 font-mono text-xs text-gray-700 space-y-1">
                <p className="text-gray-400"># Hikvision kamera RTSP URL formati:</p>
                <p>rtsp://admin:Password@192.168.1.101:554/Streaming/channels/101</p>
                <p className="text-gray-400 mt-2"># ISAPI orqali yuz tanishni yoqish:</p>
                <p>PUT http://192.168.1.101/ISAPI/Smart/FaceDetect</p>
                <p className="text-gray-400 mt-2"># Snapshot olish:</p>
                <p>GET http://192.168.1.101/ISAPI/Streaming/channels/101/picture</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => toast.success('Sozlamalar saqlandi!')} className="btn-primary">Saqlash</button>
            </div>
          </div>
        )}
      </div>

      {/* Register Student Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Yangi o&#39;quvchi qo&#39;shish</h3>
              <p className="text-sm text-gray-500 mt-0.5">Yuz ro&#39;yxatdan o&#39;tkazish ham bajariladi</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Familiya</label>
                  <input className="input-field" placeholder="Karimov" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
                  <input className="input-field" placeholder="Jasur" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sinf</label>
                  <select className="input-field">
                    {DEMO_CLASSES.map((c) => <option key={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">O&#39;quvchi kodi</label>
                  <input className="input-field" placeholder="STU0051" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ota-ona telefoni</label>
                  <input className="input-field" placeholder="+998 90 123 45 67" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telegram ID (ota-ona)</label>
                  <input className="input-field" placeholder="@username yoki 123456789" />
                </div>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-sm text-indigo-700">
                📷 Yuz ro&#39;yxatdan o&#39;tkazish uchun o&#39;quvchi Hikvision kamera oldiga borib turishi kerak
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={() => setShowRegisterModal(false)} className="flex-1 btn-secondary">Bekor qilish</button>
              <button onClick={() => { setShowRegisterModal(false); toast.success("O'quvchi muvaffaqiyatli qo'shildi!"); }} className="flex-1 btn-primary">
                Qo&#39;shish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
