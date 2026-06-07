'use client';

import { useState, useEffect } from 'react';
import {
  Users, CheckCircle2, XCircle, Clock, AlertTriangle,
  MapPin, ChevronRight, Bell, RefreshCw, TrendingUp,
  Building2, Search, Filter, User, LogOut,
} from 'lucide-react';
import toast from 'react-hot-toast';

type Tab = 'overview' | 'employees' | 'alerts';
type EmpStatus = 'present' | 'late' | 'absent' | 'remote';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  status: EmpStatus;
  checkIn: string | null;
  location: string | null;
  avatar: string;
}

const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Sardor Toshmatov', position: 'Senior Dasturchi', department: 'IT', status: 'present', checkIn: '08:52', location: 'Asosiy ofis', avatar: 'ST' },
  { id: '2', name: 'Malika Yusupova', position: 'HR Manager', department: 'HR', status: 'present', checkIn: '08:45', location: 'Asosiy ofis', avatar: 'MY' },
  { id: '3', name: 'Bobur Rakhimov', position: 'Buxgalter', department: 'Moliya', status: 'late', checkIn: '09:35', location: 'Asosiy ofis', avatar: 'BR' },
  { id: '4', name: 'Dilnoza Karimova', position: 'Designer', department: 'Marketing', status: 'present', checkIn: '08:58', location: 'Asosiy ofis', avatar: 'DK' },
  { id: '5', name: 'Jasur Mirzayev', position: 'Savdo menejeri', department: 'Savdo', status: 'remote', checkIn: '09:05', location: 'Samarqand filiali', avatar: 'JM' },
  { id: '6', name: 'Nilufar Hasanova', position: 'Junior Dasturchi', department: 'IT', status: 'absent', checkIn: null, location: null, avatar: 'NH' },
  { id: '7', name: 'Otabek Sobirov', position: 'Loyiha menejeri', department: 'IT', status: 'present', checkIn: '08:30', location: 'Asosiy ofis', avatar: 'OS' },
  { id: '8', name: 'Gulnora Tursunova', position: 'Moliyaviy tahlilchi', department: 'Moliya', status: 'late', checkIn: '09:48', location: 'Asosiy ofis', avatar: 'GT' },
  { id: '9', name: 'Sherzod Nazarov', position: 'Sotuvchi', department: 'Savdo', status: 'present', checkIn: '08:55', location: 'Showroom', avatar: 'SN' },
  { id: '10', name: 'Kamola Ergasheva', position: 'Kotib', department: 'Admin', status: 'absent', checkIn: null, location: null, avatar: 'KE' },
];

const MOCK_ALERTS = [
  { id: '1', type: 'absent', text: 'Nilufar Hasanova kelmadi', time: '09:00', severity: 'high' },
  { id: '2', type: 'absent', text: 'Kamola Ergasheva kelmadi', time: '09:00', severity: 'high' },
  { id: '3', type: 'late', text: 'Bobur Rakhimov 35 daqiqa kech keldi', time: '09:35', severity: 'medium' },
  { id: '4', type: 'late', text: 'Gulnora Tursunova 48 daqiqa kech keldi', time: '09:48', severity: 'medium' },
  { id: '5', type: 'info', text: 'Oylik maosh hisobi tayyorlandi', time: '08:00', severity: 'low' },
];

const STATUS_CONFIG: Record<EmpStatus, { label: string; bg: string; text: string; dot: string }> = {
  present: { label: 'Keldi', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  late: { label: 'Kech', bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  absent: { label: 'Kelmadi', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  remote: { label: 'Masofaviy', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
};

const DEPARTMENTS = ['Barchasi', 'IT', 'HR', 'Moliya', 'Marketing', 'Savdo', 'Admin'];

function AvatarCircle({ initials, status }: { initials: string; status: EmpStatus }) {
  const colors: Record<EmpStatus, string> = {
    present: 'bg-green-100 text-green-700',
    late: 'bg-yellow-100 text-yellow-700',
    absent: 'bg-red-100 text-red-700',
    remote: 'bg-blue-100 text-blue-700',
  };
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 relative ${colors[status]}`}>
      {initials}
      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${STATUS_CONFIG[status].dot}`} />
    </div>
  );
}

export default function DirectorMobilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('Barchasi');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const refresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
    toast.success('Ma\'lumotlar yangilandi');
  };

  const present = MOCK_EMPLOYEES.filter((e) => e.status === 'present' || e.status === 'remote').length;
  const late = MOCK_EMPLOYEES.filter((e) => e.status === 'late').length;
  const absent = MOCK_EMPLOYEES.filter((e) => e.status === 'absent').length;
  const total = MOCK_EMPLOYEES.length;
  const attendanceRate = Math.round(((present + late) / total) * 100);

  const filtered = MOCK_EMPLOYEES.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase());
    const matchDept = selectedDept === 'Barchasi' || e.department === selectedDept;
    return matchSearch && matchDept;
  });

  const deptStats = DEPARTMENTS.slice(1).map((dept) => {
    const deptEmps = MOCK_EMPLOYEES.filter((e) => e.department === dept);
    const deptPresent = deptEmps.filter((e) => e.status === 'present' || e.status === 'remote' || e.status === 'late').length;
    return { dept, total: deptEmps.length, present: deptPresent };
  }).filter((d) => d.total > 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white px-4 pt-12 pb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-indigo-200 text-xs">Direktor paneli</p>
            <p className="font-bold text-lg">Nexus Group</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={refresh} className={`w-9 h-9 bg-white/20 rounded-full flex items-center justify-center ${isRefreshing ? 'animate-spin' : ''}`}>
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="relative w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <Bell className="w-4 h-4" />
              {MOCK_ALERTS.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center font-bold">
                  {MOCK_ALERTS.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-4xl font-bold font-mono">
            {currentTime.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-indigo-200 text-xs mt-1">
            {currentTime.toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Jami', value: total, color: 'bg-white/20' },
            { label: 'Keldi', value: present, color: 'bg-green-500/30' },
            { label: 'Kech', value: late, color: 'bg-yellow-500/30' },
            { label: 'Yo\'q', value: absent, color: 'bg-red-500/30' },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-xl p-2.5 text-center backdrop-blur-sm`}>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[10px] text-indigo-100">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Attendance bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-indigo-200 mb-1">
            <span>Davomat darajasi</span>
            <span className="font-bold text-white">{attendanceRate}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${attendanceRate}%` }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-4">
        <div className="flex gap-1">
          {([
            { id: 'overview', label: 'Umumiy' },
            { id: 'employees', label: 'Xodimlar' },
            { id: 'alerts', label: `Ogohlantirishlar (${MOCK_ALERTS.length})` },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="flex-1 px-4 py-5 space-y-4">
          {/* Last updated */}
          <p className="text-xs text-gray-400 text-right">
            Yangilangan: {lastUpdated.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>

          {/* Department breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Bo&#39;limlar bo&#39;yicha</p>
            <div className="space-y-3">
              {deptStats.map((d) => {
                const pct = Math.round((d.present / d.total) * 100);
                return (
                  <div key={d.dept}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{d.dept}</span>
                      <span className="text-xs text-gray-500">{d.present}/{d.total} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">So&#39;nggi harakatlar</p>
            <div className="space-y-3">
              {MOCK_EMPLOYEES.filter((e) => e.checkIn).slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-center gap-3">
                  <AvatarCircle initials={e.avatar} status={e.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{e.name}</p>
                    <p className="text-xs text-gray-400 truncate">{e.department} • {e.location}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[e.status].bg} ${STATUS_CONFIG[e.status].text}`}>
                      {e.checkIn}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">GPS Xarita</p>
              <MapPin className="w-4 h-4 text-blue-500" />
            </div>
            <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex flex-col items-center justify-center border border-blue-100">
              <MapPin className="w-8 h-8 text-blue-400 mb-2" />
              <p className="text-sm font-medium text-blue-600">{present + late} xodim joylashuvi</p>
              <p className="text-xs text-blue-400 mt-1">Xaritada ko&#39;rish uchun bosing</p>
            </div>
          </div>
        </div>
      )}

      {/* Employees Tab */}
      {activeTab === 'employees' && (
        <div className="flex-1 flex flex-col">
          {/* Search & Filter */}
          <div className="bg-white px-4 py-3 border-b border-gray-100 space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Xodim izlash..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all flex-shrink-0 ${
                    selectedDept === dept
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 px-4 py-3 space-y-2 overflow-y-auto">
            {filtered.map((emp) => (
              <div key={emp.id} className="bg-white rounded-xl p-3.5 border border-gray-100 flex items-center gap-3">
                <AvatarCircle initials={emp.avatar} status={emp.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{emp.name}</p>
                  <p className="text-xs text-gray-400 truncate">{emp.position} • {emp.department}</p>
                  {emp.location && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-gray-300" />
                      <span className="text-xs text-gray-400">{emp.location}</span>
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${STATUS_CONFIG[emp.status].bg} ${STATUS_CONFIG[emp.status].text}`}>
                    {STATUS_CONFIG[emp.status].label}
                  </span>
                  {emp.checkIn && (
                    <p className="text-xs text-gray-400 mt-1">{emp.checkIn}</p>
                  )}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Xodim topilmadi</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="flex-1 px-4 py-5 space-y-3">
          {MOCK_ALERTS.map((alert) => (
            <div key={alert.id} className={`bg-white rounded-xl p-4 border flex items-start gap-3 ${
              alert.severity === 'high' ? 'border-red-200' :
              alert.severity === 'medium' ? 'border-yellow-200' : 'border-gray-100'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                alert.severity === 'high' ? 'bg-red-100' :
                alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                {alert.severity === 'high' ? (
                  <XCircle className="w-4 h-4 text-red-500" />
                ) : alert.severity === 'medium' ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{alert.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom nav */}
      <nav className="bg-white border-t border-gray-100 px-4 py-2 flex items-center justify-around">
        {([
          { id: 'overview', icon: TrendingUp, label: 'Umumiy' },
          { id: 'employees', icon: Users, label: 'Xodimlar' },
          { id: 'alerts', icon: AlertTriangle, label: 'Ogohlar' },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 py-1 px-4 transition-all ${
              activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-semibold">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
