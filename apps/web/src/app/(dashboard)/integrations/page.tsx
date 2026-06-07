'use client';

import { useState } from 'react';
import { Plug, CheckCircle, XCircle, RefreshCw, Settings, Plus, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type IntegrationType = 'ONEC' | 'UZASBO' | 'BITRIX24';
type SyncStatus = 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';

interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  isActive: boolean;
  syncStatus: SyncStatus;
  lastSyncAt: string | null;
  logs: SyncLog[];
}

interface SyncLog {
  id: string;
  syncType: string;
  status: string;
  recordsSynced: number;
  recordsFailed: number;
  errorMessage: string | null;
  startedAt: string;
  completedAt: string | null;
}

interface ConfigField {
  key: string;
  label: string;
  placeholder: string;
  secret?: boolean;
}

const INTEGRATION_META: Record<IntegrationType, {
  logo: string;
  color: string;
  bg: string;
  border: string;
  description: string;
  fields: ConfigField[];
  syncTypes: string[];
}> = {
  ONEC: {
    logo: '1C',
    color: 'text-yellow-700',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    description: '1C:Enterprise — ERP va buxgalteriya tizimi bilan sinxronlash',
    fields: [
      { key: 'baseUrl', label: 'Server URL', placeholder: 'http://1c-server:8080/base' },
      { key: 'username', label: 'Foydalanuvchi', placeholder: 'Admin' },
      { key: 'password', label: 'Parol', placeholder: '••••••••', secret: true },
      { key: 'infoBase', label: 'Infobase nomi', placeholder: 'StaffFlow' },
    ],
    syncTypes: ['EMPLOYEES', 'PAYROLL', 'DEPARTMENTS'],
  },
  UZASBO: {
    logo: 'UzASBO',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    description: "UzASBO — O'zbekiston milliy buxgalteriya tizimi",
    fields: [
      { key: 'apiUrl', label: 'API URL', placeholder: 'https://api.uzasbo.uz' },
      { key: 'apiKey', label: 'API Kalit', placeholder: 'uzasbo_key_...', secret: true },
      { key: 'tin', label: 'INN (STIR)', placeholder: '123456789' },
    ],
    syncTypes: ['EMPLOYEES', 'PAYROLL'],
  },
  BITRIX24: {
    logo: 'B24',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    description: "Bitrix24 — CRM va loyiha boshqaruvi tizimi",
    fields: [
      { key: 'webhookUrl', label: 'Webhook URL', placeholder: 'https://domain.bitrix24.com/rest/1/XXXXX/' },
    ],
    syncTypes: ['USERS', 'DEPARTMENTS'],
  },
};

const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: 'i1',
    type: 'ONEC',
    name: '1C:Korxona 8.3',
    isActive: true,
    syncStatus: 'SUCCESS',
    lastSyncAt: '2024-06-15T10:30:00Z',
    logs: [
      { id: 'l1', syncType: 'EMPLOYEES', status: 'SUCCESS', recordsSynced: 50, recordsFailed: 0, errorMessage: null, startedAt: '2024-06-15T10:28:00Z', completedAt: '2024-06-15T10:30:00Z' },
      { id: 'l2', syncType: 'PAYROLL', status: 'SUCCESS', recordsSynced: 50, recordsFailed: 0, errorMessage: null, startedAt: '2024-06-14T09:00:00Z', completedAt: '2024-06-14T09:02:00Z' },
    ],
  },
  {
    id: 'i2',
    type: 'UZASBO',
    name: "UzASBO Hisobot",
    isActive: false,
    syncStatus: 'IDLE',
    lastSyncAt: null,
    logs: [],
  },
  {
    id: 'i3',
    type: 'BITRIX24',
    name: 'Bitrix24 CRM',
    isActive: false,
    syncStatus: 'FAILED',
    lastSyncAt: '2024-06-10T14:00:00Z',
    logs: [
      { id: 'l3', syncType: 'USERS', status: 'FAILED', recordsSynced: 0, recordsFailed: 1, errorMessage: 'Invalid webhook URL', startedAt: '2024-06-10T14:00:00Z', completedAt: '2024-06-10T14:00:05Z' },
    ],
  },
];

function StatusBadge({ status }: { status: SyncStatus }) {
  const map: Record<SyncStatus, { label: string; cls: string }> = {
    IDLE: { label: 'Kutilmoqda', cls: 'badge-gray' },
    RUNNING: { label: 'Ishlayapti...', cls: 'badge-yellow' },
    SUCCESS: { label: 'Muvaffaqiyatli', cls: 'badge-green' },
    FAILED: { label: 'Xato', cls: 'badge-red' },
  };
  const { label, cls } = map[status];
  return <span className={cls}>{label}</span>;
}

function ConfigModal({
  type,
  onClose,
}: {
  type: IntegrationType;
  onClose: () => void;
}) {
  const meta = INTEGRATION_META[type];
  const [form, setForm] = useState<Record<string, string>>({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    await new Promise((r) => setTimeout(r, 1500));
    setTestResult(false); // demo: always fail (no real server)
    setTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm', meta.bg, meta.color)}>
              {meta.logo}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">{type === 'ONEC' ? '1C:Enterprise' : type === 'UZASBO' ? 'UzASBO' : 'Bitrix24'} Sozlamalari</h2>
              <p className="text-xs text-gray-500 mt-0.5">Ulanish konfiguratsiyasi</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          {meta.fields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type={field.secret ? 'password' : 'text'}
                placeholder={field.placeholder}
                value={form[field.key] || ''}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="input-field w-full"
              />
            </div>
          ))}

          {testResult !== null && (
            <div className={cn('flex items-center gap-2 p-3 rounded-lg text-sm', testResult ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>
              {testResult ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {testResult ? 'Ulanish muvaffaqiyatli!' : "Ulanib bo'lmadi. Sozlamalarni tekshiring."}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleTest}
            disabled={testing}
            className="btn-secondary text-sm disabled:opacity-60"
          >
            {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plug className="w-4 h-4" />}
            {testing ? 'Tekshirilmoqda...' : 'Ulanishni test qiling'}
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-secondary text-sm">Bekor</button>
            <button onClick={onClose} className="btn-primary text-sm">Saqlash</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationCard({ integration, onConfigure }: { integration: Integration; onConfigure: () => void }) {
  const meta = INTEGRATION_META[integration.type];
  const [expanded, setExpanded] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [active, setActive] = useState(integration.isActive);

  const handleSync = async (syncType: string) => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSyncing(false);
  };

  const typeLabel = integration.type === 'ONEC' ? '1C:Enterprise' : integration.type === 'UZASBO' ? 'UzASBO' : 'Bitrix24';

  return (
    <div className={cn('card overflow-hidden border', meta.border)}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0', meta.bg, meta.color)}>
              {meta.logo}
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">{integration.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{typeLabel}</div>
              <div className="mt-1.5"><StatusBadge status={integration.syncStatus} /></div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setActive(!active)}
              className={cn(
                'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                active ? 'bg-blue-600' : 'bg-gray-200',
              )}
            >
              <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', active ? 'translate-x-4' : 'translate-x-0.5')} />
            </button>
            <button onClick={onConfigure} className="btn-secondary text-xs py-1.5">
              <Settings className="w-3.5 h-3.5" />
              Sozlash
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">{meta.description}</p>

        {integration.lastSyncAt && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            Oxirgi sinxronlash: {new Date(integration.lastSyncAt).toLocaleString('uz-UZ')}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {meta.syncTypes.map((st) => (
            <button
              key={st}
              onClick={() => handleSync(st)}
              disabled={syncing || !active}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                active
                  ? 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600'
                  : 'border-gray-100 text-gray-400 cursor-not-allowed',
              )}
            >
              {syncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              {st}
            </button>
          ))}
        </div>
      </div>

      {integration.logs.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span>Sinxronlash tarixi ({integration.logs.length} ta)</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expanded && (
            <div className="divide-y divide-gray-50">
              {integration.logs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 px-5 py-3">
                  {log.status === 'SUCCESS' ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-700">{log.syncType}</div>
                    {log.errorMessage && <div className="text-xs text-red-500 mt-0.5 truncate">{log.errorMessage}</div>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-semibold text-gray-800">{log.recordsSynced} yozuv</div>
                    <div className="text-xs text-gray-400">{new Date(log.startedAt).toLocaleDateString('uz-UZ')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function IntegrationsPage() {
  const [configModal, setConfigModal] = useState<IntegrationType | null>(null);
  const [integrations] = useState<Integration[]>(MOCK_INTEGRATIONS);

  const activeCount = integrations.filter((i) => i.isActive).length;
  const successCount = integrations.filter((i) => i.syncStatus === 'SUCCESS').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Integratsiyalar</h1>
          <p className="page-subtitle">1C, UzASBO va Bitrix24 bilan ulanish</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Yangi integratsiya
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Jami integratsiyalar", value: integrations.length, color: 'text-gray-900' },
          { label: "Faol", value: activeCount, color: 'text-green-600' },
          { label: "Muvaffaqiyatli sinx.", value: successCount, color: 'text-blue-600' },
          { label: "Xato", value: integrations.filter(i => i.syncStatus === 'FAILED').length, color: 'text-red-500' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={cn('text-2xl font-bold mt-1', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Integration cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onConfigure={() => setConfigModal(integration.type)}
          />
        ))}
      </div>

      {/* How it works */}
      <div className="card p-6">
        <h3 className="font-semibold text-sm text-gray-900 mb-4">Integratsiya qanday ishlaydi?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '1', title: "Sozlash", desc: "API kalitlari yoki webhook URLini kiriting va ulanishni test qiling", icon: Settings },
            { step: '2', title: "Faollashtirish", desc: "Integratsiyani yoqing va sinxronlash turini tanlang", icon: Plug },
            { step: '3', title: "Avtomatik sinxronlash", desc: "Ma'lumotlar belgilangan vaqtda avtomatik yangilanadi", icon: RefreshCw },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">{item.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {configModal && (
        <ConfigModal type={configModal} onClose={() => setConfigModal(null)} />
      )}
    </div>
  );
}
