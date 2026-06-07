'use client';

import { useState } from 'react';
import {
  HelpCircle, Plus, Search, Filter, MessageSquare, Clock,
  CheckCircle2, AlertCircle, XCircle, ChevronDown, User,
  Tag, Calendar, MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'all' | 'open' | 'in_progress' | 'resolved' | 'closed';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

const STATUS_TABS: { id: Status; label: string; count: number }[] = [
  { id: 'all', label: 'All', count: 24 },
  { id: 'open', label: 'Open', count: 8 },
  { id: 'in_progress', label: 'In Progress', count: 6 },
  { id: 'resolved', label: 'Resolved', count: 7 },
  { id: 'closed', label: 'Closed', count: 3 },
];

const tickets = [
  { id: 'TKT-001', title: 'Cannot access payroll portal', category: 'IT Support', status: 'open', priority: 'high', requester: 'Jasur Karimov', assignee: 'IT Team', created: '2024-05-20', updated: '2024-05-20', comments: 2 },
  { id: 'TKT-002', title: 'Leave request not approved after 5 days', category: 'HR', status: 'in_progress', priority: 'medium', requester: 'Sardor Toshev', assignee: 'Dilnoza Yusupova', created: '2024-05-19', updated: '2024-05-21', comments: 4 },
  { id: 'TKT-003', title: 'Overtime calculation incorrect in May payroll', category: 'Payroll', status: 'in_progress', priority: 'urgent', requester: 'Feruza Tosheva', assignee: 'Mirzo Tursunov', created: '2024-05-18', updated: '2024-05-22', comments: 7 },
  { id: 'TKT-004', title: 'Request for updated employment certificate', category: 'Documents', status: 'resolved', priority: 'low', requester: 'Nodir Hasanov', assignee: 'Dilnoza Yusupova', created: '2024-05-15', updated: '2024-05-17', comments: 3 },
  { id: 'TKT-005', title: 'VPN access for remote work', category: 'IT Support', status: 'open', priority: 'medium', requester: 'Ulugbek Sobirov', assignee: null, created: '2024-05-22', updated: '2024-05-22', comments: 0 },
  { id: 'TKT-006', title: 'Annual leave balance discrepancy', category: 'HR', status: 'open', priority: 'high', requester: 'Kamola Umarova', assignee: null, created: '2024-05-21', updated: '2024-05-21', comments: 1 },
  { id: 'TKT-007', title: 'New employee laptop setup request', category: 'IT Support', status: 'resolved', priority: 'medium', requester: 'Malika Hamidova', assignee: 'IT Team', created: '2024-05-10', updated: '2024-05-12', comments: 5 },
];

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  open: { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  in_progress: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  resolved: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  closed: { icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-50' },
};

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-gray-500 bg-gray-50' },
  medium: { label: 'Medium', color: 'text-blue-600 bg-blue-50' },
  high: { label: 'High', color: 'text-orange-600 bg-orange-50' },
  urgent: { label: 'Urgent', color: 'text-red-600 bg-red-50' },
};

const categoryColors: Record<string, string> = {
  'IT Support': 'bg-purple-50 text-purple-700',
  'HR': 'bg-blue-50 text-blue-700',
  'Payroll': 'bg-green-50 text-green-700',
  'Documents': 'bg-orange-50 text-orange-700',
};

export default function HelpDeskPage() {
  const [activeStatus, setActiveStatus] = useState<Status>('all');
  const [search, setSearch] = useState('');

  const filtered = tickets.filter((t) => {
    if (activeStatus !== 'all' && t.status !== activeStatus) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) &&
        !t.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const summaryStats = [
    { label: 'Open', value: tickets.filter((t) => t.status === 'open').length, color: 'text-yellow-600' },
    { label: 'In Progress', value: tickets.filter((t) => t.status === 'in_progress').length, color: 'text-blue-600' },
    { label: 'Resolved Today', value: 2, color: 'text-green-600' },
    { label: 'Avg. Response', value: '4h', color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Help Desk</h1>
          <p className="page-subtitle">Employee support tickets and IT requests</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {summaryStats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className={cn('text-2xl font-bold', s.color)}>{s.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatus(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                activeStatus === tab.id ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {tab.label}
              <span className={cn(
                'text-xs px-1.5 rounded-full',
                activeStatus === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="input-field pl-9 w-64"
          />
        </div>
      </div>

      {/* Tickets Table */}
      <div className="card">
        <table className="w-full">
          <thead>
            <tr>
              {['Ticket', 'Title', 'Category', 'Priority', 'Requester', 'Assignee', 'Status', 'Updated', ''].map((h) => (
                <th key={h} className="table-header">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((ticket) => {
              const sc = statusConfig[ticket.status];
              const StatusIcon = sc.icon;
              const pc = priorityConfig[ticket.priority as Priority];

              return (
                <tr key={ticket.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="table-cell">
                    <span className="text-xs font-mono text-gray-400">{ticket.id}</span>
                  </td>
                  <td className="table-cell max-w-xs">
                    <div className="text-sm font-medium text-gray-800 truncate">{ticket.title}</div>
                    {ticket.comments > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <MessageSquare className="w-3 h-3" /> {ticket.comments}
                      </div>
                    )}
                  </td>
                  <td className="table-cell">
                    <span className={cn('px-2 py-0.5 rounded-md text-xs font-medium', categoryColors[ticket.category] || 'bg-gray-50 text-gray-600')}>
                      {ticket.category}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', pc.color)}>
                      {pc.label}
                    </span>
                  </td>
                  <td className="table-cell text-sm text-gray-600">{ticket.requester}</td>
                  <td className="table-cell">
                    {ticket.assignee ? (
                      <span className="text-sm text-gray-600">{ticket.assignee}</span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', sc.bg, sc.color)}>
                      <StatusIcon className="w-3 h-3" />
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="table-cell text-xs text-gray-400">{ticket.updated}</td>
                  <td className="table-cell">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No tickets found</p>
          </div>
        )}
      </div>
    </div>
  );
}
