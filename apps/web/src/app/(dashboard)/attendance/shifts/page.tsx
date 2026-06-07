'use client';

import { useState, useRef, useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Save, Plus, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

type ShiftType = 'ertalab' | 'kunduz' | 'kechki' | 'tungi' | 'dam' | 'tatil';

interface Employee {
  id: string;
  name: string;
  dept: string;
  initials: string;
  avatarColor: string;
}

interface DragSource {
  empId: string;
  dayIndex: number;
}

type Schedule = Record<string, Record<number, ShiftType>>;

// ─── Constants ───────────────────────────────────────────────────────────────

const SHIFT_META: Record<
  ShiftType,
  { label: string; time: string; icon: string; bg: string; text: string; border: string; pill: string }
> = {
  ertalab: {
    label: 'Ertalab',
    time: '08:00–16:00',
    icon: '🌅',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    pill: 'bg-blue-100 text-blue-800 border border-blue-200',
  },
  kunduz: {
    label: 'Kunduz',
    time: '12:00–20:00',
    icon: '☀️',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    pill: 'bg-amber-100 text-amber-800 border border-amber-200',
  },
  kechki: {
    label: 'Kechki',
    time: '16:00–00:00',
    icon: '🌙',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    pill: 'bg-purple-100 text-purple-800 border border-purple-200',
  },
  tungi: {
    label: 'Tungi',
    time: '00:00–08:00',
    icon: '🌛',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    pill: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  },
  dam: {
    label: 'Dam olish',
    time: '—',
    icon: '🏖️',
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    pill: 'bg-gray-100 text-gray-700 border border-gray-200',
  },
  tatil: {
    label: "Ta'til",
    time: '—',
    icon: '📋',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    pill: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  },
};

const SHIFT_TYPES = Object.keys(SHIFT_META) as ShiftType[];

const DAYS = [
  { short: 'Dush', full: 'Dushanba' },
  { short: 'Sesh', full: 'Seshanba' },
  { short: 'Chor', full: 'Chorshanba' },
  { short: 'Pay', full: 'Payshanba' },
  { short: 'Juma', full: 'Juma' },
  { short: 'Shan', full: "Shanba" },
  { short: 'Yak', full: 'Yakshanba' },
];

// Week: 2–8 June 2026
const WEEK_DATES = [2, 3, 4, 5, 6, 7, 8];
const WEEK_LABEL = '2–8 Iyun 2026';

const DEPARTMENTS = ['Barchasi', 'IT', 'HR', 'Savdo', 'Buxgalteriya', 'Ishlab chiqarish'];

const AVATAR_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-red-600',
  'from-cyan-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-green-500 to-emerald-600',
];

const EMPLOYEES: Employee[] = [
  { id: 'e1',  name: 'Alisher Nazarov',    dept: 'IT',               initials: 'AN', avatarColor: AVATAR_COLORS[0] },
  { id: 'e2',  name: 'Kamola Yusupova',    dept: 'HR',               initials: 'KY', avatarColor: AVATAR_COLORS[1] },
  { id: 'e3',  name: 'Jasur Toshmatov',    dept: 'Savdo',            initials: 'JT', avatarColor: AVATAR_COLORS[2] },
  { id: 'e4',  name: 'Malika Rahimova',    dept: 'Buxgalteriya',     initials: 'MR', avatarColor: AVATAR_COLORS[3] },
  { id: 'e5',  name: 'Bobur Ergashev',     dept: 'IT',               initials: 'BE', avatarColor: AVATAR_COLORS[4] },
  { id: 'e6',  name: 'Nilufar Karimova',   dept: 'HR',               initials: 'NK', avatarColor: AVATAR_COLORS[5] },
  { id: 'e7',  name: 'Sherzod Mirzayev',   dept: 'Savdo',            initials: 'SM', avatarColor: AVATAR_COLORS[6] },
  { id: 'e8',  name: 'Zulfiya Holmatova',  dept: 'Ishlab chiqarish', initials: 'ZH', avatarColor: AVATAR_COLORS[7] },
  { id: 'e9',  name: 'Sardor Qodirov',     dept: 'IT',               initials: 'SQ', avatarColor: AVATAR_COLORS[0] },
  { id: 'e10', name: 'Mohira Sultanova',   dept: 'Buxgalteriya',     initials: 'MS', avatarColor: AVATAR_COLORS[1] },
  { id: 'e11', name: 'Dilnoza Botirov',    dept: 'Savdo',            initials: 'DB', avatarColor: AVATAR_COLORS[2] },
  { id: 'e12', name: 'Timur Nazarov',      dept: 'Ishlab chiqarish', initials: 'TN', avatarColor: AVATAR_COLORS[3] },
  { id: 'e13', name: 'Feruza Yusupova',    dept: 'HR',               initials: 'FY', avatarColor: AVATAR_COLORS[4] },
  { id: 'e14', name: 'Akbar Tashmatov',    dept: 'IT',               initials: 'AT', avatarColor: AVATAR_COLORS[5] },
  { id: 'e15', name: 'Gulnora Ergasheva',  dept: 'Ishlab chiqarish', initials: 'GE', avatarColor: AVATAR_COLORS[6] },
];

// ─── Initial schedule generator ──────────────────────────────────────────────

function buildInitialSchedule(): Schedule {
  const weekdayShifts: ShiftType[] = ['ertalab', 'ertalab', 'ertalab', 'kunduz', 'kunduz', 'kechki', 'tungi'];
  const schedule: Schedule = {};

  EMPLOYEES.forEach((emp, ei) => {
    schedule[emp.id] = {};
    WEEK_DATES.forEach((_, di) => {
      const isWeekend = di >= 5; // Sat / Sun
      if (isWeekend) {
        // ~60% chance of dam olish on weekends
        const roll = (ei * 7 + di * 3) % 10;
        schedule[emp.id][di] = roll < 6 ? 'dam' : weekdayShifts[(ei + di) % weekdayShifts.length];
      } else {
        schedule[emp.id][di] = weekdayShifts[(ei * 3 + di) % weekdayShifts.length];
      }
    });
  });

  return schedule;
}

// ─── Shift Cell Component ─────────────────────────────────────────────────────

interface ShiftCellProps {
  empId: string;
  dayIndex: number;
  shift: ShiftType;
  isOpen: boolean;
  isDragOver: boolean;
  onCellClick: (empId: string, dayIndex: number) => void;
  onShiftChange: (empId: string, dayIndex: number, shift: ShiftType) => void;
  onClose: () => void;
  onDragStart: (empId: string, dayIndex: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (empId: string, dayIndex: number) => void;
  onDragEnter: (empId: string, dayIndex: number) => void;
  onDragLeave: () => void;
}

function ShiftCell({
  empId, dayIndex, shift, isOpen, isDragOver,
  onCellClick, onShiftChange, onClose,
  onDragStart, onDragOver, onDrop, onDragEnter, onDragLeave,
}: ShiftCellProps) {
  const meta = SHIFT_META[shift];

  return (
    <td
      className={cn(
        'relative px-2 py-2 text-center align-middle transition-colors',
        isDragOver && 'bg-blue-50/70 ring-2 ring-inset ring-blue-400 rounded-lg',
      )}
      onDragOver={(e) => { e.preventDefault(); onDragOver(e); }}
      onDrop={(e) => { e.preventDefault(); onDrop(empId, dayIndex); }}
      onDragEnter={() => onDragEnter(empId, dayIndex)}
      onDragLeave={onDragLeave}
    >
      {/* Shift pill — draggable */}
      <div
        draggable
        onDragStart={() => onDragStart(empId, dayIndex)}
        onClick={() => onCellClick(empId, dayIndex)}
        className={cn(
          'inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold cursor-grab active:cursor-grabbing select-none',
          'transition-all duration-150 hover:scale-105 hover:shadow-sm',
          meta.pill,
        )}
        title={`${meta.icon} ${meta.label} ${meta.time}`}
      >
        <span>{meta.icon}</span>
        <span className="hidden sm:inline">{meta.label}</span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={onClose}
          />
          <div className="absolute z-40 top-full left-1/2 -translate-x-1/2 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden">
            <div className="px-3 py-1.5 border-b border-gray-50">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Smena tanlash</p>
            </div>
            {SHIFT_TYPES.map((s) => {
              const m = SHIFT_META[s];
              return (
                <button
                  key={s}
                  onClick={(e) => { e.stopPropagation(); onShiftChange(empId, dayIndex, s); }}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-medium transition-colors',
                    s === shift
                      ? `${m.bg} ${m.text} font-semibold`
                      : 'text-gray-700 hover:bg-gray-50',
                  )}
                >
                  <span className="text-base leading-none">{m.icon}</span>
                  <div>
                    <div>{m.label}</div>
                    {m.time !== '—' && <div className="text-[10px] opacity-60">{m.time}</div>}
                  </div>
                  {s === shift && (
                    <span className="ml-auto text-current opacity-70">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </td>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ShiftsPage() {
  const [schedule, setSchedule] = useState<Schedule>(buildInitialSchedule);
  const [deptFilter, setDeptFilter] = useState('Barchasi');
  const [openCell, setOpenCell] = useState<{ empId: string; dayIndex: number } | null>(null);
  const [dragSource, setDragSource] = useState<DragSource | null>(null);
  const [dragOverCell, setDragOverCell] = useState<{ empId: string; dayIndex: number } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // ── Filter ──────────────────────────────────────────────────────────────────
  const visibleEmployees = deptFilter === 'Barchasi'
    ? EMPLOYEES
    : EMPLOYEES.filter(e => e.dept === deptFilter);

  // ── Cell interactions ───────────────────────────────────────────────────────
  const handleCellClick = useCallback((empId: string, dayIndex: number) => {
    setOpenCell(prev =>
      prev?.empId === empId && prev?.dayIndex === dayIndex ? null : { empId, dayIndex },
    );
  }, []);

  const handleShiftChange = useCallback((empId: string, dayIndex: number, shift: ShiftType) => {
    setSchedule(prev => ({
      ...prev,
      [empId]: { ...prev[empId], [dayIndex]: shift },
    }));
    setOpenCell(null);
    setHasChanges(true);
  }, []);

  // ── Drag & Drop ─────────────────────────────────────────────────────────────
  const handleDragStart = useCallback((empId: string, dayIndex: number) => {
    setDragSource({ empId, dayIndex });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDragEnter = useCallback((empId: string, dayIndex: number) => {
    setDragOverCell({ empId, dayIndex });
  }, []);

  const handleDragLeave = useCallback(() => {
    // Delayed clear to avoid flicker when entering child element
    setDragOverCell(null);
  }, []);

  const handleDrop = useCallback((targetEmpId: string, targetDayIndex: number) => {
    if (!dragSource) return;
    const { empId: srcEmpId, dayIndex: srcDayIndex } = dragSource;
    if (srcEmpId === targetEmpId && srcDayIndex === targetDayIndex) {
      setDragSource(null);
      setDragOverCell(null);
      return;
    }

    const sourceShift = schedule[srcEmpId]?.[srcDayIndex];
    if (!sourceShift) return;

    setSchedule(prev => ({
      ...prev,
      [targetEmpId]: { ...prev[targetEmpId], [targetDayIndex]: sourceShift },
    }));
    setDragSource(null);
    setDragOverCell(null);
    setHasChanges(true);

    const meta = SHIFT_META[sourceShift];
    toast.success(
      `${meta.icon} ${meta.label} smena ko'chirildi`,
      { duration: 2000, style: { fontSize: '13px' } },
    );
  }, [dragSource, schedule]);

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    toast.success('Smena jadvali saqlandi!', {
      icon: '✅',
      duration: 3000,
      style: { fontSize: '13px', fontWeight: '500' },
    });
    setHasChanges(false);
  }, []);

  // ── Per-day stats ───────────────────────────────────────────────────────────
  const dayStats = DAYS.map((_, di) => {
    const count = visibleEmployees.filter(emp => {
      const s = schedule[emp.id]?.[di];
      return s && s !== 'dam' && s !== 'tatil';
    }).length;
    return count;
  });

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="page-title">Smena Jadvali</h1>
            <p className="page-subtitle">Xodimlar smena taqvimi</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Week navigation */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-1 py-1">
            <button
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
              title="Oldingi hafta"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-sm font-semibold text-gray-700 whitespace-nowrap">
              {WEEK_LABEL}
            </span>
            <button
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
              title="Keyingi hafta"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleSave}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
              hasChanges
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-400',
            )}
          >
            <Save className="w-4 h-4" />
            Saqlash
            {hasChanges && (
              <span className="w-2 h-2 rounded-full bg-white/80 inline-block" />
            )}
          </button>

          <button className="btn-primary">
            <Plus className="w-4 h-4" />
            Yangi Smena
          </button>
        </div>
      </div>

      {/* ── Shift Legend ── */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Smena turlari:
          </span>
          {SHIFT_TYPES.map((s) => {
            const m = SHIFT_META[s];
            return (
              <span
                key={s}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
                  m.pill,
                )}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
                {m.time !== '—' && (
                  <span className="opacity-60 font-normal">{m.time}</span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Department filter tabs ── */}
      <div className="flex items-center gap-1 flex-wrap">
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept}
            onClick={() => setDeptFilter(dept)}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
              deptFilter === dept
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50',
            )}
          >
            {dept}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {visibleEmployees.length} xodim
        </span>
      </div>

      {/* ── Main grid ── */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: '780px' }}>
            {/* Header row */}
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                {/* Employee col */}
                <th
                  className="sticky left-0 z-20 bg-gray-50/80 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-100"
                  style={{ minWidth: '190px' }}
                >
                  Xodim
                </th>
                {DAYS.map((day, di) => (
                  <th
                    key={di}
                    className="px-2 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    style={{ minWidth: '108px' }}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span
                        className={cn(
                          'text-base font-bold',
                          di >= 5 ? 'text-rose-500' : 'text-gray-800',
                        )}
                      >
                        {WEEK_DATES[di]}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-semibold tracking-wider',
                          di >= 5 ? 'text-rose-400' : 'text-gray-400',
                        )}
                      >
                        {day.short}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-50">
              {visibleEmployees.map((emp, rowIdx) => (
                <tr
                  key={emp.id}
                  className={cn(
                    'transition-colors',
                    rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30',
                    'hover:bg-blue-50/20',
                  )}
                >
                  {/* Employee cell */}
                  <td
                    className="sticky left-0 z-10 px-4 py-2.5 border-r border-gray-100 bg-inherit"
                    style={{ minWidth: '190px' }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full bg-gradient-to-br flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm',
                          emp.avatarColor,
                        )}
                      >
                        {emp.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-800 truncate leading-tight">
                          {emp.name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium mt-0.5">{emp.dept}</div>
                      </div>
                    </div>
                  </td>

                  {/* Shift cells */}
                  {DAYS.map((_, di) => {
                    const shift = schedule[emp.id]?.[di] ?? 'dam';
                    const isOpen = openCell?.empId === emp.id && openCell?.dayIndex === di;
                    const isDragOver =
                      dragOverCell?.empId === emp.id && dragOverCell?.dayIndex === di &&
                      !(dragSource?.empId === emp.id && dragSource?.dayIndex === di);

                    return (
                      <ShiftCell
                        key={di}
                        empId={emp.id}
                        dayIndex={di}
                        shift={shift}
                        isOpen={isOpen}
                        isDragOver={isDragOver}
                        onCellClick={handleCellClick}
                        onShiftChange={handleShiftChange}
                        onClose={() => setOpenCell(null)}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                      />
                    );
                  })}
                </tr>
              ))}

              {visibleEmployees.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                    Bu bo'limda xodimlar topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Drag hint */}
        <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/50">
          <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <span>💡</span>
            Smena ko'chirish: qatorni sudrab olib boshqa katakchaga tashlang • O'zgartirish uchun katakchani bosing
          </p>
        </div>
      </div>

      {/* ── Bottom stats bar ── */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Kunlik faol xodimlar:
          </span>
          {DAYS.map((day, di) => (
            <div key={di} className="flex items-center gap-1.5">
              <span
                className={cn(
                  'text-xs font-bold',
                  di >= 5 ? 'text-rose-500' : 'text-gray-700',
                )}
              >
                {day.short}:
              </span>
              <span
                className={cn(
                  'text-xs font-semibold px-2 py-0.5 rounded-full',
                  dayStats[di] >= 10
                    ? 'bg-emerald-50 text-emerald-700'
                    : dayStats[di] >= 5
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-600',
                )}
              >
                {dayStats[di]} xodim
              </span>
              {di < DAYS.length - 1 && (
                <span className="text-gray-200 text-sm select-none">|</span>
              )}
            </div>
          ))}
          <div className="ml-auto flex items-center gap-3 text-xs text-gray-400">
            <span>
              Jami:{' '}
              <strong className="text-gray-700">
                {visibleEmployees.length * 7}
              </strong>{' '}
              ta yacheyka
            </span>
            {hasChanges && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                Saqlanmagan o'zgarishlar
              </span>
            )}
          </div>
        </div>

        {/* Per-shift breakdown */}
        <div className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-2">
          {SHIFT_TYPES.map((s) => {
            const m = SHIFT_META[s];
            const total = visibleEmployees.reduce((acc, emp) => {
              return acc + DAYS.filter((_, di) => schedule[emp.id]?.[di] === s).length;
            }, 0);
            return (
              <div
                key={s}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium',
                  m.bg, m.text,
                )}
              >
                <span>{m.icon}</span>
                <span>{m.label}:</span>
                <span className="font-bold">{total}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
