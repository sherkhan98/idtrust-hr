'use client';

import { useState } from 'react';
import {
  Zap, Plus, Play, Pause, Trash2, Edit, Bell, Mail,
  MessageSquare, Smartphone, Clock, Users, Calendar,
  AlertCircle, CheckCircle, TrendingDown, DollarSign,
  ToggleLeft, ToggleRight, ChevronDown, ChevronRight,
  Send, Bot, Settings, Activity, Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TriggerType =
  | 'ABSENT_DAYS'
  | 'LATE_ARRIVAL'
  | 'BIRTHDAY'
  | 'WORK_ANNIVERSARY'
  | 'CONTRACT_ENDING'
  | 'LEAVE_APPROVED'
  | 'LEAVE_REJECTED'
  | 'KPI_BELOW_TARGET'
  | 'PAYROLL_PROCESSED'
  | 'NEW_EMPLOYEE'
  | 'EMPLOYEE_EXIT'
  | 'PROBATION_END';

type ActionType = 'TELEGRAM' | 'EMAIL' | 'SMS' | 'IN_APP' | 'WEBHOOK';
type RuleStatus = 'ACTIVE' | 'PAUSED';

interface AutomationRule {
  id: string;
  name: string;
  trigger: TriggerType;
  triggerConfig: Record<string, any>;
  actions: ActionType[];
  recipients: string[];
  status: RuleStatus;
  executionCount: number;
  lastRun: string | null;
}

const TRIGGER_META: Record<TriggerType, { label: string; icon: any; color: string; bg: string; desc: string }> = {
  ABSENT_DAYS:       { label: 'Ketma-ket davomatsizlik', icon: AlertCircle,   color: 'text-red-600',    bg: 'bg-red-50',    desc: 'N kun ketma-ket kelmasa' },
  LATE_ARRIVAL:      { label: 'Kechikish',               icon: Clock,         color: 'text-orange-600', bg: 'bg-orange-50', desc: 'Oyda N martadan ko\'p kechiksa' },
  BIRTHDAY:          { label: 'Tug\'ilgan kun',           icon: Calendar,      color: 'text-pink-600',   bg: 'bg-pink-50',   desc: 'Xodim tug\'ilgan kunida' },
  WORK_ANNIVERSARY:  { label: 'Ish yilligi',             icon: TrendingDown,  color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Ish yilligi to\'lganida' },
  CONTRACT_ENDING:   { label: 'Shartnoma tugashi',       icon: AlertCircle,   color: 'text-yellow-600', bg: 'bg-yellow-50', desc: 'Shartnoma N kun qolganida' },
  LEAVE_APPROVED:    { label: "Ta'til tasdiqlandi",      icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-50',  desc: "Ta'til so'rovi tasdiqlanganda" },
  LEAVE_REJECTED:    { label: "Ta'til rad etildi",       icon: AlertCircle,   color: 'text-red-600',    bg: 'bg-red-50',    desc: "Ta'til so'rovi rad etilganda" },
  KPI_BELOW_TARGET:  { label: 'KPI maqsaddan past',      icon: TrendingDown,  color: 'text-red-600',    bg: 'bg-red-50',    desc: 'KPI N% dan past bo\'lsa' },
  PAYROLL_PROCESSED: { label: 'Maosh hisoblandi',        icon: DollarSign,    color: 'text-green-600',  bg: 'bg-green-50',  desc: 'Oylik maosh hisoblanganda' },
  NEW_EMPLOYEE:      { label: 'Yangi xodim',             icon: Users,         color: 'text-blue-600',   bg: 'bg-blue-50',   desc: 'Yangi xodim qo\'shilganda' },
  EMPLOYEE_EXIT:     { label: 'Xodim ketishi',           icon: Users,         color: 'text-orange-600', bg: 'bg-orange-50', desc: 'Xodim ishdan chiqishida' },
  PROBATION_END:     { label: 'Sinov muddati tugashi',   icon: Shield,        color: 'text-teal-600',   bg: 'bg-teal-50',   desc: 'Sinov muddati N kun qolganida' },
};

const ACTION_META: Record<ActionType, { label: string; icon: any; color: string; bg: string }> = {
  TELEGRAM:  { label: 'Telegram',    icon: Bot,          color: 'text-blue-600',   bg: 'bg-blue-50' },
  EMAIL:     { label: 'Email',       icon: Mail,         color: 'text-purple-600', bg: 'bg-purple-50' },
  SMS:       { label: 'SMS',         icon: Smartphone,   color: 'text-green-600',  bg: 'bg-green-50' },
  IN_APP:    { label: "Bildirishnoma", icon: Bell,       color: 'text-orange-600', bg: 'bg-orange-50' },
  WEBHOOK:   { label: 'Webhook',     icon: Activity,     color: 'text-gray-600',   bg: 'bg-gray-100' },
};

const MOCK_RULES: AutomationRule[] = [
  {
    id: 'r1', name: '3 kun davomatsizlik — HR ga xabar',
    trigger: 'ABSENT_DAYS', triggerConfig: { days: 3 },
    actions: ['TELEGRAM', 'EMAIL'], recipients: ['HR Manager', 'Direct Manager'],
    status: 'ACTIVE', executionCount: 12, lastRun: '2024-06-14',
  },
  {
    id: 'r2', name: "Tug'ilgan kun tabrik",
    trigger: 'BIRTHDAY', triggerConfig: {},
    actions: ['TELEGRAM', 'IN_APP'], recipients: ['Employee', 'Team'],
    status: 'ACTIVE', executionCount: 47, lastRun: '2024-06-13',
  },
  {
    id: 'r3', name: 'Shartnoma tugashi (30 kun)',
    trigger: 'CONTRACT_ENDING', triggerConfig: { daysLeft: 30 },
    actions: ['EMAIL', 'IN_APP'], recipients: ['HR Manager'],
    status: 'ACTIVE', executionCount: 5, lastRun: '2024-06-01',
  },
  {
    id: 'r4', name: 'Maosh slip yuborish',
    trigger: 'PAYROLL_PROCESSED', triggerConfig: {},
    actions: ['TELEGRAM', 'EMAIL'], recipients: ['Employee'],
    status: 'ACTIVE', executionCount: 2, lastRun: '2024-05-31',
  },
  {
    id: 'r5', name: 'KPI pastligi ogohlantirishsi',
    trigger: 'KPI_BELOW_TARGET', triggerConfig: { threshold: 70 },
    actions: ['IN_APP', 'EMAIL'], recipients: ['Employee', 'Manager'],
    status: 'PAUSED', executionCount: 8, lastRun: '2024-06-10',
  },
  {
    id: 'r6', name: "Oyda 3 martadan ko'p kechikish",
    trigger: 'LATE_ARRIVAL', triggerConfig: { count: 3 },
    actions: ['IN_APP'], recipients: ['Employee', 'HR Manager'],
    status: 'ACTIVE', executionCount: 3, lastRun: '2024-06-12',
  },
];

const LOG_ENTRIES = [
  { id: 'lg1', rule: '3 kun davomatsizlik', employee: 'Zulfiya Karimova', action: 'TELEGRAM', time: '10:23', date: '2024-06-14', success: true },
  { id: 'lg2', rule: "Tug'ilgan kun tabrik", employee: 'Bobur Rahimov', action: 'TELEGRAM', time: '09:00', date: '2024-06-13', success: true },
  { id: 'lg3', rule: 'Shartnoma tugashi', employee: 'Nilufar Xasanova', action: 'EMAIL', time: '08:00', date: '2024-06-13', success: true },
  { id: 'lg4', rule: 'KPI pastligi', employee: 'Timur Sultanov', action: 'EMAIL', time: '11:00', date: '2024-06-10', success: false },
  { id: 'lg5', rule: "Tug'ilgan kun tabrik", employee: 'Alisher Toshmatov', action: 'TELEGRAM', time: '09:00', date: '2024-06-09', success: true },
];

function RuleCard({ rule, onToggle }: { rule: AutomationRule; onToggle: () => void }) {
  const triggerMeta = TRIGGER_META[rule.trigger];
  return (
    <div className={cn('card p-4 border transition-all', rule.status === 'PAUSED' && 'opacity-60')}>
      <div className="flex items-start gap-3">
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', triggerMeta.bg)}>
          <triggerMeta.icon className={cn('w-4.5 h-4.5', triggerMeta.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="font-semibold text-sm text-gray-900 leading-tight">{rule.name}</div>
            <button
              onClick={onToggle}
              className="flex-shrink-0 mt-0.5"
              title={rule.status === 'ACTIVE' ? 'Pauza' : 'Ishga tushirish'}
            >
              {rule.status === 'ACTIVE'
                ? <ToggleRight className="w-5 h-5 text-blue-600" />
                : <ToggleLeft className="w-5 h-5 text-gray-400" />
              }
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{triggerMeta.desc}</div>

          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {rule.actions.map(action => {
              const meta = ACTION_META[action];
              return (
                <div key={action} className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', meta.bg, meta.color)}>
                  <meta.icon className="w-3 h-3" />
                  {meta.label}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mt-2.5 text-xs text-gray-400">
            <span>{rule.executionCount} marta ishladi</span>
            {rule.lastRun && <span>Son: {rule.lastRun}</span>}
          </div>
        </div>
      </div>
      <div className="flex gap-1.5 mt-3 pt-3 border-t border-gray-50">
        <button className="flex-1 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1">
          <Edit className="w-3 h-3" />
          Tahrirlash
        </button>
        <button className="flex-1 py-1.5 text-xs font-medium text-red-500 border border-red-100 rounded-lg hover:bg-red-50 flex items-center justify-center gap-1">
          <Trash2 className="w-3 h-3" />
          O'chirish
        </button>
      </div>
    </div>
  );
}

function NewRuleModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerType | null>(null);
  const [selectedActions, setSelectedActions] = useState<ActionType[]>([]);
  const [ruleName, setRuleName] = useState('');

  const toggleAction = (action: ActionType) => {
    setSelectedActions(prev =>
      prev.includes(action) ? prev.filter(a => a !== action) : [...prev, action]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">Yangi avtomatik qoida</h2>
            <p className="text-xs text-gray-500 mt-0.5">Qadam {step}/3</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-4">
          <div className="flex gap-1">
            {[1,2,3].map(s => (
              <div key={s} className={cn('flex-1 h-1 rounded-full transition-colors', s <= step ? 'bg-blue-600' : 'bg-gray-100')} />
            ))}
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Trigger tanlang (Qachon ishlaydi?)</p>
              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
                {(Object.keys(TRIGGER_META) as TriggerType[]).map(key => {
                  const meta = TRIGGER_META[key];
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedTrigger(key)}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-xl border text-left transition-all',
                        selectedTrigger === key ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50/30'
                      )}
                    >
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', meta.bg)}>
                        <meta.icon className={cn('w-3.5 h-3.5', meta.color)} />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Amal tanlang (Nima qiladi?)</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(ACTION_META) as ActionType[]).map(key => {
                  const meta = ACTION_META[key];
                  const selected = selectedActions.includes(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggleAction(key)}
                      className={cn(
                        'flex items-center gap-2.5 p-3 rounded-xl border transition-all',
                        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'
                      )}
                    >
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', meta.bg)}>
                        <meta.icon className={cn('w-4 h-4', meta.color)} />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-800">{meta.label}</div>
                        {selected && <div className="text-xs text-blue-600">Tanlandi ✓</div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Qoida nomi</label>
                <input
                  type="text"
                  placeholder="Masalan: 3 kun kelmasa HR ga xabar"
                  value={ruleName}
                  onChange={e => setRuleName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Kimga yuborilsin?</label>
                <div className="space-y-2">
                  {['HR Manager', 'Direct Manager', 'Employee', 'Department Head'].map(r => (
                    <label key={r} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      {r}
                    </label>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
                <div className="font-medium mb-1">Xulosa:</div>
                {selectedTrigger && <div>• Trigger: {TRIGGER_META[selectedTrigger].label}</div>}
                <div>• Amallar: {selectedActions.map(a => ACTION_META[a].label).join(', ') || "Hech biri tanlanmadi"}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
            className="btn-secondary text-sm"
          >
            {step === 1 ? 'Bekor' : 'Orqaga'}
          </button>
          <button
            onClick={() => step < 3 ? setStep(s => s + 1) : onClose()}
            disabled={step === 1 && !selectedTrigger}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {step === 3 ? 'Saqlash' : 'Keyingi'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TelegramBotConfig() {
  const [token, setToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testOk, setTestOk] = useState<boolean | null>(null);

  const handleTest = async () => {
    setTesting(true);
    await new Promise(r => setTimeout(r, 1500));
    setTestOk(false);
    setTesting(false);
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
          <Bot className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-gray-900">Telegram Bot</h3>
          <p className="text-xs text-gray-500">@BotFather orqali bot yarating</p>
        </div>
        <span className="ml-auto badge-red">Ulanmagan</span>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Bot Token</label>
          <input type="password" placeholder="123456789:AAE..." value={token} onChange={e => setToken(e.target.value)} className="input-field font-mono" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Chat ID (HR guruh)</label>
          <input type="text" placeholder="-100123456789" value={chatId} onChange={e => setChatId(e.target.value)} className="input-field font-mono" />
        </div>
        {testOk !== null && (
          <div className={cn('flex items-center gap-2 p-2.5 rounded-lg text-xs', testOk ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>
            {testOk ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {testOk ? "Bot muvaffaqiyatli ulandi!" : "Ulanib bo'lmadi. Token yoki Chat ID ni tekshiring."}
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={handleTest} disabled={testing} className="btn-secondary text-xs flex-1 disabled:opacity-60">
            {testing ? <Activity className="w-3.5 h-3.5 animate-pulse" /> : <Send className="w-3.5 h-3.5" />}
            Test yuborish
          </button>
          <button className="btn-primary text-xs flex-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState<'rules' | 'channels' | 'logs'>('rules');
  const [rules, setRules] = useState(MOCK_RULES);
  const [showNewRule, setShowNewRule] = useState(false);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r =>
      r.id === id ? { ...r, status: r.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' as RuleStatus } : r
    ));
  };

  const activeCount = rules.filter(r => r.status === 'ACTIVE').length;
  const totalRuns = rules.reduce((s, r) => s + r.executionCount, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Avtomatik Qoidalar</h1>
          <p className="page-subtitle">Trigger asosida bildirishnoma va harakatlar</p>
        </div>
        <button onClick={() => setShowNewRule(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Yangi qoida
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Faol qoidalar', value: activeCount, color: 'text-blue-600' },
          { label: "Jami qoidalar", value: rules.length, color: 'text-gray-900' },
          { label: "Jami ishga tushgan", value: totalRuns, color: 'text-green-600' },
          { label: 'Kanal turlari', value: 4, color: 'text-purple-600' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={cn('text-2xl font-bold mt-1', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg w-fit">
        {[
          { id: 'rules', label: 'Qoidalar', icon: Zap },
          { id: 'channels', label: "Kanallar", icon: Bell },
          { id: 'logs', label: 'Loglар', icon: Activity },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn('flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-md transition-all',
              activeTab === tab.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {rules.map(rule => (
            <RuleCard key={rule.id} rule={rule} onToggle={() => toggleRule(rule.id)} />
          ))}
          <button
            onClick={() => setShowNewRule(true)}
            className="card p-5 border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500 min-h-[160px]"
          >
            <Plus className="w-8 h-8" />
            <span className="text-sm font-medium">Yangi qoida qo'shish</span>
          </button>
        </div>
      )}

      {activeTab === 'channels' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TelegramBotConfig />

          {/* Email config */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Email (SMTP)</h3>
                <p className="text-xs text-gray-500">Korporativ email sozlamalari</p>
              </div>
              <span className="ml-auto badge-green">Ulangan</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'SMTP Host', value: 'smtp.gmail.com', type: 'text' },
                { label: 'SMTP Port', value: '587', type: 'number' },
                { label: 'Username', value: 'hr@company.uz', type: 'email' },
                { label: 'Parol', value: '••••••••', type: 'password' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
                  <input type={f.type} defaultValue={f.value} className="input-field" />
                </div>
              ))}
              <button className="btn-primary text-xs w-full"><CheckCircle className="w-3.5 h-3.5" />Saqlash</button>
            </div>
          </div>

          {/* SMS config */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-900">SMS Gateway</h3>
                <p className="text-xs text-gray-500">Eskiz.uz, Infobip, Twilio</p>
              </div>
              <span className="ml-auto badge-gray">Ulanmagan</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Provider</label>
                <select className="input-field">
                  <option>Eskiz.uz (O'zbekiston)</option>
                  <option>Infobip</option>
                  <option>Twilio</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">API Key</label>
                <input type="password" placeholder="sk_..." className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sender ID</label>
                <input type="text" placeholder="StaffFlow" className="input-field" />
              </div>
              <button className="btn-primary text-xs w-full"><CheckCircle className="w-3.5 h-3.5" />Saqlash</button>
            </div>
          </div>

          {/* In-app config */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Ichki Bildirishnomalar</h3>
                <p className="text-xs text-gray-500">Push va tizim ichidagi xabarlar</p>
              </div>
              <span className="ml-auto badge-green">Faol</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Browser Push bildirishnomalar', checked: true },
                { label: "Tizim ikonkasida badge ko'rsatish", checked: true },
                { label: "Ovozli signal", checked: false },
                { label: "Email ham yuborish", checked: true },
              ].map(item => (
                <label key={item.label} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked={item.checked} className="rounded" />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-sm text-gray-900">Avtomatika tarixi</h3>
            <span className="text-xs text-gray-400">So'nggi 50 ta</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="table-header">Qoida</th>
                  <th className="table-header">Xodim</th>
                  <th className="table-header">Kanal</th>
                  <th className="table-header">Sana</th>
                  <th className="table-header">Natija</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {LOG_ENTRIES.map(log => {
                  const actionMeta = ACTION_META[log.action as ActionType];
                  return (
                    <tr key={log.id} className="hover:bg-gray-50/50">
                      <td className="table-cell font-medium text-gray-800">{log.rule}</td>
                      <td className="table-cell text-gray-600">{log.employee}</td>
                      <td className="table-cell">
                        <div className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium', actionMeta.bg, actionMeta.color)}>
                          <actionMeta.icon className="w-3 h-3" />
                          {actionMeta.label}
                        </div>
                      </td>
                      <td className="table-cell text-gray-500">{log.date} {log.time}</td>
                      <td className="table-cell">
                        {log.success
                          ? <span className="badge-green"><CheckCircle className="w-3 h-3 inline mr-1" />Muvaffaqiyatli</span>
                          : <span className="badge-red"><AlertCircle className="w-3 h-3 inline mr-1" />Xato</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showNewRule && <NewRuleModal onClose={() => setShowNewRule(false)} />}
    </div>
  );
}
