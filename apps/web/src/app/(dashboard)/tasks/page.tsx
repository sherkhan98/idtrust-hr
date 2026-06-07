'use client';

import { useState } from 'react';
import { CheckSquare, Plus, Clock, AlertCircle, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const TASKS = [
  { id: 't1', title: 'Update employee handbook Q2 2024', priority: 'HIGH', status: 'IN_PROGRESS', dueDate: '2024-06-15', assignees: ['MY', 'AT'], project: 'HR Processes', progress: 60 },
  { id: 't2', title: 'Conduct onboarding for 3 new hires', priority: 'URGENT', status: 'TODO', dueDate: '2024-06-10', assignees: ['MY'], project: 'Onboarding', progress: 0 },
  { id: 't3', title: 'Setup attendance kiosk at Samarkand branch', priority: 'MEDIUM', status: 'IN_PROGRESS', dueDate: '2024-06-20', assignees: ['BR', 'JN'], project: 'IT Setup', progress: 40 },
  { id: 't4', title: 'Prepare payroll report for May 2024', priority: 'HIGH', status: 'DONE', dueDate: '2024-06-01', assignees: ['ZK'], project: 'Finance', progress: 100 },
  { id: 't5', title: 'Interview candidates for React Developer position', priority: 'HIGH', status: 'IN_PROGRESS', dueDate: '2024-06-12', assignees: ['MY', 'AT', 'BR'], project: 'Recruitment', progress: 70 },
  { id: 't6', title: 'Review and approve Q2 KPI scores', priority: 'MEDIUM', status: 'TODO', dueDate: '2024-06-30', assignees: ['AT'], project: 'Performance', progress: 0 },
];

const PRIORITY_CONFIG: Record<string, { color: string; dot: string }> = {
  URGENT: { color: 'text-red-600', dot: 'bg-red-500' },
  HIGH: { color: 'text-orange-600', dot: 'bg-orange-500' },
  MEDIUM: { color: 'text-blue-600', dot: 'bg-blue-500' },
  LOW: { color: 'text-gray-500', dot: 'bg-gray-400' },
};

const STATUS_CONFIG: Record<string, string> = {
  TODO: 'badge-gray',
  IN_PROGRESS: 'badge-blue',
  IN_REVIEW: 'badge-yellow',
  DONE: 'badge-green',
  CANCELLED: 'badge-red',
};

const KANBAN_COLS = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'] as const;
const KANBAN_LABELS: Record<string, string> = {
  TODO: 'To Do', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review', DONE: 'Done',
};
const KANBAN_COLORS: Record<string, string> = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  IN_REVIEW: 'bg-yellow-100 text-yellow-700',
  DONE: 'bg-green-100 text-green-700',
};

const AVATAR_COLORS = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];

export default function TasksPage() {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [filter, setFilter] = useState('ALL');

  const filtered = filter === 'ALL' ? TASKS : TASKS.filter(t => t.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Manage team tasks and projects</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            {(['list', 'kanban'] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-all', view === v ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500')}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <button className="btn-primary"><Plus className="w-4 h-4" />New Task</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: TASKS.length, icon: CheckSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'In Progress', value: TASKS.filter(t => t.status === 'IN_PROGRESS').length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Overdue', value: 2, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Completed', value: TASKS.filter(t => t.status === 'DONE').length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{s.value}</p>
              </div>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', s.bg)}>
                <s.icon className={cn('w-5 h-5', s.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
              filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50')}>
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {view === 'list' ? (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="table-header">Task</th>
                <th className="table-header">Project</th>
                <th className="table-header">Priority</th>
                <th className="table-header">Assignees</th>
                <th className="table-header">Progress</th>
                <th className="table-header">Due Date</th>
                <th className="table-header">Status</th>
                <th className="table-header w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((task) => {
                const prio = PRIORITY_CONFIG[task.priority];
                return (
                  <tr key={task.id} className="hover:bg-gray-50/50">
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', prio.dot)} />
                        <span className="text-sm font-medium text-gray-800 max-w-xs truncate">{task.title}</span>
                      </div>
                    </td>
                    <td className="table-cell text-gray-500 text-xs">{task.project}</td>
                    <td className="table-cell">
                      <span className={cn('text-xs font-semibold', prio.color)}>{task.priority}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex -space-x-1.5">
                        {task.assignees.map((a, i) => (
                          <div key={i} className={cn('w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white', AVATAR_COLORS[i % AVATAR_COLORS.length])}>
                            {a}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full">
                          <div className={cn('h-full rounded-full', task.progress === 100 ? 'bg-green-500' : 'bg-blue-500')} style={{ width: `${task.progress}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="table-cell text-gray-500">{task.dueDate}</td>
                    <td className="table-cell"><span className={STATUS_CONFIG[task.status]}>{task.status.replace('_', ' ')}</span></td>
                    <td className="table-cell">
                      <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                        <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 overflow-x-auto">
          {KANBAN_COLS.map((col) => {
            const colTasks = TASKS.filter(t => t.status === col);
            return (
              <div key={col} className="min-w-[220px]">
                <div className={cn('flex items-center justify-between px-3 py-2 rounded-lg mb-3', KANBAN_COLORS[col])}>
                  <span className="text-xs font-semibold">{KANBAN_LABELS[col]}</span>
                  <span className="text-xs font-bold">{colTasks.length}</span>
                </div>
                <div className="space-y-2">
                  {colTasks.map((task) => (
                    <div key={task.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-card-hover cursor-pointer transition-all">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-medium text-gray-800 leading-tight">{task.title}</span>
                        <div className={cn('w-2 h-2 rounded-full flex-shrink-0 mt-0.5', PRIORITY_CONFIG[task.priority].dot)} />
                      </div>
                      <div className="text-[10px] text-gray-400 mb-2">{task.project}</div>
                      {task.progress > 0 && (
                        <div className="h-1 bg-gray-100 rounded-full mb-2">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${task.progress}%` }} />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-1">
                          {task.assignees.map((a, i) => (
                            <div key={i} className={cn('w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold border border-white', AVATAR_COLORS[i])}>
                              {a}
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400">{task.dueDate}</span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-2 border-2 border-dashed border-gray-100 rounded-xl text-xs text-gray-300 hover:border-blue-200 hover:text-blue-400 transition-colors">
                    + Add task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
