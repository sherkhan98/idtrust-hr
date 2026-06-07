'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, Building2, User,
  Edit, MoreHorizontal, Badge, Clock, TrendingUp, FileText, Star,
  CheckCircle2, XCircle, AlertCircle, ChevronRight, Loader2
} from 'lucide-react';
import { employeesApi } from '@/lib/api';
import { formatDate, formatCurrency, getInitials, getStatusColor, cn } from '@/lib/utils';
import Link from 'next/link';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'payroll', label: 'Payroll' },
  { id: 'leave', label: 'Leave' },
  { id: 'kpi', label: 'KPI' },
  { id: 'documents', label: 'Documents' },
  { id: 'activity', label: 'Activity' },
];

const mockEmployee = {
  id: '1',
  code: 'EMP-001',
  firstName: 'Jasur',
  lastName: 'Karimov',
  middleName: 'Bekmurod',
  email: 'jasur.karimov@nexusgroup.uz',
  phone: '+998 90 123 45 67',
  status: 'ACTIVE',
  workType: 'FULL_TIME',
  hireDate: '2022-03-15',
  birthDate: '1990-05-20',
  gender: 'MALE',
  address: 'Tashkent, Mirzo-Ulugbek district',
  salary: 8500000,
  department: { name: 'Engineering' },
  position: { title: 'Senior Developer' },
  branch: { name: 'Tashkent HQ' },
  manager: { firstName: 'Dilnoza', lastName: 'Yusupova' },
  attendanceStats: { present: 18, absent: 1, late: 2, total: 21 },
  leaveBalance: { annual: 12, sick: 5, used: 6 },
  kpiScore: 87.5,
  completedTasks: 34,
  openTasks: 8,
};

const mockAttendance = Array.from({ length: 10 }, (_, i) => ({
  date: `2024-05-${String(20 - i).padStart(2, '0')}`,
  checkIn: i === 2 ? null : `0${8 + (i % 2)}:${i % 2 === 0 ? '58' : '15'}`,
  checkOut: i === 2 ? null : '18:05',
  method: ['FACE', 'QR', 'MOBILE', 'GPS'][i % 4],
  status: i === 2 ? 'ABSENT' : i === 4 ? 'LATE' : 'PRESENT',
  workMinutes: i === 2 ? 0 : 540,
}));

const mockPayrolls = [
  { period: 'May 2024', gross: 8500000, tax: 1020000, pension: 680000, net: 6800000 },
  { period: 'Apr 2024', gross: 8500000, tax: 1020000, pension: 680000, net: 6800000 },
  { period: 'Mar 2024', gross: 9200000, tax: 1104000, pension: 736000, net: 7360000 },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  PRESENT: { label: 'Present', color: 'text-green-600 bg-green-50', icon: CheckCircle2 },
  ABSENT: { label: 'Absent', color: 'text-red-600 bg-red-50', icon: XCircle },
  LATE: { label: 'Late', color: 'text-yellow-600 bg-yellow-50', icon: AlertCircle },
};

const methodColors: Record<string, string> = {
  FACE: 'bg-purple-50 text-purple-700',
  QR: 'bg-blue-50 text-blue-700',
  GPS: 'bg-green-50 text-green-700',
  MOBILE: 'bg-orange-50 text-orange-700',
};

export default function EmployeeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const employee = mockEmployee;

  const attendanceRate = Math.round(
    (employee.attendanceStats.present / employee.attendanceStats.total) * 100
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/employees" className="hover:text-blue-600">Employees</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-700">{employee.firstName} {employee.lastName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/employees/${params.id}/edit`} className="btn-secondary">
            <Edit className="w-4 h-4" /> Edit
          </Link>
          <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="card p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
              {getInitials(employee.firstName, employee.lastName)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {employee.lastName} {employee.firstName} {employee.middleName}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">{employee.position.title} · {employee.department.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                  {employee.code}
                </span>
                <span className={cn(
                  'badge text-xs',
                  employee.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'
                )}>
                  {employee.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {[
                { icon: Mail, label: employee.email },
                { icon: Phone, label: employee.phone },
                { icon: Building2, label: employee.branch.name },
                { icon: Calendar, label: `Hired ${formatDate(employee.hireDate)}` },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex-shrink-0 grid grid-cols-2 gap-3">
            {[
              { label: 'Attendance', value: `${attendanceRate}%`, color: 'text-green-600' },
              { label: 'KPI Score', value: `${employee.kpiScore}%`, color: 'text-blue-600' },
              { label: 'Tasks Done', value: employee.completedTasks, color: 'text-purple-600' },
              { label: 'Open Tasks', value: employee.openTasks, color: 'text-orange-600' },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 bg-gray-50 rounded-xl">
                <div className={cn('text-lg font-bold', s.color)}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-44 flex-shrink-0">
          <div className="card p-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeTab === 'overview' && (
            <>
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    { label: 'Full Name', value: `${employee.lastName} ${employee.firstName} ${employee.middleName}` },
                    { label: 'Gender', value: employee.gender === 'MALE' ? 'Male' : 'Female' },
                    { label: 'Date of Birth', value: formatDate(employee.birthDate) },
                    { label: 'Address', value: employee.address },
                    { label: 'Email', value: employee.email },
                    { label: 'Phone', value: employee.phone },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                      <div className="text-sm text-gray-800 font-medium">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Employment Details</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    { label: 'Employee Code', value: employee.code },
                    { label: 'Department', value: employee.department.name },
                    { label: 'Position', value: employee.position.title },
                    { label: 'Branch', value: employee.branch.name },
                    { label: 'Work Type', value: employee.workType.replace('_', ' ') },
                    { label: 'Manager', value: `${employee.manager.firstName} ${employee.manager.lastName}` },
                    { label: 'Hire Date', value: formatDate(employee.hireDate) },
                    { label: 'Salary', value: formatCurrency(employee.salary, 'UZS') },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                      <div className="text-sm text-gray-800 font-medium">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Leave Balance</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Annual Leave', total: employee.leaveBalance.annual + employee.leaveBalance.used, used: employee.leaveBalance.used, color: 'bg-blue-500' },
                    { label: 'Sick Leave', total: employee.leaveBalance.sick + 2, used: 2, color: 'bg-red-500' },
                    { label: 'Available', total: employee.leaveBalance.annual + employee.leaveBalance.used, used: employee.leaveBalance.annual, color: 'bg-green-500' },
                  ].map((item) => (
                    <div key={item.label} className="p-4 border border-gray-100 rounded-xl">
                      <div className="text-sm font-medium text-gray-700 mb-2">{item.label}</div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">{item.total - item.used}</div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full', item.color)}
                          style={{ width: `${(item.used / item.total) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{item.used} used of {item.total} days</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'attendance' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-gray-900">Attendance History</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Present: {employee.attendanceStats.present}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Absent: {employee.attendanceStats.absent}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Late: {employee.attendanceStats.late}</span>
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr>
                    {['Date', 'Check In', 'Check Out', 'Method', 'Duration', 'Status'].map((h) => (
                      <th key={h} className="table-header">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockAttendance.map((row, i) => {
                    const sc = statusConfig[row.status];
                    const Icon = sc.icon;
                    return (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="table-cell font-medium">{row.date}</td>
                        <td className="table-cell">{row.checkIn ?? '—'}</td>
                        <td className="table-cell">{row.checkOut ?? '—'}</td>
                        <td className="table-cell">
                          {row.method && (
                            <span className={cn('px-2 py-0.5 rounded-md text-xs font-medium', methodColors[row.method])}>
                              {row.method}
                            </span>
                          )}
                        </td>
                        <td className="table-cell text-gray-500">
                          {row.workMinutes > 0 ? `${Math.floor(row.workMinutes / 60)}h ${row.workMinutes % 60}m` : '—'}
                        </td>
                        <td className="table-cell">
                          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', sc.color)}>
                            <Icon className="w-3 h-3" /> {sc.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'payroll' && (
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-5">Payroll History</h3>
              <table className="w-full">
                <thead>
                  <tr>
                    {['Period', 'Gross Salary', 'Income Tax', 'Pension Fund', 'Net Salary'].map((h) => (
                      <th key={h} className="table-header">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockPayrolls.map((row) => (
                    <tr key={row.period} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="table-cell font-medium">{row.period}</td>
                      <td className="table-cell">{formatCurrency(row.gross, 'UZS')}</td>
                      <td className="table-cell text-red-600">-{formatCurrency(row.tax, 'UZS')}</td>
                      <td className="table-cell text-red-600">-{formatCurrency(row.pension, 'UZS')}</td>
                      <td className="table-cell font-semibold text-green-600">{formatCurrency(row.net, 'UZS')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(activeTab === 'leave' || activeTab === 'kpi' || activeTab === 'documents' || activeTab === 'activity') && (
            <div className="card p-12 text-center text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
