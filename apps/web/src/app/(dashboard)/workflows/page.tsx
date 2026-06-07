'use client';

import { useState } from 'react';
import {
  Plus, Play, CheckCircle, Clock, GitBranch, Bell, User, Trash2, Pencil,
  ChevronDown, X, Zap, FileText, Settings, ChevronRight, MoreVertical,
  AlertCircle, ArrowDown, Check, Circle
} from 'lucide-react';

type StepType = 'approval' | 'notification' | 'condition' | 'timer' | 'integration' | 'form' | 'trigger';

interface WorkflowStep {
  id: string;
  type: StepType;
  name: string;
  role?: string;
  channel?: string;
  condition?: string;
  timer?: string;
  sla?: string;
  branches?: { label: string; color: string }[];
}

interface Workflow {
  id: string;
  name: string;
  steps: number;
  status: 'Active' | 'Draft';
  steps_data: WorkflowStep[];
}

const STEP_TYPE_META: Record<StepType, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  trigger: { icon: <Zap size={16} />, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Trigger' },
  approval: { icon: <User size={16} />, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Tasdiqlash' },
  notification: { icon: <Bell size={16} />, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Bildirishnoma' },
  condition: { icon: <GitBranch size={16} />, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Shart' },
  timer: { icon: <Clock size={16} />, color: 'text-green-600', bg: 'bg-green-100', label: 'Taymer' },
  integration: { icon: <Settings size={16} />, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Integratsiya' },
  form: { icon: <FileText size={16} />, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Forma' },
};

const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: '1', name: "Ta'til tasdiqlash", steps: 3, status: 'Active',
    steps_data: [
      { id: 's0', type: 'trigger', name: "Xodim so'rov yuboradi", role: 'Employee' },
      { id: 's1', type: 'approval', name: 'Bevosita menejer tekshiruvi', role: 'Direct Manager', sla: '24 soat' },
      { id: 's2', type: 'condition', name: 'Tasdiqlandi?', condition: 'status == approved', branches: [{ label: 'Ha', color: 'text-green-600' }, { label: "Yo'q", color: 'text-red-500' }] },
      { id: 's3', type: 'approval', name: "HR bo'limi tekshiruvi", role: 'HR Manager', sla: '48 soat' },
      { id: 's4', type: 'notification', name: "Barcha tomonlarga xabar", channel: 'Email + Telegram' },
    ]
  },
  {
    id: '2', name: 'Yangi xodim onboarding', steps: 8, status: 'Active',
    steps_data: [
      { id: 's0', type: 'trigger', name: "Yangi xodim qabul qilinadi" },
      { id: 's1', type: 'form', name: "Hujjatlar formasini to'ldirish", role: 'New Employee' },
      { id: 's2', type: 'approval', name: "IT jihozlar tayinlash", role: 'IT Department', sla: '8 soat' },
      { id: 's3', type: 'notification', name: "Jamoaga xabar yuborish", channel: 'Telegram' },
      { id: 's4', type: 'timer', name: '3 kun kutish', timer: '3 days' },
      { id: 's5', type: 'approval', name: 'Mentorni tayinlash', role: 'HR Manager' },
      { id: 's6', type: 'integration', name: '1C ga ma\'lumot yuklash' },
      { id: 's7', type: 'notification', name: "Onboarding tugadi", channel: 'Email' },
    ]
  },
  {
    id: '3', name: 'Xarajat tasdiqlash', steps: 4, status: 'Active',
    steps_data: [
      { id: 's0', type: 'trigger', name: 'Xarajat so\'rovi yuboriladi' },
      { id: 's1', type: 'approval', name: 'Menejer tasdiqlashi', role: 'Manager', sla: '24 soat' },
      { id: 's2', type: 'condition', name: '>1,000,000 so\'mmi?', condition: 'amount > 1000000', branches: [{ label: 'Ha (Direktor kerak)', color: 'text-red-500' }, { label: "Yo'q (Avtotasdiqlash)", color: 'text-green-600' }] },
      { id: 's3', type: 'approval', name: 'Direktor tasdiqlashi', role: 'Director', sla: '48 soat' },
      { id: 's4', type: 'notification', name: 'Moliya bo\'limiga xabar', channel: 'Email' },
    ]
  },
  {
    id: '4', name: "Ishdan bo'shatish", steps: 6, status: 'Draft',
    steps_data: [
      { id: 's0', type: 'trigger', name: "Bo'shatish so'rovi" },
      { id: 's1', type: 'approval', name: 'HR tasdiqlashi', role: 'HR', sla: '24 soat' },
      { id: 's2', type: 'approval', name: 'Direktor tasdiqlashi', role: 'Director', sla: '72 soat' },
      { id: 's3', type: 'form', name: 'Chiqish intervyu', role: 'Employee' },
      { id: 's4', type: 'integration', name: 'Tizimlardan o\'chirish' },
      { id: 's5', type: 'notification', name: 'Barcha bo\'limlarga xabar', channel: 'Email + Telegram' },
    ]
  },
  {
    id: '5', name: 'Bonus tasdiqlash', steps: 3, status: 'Active',
    steps_data: [
      { id: 's0', type: 'trigger', name: 'Bonus taklifi yuboriladi' },
      { id: 's1', type: 'approval', name: 'Menejer tasdiqlashi', role: 'Manager', sla: '24 soat' },
      { id: 's2', type: 'approval', name: 'Moliya tasdiqlashi', role: 'Finance', sla: '24 soat' },
      { id: 's3', type: 'notification', name: 'Xodimga xabar', channel: 'Email + In-app' },
    ]
  },
];

const TEMPLATES = [
  { id: 't1', name: "Ta'til jarayoni", steps: 4, icon: '🏖️' },
  { id: 't2', name: 'Onboarding standart', steps: 7, icon: '👋' },
  { id: 't3', name: 'Xarajat nazorati', steps: 5, icon: '💰' },
  { id: 't4', name: 'Ishga qabul', steps: 6, icon: '📋' },
];

const STEP_TYPES: StepType[] = ['approval', 'notification', 'condition', 'timer', 'integration', 'form'];

interface AddStepModalProps {
  onClose: () => void;
  onAdd: (step: WorkflowStep) => void;
  insertAfterIndex: number;
}

function AddStepModal({ onClose, onAdd }: AddStepModalProps) {
  const [selectedType, setSelectedType] = useState<StepType | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [channel, setChannel] = useState('Email');
  const [condition, setCondition] = useState('');
  const [sla, setSla] = useState('24');
  const [timer, setTimer] = useState('1 day');

  const handleAdd = () => {
    if (!selectedType || !name) return;
    const step: WorkflowStep = {
      id: 's' + Date.now(),
      type: selectedType,
      name,
      role: role || undefined,
      channel: selectedType === 'notification' ? channel : undefined,
      condition: selectedType === 'condition' ? condition : undefined,
      sla: selectedType === 'approval' ? sla + ' soat' : undefined,
      timer: selectedType === 'timer' ? timer : undefined,
      branches: selectedType === 'condition' ? [{ label: 'Ha', color: 'text-green-600' }, { label: "Yo'q", color: 'text-red-500' }] : undefined,
    };
    onAdd(step);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Qadam qo'shish</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {!selectedType ? (
          <div>
            <p className="text-sm text-gray-500 mb-4">Qadam turini tanlang:</p>
            <div className="grid grid-cols-2 gap-3">
              {STEP_TYPES.map(type => {
                const meta = STEP_TYPE_META[type];
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all text-left`}
                  >
                    <span className={`p-2 rounded-lg ${meta.bg} ${meta.color}`}>{meta.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`p-1.5 rounded-lg ${STEP_TYPE_META[selectedType].bg} ${STEP_TYPE_META[selectedType].color}`}>
                {STEP_TYPE_META[selectedType].icon}
              </span>
              <span className="text-sm font-semibold text-gray-700">{STEP_TYPE_META[selectedType].label}</span>
              <button onClick={() => setSelectedType(null)} className="ml-auto text-xs text-blue-600 hover:underline">O'zgartirish</button>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Qadam nomi *</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Qadam nomini kiriting"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {selectedType === 'approval' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Rol / Shaxs</label>
                  <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Tanlang...</option>
                    <option>Direct Manager</option>
                    <option>HR Manager</option>
                    <option>Director</option>
                    <option>Finance</option>
                    <option>IT Department</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">SLA (soat)</label>
                  <input type="number" value={sla} onChange={e => setSla(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </>
            )}

            {selectedType === 'notification' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Kanal</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Email', 'Telegram', 'SMS', 'In-app'].map(ch => (
                    <button key={ch} onClick={() => setChannel(ch)}
                      className={`py-2 rounded-lg border text-sm font-medium transition-all ${channel === ch ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}
                    >{ch}</button>
                  ))}
                </div>
              </div>
            )}

            {selectedType === 'condition' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Shart ifodasi</label>
                <input value={condition} onChange={e => setCondition(e.target.value)} placeholder="e.g. amount > 1000000" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            )}

            {selectedType === 'timer' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Kutish muddati</label>
                <select value={timer} onChange={e => setTimer(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>1 soat</option>
                  <option>4 soat</option>
                  <option>8 soat</option>
                  <option>1 kun</option>
                  <option>2 kun</option>
                  <option>3 kun</option>
                  <option>1 hafta</option>
                </select>
              </div>
            )}

            {selectedType === 'form' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Rol</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Tanlang...</option>
                  <option>Employee</option>
                  <option>Manager</option>
                  <option>HR</option>
                </select>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">Bekor qilish</button>
              <button onClick={handleAdd} disabled={!name} className="flex-1 py-2.5 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-all disabled:opacity-40">Qo'shish</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface StepBoxProps {
  step: WorkflowStep;
  isLast: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onAddAfter: () => void;
}

function StepBox({ step, isLast, onDelete, onAddAfter }: StepBoxProps) {
  const [hovered, setHovered] = useState(false);
  const meta = STEP_TYPE_META[step.type];

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-full max-w-sm group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={`rounded-xl border-2 ${step.type === 'trigger' ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-white'} shadow-sm p-4 transition-all hover:shadow-md hover:border-blue-300`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className={`p-2 rounded-lg ${meta.bg} ${meta.color} flex-shrink-0`}>{meta.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{meta.label}</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{step.name}</p>
                {step.role && <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><User size={10} />{step.role}</p>}
                {step.channel && <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><Bell size={10} />{step.channel}</p>}
                {step.condition && <p className="text-xs text-orange-600 mt-0.5 font-mono bg-orange-50 px-2 py-0.5 rounded">{step.condition}</p>}
                {step.timer && <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1"><Clock size={10} />Kutish: {step.timer}</p>}
              </div>
            </div>
            <div className={`flex items-center gap-1 transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}>
              {step.sla && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium mr-1">{step.sla}</span>}
              <button className="p-1.5 hover:bg-gray-100 rounded-lg" title="Tahrirlash"><Pencil size={13} className="text-gray-400" /></button>
              {step.type !== 'trigger' && (
                <button onClick={onDelete} className="p-1.5 hover:bg-red-50 rounded-lg" title="O'chirish"><Trash2 size={13} className="text-red-400" /></button>
              )}
            </div>
          </div>

          {step.branches && (
            <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
              {step.branches.map((b, i) => (
                <span key={i} className={`text-xs font-semibold ${b.color} flex items-center gap-1`}>
                  <ChevronRight size={12} />{b.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isLast && (
        <div className="flex flex-col items-center my-1">
          <div className="w-px h-4 bg-gray-300" />
          <button
            onClick={onAddAfter}
            className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center transition-all group"
            title="Qadam qo'shish"
          >
            <Plus size={12} className="text-gray-400 group-hover:text-blue-500" />
          </button>
          <div className="w-px h-4 bg-gray-300" />
          <ArrowDown size={14} className="text-gray-300" />
        </div>
      )}
    </div>
  );
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);
  const [selectedId, setSelectedId] = useState<string>('1');
  const [showAddModal, setShowAddModal] = useState(false);
  const [insertAfterIndex, setInsertAfterIndex] = useState<number>(0);
  const [testRunning, setTestRunning] = useState(false);
  const [testStep, setTestStep] = useState(-1);

  const selected = workflows.find(w => w.id === selectedId) || workflows[0];

  const handleAddStep = (step: WorkflowStep) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id !== selectedId) return w;
      const newSteps = [...w.steps_data];
      newSteps.splice(insertAfterIndex + 1, 0, step);
      return { ...w, steps_data: newSteps, steps: newSteps.length - 1 };
    }));
  };

  const handleDeleteStep = (stepId: string) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id !== selectedId) return w;
      const newSteps = w.steps_data.filter(s => s.id !== stepId);
      return { ...w, steps_data: newSteps, steps: newSteps.filter(s => s.type !== 'trigger').length };
    }));
  };

  const handleTestWorkflow = () => {
    setTestRunning(true);
    setTestStep(0);
    const interval = setInterval(() => {
      setTestStep(prev => {
        if (prev >= (selected.steps_data.length - 1)) {
          clearInterval(interval);
          setTestRunning(false);
          setTestStep(-1);
          return -1;
        }
        return prev + 1;
      });
    }, 900);
  };

  const handleActivate = () => {
    setWorkflows(prev => prev.map(w =>
      w.id === selectedId ? { ...w, status: 'Active' } : w
    ));
  };

  const handleNewWorkflow = () => {
    const newId = String(Date.now());
    const newWf: Workflow = {
      id: newId,
      name: 'Yangi Workflow',
      steps: 0,
      status: 'Draft',
      steps_data: [{ id: 's0', type: 'trigger', name: "Xodim so'rov yuboradi" }],
    };
    setWorkflows(prev => [newWf, ...prev]);
    setSelectedId(newId);
  };

  return (
    <div className="h-full flex gap-6 -m-6 p-0 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Left Panel */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={handleNewWorkflow}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <Plus size={16} />Yangi Workflow
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Mening Workflowlarim</h3>
            <div className="space-y-1">
              {workflows.map(wf => (
                <button
                  key={wf.id}
                  onClick={() => setSelectedId(wf.id)}
                  className={`w-full text-left px-3 py-3 rounded-xl transition-all group ${selectedId === wf.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${selectedId === wf.id ? 'text-blue-700' : 'text-gray-700'}`}>{wf.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${wf.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{wf.status}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{wf.steps} qadam</p>
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 pt-4 pb-4 border-t border-gray-100 mt-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Shablonlar</h3>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map(t => (
                <button key={t.id} className="p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-left transition-all">
                  <div className="text-xl mb-1">{t.icon}</div>
                  <p className="text-xs font-semibold text-gray-700 leading-tight">{t.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.steps} qadam</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Canvas Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
            <p className="text-sm text-gray-500">{selected.steps_data.filter(s => s.type !== 'trigger').length} qadam · <span className={`font-medium ${selected.status === 'Active' ? 'text-green-600' : 'text-amber-600'}`}>{selected.status}</span></p>
          </div>
          <div className="flex items-center gap-3">
            {testRunning && (
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Test jarayonida... ({testStep + 1}/{selected.steps_data.length})
              </div>
            )}
            <button
              onClick={handleTestWorkflow}
              disabled={testRunning}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-40"
            >
              <Play size={14} className="text-green-500" />Test Workflow
            </button>
            {selected.status === 'Draft' && (
              <button
                onClick={handleActivate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium text-white transition-all shadow-sm"
              >
                <CheckCircle size={14} />Faollashtirish
              </button>
            )}
            {selected.status === 'Active' && (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-green-50 rounded-xl text-sm font-medium text-green-700">
                <CheckCircle size={14} />Faol
              </div>
            )}
          </div>
        </div>

        {/* Canvas Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col items-center min-h-full">
            <div className="w-full max-w-sm space-y-0">
              {selected.steps_data.map((step, index) => (
                <div key={step.id} className="relative">
                  {testRunning && testStep === index && (
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 animate-ping z-10" />
                  )}
                  <div className={`transition-all ${testRunning && testStep > index ? 'opacity-60' : ''} ${testRunning && testStep === index ? 'scale-105' : ''}`}>
                    <StepBox
                      step={step}
                      isLast={index === selected.steps_data.length - 1}
                      onDelete={() => handleDeleteStep(step.id)}
                      onEdit={() => {}}
                      onAddAfter={() => {
                        setInsertAfterIndex(index);
                        setShowAddModal(true);
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="flex flex-col items-center mt-2">
                <div className="w-px h-4 bg-gray-300" />
                <button
                  onClick={() => {
                    setInsertAfterIndex(selected.steps_data.length - 1);
                    setShowAddModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl text-sm font-medium text-gray-500 hover:text-blue-600 transition-all"
                >
                  <Plus size={16} />Qadam qo'shish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddStepModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddStep}
          insertAfterIndex={insertAfterIndex}
        />
      )}
    </div>
  );
}
