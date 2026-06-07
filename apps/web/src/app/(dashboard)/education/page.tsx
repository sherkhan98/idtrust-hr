'use client';

import { useState, useMemo } from 'react';
import {
  Users, BookOpen, AlertTriangle, ArrowLeftRight, Bell, BellOff,
  Download, Send, Check, ChevronUp, ChevronDown, Trophy, Star,
  Clock, Phone, MessageSquare, Calendar, X, ToggleLeft, ToggleRight,
  User, CheckCircle
} from 'lucide-react';

// ---- DATA ----

const DAYS = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

type LessonStatus = 'present' | 'absent' | 'substituted' | 'free';

interface Lesson {
  teacher: string;
  subject: string;
  classGroup: string;
  status: LessonStatus;
}

const TIMETABLE: Record<string, Record<string, Lesson | null>> = {
  '08:00': {
    'Dushanba': { teacher: 'Sardor T.', subject: 'Matematika', classGroup: '9A', status: 'present' },
    'Seshanba': { teacher: 'Nilufar A.', subject: 'Ona tili', classGroup: '8B', status: 'present' },
    'Chorshanba': { teacher: 'Jahongir M.', subject: 'Fizika', classGroup: '10A', status: 'absent' },
    'Payshanba': { teacher: 'Dilnoza K.', subject: 'Kimyo', classGroup: '11B', status: 'present' },
    'Juma': { teacher: 'Sardor T.', subject: 'Matematika', classGroup: '10B', status: 'present' },
    'Shanba': null,
  },
  '09:00': {
    'Dushanba': { teacher: 'Nilufar A.', subject: 'Ona tili', classGroup: '7A', status: 'present' },
    'Seshanba': { teacher: 'Sardor T.', subject: 'Algebra', classGroup: '9B', status: 'present' },
    'Chorshanba': { teacher: 'Kamola R.', subject: 'Ingliz tili', classGroup: '8A', status: 'substituted' },
    'Payshanba': { teacher: 'Jahongir M.', subject: 'Fizika', classGroup: '9A', status: 'present' },
    'Juma': { teacher: 'Dilnoza K.', subject: 'Biologiya', classGroup: '10A', status: 'present' },
    'Shanba': { teacher: 'Sardor T.', subject: 'Matematika', classGroup: '11A', status: 'present' },
  },
  '10:00': {
    'Dushanba': { teacher: 'Jahongir M.', subject: 'Fizika', classGroup: '11A', status: 'present' },
    'Seshanba': { teacher: 'Kamola R.', subject: 'Ingliz tili', classGroup: '9A', status: 'present' },
    'Chorshanba': { teacher: 'Sardor T.', subject: 'Geometriya', classGroup: '8B', status: 'present' },
    'Payshanba': { teacher: 'Nilufar A.', subject: 'Adabiyot', classGroup: '10B', status: 'present' },
    'Juma': { teacher: 'Kamola R.', subject: 'Ingliz tili', classGroup: '11A', status: 'present' },
    'Shanba': { teacher: 'Dilnoza K.', subject: 'Kimyo', classGroup: '9B', status: 'absent' },
  },
  '11:00': {
    'Dushanba': { teacher: 'Dilnoza K.', subject: 'Kimyo', classGroup: '10B', status: 'present' },
    'Seshanba': { teacher: 'Jahongir M.', subject: 'Astronomiya', classGroup: '11B', status: 'present' },
    'Chorshanba': { teacher: 'Nilufar A.', subject: 'Ona tili', classGroup: '9B', status: 'present' },
    'Payshanba': { teacher: 'Sardor T.', subject: 'Matematika', classGroup: '7B', status: 'present' },
    'Juma': null,
    'Shanba': { teacher: 'Kamola R.', subject: 'Ingliz tili', classGroup: '10B', status: 'present' },
  },
  '12:00': { 'Dushanba': null, 'Seshanba': null, 'Chorshanba': null, 'Payshanba': null, 'Juma': null, 'Shanba': null },
  '13:00': {
    'Dushanba': { teacher: 'Kamola R.', subject: 'Ingliz tili', classGroup: '10A', status: 'present' },
    'Seshanba': { teacher: 'Sardor T.', subject: 'Matematika', classGroup: '11B', status: 'present' },
    'Chorshanba': { teacher: 'Dilnoza K.', subject: 'Biologiya', classGroup: '8A', status: 'present' },
    'Payshanba': { teacher: 'Jahongir M.', subject: 'Fizika', classGroup: '11A', status: 'present' },
    'Juma': { teacher: 'Nilufar A.', subject: 'Adabiyot', classGroup: '8B', status: 'present' },
    'Shanba': null,
  },
  '14:00': {
    'Dushanba': { teacher: 'Jahongir M.', subject: 'Fizika', classGroup: '10B', status: 'present' },
    'Seshanba': { teacher: 'Dilnoza K.', subject: 'Kimyo', classGroup: '9A', status: 'present' },
    'Chorshanba': null,
    'Payshanba': { teacher: 'Kamola R.', subject: 'Ingliz tili', classGroup: '7A', status: 'present' },
    'Juma': { teacher: 'Sardor T.', subject: 'Algebra', classGroup: '10A', status: 'present' },
    'Shanba': null,
  },
  '15:00': {
    'Dushanba': { teacher: 'Nilufar A.', subject: "Nutq o'stirish", classGroup: '7B', status: 'present' },
    'Seshanba': null,
    'Chorshanba': { teacher: 'Sardor T.', subject: 'Matematika', classGroup: '9A', status: 'present' },
    'Payshanba': null,
    'Juma': null,
    'Shanba': null,
  },
  '16:00': { 'Dushanba': null, 'Seshanba': null, 'Chorshanba': null, 'Payshanba': null, 'Juma': null, 'Shanba': null },
};

interface KPIRow {
  name: string;
  subject: string;
  classesPerWeek: number;
  avgGrade: number;
  parentRating: number;
  punctuality: number;
  substitutions: number;
  score: number;
}

const KPI_DATA: KPIRow[] = [
  { name: 'Sardor Toshmatov', subject: 'Matematika', classesPerWeek: 18, avgGrade: 4.3, parentRating: 4.8, punctuality: 98, substitutions: 0, score: 92 },
  { name: 'Nilufar Azimova', subject: 'Ona tili', classesPerWeek: 14, avgGrade: 4.1, parentRating: 4.5, punctuality: 95, substitutions: 1, score: 85 },
  { name: 'Jahongir Mirzayev', subject: 'Fizika', classesPerWeek: 16, avgGrade: 3.9, parentRating: 4.2, punctuality: 88, substitutions: 3, score: 75 },
  { name: 'Kamola Rahimova', subject: 'Ingliz tili', classesPerWeek: 20, avgGrade: 4.6, parentRating: 4.9, punctuality: 97, substitutions: 1, score: 94 },
  { name: 'Dilnoza Karimova', subject: 'Kimyo', classesPerWeek: 12, avgGrade: 3.8, parentRating: 4.0, punctuality: 91, substitutions: 2, score: 72 },
  { name: 'Behruz Nazarov', subject: 'Tarix', classesPerWeek: 10, avgGrade: 3.5, parentRating: 3.8, punctuality: 78, substitutions: 5, score: 58 },
  { name: 'Gulnora Yusupova', subject: 'Biologiya', classesPerWeek: 12, avgGrade: 4.2, parentRating: 4.4, punctuality: 94, substitutions: 1, score: 83 },
  { name: 'Muzaffar Komilov', subject: 'Geografiya', classesPerWeek: 8, avgGrade: 3.7, parentRating: 4.1, punctuality: 85, substitutions: 2, score: 68 },
];

interface NotificationLog {
  id: string;
  date: string;
  teacher: string;
  classGroup: string;
  reason: string;
  sentTo: string;
  status: 'Yuborildi' | 'Xato';
}

const NOTIF_LOGS: NotificationLog[] = [
  { id: '1', date: '2025-05-28 08:05', teacher: 'Jahongir Mirzayev', classGroup: '10A', reason: "Darsga kelmadi", sentTo: '24 ota-ona', status: 'Yuborildi' },
  { id: '2', date: '2025-05-28 09:12', teacher: 'Kamola Rahimova', classGroup: '8A', reason: "Almashtirish tayinlandi", sentTo: '28 ota-ona', status: 'Yuborildi' },
  { id: '3', date: '2025-05-27 08:03', teacher: 'Dilnoza Karimova', classGroup: '9A', reason: "5 daqiqa kech keldi", sentTo: 'Direktor + 30 ota-ona', status: 'Yuborildi' },
  { id: '4', date: '2025-05-27 13:00', teacher: 'Sardor Toshmatov', classGroup: '11B', reason: "Dars bekor qilindi", sentTo: '26 ota-ona', status: 'Xato' },
  { id: '5', date: '2025-05-26 08:00', teacher: 'Nilufar Azimova', classGroup: '7A', reason: "Almashtirish tayinlandi", sentTo: '22 ota-ona', status: 'Yuborildi' },
];

interface SummerPayRow {
  name: string;
  experience: number;
  baseSalary: number;
  vacationDays: number;
}

const SUMMER_DATA: SummerPayRow[] = [
  { name: 'Sardor Toshmatov', experience: 12, baseSalary: 8500000, vacationDays: 42 },
  { name: 'Nilufar Azimova', experience: 7, baseSalary: 6800000, vacationDays: 35 },
  { name: 'Jahongir Mirzayev', experience: 4, baseSalary: 7200000, vacationDays: 28 },
  { name: 'Kamola Rahimova', experience: 8, baseSalary: 7500000, vacationDays: 35 },
  { name: 'Dilnoza Karimova', experience: 3, baseSalary: 6200000, vacationDays: 28 },
  { name: 'Behruz Nazarov', experience: 1, baseSalary: 5800000, vacationDays: 24 },
  { name: 'Gulnora Yusupova', experience: 6, baseSalary: 6500000, vacationDays: 35 },
  { name: 'Muzaffar Komilov', experience: 2, baseSalary: 5900000, vacationDays: 24 },
];

const WORKING_DAYS = 248;

function getExperienceCoeff(years: number): number {
  if (years < 2) return 1.0;
  if (years < 5) return 1.1;
  if (years < 10) return 1.2;
  return 1.5;
}

function calcSummerPay(row: SummerPayRow): number {
  const coeff = getExperienceCoeff(row.experience);
  return Math.round(row.baseSalary * (row.vacationDays / WORKING_DAYS) * coeff);
}

function formatUZS(v: number) {
  return v.toLocaleString('uz-UZ') + " so'm";
}

// ---- STATUS COLORS ----

const statusColor: Record<LessonStatus, string> = {
  present: 'bg-teal-100 border-teal-300 text-teal-800',
  absent: 'bg-red-100 border-red-300 text-red-800',
  substituted: 'bg-amber-100 border-amber-300 text-amber-800',
  free: 'bg-gray-50 border-gray-200 text-gray-400',
};

// ---- MAIN COMPONENT ----

export default function EducationPage() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'kpi' | 'notifications' | 'summer'>('schedule');
  const [kpiSort, setKpiSort] = useState<{ col: keyof KPIRow; dir: 'asc' | 'desc' }>({ col: 'score', dir: 'desc' });
  const [notifChannel, setNotifChannel] = useState<'sms' | 'telegram' | 'both'>('both');
  const [notifRules, setNotifRules] = useState({
    absent: true,
    late: true,
    substituted: false,
  });
  const [showTestSent, setShowTestSent] = useState(false);

  // Absent teachers
  const absentTeachers = useMemo(() => {
    const found = new Set<string>();
    for (const slot of Object.values(TIMETABLE)) {
      for (const lesson of Object.values(slot)) {
        if (lesson?.status === 'absent') found.add(lesson.teacher);
      }
    }
    return Array.from(found);
  }, []);

  // KPI sort
  const sortedKPI = useMemo(() => {
    return [...KPI_DATA].sort((a, b) => {
      const av = a[kpiSort.col];
      const bv = b[kpiSort.col];
      if (typeof av === 'number' && typeof bv === 'number') {
        return kpiSort.dir === 'asc' ? av - bv : bv - av;
      }
      return kpiSort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }, [kpiSort]);

  const handleKPISort = (col: keyof KPIRow) => {
    setKpiSort(prev => prev.col === col ? { col, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'desc' });
  };

  const SortIcon = ({ col }: { col: keyof KPIRow }) => {
    if (kpiSort.col !== col) return <ChevronUp size={12} className="text-gray-300" />;
    return kpiSort.dir === 'asc' ? <ChevronUp size={12} className="text-teal-600" /> : <ChevronDown size={12} className="text-teal-600" />;
  };

  // Summer pay totals
  const summerRows = SUMMER_DATA.map(r => ({ ...r, coeff: getExperienceCoeff(r.experience), calculated: calcSummerPay(r) }));
  const totalSummer = summerRows.reduce((s, r) => s + r.calculated, 0);

  const topScorer = sortedKPI[0];
  const maxScore = sortedKPI[0]?.score || 100;

  const handleSendTest = () => {
    setShowTestSent(true);
    setTimeout(() => setShowTestSent(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ta'lim Sektori HR Moduli</h1>
          <p className="text-sm text-gray-500 mt-1">Maktab va universitetlar uchun maxsus HR boshqaruvi</p>
        </div>
        <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 px-4 py-2 rounded-xl">
          <BookOpen size={16} className="text-teal-600" />
          <span className="text-sm font-semibold text-teal-700">Ta'lim Moduli</span>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Jami O'qituvchilar", value: 87, icon: <Users size={20} />, color: 'teal', sub: '+3 bu oy' },
          { label: 'Bugungi Darslar', value: 42, icon: <BookOpen size={20} />, color: 'emerald', sub: '6 sinf, 7 o\'qituvchi' },
          { label: "Bugun Yo'q", value: absentTeachers.length, icon: <AlertTriangle size={20} />, color: 'red', sub: absentTeachers.join(', ') },
          { label: 'Almashtirishlar', value: 2, icon: <ArrowLeftRight size={20} />, color: 'amber', sub: 'Bugun tayinlangan' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white rounded-2xl border shadow-sm p-4 ${stat.color === 'red' ? 'border-red-200' : stat.color === 'amber' ? 'border-amber-200' : 'border-teal-100'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`p-2 rounded-xl ${
                stat.color === 'teal' ? 'bg-teal-100 text-teal-600' :
                stat.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                stat.color === 'red' ? 'bg-red-100 text-red-600' :
                'bg-amber-100 text-amber-600'
              }`}>{stat.icon}</span>
            </div>
            <p className={`text-3xl font-bold ${
              stat.color === 'teal' ? 'text-teal-700' :
              stat.color === 'emerald' ? 'text-emerald-700' :
              stat.color === 'red' ? 'text-red-600' :
              'text-amber-600'
            }`}>{stat.value}</p>
            <p className="text-sm font-semibold text-gray-700 mt-1">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Absent Alert */}
      {absentTeachers.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-semibold text-red-700">Bugun yo'q o'qituvchilar: </span>
            <span className="text-sm text-red-600">{absentTeachers.join(', ')}</span>
          </div>
          <button className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1.5 bg-white border border-red-200 px-3 py-1.5 rounded-lg whitespace-nowrap">
            <ArrowLeftRight size={14} />Almashtirish tayinlash
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { key: 'schedule', label: 'Dars Jadvali', icon: <Calendar size={14} /> },
          { key: 'kpi', label: "O'qituvchi KPI", icon: <Star size={14} /> },
          { key: 'notifications', label: 'Ota-onalarga Xabar', icon: <Bell size={14} /> },
          { key: 'summer', label: "Yozgi Ta'til", icon: <Download size={14} /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.key ? 'bg-white shadow-sm text-teal-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Schedule */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Haftalik Dars Jadvali</h2>
            <div className="flex items-center gap-3">
              {[
                { status: 'present', label: 'Keldi', color: 'bg-teal-500' },
                { status: 'absent', label: "Kelmadi", color: 'bg-red-400' },
                { status: 'substituted', label: 'Almashtirish', color: 'bg-amber-400' },
              ].map(item => (
                <div key={item.status} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="w-20 px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-left">Vaqt</th>
                  {DAYS.map(day => (
                    <th key={day} className={`px-2 py-3 text-xs font-semibold uppercase text-center ${day === 'Dushanba' ? 'text-teal-600' : 'text-gray-500'}`}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot, si) => (
                  <tr key={slot} className={`border-b border-gray-50 ${slot === '12:00' ? 'bg-gray-50' : ''}`}>
                    <td className="px-4 py-2 text-xs font-semibold text-gray-500 whitespace-nowrap">{slot}</td>
                    {DAYS.map(day => {
                      const lesson = TIMETABLE[slot]?.[day];
                      if (slot === '12:00') return <td key={day} className="px-2 py-2 text-center"><span className="text-xs text-gray-400">Tanaffus</span></td>;
                      if (!lesson) return <td key={day} className="px-2 py-2"><div className="h-14 rounded-lg bg-gray-50 border border-dashed border-gray-200" /></td>;
                      return (
                        <td key={day} className="px-2 py-1.5">
                          <div className={`rounded-lg border p-2 text-xs ${statusColor[lesson.status]} min-h-[52px] flex flex-col justify-between`}>
                            <div className="font-semibold truncate">{lesson.teacher}</div>
                            <div className="text-xs opacity-75 truncate">{lesson.subject}</div>
                            <div className="text-xs font-bold">{lesson.classGroup}</div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: KPI */}
      {activeTab === 'kpi' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">O'qituvchi KPI Jadvali</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-700">
                <Trophy size={13} />Eng yaxshi: {topScorer?.name.split(' ')[0]} ({topScorer?.score}%)
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {([
                    ['name', "O'qituvchi"],
                    ['subject', 'Fan'],
                    ['classesPerWeek', 'Dars/hafta'],
                    ['avgGrade', "O'rtacha baho"],
                    ['parentRating', 'Ota-ona ⭐'],
                    ['punctuality', 'Vaqtida %'],
                    ['substitutions', 'Almash.'],
                    ['score', 'Umumiy ball'],
                  ] as [keyof KPIRow, string][]).map(([col, label]) => (
                    <th
                      key={col}
                      onClick={() => handleKPISort(col)}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600 select-none whitespace-nowrap"
                    >
                      <span className="flex items-center gap-1">{label}<SortIcon col={col} /></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sortedKPI.map((teacher, i) => {
                  const isTop = teacher.score === maxScore;
                  const isRisk = teacher.score < 60;
                  return (
                    <tr key={teacher.name} className={`transition-colors ${isRisk ? 'bg-red-50 hover:bg-red-100' : isTop ? 'bg-teal-50 hover:bg-teal-100' : 'hover:bg-gray-50'}`}>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${isTop ? 'bg-teal-500' : isRisk ? 'bg-red-400' : 'bg-gray-400'}`}>
                            {teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">{teacher.name}</span>
                            {isTop && <span className="ml-2 text-xs">🏆</span>}
                            {isRisk && <span className="ml-2 text-xs text-red-500 font-medium">Xavfli zona</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">{teacher.subject}</td>
                      <td className="px-4 py-3.5 text-center font-semibold text-gray-700">{teacher.classesPerWeek}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`font-bold ${teacher.avgGrade >= 4.0 ? 'text-teal-600' : teacher.avgGrade >= 3.5 ? 'text-amber-600' : 'text-red-500'}`}>{teacher.avgGrade}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="flex items-center justify-center gap-1">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span className="font-bold text-gray-700">{teacher.parentRating}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${teacher.punctuality >= 95 ? 'bg-teal-500' : teacher.punctuality >= 85 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${teacher.punctuality}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-600">{teacher.punctuality}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`text-sm font-bold ${teacher.substitutions === 0 ? 'text-teal-600' : teacher.substitutions > 3 ? 'text-red-500' : 'text-amber-600'}`}>{teacher.substitutions}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${teacher.score >= 80 ? 'bg-teal-500' : teacher.score >= 60 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${teacher.score}%` }} />
                          </div>
                          <span className={`text-sm font-bold ${teacher.score >= 80 ? 'text-teal-700' : teacher.score >= 60 ? 'text-amber-600' : 'text-red-500'}`}>{teacher.score}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-5">
          {/* Channel selector */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Xabar Kanali</h2>
            <div className="flex gap-3">
              {([['sms', 'SMS', <Phone size={14} />], ['telegram', 'Telegram', <MessageSquare size={14} />], ['both', 'Ikkalasi ham', <Bell size={14} />]] as [typeof notifChannel, string, React.ReactNode][]).map(([val, label, icon]) => (
                <button
                  key={val}
                  onClick={() => setNotifChannel(val)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${notifChannel === val ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-600 hover:border-teal-300'}`}
                >
                  {icon}{label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-notification rules */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Avtomatik Xabar Qoidalari</h2>
            <div className="space-y-3">
              {([
                ['absent', "O'qituvchi darsga kelmasa → Ota-onaga xabar", 'Har bir yo\'q sababi uchun'],
                ['late', "5 daqiqadan kech kelsa → Direktor + Ota-ona", 'Kechikish qayd etilganda'],
                ['substituted', "Almashtirish tayinlanganda → Ota-onalarga xabar", 'Jadval o\'zgarganda'],
              ] as [keyof typeof notifRules, string, string][]).map(([key, title, subtitle]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                  </div>
                  <button
                    onClick={() => setNotifRules(prev => ({ ...prev, [key]: !prev[key as keyof typeof notifRules] }))}
                    className={`transition-colors ${notifRules[key] ? 'text-teal-600' : 'text-gray-300'}`}
                  >
                    {notifRules[key] ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notification history */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Xabar Tarixi</h2>
              <button
                onClick={handleSendTest}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm"
              >
                {showTestSent ? <><Check size={14} />Yuborildi!</> : <><Send size={14} />Test xabar yuborish</>}
              </button>
            </div>
            {showTestSent && (
              <div className="mx-6 mt-4 p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-2 text-sm text-teal-700 font-medium">
                <CheckCircle size={16} />Test xabar muvaffaqiyatli yuborildi!
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Sana', "O'qituvchi", 'Sinf', 'Sabab', 'Kimga yuborildi', 'Holat'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {NOTIF_LOGS.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{log.date}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{log.teacher}</td>
                      <td className="px-4 py-3 text-gray-600">{log.classGroup}</td>
                      <td className="px-4 py-3 text-gray-600">{log.reason}</td>
                      <td className="px-4 py-3 text-gray-600">{log.sentTo}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${log.status === 'Yuborildi' ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-600'}`}>
                          {log.status === 'Yuborildi' ? <Check size={10} /> : <X size={10} />}{log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Summer Leave */}
      {activeTab === 'summer' && (
        <div className="space-y-5">
          {/* Formula card */}
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-teal-800 mb-3 flex items-center gap-2">
              <BookOpen size={16} />Yozgi Ta'til Hisobi Formulasi
            </h3>
            <div className="bg-white rounded-xl p-4 border border-teal-100 mb-4">
              <p className="text-sm font-mono text-gray-700 text-center">
                Asosiy maosh × (Ta'til kunlari / {WORKING_DAYS} ish kuni) × Tajriba koeffitsienti
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: '< 2 yil tajriba', coeff: '× 1.0', color: 'bg-gray-100 text-gray-700' },
                { label: '2–5 yil tajriba', coeff: '× 1.1', color: 'bg-teal-100 text-teal-700' },
                { label: '5–10 yil tajriba', coeff: '× 1.2', color: 'bg-emerald-100 text-emerald-700' },
                { label: '> 10 yil tajriba', coeff: '× 1.5', color: 'bg-green-100 text-green-800' },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-xl ${item.color} text-center`}>
                  <p className="text-lg font-bold">{item.coeff}</p>
                  <p className="text-xs mt-1 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summer payroll table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Yozgi Ta'til To'lovi Jadvali</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm">
                <Download size={15} />Excel yuklash
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["O'qituvchi", 'Tajriba (yil)', 'Asosiy maosh', "Ta'til kunlari", 'Koeffitsient', 'Hisoblangan summa'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {summerRows.map((row, i) => (
                    <tr key={i} className="hover:bg-teal-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {row.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-medium text-gray-800">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">{row.experience}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${row.experience >= 10 ? 'bg-green-100 text-green-700' : row.experience >= 5 ? 'bg-teal-100 text-teal-700' : row.experience >= 2 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                            {row.experience >= 10 ? 'Senior' : row.experience >= 5 ? 'O\'rta' : row.experience >= 2 ? 'Junior' : 'Yangi'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-gray-700">{formatUZS(row.baseSalary)}</td>
                      <td className="px-4 py-3.5 text-center font-semibold text-teal-700">{row.vacationDays} kun</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`font-bold text-base ${row.coeff === 1.5 ? 'text-green-600' : row.coeff === 1.2 ? 'text-teal-600' : row.coeff === 1.1 ? 'text-blue-600' : 'text-gray-600'}`}>×{row.coeff.toFixed(1)}</span>
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-teal-700">{formatUZS(row.calculated)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-teal-50 border-t-2 border-teal-200">
                    <td colSpan={5} className="px-4 py-4 font-bold text-gray-800 text-right">Jami yozgi ta'til to'lovi:</td>
                    <td className="px-4 py-4 font-mono font-bold text-teal-700 text-lg">{formatUZS(totalSummer)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
