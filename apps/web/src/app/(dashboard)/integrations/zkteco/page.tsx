'use client';

import { useState } from 'react';
import {
  Fingerprint,
  Wifi,
  WifiOff,
  RefreshCw,
  Plus,
  Settings,
  FlaskConical,
  CheckCircle,
  XCircle,
  Loader2,
  Activity,
  Users,
  Clock,
  Server,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type TerminalStatus = 'Online' | 'Offline';

interface Terminal {
  id: string;
  name: string;
  location: string;
  ip: string;
  model: string;
  status: TerminalStatus;
  lastSync: string;
  enrolledCount: number;
}

interface SyncLog {
  id: string;
  terminal: string;
  time: string;
  records: number;
  status: 'OK' | 'Xato';
}

const ZK_MODELS = [
  'ZKTeco K40',
  'ZKTeco K80',
  'ZKTeco K20',
  'ZKTeco F22',
  'ZKTeco MA300',
  'ZK9500',
  'iClock760',
  'iClock580',
];

// ─── Initial demo data ────────────────────────────────────────────────────────

const INITIAL_TERMINALS: Terminal[] = [
  { id: 't1', name: 'Terminal #1', location: 'Asosiy kirish',  ip: '192.168.1.101', model: 'ZKTeco K40',   status: 'Online',  lastSync: '5 daqiqa oldin',  enrolledCount: 245 },
  { id: 't2', name: 'Terminal #2', location: 'Orqa eshik',      ip: '192.168.1.102', model: 'ZKTeco K80',   status: 'Online',  lastSync: '3 daqiqa oldin',  enrolledCount: 198 },
  { id: 't3', name: 'Terminal #3', location: '2-qavat',          ip: '192.168.1.103', model: 'ZK9500',       status: 'Online',  lastSync: '8 daqiqa oldin',  enrolledCount: 156 },
  { id: 't4', name: 'Terminal #4', location: 'Ombor',            ip: '192.168.1.104', model: 'iClock760',    status: 'Offline', lastSync: '2 soat oldin',    enrolledCount:  67 },
  { id: 't5', name: 'Terminal #5', location: 'Kafe',             ip: '192.168.1.105', model: 'ZKTeco F22',   status: 'Online',  lastSync: '1 daqiqa oldin',  enrolledCount:  43 },
  { id: 't6', name: 'Terminal #6', location: 'Xavfsizlik',       ip: '192.168.1.106', model: 'ZKTeco MA300', status: 'Offline', lastSync: '1 kun oldin',     enrolledCount:  12 },
];

const INITIAL_LOGS: SyncLog[] = [
  { id: 'sl1',  terminal: 'Terminal #1', time: '10:32', records: 124, status: 'OK'   },
  { id: 'sl2',  terminal: 'Terminal #2', time: '10:30', records:  98, status: 'OK'   },
  { id: 'sl3',  terminal: 'Terminal #3', time: '10:28', records:  76, status: 'OK'   },
  { id: 'sl4',  terminal: 'Terminal #4', time: '08:15', records:   0, status: 'Xato' },
  { id: 'sl5',  terminal: 'Terminal #5', time: '10:35', records:  41, status: 'OK'   },
  { id: 'sl6',  terminal: 'Terminal #6', time: '09:00', records:   0, status: 'Xato' },
  { id: 'sl7',  terminal: 'Terminal #1', time: '09:02', records: 110, status: 'OK'   },
  { id: 'sl8',  terminal: 'Terminal #2', time: '08:58', records:  87, status: 'OK'   },
  { id: 'sl9',  terminal: 'Terminal #3', time: '08:55', records:  69, status: 'OK'   },
  { id: 'sl10', terminal: 'Terminal #5', time: '08:50', records:  38, status: 'OK'   },
];

// ─── Add Terminal Modal ───────────────────────────────────────────────────────

function AddTerminalModal({ onClose, onAdd }: { onClose: () => void; onAdd: (t: Terminal) => void }) {
  const [form, setForm] = useState({ name: '', ip: '', port: '4370', model: ZK_MODELS[0], location: '' });
  const [testing, setTesting]       = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleTest = async () => {
    if (!form.ip) { toast.error("IP manzilni kiriting"); return; }
    setTesting(true);
    setTestResult(null);
    await new Promise<void>((r) => setTimeout(r, 1800));
    const ok = Math.random() > 0.35;
    setTestResult(ok);
    setTesting(false);
    if (ok) toast.success(`${form.ip} — ulanish muvaffaqiyatli!`);
    else     toast.error(`${form.ip} — ulanib bo'lmadi`);
  };

  const handleSave = () => {
    if (!form.name || !form.ip || !form.location) {
      toast.error("Barcha maydonlarni to'ldiring");
      return;
    }
    const newTerminal: Terminal = {
      id: `t${Date.now()}`,
      name: form.name,
      location: form.location,
      ip: form.ip,
      model: form.model,
      status: 'Offline',
      lastSync: "Hali sinxronlanmagan",
      enrolledCount: 0,
    };
    onAdd(newTerminal);
    toast.success(`${form.name} qo'shildi`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Fingerprint className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Terminal qo'shish</h2>
              <p className="text-xs text-gray-500 mt-0.5">ZKTeco qurilmasini ulash</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none font-light">×</button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Terminal nomi</label>
            <input
              type="text"
              placeholder="Terminal #7"
              value={form.name}
              onChange={set('name')}
              className="input-field w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">IP manzil</label>
              <input
                type="text"
                placeholder="192.168.1.110"
                value={form.ip}
                onChange={set('ip')}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Port</label>
              <input
                type="number"
                placeholder="4370"
                value={form.port}
                onChange={set('port')}
                className="input-field w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Model tanlash</label>
            <select value={form.model} onChange={set('model')} className="input-field w-full">
              {ZK_MODELS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Joylashuv</label>
            <input
              type="text"
              placeholder="Asosiy kirish"
              value={form.location}
              onChange={set('location')}
              className="input-field w-full"
            />
          </div>

          {testResult !== null && (
            <div className={cn(
              'flex items-center gap-2 p-3 rounded-lg text-sm',
              testResult ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700',
            )}>
              {testResult
                ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                : <XCircle     className="w-4 h-4 flex-shrink-0" />}
              {testResult
                ? 'Ulanish muvaffaqiyatli! Terminal tayyor.'
                : "Ulanib bo'lmadi. IP manzil va portni tekshiring."}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleTest}
            disabled={testing}
            className="btn-secondary text-sm disabled:opacity-60 flex items-center gap-2"
          >
            {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FlaskConical className="w-4 h-4" />}
            {testing ? 'Tekshirilmoqda...' : 'Test ulanish'}
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-secondary text-sm">Bekor</button>
            <button onClick={handleSave} className="btn-primary text-sm">Saqlash</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Terminal Card ────────────────────────────────────────────────────────────

function TerminalCard({
  terminal,
  syncing,
  onSync,
  onTest,
  onConfigure,
}: {
  terminal: Terminal;
  syncing: boolean;
  onSync: () => void;
  onTest: () => void;
  onConfigure: () => void;
}) {
  const online = terminal.status === 'Online';

  return (
    <div className={cn(
      'card p-5 border-l-4 transition-all',
      online ? 'border-l-green-500' : 'border-l-red-400',
    )}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            online ? 'bg-green-50' : 'bg-gray-100',
          )}>
            <Fingerprint className={cn('w-5 h-5', online ? 'text-green-600' : 'text-gray-400')} />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 text-sm leading-snug truncate">
              {terminal.name}
            </div>
            <div className="text-xs text-gray-500 truncate">{terminal.location}</div>
          </div>
        </div>

        {/* Status badge */}
        <span className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0',
          online
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-600',
        )}>
          {online
            ? <Wifi    className="w-3 h-3" />
            : <WifiOff className="w-3 h-3" />}
          {terminal.status}
        </span>
      </div>

      {/* Meta grid */}
      <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Server  className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="truncate">{terminal.ip}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="truncate">{terminal.model}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="truncate">{terminal.lastSync}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span>{terminal.enrolledCount} xodim</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={onSync}
          disabled={syncing || !online}
          className={cn(
            'flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
            online && !syncing
              ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
              : 'border-gray-100 text-gray-400 cursor-not-allowed bg-gray-50',
          )}
        >
          {syncing
            ? <Loader2  className="w-3.5 h-3.5 animate-spin" />
            : <RefreshCw className="w-3.5 h-3.5" />}
          {syncing ? 'Sinxronlanmoqda...' : 'Sinxronlash'}
        </button>

        <button
          onClick={onTest}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
        >
          <FlaskConical className="w-3.5 h-3.5" />
          Test
        </button>

        <button
          onClick={onConfigure}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
        >
          <Settings className="w-3.5 h-3.5" />
          Sozlash
        </button>
      </div>
    </div>
  );
}

// ─── Sync Log Table ───────────────────────────────────────────────────────────

function SyncLogTable({ logs }: { logs: SyncLog[] }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-sm text-gray-900">Sinxronlash tarixi</h3>
        <span className="text-xs text-gray-400">Oxirgi {logs.length} ta yozuv</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 text-gray-500 font-medium">
              <th className="px-4 py-3 text-left">Terminal</th>
              <th className="px-4 py-3 text-left">Vaqt</th>
              <th className="px-4 py-3 text-right">Yozuvlar soni</th>
              <th className="px-4 py-3 text-center">Holat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800">{log.terminal}</td>
                <td className="px-4 py-3 text-gray-500">{log.time}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-700">
                  {log.status === 'OK' ? log.records : '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium',
                    log.status === 'OK'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600',
                  )}>
                    {log.status === 'OK'
                      ? <CheckCircle className="w-3 h-3" />
                      : <XCircle     className="w-3 h-3" />}
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ZKTecoPage() {
  const [terminals, setTerminals]       = useState<Terminal[]>(INITIAL_TERMINALS);
  const [logs, setLogs]                 = useState<SyncLog[]>(INITIAL_LOGS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [syncingIds, setSyncingIds]     = useState<Set<string>>(new Set());
  const [syncingAll, setSyncingAll]     = useState(false);

  const onlineCount  = terminals.filter((t) => t.status === 'Online').length;
  const offlineCount = terminals.filter((t) => t.status === 'Offline').length;
  const totalSynced  = logs.filter((l) => l.status === 'OK').reduce((acc, l) => acc + l.records, 0);

  // ── Single terminal sync ──────────────────────────────────────────────────
  const handleSync = async (terminal: Terminal) => {
    if (terminal.status === 'Offline') { toast.error(`${terminal.name} offline — ulanib bo'lmadi`); return; }

    setSyncingIds((prev) => new Set(prev).add(terminal.id));
    const toastId = toast.loading(`${terminal.name} sinxronlanmoqda...`);

    await new Promise<void>((r) => setTimeout(r, 1500 + Math.random() * 1000));

    const ok = Math.random() > 0.1;
    const records = ok ? Math.floor(20 + Math.random() * 80) : 0;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newLog: SyncLog = {
      id: `sl${Date.now()}`,
      terminal: terminal.name,
      time: timeStr,
      records,
      status: ok ? 'OK' : 'Xato',
    };

    setLogs((prev) => [newLog, ...prev].slice(0, 10));

    if (ok) {
      setTerminals((prev) =>
        prev.map((t) => t.id === terminal.id ? { ...t, lastSync: '1 daqiqa oldin' } : t),
      );
      toast.success(`${terminal.name}: ${records} ta yozuv sinxronlandi`, { id: toastId });
    } else {
      toast.error(`${terminal.name}: sinxronlash xatosi`, { id: toastId });
    }

    setSyncingIds((prev) => { const next = new Set(prev); next.delete(terminal.id); return next; });
  };

  // ── Test connection ───────────────────────────────────────────────────────
  const handleTest = async (terminal: Terminal) => {
    const toastId = toast.loading(`${terminal.name} — ulanish tekshirilmoqda...`);
    await new Promise<void>((r) => setTimeout(r, 1200 + Math.random() * 800));
    const ok = terminal.status === 'Online' ? Math.random() > 0.05 : Math.random() > 0.7;

    if (ok) {
      setTerminals((prev) =>
        prev.map((t) => t.id === terminal.id ? { ...t, status: 'Online' } : t),
      );
      toast.success(`${terminal.name}: ulanish muvaffaqiyatli`, { id: toastId });
    } else {
      toast.error(`${terminal.name}: ulanib bo'lmadi`, { id: toastId });
    }
  };

  // ── Configure (stub) ──────────────────────────────────────────────────────
  const handleConfigure = (terminal: Terminal) => {
    toast(`${terminal.name} sozlamalari tez orada qo'shiladi`, { icon: 'ℹ️' });
  };

  // ── Sync all online terminals ─────────────────────────────────────────────
  const handleSyncAll = async () => {
    const onlineTerminals = terminals.filter((t) => t.status === 'Online');
    if (onlineTerminals.length === 0) { toast.error("Hech qanday online terminal yo'q"); return; }

    setSyncingAll(true);
    const toastId = toast.loading(`${onlineTerminals.length} ta terminal sinxronlanmoqda...`);

    // Fire syncs with staggered delays
    const newLogs: SyncLog[] = [];
    const now = new Date();

    await Promise.all(
      onlineTerminals.map(async (t, i) => {
        setSyncingIds((prev) => new Set(prev).add(t.id));
        await new Promise<void>((r) => setTimeout(r, i * 400 + Math.random() * 600));

        const ok = Math.random() > 0.08;
        const records = ok ? Math.floor(20 + Math.random() * 80) : 0;
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        newLogs.push({ id: `sl${Date.now()}-${i}`, terminal: t.name, time: timeStr, records, status: ok ? 'OK' : 'Xato' });

        if (ok) {
          setTerminals((prev) =>
            prev.map((terminal) => terminal.id === t.id ? { ...terminal, lastSync: '1 daqiqa oldin' } : terminal),
          );
        }

        setSyncingIds((prev) => { const next = new Set(prev); next.delete(t.id); return next; });
      }),
    );

    const successCount = newLogs.filter((l) => l.status === 'OK').length;
    const totalRecords = newLogs.reduce((acc, l) => acc + l.records, 0);

    setLogs((prev) => [...newLogs, ...prev].slice(0, 10));
    toast.success(`${successCount}/${onlineTerminals.length} terminal — ${totalRecords} yozuv sinxronlandi`, { id: toastId });
    setSyncingAll(false);
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Fingerprint className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="page-title">ZKTeco Terminal Integratsiyasi</h1>
            <p className="page-subtitle">Biometrik qurilmalarni ulang va sinxronlang</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleSyncAll}
            disabled={syncingAll}
            className="btn-secondary text-sm disabled:opacity-60 flex items-center gap-2"
          >
            {syncingAll
              ? <Loader2   className="w-4 h-4 animate-spin" />
              : <RefreshCw className="w-4 h-4" />}
            {syncingAll ? 'Sinxronlanmoqda...' : 'Hammasini sinxronlash'}
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Terminal qo'shish
          </button>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Jami terminallar',
            value: terminals.length,
            color: 'text-gray-900',
            icon: <Server className="w-4 h-4 text-gray-400" />,
          },
          {
            label: 'Online',
            value: onlineCount,
            color: 'text-green-600',
            icon: <Wifi className="w-4 h-4 text-green-500" />,
          },
          {
            label: 'Offline',
            value: offlineCount,
            color: 'text-red-500',
            icon: <WifiOff className="w-4 h-4 text-red-400" />,
          },
          {
            label: "Bugungi sinxronlashlar",
            value: totalSynced + 847,
            color: 'text-blue-600',
            icon: <Activity className="w-4 h-4 text-blue-400" />,
          },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              {s.icon}
            </div>
            <p className={cn('text-2xl font-bold mt-2', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Terminals grid ── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Terminallar</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {terminals.map((terminal) => (
            <TerminalCard
              key={terminal.id}
              terminal={terminal}
              syncing={syncingIds.has(terminal.id)}
              onSync={() => handleSync(terminal)}
              onTest={() => handleTest(terminal)}
              onConfigure={() => handleConfigure(terminal)}
            />
          ))}
        </div>
      </div>

      {/* ── Sync log table ── */}
      <SyncLogTable logs={logs} />

      {/* ── Add Terminal Modal ── */}
      {showAddModal && (
        <AddTerminalModal
          onClose={() => setShowAddModal(false)}
          onAdd={(t) => setTerminals((prev) => [...prev, t])}
        />
      )}
    </div>
  );
}
