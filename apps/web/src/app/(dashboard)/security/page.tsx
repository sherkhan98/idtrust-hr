'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Shield, AlertTriangle, Activity, Clock, Download, RefreshCw,
  Search, Filter, Eye, CheckCircle, XCircle, Globe, Lock,
  Database, FileText, ToggleLeft, ToggleRight, ChevronDown, Server,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type AlertStatus = 'New' | 'Investigating' | 'Resolved';
type ActionType = 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'VIEW';

interface SecurityAlert {
  id: string;
  time: string;
  user: string;
  action: string;
  ip: string;
  location: string;
  risk: RiskLevel;
  status: AlertStatus;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  actionType: ActionType;
  resource: string;
  ip: string;
  userAgent: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_ALERTS: SecurityAlert[] = [
  { id: 'a1', time: '03:14', user: 'Alisher Toshmatov', action: 'Login attempt at unusual hour', ip: '91.185.12.44', location: 'Toshkent', risk: 'CRITICAL', status: 'New' },
  { id: 'a2', time: '09:42', user: 'Jasur Nazarov', action: '127 files downloaded in 2 min', ip: '95.130.20.11', location: 'Toshkent', risk: 'HIGH', status: 'Investigating' },
  { id: 'a3', time: '11:05', user: 'Malika Yusupova', action: 'Password changed 3 times in 5 min', ip: '84.54.100.22', location: 'Toshkent', risk: 'HIGH', status: 'New' },
  { id: 'a4', time: '13:28', user: 'Bobur Rahimov', action: 'Login from new device', ip: '212.67.88.99', location: 'Samarqand', risk: 'MEDIUM', status: 'Investigating' },
  { id: 'a5', time: '14:51', user: 'Zulfiya Karimova', action: '5 consecutive failed login attempts', ip: '178.218.44.5', location: 'Toshkent', risk: 'MEDIUM', status: 'New' },
  { id: 'a6', time: '08:15', user: 'Dilnoza Hasanova', action: 'Standard document access', ip: '192.168.1.45', location: 'Toshkent', risk: 'LOW', status: 'Resolved' },
  { id: 'a7', time: '10:30', user: 'Nodir Ergashev', action: 'Employee record viewed', ip: '192.168.1.102', location: 'Toshkent', risk: 'LOW', status: 'Resolved' },
  { id: 'a8', time: '11:45', user: 'Sarvar Umarov', action: 'Report exported (authorized)', ip: '192.168.1.78', location: 'Toshkent', risk: 'LOW', status: 'Resolved' },
  { id: 'a9', time: '16:22', user: 'Kamola Mirova', action: 'Settings page accessed', ip: '192.168.1.55', location: 'Farg\'ona', risk: 'LOW', status: 'Resolved' },
];

const AUDIT_LOG: AuditEntry[] = [
  { id: 'l1', timestamp: '2024-06-18 08:01:12', user: 'Alisher Toshmatov', actionType: 'LOGIN', resource: 'Auth System', ip: '192.168.1.45', userAgent: 'Chrome 125 / Windows 11' },
  { id: 'l2', timestamp: '2024-06-18 08:15:33', user: 'Alisher Toshmatov', actionType: 'VIEW', resource: 'Employee #042', ip: '192.168.1.45', userAgent: 'Chrome 125 / Windows 11' },
  { id: 'l3', timestamp: '2024-06-18 08:44:05', user: 'Malika Yusupova', actionType: 'LOGIN', resource: 'Auth System', ip: '192.168.1.77', userAgent: 'Safari 17 / macOS' },
  { id: 'l4', timestamp: '2024-06-18 09:02:19', user: 'Malika Yusupova', actionType: 'CREATE', resource: 'Leave Request #211', ip: '192.168.1.77', userAgent: 'Safari 17 / macOS' },
  { id: 'l5', timestamp: '2024-06-18 09:21:44', user: 'Jasur Nazarov', actionType: 'LOGIN', resource: 'Auth System', ip: '95.130.20.11', userAgent: 'Firefox 126 / Ubuntu' },
  { id: 'l6', timestamp: '2024-06-18 09:38:57', user: 'Jasur Nazarov', actionType: 'EXPORT', resource: 'Payroll Report May-2024', ip: '95.130.20.11', userAgent: 'Firefox 126 / Ubuntu' },
  { id: 'l7', timestamp: '2024-06-18 09:42:11', user: 'Jasur Nazarov', actionType: 'EXPORT', resource: 'Employee Directory (CSV)', ip: '95.130.20.11', userAgent: 'Firefox 126 / Ubuntu' },
  { id: 'l8', timestamp: '2024-06-18 10:05:30', user: 'Zulfiya Karimova', actionType: 'UPDATE', resource: 'Employee #018 Salary', ip: '192.168.1.102', userAgent: 'Edge 125 / Windows 10' },
  { id: 'l9', timestamp: '2024-06-18 10:30:00', user: 'Admin', actionType: 'DELETE', resource: 'Draft Announcement #5', ip: '192.168.1.1', userAgent: 'Chrome 125 / Windows 11' },
  { id: 'l10', timestamp: '2024-06-18 11:05:18', user: 'Malika Yusupova', actionType: 'UPDATE', resource: 'Password (self)', ip: '192.168.1.77', userAgent: 'Safari 17 / macOS' },
  { id: 'l11', timestamp: '2024-06-18 11:12:45', user: 'Malika Yusupova', actionType: 'UPDATE', resource: 'Password (self)', ip: '192.168.1.77', userAgent: 'Safari 17 / macOS' },
  { id: 'l12', timestamp: '2024-06-18 11:17:02', user: 'Malika Yusupova', actionType: 'UPDATE', resource: 'Password (self)', ip: '192.168.1.77', userAgent: 'Safari 17 / macOS' },
  { id: 'l13', timestamp: '2024-06-18 13:28:40', user: 'Bobur Rahimov', actionType: 'LOGIN', resource: 'Auth System (new device)', ip: '212.67.88.99', userAgent: 'Chrome 124 / Android 14' },
  { id: 'l14', timestamp: '2024-06-18 14:15:05', user: 'Sarvar Umarov', actionType: 'VIEW', resource: 'Attendance Report Q2', ip: '192.168.1.78', userAgent: 'Chrome 125 / Windows 11' },
  { id: 'l15', timestamp: '2024-06-18 15:55:22', user: 'Admin', actionType: 'LOGOUT', resource: 'Auth System', ip: '192.168.1.1', userAgent: 'Chrome 125 / Windows 11' },
  { id: 'l16', timestamp: '2024-06-18 16:22:10', user: 'Kamola Mirova', actionType: 'VIEW', resource: 'White-label Settings', ip: '192.168.1.55', userAgent: 'Chrome 125 / Windows 11' },
];

const RECENT_DOCS = [
  { id: 'd1', title: 'Mehnat shartnomasi — Sardor Toshmatov', status: 'SIGNED', date: '2024-06-15' },
  { id: 'd2', title: 'Ichki tartib qoidalar 2024', status: 'PENDING', date: '2024-06-17' },
  { id: 'd3', title: 'Bonos buyrug\'i #12', status: 'SIGNED', date: '2024-06-10' },
  { id: 'd4', title: 'NDA — Yangi xodim', status: 'PENDING', date: '2024-06-18' },
  { id: 'd5', title: 'Ta\'til buyrug\'i — Malika Y.', status: 'DRAFT', date: '2024-06-18' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RISK_STYLES: Record<RiskLevel, string> = {
  CRITICAL: 'bg-red-100 text-red-700 border border-red-200',
  HIGH:     'bg-orange-100 text-orange-700 border border-orange-200',
  MEDIUM:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
  LOW:      'bg-green-100 text-green-700 border border-green-200',
};

const STATUS_STYLES: Record<AlertStatus, string> = {
  New:          'bg-blue-50 text-blue-700',
  Investigating:'bg-purple-50 text-purple-700',
  Resolved:     'bg-green-50 text-green-700',
};

const ACTION_STYLES: Record<ActionType, string> = {
  LOGIN:  'bg-blue-50 text-blue-700',
  LOGOUT: 'bg-gray-100 text-gray-600',
  CREATE: 'bg-green-50 text-green-700',
  UPDATE: 'bg-yellow-50 text-yellow-700',
  DELETE: 'bg-red-50 text-red-700',
  EXPORT: 'bg-orange-50 text-orange-700',
  VIEW:   'bg-indigo-50 text-indigo-700',
};

function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tracking-wide', RISK_STYLES[level])}>
      {level}
    </span>
  );
}

function StatusBadge({ status }: { status: AlertStatus }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', STATUS_STYLES[status])}>
      {status}
    </span>
  );
}

function ActionBadge({ type }: { type: ActionType }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono tracking-wide', ACTION_STYLES[type])}>
      {type}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<'anomaly' | 'audit' | 'esignature' | 'residency'>('anomaly');
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [countdown, setCountdown] = useState(30);

  // Audit filters
  const [auditSearch, setAuditSearch] = useState('');
  const [auditAction, setAuditAction] = useState<ActionType | 'ALL'>('ALL');
  const [auditDateFrom, setAuditDateFrom] = useState('2024-06-18');
  const [auditDateTo, setAuditDateTo] = useState('2024-06-18');

  // Data residency
  const [gdprEnabled, setGdprEnabled] = useState(true);
  const [retention, setRetention] = useState('3yr');
  const [backupSchedule, setBackupSchedule] = useState('Daily');
  const [selectedRegion, setSelectedRegion] = useState<string>('UZ');

  const doRefresh = useCallback(() => {
    setLastRefresh(new Date());
    setCountdown(30);
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { doRefresh(); return 30; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, doRefresh]);

  const handleInvestigate = (id: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === id
        ? { ...a, status: a.status === 'New' ? 'Investigating' : a.status === 'Investigating' ? 'Resolved' : 'Resolved' }
        : a
    ));
  };

  const filteredAlerts = riskFilter === 'ALL' ? alerts : alerts.filter(a => a.risk === riskFilter);

  const filteredAudit = AUDIT_LOG.filter(e => {
    const matchSearch = auditSearch === '' ||
      e.user.toLowerCase().includes(auditSearch.toLowerCase()) ||
      e.resource.toLowerCase().includes(auditSearch.toLowerCase());
    const matchAction = auditAction === 'ALL' || e.actionType === auditAction;
    const matchDate = e.timestamp >= auditDateFrom && e.timestamp <= auditDateTo + ' 99:99:99';
    return matchSearch && matchAction && matchDate;
  });

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.risk === 'CRITICAL').length,
    investigating: alerts.filter(a => a.status === 'Investigating').length,
    resolved: alerts.filter(a => a.status === 'Resolved').length,
  };

  const exportCSV = () => {
    const header = 'Timestamp,User,Action Type,Resource,IP,User Agent\n';
    const rows = filteredAudit.map(e =>
      `"${e.timestamp}","${e.user}","${e.actionType}","${e.resource}","${e.ip}","${e.userAgent}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'audit-log.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const TABS = [
    { id: 'anomaly',   label: 'Anomaly Detection', icon: AlertTriangle },
    { id: 'audit',     label: 'Audit Log',          icon: FileText },
    { id: 'esignature',label: 'E-Signature',         icon: Shield },
    { id: 'residency', label: 'Data Residency',      icon: Globe },
  ] as const;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" /> Security & Compliance
          </h1>
          <p className="page-subtitle">Monitor threats, audit activity, and manage data compliance</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(p => !p)}
            className={cn(
              'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-colors',
              autoRefresh
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            )}
          >
            <RefreshCw className={cn('w-4 h-4', autoRefresh && 'animate-spin')} />
            {autoRefresh ? `Auto-refresh ${countdown}s` : 'Auto-refresh'}
          </button>
          <button onClick={doRefresh} className="btn-secondary">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: Anomaly Detection ── */}
      {activeTab === 'anomaly' && (
        <div className="space-y-4">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Events', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50', icon: Activity },
              { label: 'Critical Alerts', value: stats.critical, color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle },
              { label: 'Investigating', value: stats.investigating, color: 'text-purple-600', bg: 'bg-purple-50', icon: Eye },
              { label: 'Resolved', value: stats.resolved, color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
            ].map(s => (
              <div key={s.label} className="stat-card flex items-center gap-4">
                <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', s.bg)}>
                  <s.icon className={cn('w-5 h-5', s.color)} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3">
            <div className="flex gap-2">
              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setRiskFilter(f)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                    riskFilter === f
                      ? f === 'ALL'       ? 'bg-gray-800 text-white'
                        : f === 'CRITICAL'? 'bg-red-600 text-white'
                        : f === 'HIGH'    ? 'bg-orange-500 text-white'
                        : f === 'MEDIUM'  ? 'bg-yellow-500 text-white'
                        :                   'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              Last updated: {lastRefresh.toLocaleTimeString('en-GB')}
            </div>
          </div>

          {/* Alert Table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Time', 'User', 'Action', 'IP Address', 'Location', 'Risk Level', 'Status', 'Action'].map(h => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAlerts.map(alert => (
                  <tr
                    key={alert.id}
                    className={cn(
                      'hover:bg-gray-50/50 transition-colors',
                      alert.risk === 'CRITICAL' && 'bg-red-50/30',
                    )}
                  >
                    <td className="table-cell font-mono text-xs font-medium text-gray-800">{alert.time}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {alert.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{alert.user}</span>
                      </div>
                    </td>
                    <td className="table-cell max-w-xs">
                      <span className="text-sm text-gray-700">{alert.action}</span>
                    </td>
                    <td className="table-cell font-mono text-xs text-gray-600">{alert.ip}</td>
                    <td className="table-cell text-sm text-gray-600">{alert.location}</td>
                    <td className="table-cell"><RiskBadge level={alert.risk} /></td>
                    <td className="table-cell"><StatusBadge status={alert.status} /></td>
                    <td className="table-cell">
                      {alert.status !== 'Resolved' ? (
                        <button
                          onClick={() => handleInvestigate(alert.id)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                            alert.status === 'New'
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          )}
                        >
                          {alert.status === 'New' ? 'Investigate' : 'Resolve'}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Done
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: Audit Log ── */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search user or resource…"
                  value={auditSearch}
                  onChange={e => setAuditSearch(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 font-medium whitespace-nowrap">From</label>
                <input type="date" value={auditDateFrom} onChange={e => setAuditDateFrom(e.target.value)} className="input-field w-auto" />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 font-medium whitespace-nowrap">To</label>
                <input type="date" value={auditDateTo} onChange={e => setAuditDateTo(e.target.value)} className="input-field w-auto" />
              </div>
              <select
                value={auditAction}
                onChange={e => setAuditAction(e.target.value as ActionType | 'ALL')}
                className="input-field w-auto"
              >
                <option value="ALL">All Actions</option>
                {(['LOGIN','LOGOUT','CREATE','UPDATE','DELETE','EXPORT','VIEW'] as ActionType[]).map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <button onClick={exportCSV} className="btn-secondary whitespace-nowrap">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                {filteredAudit.length} entries
              </span>
              <span className="text-xs text-gray-400">Full audit trail — tamper-proof log</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Timestamp', 'User', 'Action', 'Resource', 'IP Address', 'User Agent'].map(h => (
                      <th key={h} className="table-header whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredAudit.map(entry => (
                    <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="table-cell font-mono text-xs text-gray-600 whitespace-nowrap">{entry.timestamp}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                            {entry.user === 'Admin' ? 'A' : entry.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{entry.user}</span>
                        </div>
                      </td>
                      <td className="table-cell"><ActionBadge type={entry.actionType} /></td>
                      <td className="table-cell text-sm text-gray-700 max-w-[200px] truncate">{entry.resource}</td>
                      <td className="table-cell font-mono text-xs text-gray-600">{entry.ip}</td>
                      <td className="table-cell text-xs text-gray-500 max-w-[180px] truncate">{entry.userAgent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: E-Signature Teaser ── */}
      {activeTab === 'esignature' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Signed', value: 32, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Pending Signature', value: 11, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: 'Signed This Month', value: 14, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
            ].map(s => (
              <div key={s.label} className="stat-card flex items-center gap-4">
                <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', s.bg)}>
                  <s.icon className={cn('w-5 h-5', s.color)} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Recent Documents</h3>
              <a href="/e-signature" className="text-sm text-blue-600 hover:underline font-medium">View all →</a>
            </div>
            <div className="divide-y divide-gray-50">
              {RECENT_DOCS.map(doc => (
                <div key={doc.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-base">📄</div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{doc.title}</p>
                      <p className="text-xs text-gray-400">{doc.date}</p>
                    </div>
                  </div>
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    doc.status === 'SIGNED'  ? 'bg-green-50 text-green-700' :
                    doc.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' :
                    doc.status === 'EXPIRED' ? 'bg-red-50 text-red-700' :
                                               'bg-gray-100 text-gray-600'
                  )}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <a
              href="/e-signature"
              className="btn-primary text-base px-8 py-3"
            >
              <Shield className="w-5 h-5" />
              Manage E-Signatures
            </a>
          </div>
        </div>
      )}

      {/* ── TAB 4: Data Residency ── */}
      {activeTab === 'residency' && (
        <div className="space-y-5">
          {/* Region Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'UZ', flag: '🇺🇿', region: 'Uzbekistan', note: 'Primary', available: true, ping: '4ms' },
              { id: 'DE', flag: '🇩🇪', region: 'Germany / EU', note: 'GDPR-compliant', available: true, ping: '82ms' },
              { id: 'AE', flag: '🇦🇪', region: 'UAE (Dubai)', note: 'Middle East', available: true, ping: '61ms' },
            ].map(r => (
              <div
                key={r.id}
                onClick={() => setSelectedRegion(r.id)}
                className={cn(
                  'bg-white rounded-xl border-2 p-5 cursor-pointer transition-all hover:shadow-md',
                  selectedRegion === r.id ? 'border-blue-500 shadow-md' : 'border-gray-100'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{r.flag}</span>
                  {selectedRegion === r.id
                    ? <span className="badge-green text-xs font-semibold">Active</span>
                    : <span className="badge-gray text-xs">Available</span>
                  }
                </div>
                <p className="font-semibold text-gray-900">{r.region}</p>
                <p className="text-xs text-gray-500 mt-0.5">{r.note}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                  <Activity className="w-3 h-3" />
                  <span>Latency: <span className="font-medium text-gray-600">{r.ping}</span></span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Compliance Settings */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-5">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" /> Compliance & Retention
              </h3>

              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-800">GDPR Compliance Mode</p>
                  <p className="text-xs text-gray-500 mt-0.5">Enforce EU data protection rules</p>
                </div>
                <button onClick={() => setGdprEnabled(p => !p)} className="flex-shrink-0">
                  {gdprEnabled
                    ? <ToggleRight className="w-8 h-8 text-blue-600" />
                    : <ToggleLeft className="w-8 h-8 text-gray-300" />
                  }
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Data Retention Policy</label>
                <div className="relative">
                  <select
                    value={retention}
                    onChange={e => setRetention(e.target.value)}
                    className="input-field appearance-none pr-8"
                  >
                    {['1yr', '3yr', '5yr', '7yr'].map(v => (
                      <option key={v} value={v}>{v === '1yr' ? '1 Year' : v === '3yr' ? '3 Years' : v === '5yr' ? '5 Years' : '7 Years'}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Backup Schedule</label>
                <div className="flex gap-2">
                  {['Daily', 'Weekly', 'Monthly'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setBackupSchedule(opt)}
                      className={cn(
                        'flex-1 py-2 rounded-lg text-sm font-medium border transition-colors',
                        backupSchedule === opt
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Last Backup</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">Today, 02:00 AM UTC</p>
                </div>
                <span className="badge-green">Success</span>
              </div>
            </div>

            {/* GDPR Export */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" /> Data Management
              </h3>

              <div className="space-y-3">
                {[
                  { label: 'Total Data Volume', value: '2.4 GB' },
                  { label: 'Encrypted at Rest', value: 'AES-256' },
                  { label: 'In-Transit Encryption', value: 'TLS 1.3' },
                  { label: 'Backup Copies', value: '3 (geo-redundant)' },
                  { label: 'RPO', value: '1 hour' },
                  { label: 'RTO', value: '4 hours' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 space-y-2">
                <button className="w-full btn-secondary justify-center">
                  <Download className="w-4 h-4" /> Data Export (GDPR Request)
                </button>
                <button className="w-full btn-secondary justify-center text-red-600 border-red-200 hover:bg-red-50">
                  <XCircle className="w-4 h-4" /> Request Data Deletion
                </button>
              </div>
            </div>
          </div>

          {/* Server map placeholder */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-600" /> Data Flow Map
            </h3>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg h-40 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="absolute border-t border-blue-400 w-full" style={{ top: `${i * 22}%`, opacity: 0.4 }} />
                ))}
              </div>
              {/* Dots */}
              <div className="relative flex items-center gap-16 z-10">
                {[
                  { flag: '🇺🇿', name: 'UZ', active: selectedRegion === 'UZ' },
                  { flag: '🇩🇪', name: 'DE', active: selectedRegion === 'DE' },
                  { flag: '🇦🇪', name: 'AE', active: selectedRegion === 'AE' },
                ].map(n => (
                  <div key={n.name} className="flex flex-col items-center gap-2">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 transition-all',
                      n.active ? 'border-blue-400 bg-blue-900/50 shadow-lg shadow-blue-500/30' : 'border-gray-600 bg-gray-800'
                    )}>
                      {n.flag}
                    </div>
                    {n.active && <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
