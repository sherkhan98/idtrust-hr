'use client';

import { useState } from 'react';
import {
  Building2, ChevronDown, ChevronRight, Plus, Users, MapPin,
  Phone, Globe, MoreHorizontal, Search, GitBranch, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'structure', label: 'Org Structure', icon: GitBranch },
  { id: 'departments', label: 'Departments', icon: Layers },
  { id: 'branches', label: 'Branches', icon: Building2 },
  { id: 'positions', label: 'Positions', icon: Users },
];

type Department = {
  id: string;
  name: string;
  head: string;
  headTitle: string;
  employeeCount: number;
  color: string;
  children?: Department[];
};

const orgTree: Department = {
  id: 'root',
  name: 'Nexus Group LLC',
  head: 'Aziz Nazarov',
  headTitle: 'Chief Executive Officer',
  employeeCount: 50,
  color: 'bg-blue-600',
  children: [
    {
      id: 'eng',
      name: 'Engineering',
      head: 'Bobur Rashidov',
      headTitle: 'CTO',
      employeeCount: 18,
      color: 'bg-indigo-500',
      children: [
        { id: 'frontend', name: 'Frontend', head: 'Sardor Toshev', headTitle: 'Lead Developer', employeeCount: 6, color: 'bg-indigo-400' },
        { id: 'backend', name: 'Backend', head: 'Doniyor Ergashev', headTitle: 'Lead Developer', employeeCount: 8, color: 'bg-indigo-400' },
        { id: 'devops', name: 'DevOps', head: 'Ulugbek Sobirov', headTitle: 'DevOps Lead', employeeCount: 4, color: 'bg-indigo-400' },
      ],
    },
    {
      id: 'hr',
      name: 'Human Resources',
      head: 'Dilnoza Yusupova',
      headTitle: 'HR Director',
      employeeCount: 8,
      color: 'bg-purple-500',
      children: [
        { id: 'recruitment', name: 'Recruitment', head: 'Malika Hamidova', headTitle: 'Recruiter', employeeCount: 3, color: 'bg-purple-400' },
        { id: 'training', name: 'Training', head: 'Kamola Umarova', headTitle: 'L&D Specialist', employeeCount: 2, color: 'bg-purple-400' },
      ],
    },
    {
      id: 'finance',
      name: 'Finance',
      head: 'Mirzo Tursunov',
      headTitle: 'CFO',
      employeeCount: 7,
      color: 'bg-green-500',
      children: [
        { id: 'accounting', name: 'Accounting', head: 'Zulfiya Karimova', headTitle: 'Chief Accountant', employeeCount: 4, color: 'bg-green-400' },
        { id: 'treasury', name: 'Treasury', head: 'Sherzod Alimov', headTitle: 'Treasurer', employeeCount: 3, color: 'bg-green-400' },
      ],
    },
    {
      id: 'sales',
      name: 'Sales',
      head: 'Jahongir Mirzayev',
      headTitle: 'Sales Director',
      employeeCount: 12,
      color: 'bg-orange-500',
      children: [
        { id: 'b2b', name: 'B2B Sales', head: 'Nodir Hasanov', headTitle: 'B2B Lead', employeeCount: 6, color: 'bg-orange-400' },
        { id: 'b2c', name: 'B2C Sales', head: 'Feruza Tosheva', headTitle: 'B2C Lead', employeeCount: 6, color: 'bg-orange-400' },
      ],
    },
  ],
};

const departments = [
  { id: '1', name: 'Engineering', head: 'Bobur Rashidov', employees: 18, budget: 450000000, color: 'bg-indigo-100 text-indigo-700' },
  { id: '2', name: 'Human Resources', head: 'Dilnoza Yusupova', employees: 8, budget: 180000000, color: 'bg-purple-100 text-purple-700' },
  { id: '3', name: 'Finance', head: 'Mirzo Tursunov', employees: 7, budget: 200000000, color: 'bg-green-100 text-green-700' },
  { id: '4', name: 'Sales', head: 'Jahongir Mirzayev', employees: 12, budget: 320000000, color: 'bg-orange-100 text-orange-700' },
  { id: '5', name: 'Marketing', head: 'Nilufar Saidova', employees: 5, budget: 150000000, color: 'bg-pink-100 text-pink-700' },
];

const branches = [
  { id: '1', city: 'Tashkent', name: 'Tashkent HQ', address: 'Mirzo-Ulugbek, 12 Mustakillik Ave', phone: '+998 71 200-00-00', employees: 35, isHQ: true },
  { id: '2', city: 'Samarkand', name: 'Samarkand Branch', address: 'Registan district, 5 Temur Ave', phone: '+998 66 300-00-00', employees: 8, isHQ: false },
  { id: '3', city: 'Namangan', name: 'Namangan Branch', address: 'Central district, 22 Navoi St', phone: '+998 69 400-00-00', employees: 7, isHQ: false },
];

const positions = [
  { id: '1', title: 'Software Developer', dept: 'Engineering', level: 'Mid', count: 6 },
  { id: '2', title: 'Senior Developer', dept: 'Engineering', level: 'Senior', count: 4 },
  { id: '3', title: 'Team Lead', dept: 'Engineering', level: 'Lead', count: 3 },
  { id: '4', title: 'HR Manager', dept: 'Human Resources', level: 'Manager', count: 2 },
  { id: '5', title: 'Recruiter', dept: 'Human Resources', level: 'Mid', count: 3 },
  { id: '6', title: 'Chief Accountant', dept: 'Finance', level: 'Senior', count: 1 },
  { id: '7', title: 'Accountant', dept: 'Finance', level: 'Mid', count: 4 },
  { id: '8', title: 'Sales Manager', dept: 'Sales', level: 'Manager', count: 4 },
  { id: '9', title: 'Sales Specialist', dept: 'Sales', level: 'Mid', count: 8 },
];

const levelColors: Record<string, string> = {
  Mid: 'bg-blue-50 text-blue-700',
  Senior: 'bg-purple-50 text-purple-700',
  Lead: 'bg-indigo-50 text-indigo-700',
  Manager: 'bg-orange-50 text-orange-700',
};

function OrgNode({ node, isRoot = false }: { node: Department; isRoot?: boolean }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={cn('flex flex-col items-center', !isRoot && 'relative')}>
      {/* Card */}
      <div className="relative group">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all w-52 p-4">
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3', node.color)}>
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div className="text-sm font-semibold text-gray-900 truncate">{node.name}</div>
          <div className="text-xs text-gray-500 truncate mt-0.5">{node.head}</div>
          <div className="text-xs text-gray-400 truncate">{node.headTitle}</div>
          <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
            <Users className="w-3 h-3" /> {node.employeeCount} employees
          </div>
        </div>
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm z-10"
          >
            {expanded ? <ChevronDown className="w-3 h-3 text-gray-500" /> : <ChevronRight className="w-3 h-3 text-gray-500" />}
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="mt-8 flex gap-6">
          {node.children!.map((child, i) => (
            <div key={child.id} className="flex flex-col items-center relative">
              {/* Connector line */}
              <div className="absolute top-0 left-1/2 -translate-x-px -translate-y-8 w-px h-8 bg-gray-200" />
              {i === 0 && node.children!.length > 1 && (
                <div className="absolute top-0 left-1/2 -translate-y-8 h-px bg-gray-200"
                  style={{ width: `calc(100% * ${node.children!.length / 2})` }} />
              )}
              <OrgNode node={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState('structure');
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Organization</h1>
          <p className="page-subtitle">Manage your company structure, departments, branches, and positions</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          {activeTab === 'departments' ? 'Add Department' :
           activeTab === 'branches' ? 'Add Branch' :
           activeTab === 'positions' ? 'Add Position' : 'Edit Structure'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === tab.id ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Org Structure */}
      {activeTab === 'structure' && (
        <div className="card p-8 overflow-auto">
          <div className="min-w-max flex justify-center">
            <OrgNode node={orgTree} isRoot />
          </div>
        </div>
      )}

      {/* Departments */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 gap-4">
          {departments.map((dept) => (
            <div key={dept.id} className="card p-5 flex items-center gap-5">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold', dept.color)}>
                {dept.name[0]}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{dept.name}</div>
                <div className="text-sm text-gray-500 mt-0.5">Head: {dept.head}</div>
              </div>
              <div className="flex items-center gap-8 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{dept.employees}</div>
                  <div className="text-xs text-gray-400">Employees</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{(dept.budget / 1000000).toFixed(0)}M</div>
                  <div className="text-xs text-gray-400">Budget (UZS)</div>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Branches */}
      {activeTab === 'branches' && (
        <div className="grid grid-cols-3 gap-4">
          {branches.map((branch) => (
            <div key={branch.id} className="card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{branch.name}</span>
                    {branch.isHQ && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">HQ</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">{branch.city}</div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs">{branch.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs">{branch.phone}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center gap-1.5 text-sm text-gray-600">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-medium">{branch.employees}</span>
                <span className="text-gray-400">employees</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Positions */}
      {activeTab === 'positions' && (
        <div className="card">
          <div className="p-4 border-b border-gray-100">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search positions..."
                className="input-field pl-9"
              />
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                {['Position Title', 'Department', 'Level', 'Headcount', ''].map((h) => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {positions
                .filter((p) =>
                  !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
                  p.dept.toLowerCase().includes(search.toLowerCase())
                )
                .map((pos) => (
                  <tr key={pos.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="table-cell font-medium">{pos.title}</td>
                    <td className="table-cell text-gray-500">{pos.dept}</td>
                    <td className="table-cell">
                      <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium', levelColors[pos.level] || 'bg-gray-100 text-gray-600')}>
                        {pos.level}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Users className="w-3.5 h-3.5 text-gray-400" /> {pos.count}
                      </div>
                    </td>
                    <td className="table-cell">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
