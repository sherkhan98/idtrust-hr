'use client';

import { useState } from 'react';
import {
  FileText, Upload, Search, Folder, File, Download, Eye, Trash2,
  MoreHorizontal, Filter, FolderOpen, ChevronRight, Plus, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

type DocCategory = 'all' | 'contracts' | 'policies' | 'reports' | 'personal';

const CATEGORIES: { id: DocCategory; label: string; count: number; icon: typeof FileText }[] = [
  { id: 'all', label: 'All Documents', count: 48, icon: FileText },
  { id: 'contracts', label: 'Contracts', count: 16, icon: File },
  { id: 'policies', label: 'HR Policies', count: 12, icon: Lock },
  { id: 'reports', label: 'Reports', count: 14, icon: FileText },
  { id: 'personal', label: 'Personal Docs', count: 6, icon: Folder },
];

const documents = [
  { id: '1', name: 'Employment Contract - Jasur Karimov.pdf', category: 'contracts', size: '1.2 MB', uploadedBy: 'Dilnoza Yusupova', date: '2024-03-15', type: 'pdf', restricted: false },
  { id: '2', name: 'HR Policy Manual v2.4.pdf', category: 'policies', size: '3.8 MB', uploadedBy: 'Dilnoza Yusupova', date: '2024-01-10', type: 'pdf', restricted: true },
  { id: '3', name: 'Q1 2024 Payroll Report.xlsx', category: 'reports', size: '540 KB', uploadedBy: 'Mirzo Tursunov', date: '2024-04-02', type: 'xlsx', restricted: true },
  { id: '4', name: 'Leave Policy 2024.pdf', category: 'policies', size: '890 KB', uploadedBy: 'Dilnoza Yusupova', date: '2024-01-05', type: 'pdf', restricted: false },
  { id: '5', name: 'Onboarding Checklist.docx', category: 'policies', size: '120 KB', uploadedBy: 'Kamola Umarova', date: '2024-02-20', type: 'docx', restricted: false },
  { id: '6', name: 'Q4 2023 KPI Report.xlsx', category: 'reports', size: '780 KB', uploadedBy: 'Dilnoza Yusupova', date: '2024-01-15', type: 'xlsx', restricted: true },
  { id: '7', name: 'NDA Template.pdf', category: 'contracts', size: '230 KB', uploadedBy: 'Mirzo Tursunov', date: '2023-11-20', type: 'pdf', restricted: true },
  { id: '8', name: 'Remote Work Policy.pdf', category: 'policies', size: '450 KB', uploadedBy: 'Dilnoza Yusupova', date: '2024-03-01', type: 'pdf', restricted: false },
];

const typeColors: Record<string, string> = {
  pdf: 'bg-red-50 text-red-700',
  xlsx: 'bg-green-50 text-green-700',
  docx: 'bg-blue-50 text-blue-700',
};

const typeIcons: Record<string, string> = {
  pdf: '📄',
  xlsx: '📊',
  docx: '📝',
};

export default function DocumentsPage() {
  const [activeCategory, setActiveCategory] = useState<DocCategory>('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');

  const filtered = documents.filter((doc) => {
    if (activeCategory !== 'all' && doc.category !== activeCategory) return false;
    if (search && !doc.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">Manage company documents, contracts, and policies</p>
        </div>
        <button className="btn-primary">
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-52 flex-shrink-0">
          <div className="card p-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    activeCategory === cat.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn('w-4 h-4', activeCategory === cat.id ? 'text-blue-500' : 'text-gray-400')} />
                    {cat.label}
                  </div>
                  <span className={cn('text-xs px-1.5 py-0.5 rounded-full', activeCategory === cat.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400')}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="card p-3 mt-3">
            <div className="text-xs font-semibold text-gray-500 mb-2 px-1">Storage Used</div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-3/5 bg-blue-500 rounded-full" />
            </div>
            <div className="text-xs text-gray-400 mt-1.5">3.1 GB of 5 GB used</div>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1">
          <div className="card">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search documents..."
                  className="input-field pl-9"
                />
              </div>
              <button className="btn-secondary gap-1.5 text-sm">
                <Filter className="w-3.5 h-3.5" /> Filter
              </button>
            </div>

            <table className="w-full">
              <thead>
                <tr>
                  {['Name', 'Category', 'Size', 'Uploaded By', 'Date', ''].map((h) => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{typeIcons[doc.type]}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                            {doc.name}
                            {doc.restricted && <Lock className="w-3 h-3 text-gray-400" />}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={cn('px-2 py-0.5 rounded-md text-xs font-medium capitalize', typeColors[doc.type])}>
                        {doc.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="table-cell text-gray-500 text-sm">{doc.size}</td>
                    <td className="table-cell text-gray-600 text-sm">{doc.uploadedBy}</td>
                    <td className="table-cell text-gray-400 text-sm">{doc.date}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Preview">
                          <Eye className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Download">
                          <Download className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-400">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No documents found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
