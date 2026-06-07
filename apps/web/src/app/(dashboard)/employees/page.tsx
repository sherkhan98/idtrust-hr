'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Users, Search, Plus, Filter, Download, Upload,
  MoreHorizontal, Eye, Edit, UserX, Mail, Phone,
  Building2, MapPin, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { employeesApi } from '@/lib/api';
import { formatDate, getStatusColor, getInitials, cn } from '@/lib/utils';

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
  'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
  'bg-yellow-500', 'bg-cyan-500',
];

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active', ON_LEAVE: 'On Leave', RESIGNED: 'Resigned',
  TERMINATED: 'Terminated', SUSPENDED: 'Suspended',
};

const WORK_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full Time', PART_TIME: 'Part Time', REMOTE: 'Remote', HYBRID: 'Hybrid',
};

// Mock employees for demo
const MOCK_EMPLOYEES = Array.from({ length: 20 }, (_, i) => ({
  id: `emp-${i + 1}`,
  employeeCode: `EMP${String(i + 1).padStart(4, '0')}`,
  firstName: ['Alisher', 'Bobur', 'Jasur', 'Malika', 'Zulfiya', 'Kamola', 'Sherzod', 'Nilufar', 'Timur', 'Dilnoza'][i % 10],
  lastName: ['Toshmatov', 'Yusupov', 'Karimov', 'Rahimova', 'Nazarova', 'Xolmatova', 'Mirzayev', 'Qodirova', 'Sultanov', 'Ergasheva'][i % 10],
  email: `employee${i + 1}@nexusgroup.uz`,
  phone: `+99890${String(1000000 + i * 111111).slice(0, 7)}`,
  status: i % 9 === 0 ? 'ON_LEAVE' : 'ACTIVE',
  workType: i % 5 === 0 ? 'HYBRID' : 'FULL_TIME',
  hireDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1).toISOString(),
  baseSalary: (3000000 + i * 500000),
  department: { name: ['IT', 'HR', 'Finance', 'Sales', 'Operations', 'Logistics', 'Support'][i % 7] },
  position: { name: ['Software Engineer', 'HR Manager', 'Accountant', 'Sales Manager', 'Operations Lead', 'Coordinator', 'Support Agent'][i % 7] },
  branch: { name: ['Tashkent HQ', 'Samarkand', 'Namangan'][i % 3] },
}));

export default function EmployeesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const { data, isLoading } = useQuery({
    queryKey: ['employees', { page, search, statusFilter, deptFilter }],
    queryFn: () =>
      employeesApi.list({
        page,
        limit: 20,
        search: search || undefined,
        status: statusFilter || undefined,
        departmentId: deptFilter || undefined,
      }),
    placeholderData: {
      data: MOCK_EMPLOYEES,
      meta: { total: 50, page: 1, limit: 20, totalPages: 3 },
    } as any,
  });

  const employees = (data as any)?.data || MOCK_EMPLOYEES;
  const meta = (data as any)?.meta || { total: 50, page: 1, totalPages: 3 };

  const filtered = employees.filter((emp: any) => {
    const name = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    return (
      (!search || name.includes(search.toLowerCase()) || emp.employeeCode.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || emp.status === statusFilter)
    );
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">{meta.total} total employees</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export
          </button>
          <Link href="/employees/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Employee
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, code, email..."
              className="input-field pl-9"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-36"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="RESIGNED">Resigned</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="input-field w-36"
          >
            <option value="">All Departments</option>
            <option value="dept-it">IT</option>
            <option value="dept-hr">HR</option>
            <option value="dept-finance">Finance</option>
            <option value="dept-sales">Sales</option>
          </select>

          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={cn('p-1.5 rounded', viewMode === 'table' ? 'bg-white shadow-sm' : 'hover:bg-gray-200')}
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18M3 14h18M3 18h18" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn('p-1.5 rounded', viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200')}
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="table-header w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                  <th className="table-header">Employee</th>
                  <th className="table-header">Department</th>
                  <th className="table-header">Position</th>
                  <th className="table-header">Branch</th>
                  <th className="table-header">Work Type</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Hire Date</th>
                  <th className="table-header w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((emp: any, i: number) => (
                  <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="table-cell">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0', AVATAR_COLORS[i % AVATAR_COLORS.length])}>
                          {getInitials(emp.firstName, emp.lastName)}
                        </div>
                        <div className="min-w-0">
                          <Link href={`/employees/${emp.id}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate block">
                            {emp.firstName} {emp.lastName}
                          </Link>
                          <div className="text-xs text-gray-400">{emp.employeeCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-700">{emp.department?.name || '-'}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-700 max-w-[160px] block truncate">{emp.position?.name || '-'}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        {emp.branch?.name || '-'}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="badge-blue">{WORK_TYPE_LABELS[emp.workType] || emp.workType}</span>
                    </td>
                    <td className="table-cell">
                      <span className={getStatusColor(emp.status)}>
                        {STATUS_LABELS[emp.status] || emp.status}
                      </span>
                    </td>
                    <td className="table-cell text-gray-500">
                      {formatDate(emp.hireDate)}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/employees/${emp.id}`} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link href={`/employees/${emp.id}/edit`} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Showing {(meta.page - 1) * 20 + 1}–{Math.min(meta.page * 20, meta.total)} of {meta.total}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors',
                    page === p ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50',
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((emp: any, i: number) => (
            <Link
              key={emp.id}
              href={`/employees/${emp.id}`}
              className="card p-4 hover:shadow-card-hover transition-all duration-200 group text-center"
            >
              <div className={cn('w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-3', AVATAR_COLORS[i % AVATAR_COLORS.length])}>
                {getInitials(emp.firstName, emp.lastName)}
              </div>
              <div className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                {emp.firstName} {emp.lastName}
              </div>
              <div className="text-xs text-gray-500 truncate mt-0.5">{emp.position?.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{emp.department?.name}</div>
              <div className="mt-2">
                <span className={cn(getStatusColor(emp.status), 'text-xs')}>{STATUS_LABELS[emp.status]}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
