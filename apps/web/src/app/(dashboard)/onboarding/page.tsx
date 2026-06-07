'use client';

import { useState } from 'react';
import {
  UserPlus, UserMinus, CheckCircle, Clock, AlertCircle,
  Plus, ChevronRight, User, Laptop, Key, FileText,
  BookOpen, Users, Building2, MoreHorizontal, Edit,
  Trash2, Copy, Play, XCircle, ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type WorkflowType = 'ONBOARDING' | 'OFFBOARDING';
type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'SKIPPED';
type TaskCategory = 'DOCUMENTS' | 'IT_SETUP' | 'ACCESS' | 'TRAINING' | 'INTRODUCTION' | 'KNOWLEDGE';

interface ChecklistTask {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  assignedTo: 'HR' | 'IT' | 'MANAGER' | 'EMPLOYEE';
  dueOffsetDays: number;
  required: boolean;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  type: WorkflowType;
  tasks: ChecklistTask[];
  department?: string;
}

interface ActiveWorkflow {
  id: string;
  type: WorkflowType;
  employeeName: string;
  employeeRole: string;
  department: string;
  startDate: string;
  completionDate?: string;
  progress: number;
  tasks: { id: string; title: string; status: TaskStatus; assignedTo: string; dueDate: string; category: TaskCategory }[];
  avatar: string;
  bg: string;
}

const CATEGORY_META: Record<TaskCategory, { label: string; icon: any; color: string; bg: string }> = {
  DOCUMENTS:    { label: "Hujjatlar",    icon: FileText,   color: 'text-blue-600',   bg: 'bg-blue-50' },
  IT_SETUP:     { label: "IT sozlash",   icon: Laptop,     color: 'text-purple-600', bg: 'bg-purple-50' },
  ACCESS:       { label: "Kirish huquqi",icon: Key,        color: 'text-orange-600', bg: 'bg-orange-50' },
  TRAINING:     { label: "Ta'lim",       icon: BookOpen,   color: 'text-green-600',  bg: 'bg-green-50' },
  INTRODUCTION: { label: "Tanishish",    icon: Users,      color: 'text-teal-600',   bg: 'bg-teal-50' },
  KNOWLEDGE:    { label: "Bilim topshirish", icon: Building2, color: 'text-red-600', bg: 'bg-red-50' },
};

const TEMPLATES: WorkflowTemplate[] = [
  {
    id: 't1', name: 'Standart Onboarding', type: 'ONBOARDING',
    tasks: [
      { id: 'task1', title: "Mehnat shartnomasi imzolash", category: 'DOCUMENTS', assignedTo: 'HR', dueOffsetDays: 0, required: true },
      { id: 'task2', title: "Shaxsiy ma'lumotlar to'ldirish", category: 'DOCUMENTS', assignedTo: 'HR', dueOffsetDays: 0, required: true },
      { id: 'task3', title: "Noutbuk va qurilmalar berish", category: 'IT_SETUP', assignedTo: 'IT', dueOffsetDays: 1, required: true },
      { id: 'task4', title: "Korporativ email yaratish", category: 'IT_SETUP', assignedTo: 'IT', dueOffsetDays: 1, required: true },
      { id: 'task5', title: "Tizimga kirish parollarini berish", category: 'ACCESS', assignedTo: 'IT', dueOffsetDays: 1, required: true },
      { id: 'task6', title: "Slack / Teams ga qo'shish", category: 'ACCESS', assignedTo: 'IT', dueOffsetDays: 1, required: false },
      { id: 'task7', title: "Jamoa bilan tanishtirish", category: 'INTRODUCTION', assignedTo: 'MANAGER', dueOffsetDays: 1, required: true },
      { id: 'task8', title: "Ofis qoidalari bilan tanishtirish", category: 'INTRODUCTION', assignedTo: 'HR', dueOffsetDays: 1, required: true },
      { id: 'task9', title: "30 kunlik maqsadlar belgilash", category: 'TRAINING', assignedTo: 'MANAGER', dueOffsetDays: 3, required: true },
      { id: 'task10', title: "Mahsulot bo'yicha trening", category: 'TRAINING', assignedTo: 'MANAGER', dueOffsetDays: 7, required: true },
    ],
  },
  {
    id: 't2', name: "IT Xodim Onboarding", type: 'ONBOARDING', department: 'IT',
    tasks: [
      { id: 'task1', title: "Mehnat shartnomasi", category: 'DOCUMENTS', assignedTo: 'HR', dueOffsetDays: 0, required: true },
      { id: 'task2', title: "GitHub / GitLab access", category: 'ACCESS', assignedTo: 'IT', dueOffsetDays: 1, required: true },
      { id: 'task3', title: "Dev environment sozlash", category: 'IT_SETUP', assignedTo: 'IT', dueOffsetDays: 1, required: true },
      { id: 'task4', title: "Code review process bilan tanishtirish", category: 'TRAINING', assignedTo: 'MANAGER', dueOffsetDays: 3, required: true },
    ],
  },
  {
    id: 't3', name: 'Standart Offboarding', type: 'OFFBOARDING',
    tasks: [
      { id: 'task1', title: "Ishdan bo'shatish buyrug'i", category: 'DOCUMENTS', assignedTo: 'HR', dueOffsetDays: 0, required: true },
      { id: 'task2', title: "Bilim va loyihalarni topshirish", category: 'KNOWLEDGE', assignedTo: 'EMPLOYEE', dueOffsetDays: 3, required: true },
      { id: 'task3', title: "Qurilmalarni qaytarish", category: 'IT_SETUP', assignedTo: 'IT', dueOffsetDays: 5, required: true },
      { id: 'task4', title: "Barcha tizim kirishlarini bloklash", category: 'ACCESS', assignedTo: 'IT', dueOffsetDays: 7, required: true },
      { id: 'task5', title: "Chiqish intervyusi", category: 'INTRODUCTION', assignedTo: 'HR', dueOffsetDays: 5, required: false },
      { id: 'task6', title: "So'nggi maosh hisob-kitobi", category: 'DOCUMENTS', assignedTo: 'HR', dueOffsetDays: 7, required: true },
    ],
  },
];

const ACTIVE_WORKFLOWS: ActiveWorkflow[] = [
  {
    id: 'w1', type: 'ONBOARDING', employeeName: 'Doniyor Yusupov', employeeRole: 'Frontend Developer',
    department: 'IT', startDate: '2024-06-10', progress: 70, avatar: 'DY', bg: 'bg-blue-500',
    tasks: [
      { id: 't1', title: "Mehnat shartnomasi imzolash", status: 'DONE', assignedTo: 'HR', dueDate: '2024-06-10', category: 'DOCUMENTS' },
      { id: 't2', title: "Noutbuk berish", status: 'DONE', assignedTo: 'IT', dueDate: '2024-06-11', category: 'IT_SETUP' },
      { id: 't3', title: "Email yaratish", status: 'DONE', assignedTo: 'IT', dueDate: '2024-06-11', category: 'IT_SETUP' },
      { id: 't4', title: "Jamoa bilan tanishtirish", status: 'DONE', assignedTo: 'MANAGER', dueDate: '2024-06-11', category: 'INTRODUCTION' },
      { id: 't5', title: "GitHub access", status: 'IN_PROGRESS', assignedTo: 'IT', dueDate: '2024-06-12', category: 'ACCESS' },
      { id: 't6', title: "Mahsulot bo'yicha trening", status: 'PENDING', assignedTo: 'MANAGER', dueDate: '2024-06-17', category: 'TRAINING' },
      { id: 't7', title: "30 kunlik maqsadlar", status: 'PENDING', assignedTo: 'MANAGER', dueDate: '2024-06-13', category: 'TRAINING' },
    ],
  },
  {
    id: 'w2', type: 'ONBOARDING', employeeName: 'Sarvinoz Mirzaeva', employeeRole: 'HR Specialist',
    department: 'HR', startDate: '2024-06-12', progress: 30, avatar: 'SM', bg: 'bg-purple-500',
    tasks: [
      { id: 't1', title: "Mehnat shartnomasi", status: 'DONE', assignedTo: 'HR', dueDate: '2024-06-12', category: 'DOCUMENTS' },
      { id: 't2', title: "Email yaratish", status: 'IN_PROGRESS', assignedTo: 'IT', dueDate: '2024-06-13', category: 'IT_SETUP' },
      { id: 't3', title: "HR tizimiga kirish", status: 'PENDING', assignedTo: 'IT', dueDate: '2024-06-13', category: 'ACCESS' },
      { id: 't4', title: "Ofis qoidalari", status: 'PENDING', assignedTo: 'HR', dueDate: '2024-06-13', category: 'INTRODUCTION' },
    ],
  },
  {
    id: 'w3', type: 'OFFBOARDING', employeeName: 'Rustam Xoliqov', employeeRole: 'Sales Manager',
    department: 'Sales', startDate: '2024-06-08', completionDate: '2024-06-15', progress: 85, avatar: 'RX', bg: 'bg-red-500',
    tasks: [
      { id: 't1', title: "Ishdan bo'shatish buyrug'i", status: 'DONE', assignedTo: 'HR', dueDate: '2024-06-08', category: 'DOCUMENTS' },
      { id: 't2', title: "Mijozlar bazasini topshirish", status: 'DONE', assignedTo: 'EMPLOYEE', dueDate: '2024-06-11', category: 'KNOWLEDGE' },
      { id: 't3', title: "Laptop qaytarish", status: 'IN_PROGRESS', assignedTo: 'IT', dueDate: '2024-06-14', category: 'IT_SETUP' },
      { id: 't4', title: "Tizim kirishlarini bloklash", status: 'PENDING', assignedTo: 'IT', dueDate: '2024-06-15', category: 'ACCESS' },
      { id: 't5', title: "Chiqish intervyusi", status: 'PENDING', assignedTo: 'HR', dueDate: '2024-06-14', category: 'INTRODUCTION' },
    ],
  },
];

function TaskStatusIcon({ status }: { status: TaskStatus }) {
  if (status === 'DONE') return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (status === 'IN_PROGRESS') return <Clock className="w-4 h-4 text-blue-500" />;
  if (status === 'SKIPPED') return <XCircle className="w-4 h-4 text-gray-400" />;
  return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
}

function ProgressBar({ value, type }: { value: number; type: WorkflowType }) {
  return (
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all', type === 'ONBOARDING' ? 'bg-blue-500' : 'bg-orange-500')}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function WorkflowCard({ workflow, onClick }: { workflow: ActiveWorkflow; onClick: () => void }) {
  const done = workflow.tasks.filter(t => t.status === 'DONE').length;
  const inProgress = workflow.tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const pending = workflow.tasks.filter(t => t.status === 'PENDING').length;

  return (
    <div
      onClick={onClick}
      className="card p-5 hover:shadow-md transition-shadow cursor-pointer border hover:border-blue-100"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0', workflow.bg)}>
            {workflow.avatar}
          </div>
          <div>
            <div className="font-semibold text-sm text-gray-900">{workflow.employeeName}</div>
            <div className="text-xs text-gray-500 mt-0.5">{workflow.employeeRole} · {workflow.department}</div>
          </div>
        </div>
        <span className={cn('flex-shrink-0', workflow.type === 'ONBOARDING' ? 'badge-blue' : 'badge-yellow')}>
          {workflow.type === 'ONBOARDING' ? <UserPlus className="w-3 h-3 mr-1 inline" /> : <UserMinus className="w-3 h-3 mr-1 inline" />}
          {workflow.type === 'ONBOARDING' ? 'Onboarding' : 'Offboarding'}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-gray-500">Jarayon</span>
          <span className="font-semibold text-gray-700">{workflow.progress}%</span>
        </div>
        <ProgressBar value={workflow.progress} type={workflow.type} />
      </div>

      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" />{done} bajarildi</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-blue-500" />{inProgress} jarayonda</span>
        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full border-2 border-gray-300" />{pending} kutmoqda</span>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
        <span>Boshlangan: {workflow.startDate}</span>
        {workflow.completionDate && <span className="text-orange-500">Muddat: {workflow.completionDate}</span>}
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
}

function WorkflowDetail({ workflow, onClose }: { workflow: ActiveWorkflow; onClose: () => void }) {
  const [tasks, setTasks] = useState(workflow.tasks);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === 'DONE' ? 'PENDING' : 'DONE' as TaskStatus } : t
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold', workflow.bg)}>
              {workflow.avatar}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{workflow.employeeName}</h2>
              <p className="text-xs text-gray-500">{workflow.employeeRole} · {workflow.type === 'ONBOARDING' ? 'Onboarding' : 'Offboarding'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Umumiy jarayon</span>
              <span className="font-semibold">{Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100)}%</span>
            </div>
            <ProgressBar value={Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100)} type={workflow.type} />
          </div>

          {(['DOCUMENTS','IT_SETUP','ACCESS','TRAINING','INTRODUCTION','KNOWLEDGE'] as TaskCategory[]).map(cat => {
            const catTasks = tasks.filter(t => t.category === cat);
            if (catTasks.length === 0) return null;
            const meta = CATEGORY_META[cat];
            return (
              <div key={cat} className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', meta.bg)}>
                    <meta.icon className={cn('w-3.5 h-3.5', meta.color)} />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{meta.label}</span>
                </div>
                <div className="space-y-2 pl-8">
                  {catTasks.map(task => (
                    <div
                      key={task.id}
                      className={cn('flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer',
                        task.status === 'DONE' ? 'border-green-100 bg-green-50/50' : 'border-gray-100 hover:border-blue-100 hover:bg-blue-50/30'
                      )}
                      onClick={() => toggleTask(task.id)}
                    >
                      <TaskStatusIcon status={task.status} />
                      <div className="flex-1 min-w-0">
                        <div className={cn('text-sm font-medium', task.status === 'DONE' ? 'line-through text-gray-400' : 'text-gray-800')}>
                          {task.title}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{task.assignedTo} · Muddat: {task.dueDate}</div>
                      </div>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full',
                        task.status === 'DONE' ? 'bg-green-100 text-green-700' :
                        task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      )}>
                        {task.status === 'DONE' ? 'Bajarildi' : task.status === 'IN_PROGRESS' ? 'Jarayonda' : 'Kutmoqda'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button className="btn-secondary text-sm">
            <Edit className="w-4 h-4" />
            Tahrirlash
          </button>
          <button onClick={onClose} className="btn-primary text-sm">Yopish</button>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'templates'>('active');
  const [filter, setFilter] = useState<'ALL' | 'ONBOARDING' | 'OFFBOARDING'>('ALL');
  const [selectedWorkflow, setSelectedWorkflow] = useState<ActiveWorkflow | null>(null);

  const filtered = ACTIVE_WORKFLOWS.filter(w => filter === 'ALL' || w.type === filter);
  const onboardingCount = ACTIVE_WORKFLOWS.filter(w => w.type === 'ONBOARDING').length;
  const offboardingCount = ACTIVE_WORKFLOWS.filter(w => w.type === 'OFFBOARDING').length;
  const avgProgress = Math.round(ACTIVE_WORKFLOWS.reduce((s, w) => s + w.progress, 0) / ACTIVE_WORKFLOWS.length);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Onboarding & Offboarding</h1>
          <p className="page-subtitle">Xodim kirish va chiqish jarayonlarini boshqarish</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <UserMinus className="w-4 h-4" />
            Offboarding boshlash
          </button>
          <button className="btn-primary">
            <UserPlus className="w-4 h-4" />
            Onboarding boshlash
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Faol Onboarding', value: onboardingCount, color: 'text-blue-600', icon: UserPlus, bg: 'bg-blue-50' },
          { label: 'Faol Offboarding', value: offboardingCount, color: 'text-orange-600', icon: UserMinus, bg: 'bg-orange-50' },
          { label: "O'rtacha jarayon", value: `${avgProgress}%`, color: 'text-green-600', icon: CheckCircle, bg: 'bg-green-50' },
          { label: 'Shablonlar', value: TEMPLATES.length, color: 'text-purple-600', icon: Copy, bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                <p className={cn('text-2xl font-bold mt-1', s.color)}>{s.value}</p>
              </div>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', s.bg)}>
                <s.icon className={cn('w-5 h-5', s.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg">
          {[
            { id: 'active', label: 'Faol jarayonlar' },
            { id: 'templates', label: 'Shablonlar' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn('px-4 py-1.5 text-sm font-medium rounded-md transition-all',
                activeTab === tab.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'active' && (
          <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg">
            {[
              { id: 'ALL', label: 'Hammasi' },
              { id: 'ONBOARDING', label: 'Onboarding' },
              { id: 'OFFBOARDING', label: 'Offboarding' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                  filter === f.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeTab === 'active' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(w => (
            <WorkflowCard key={w.id} workflow={w} onClick={() => setSelectedWorkflow(w)} />
          ))}
          <button className="card p-5 border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500 min-h-[180px]">
            <Plus className="w-8 h-8" />
            <span className="text-sm font-medium">Yangi jarayon boshlash</span>
          </button>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-4">
          {TEMPLATES.map(template => (
            <div key={template.id} className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center',
                    template.type === 'ONBOARDING' ? 'bg-blue-50' : 'bg-orange-50'
                  )}>
                    {template.type === 'ONBOARDING'
                      ? <UserPlus className="w-4.5 h-4.5 text-blue-600" />
                      : <UserMinus className="w-4.5 h-4.5 text-orange-600" />
                    }
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{template.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {template.tasks.length} ta vazifa
                      {template.department && ` · ${template.department} uchun`}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary text-xs py-1.5">
                    <Edit className="w-3.5 h-3.5" />
                    Tahrirlash
                  </button>
                  <button className="btn-primary text-xs py-1.5">
                    <Play className="w-3.5 h-3.5" />
                    Ishga tushirish
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {(['DOCUMENTS','IT_SETUP','ACCESS','TRAINING','INTRODUCTION','KNOWLEDGE'] as TaskCategory[]).map(cat => {
                    const count = template.tasks.filter(t => t.category === cat).length;
                    if (count === 0) return null;
                    const meta = CATEGORY_META[cat];
                    return (
                      <div key={cat} className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium', meta.bg, meta.color)}>
                        <meta.icon className="w-3 h-3" />
                        {meta.label} ({count})
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 space-y-1">
                  {template.tasks.slice(0, 4).map(task => (
                    <div key={task.id} className="flex items-center gap-2 text-xs text-gray-600">
                      <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span>{task.title}</span>
                      <span className="text-gray-400 ml-auto flex-shrink-0">Kun {task.dueOffsetDays}</span>
                    </div>
                  ))}
                  {template.tasks.length > 4 && (
                    <div className="text-xs text-blue-500 pl-5">+{template.tasks.length - 4} ta vazifa ko'proq...</div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Yangi shablon yaratish
          </button>
        </div>
      )}

      {selectedWorkflow && (
        <WorkflowDetail workflow={selectedWorkflow} onClose={() => setSelectedWorkflow(null)} />
      )}
    </div>
  );
}
