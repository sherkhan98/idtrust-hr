'use client';

import { useState } from 'react';
import { Megaphone, Plus, Pin, Globe, Users, Building2, Eye, Edit, Trash2, MoreHorizontal, Calendar } from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';

type Audience = 'all' | 'department' | 'branch';

const announcements = [
  {
    id: '1',
    title: 'Office Closed — Independence Day (September 1)',
    content: 'As a reminder, all offices will be closed on September 1st, 2024 in observance of Uzbekistan Independence Day. Enjoy the holiday!',
    author: 'Dilnoza Yusupova',
    authorTitle: 'HR Director',
    audience: 'all' as Audience,
    audienceLabel: 'All Employees',
    pinned: true,
    views: 48,
    created: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Holiday',
  },
  {
    id: '2',
    title: 'New Remote Work Policy Effective June 1',
    content: 'We are pleased to announce our updated Remote Work Policy allowing eligible employees to work from home up to 2 days per week. Please review the full policy in the Documents section.',
    author: 'Aziz Nazarov',
    authorTitle: 'CEO',
    audience: 'all' as Audience,
    audienceLabel: 'All Employees',
    pinned: true,
    views: 50,
    created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Policy',
  },
  {
    id: '3',
    title: 'Engineering Team: Sprint Planning — May 27',
    content: 'Sprint planning for Q2 cycle 3 will be held on Monday May 27 at 10:00 AM in Conference Room B. Please come prepared with your task estimates.',
    author: 'Bobur Rashidov',
    authorTitle: 'CTO',
    audience: 'department' as Audience,
    audienceLabel: 'Engineering',
    pinned: false,
    views: 18,
    created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Meeting',
  },
  {
    id: '4',
    title: 'May Payroll Processing Date Change',
    content: 'Due to a bank holiday, May payroll will be processed on May 29 instead of May 31. Net salary will be deposited to your accounts by end of day.',
    author: 'Mirzo Tursunov',
    authorTitle: 'CFO',
    audience: 'all' as Audience,
    audienceLabel: 'All Employees',
    pinned: false,
    views: 47,
    created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Payroll',
  },
  {
    id: '5',
    title: 'Samarkand Branch: Fire Drill — May 30',
    content: 'A mandatory fire drill will be conducted at the Samarkand branch on May 30 at 11:00 AM. Please follow the evacuation plan posted on each floor.',
    author: 'Dilnoza Yusupova',
    authorTitle: 'HR Director',
    audience: 'branch' as Audience,
    audienceLabel: 'Samarkand Branch',
    pinned: false,
    views: 8,
    created: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Safety',
  },
];

const categoryColors: Record<string, string> = {
  Holiday: 'bg-orange-50 text-orange-700',
  Policy: 'bg-blue-50 text-blue-700',
  Meeting: 'bg-purple-50 text-purple-700',
  Payroll: 'bg-green-50 text-green-700',
  Safety: 'bg-red-50 text-red-700',
};

const audienceIcons: Record<Audience, typeof Globe> = {
  all: Globe,
  department: Users,
  branch: Building2,
};

export default function AnnouncementsPage() {
  const [filter, setFilter] = useState<'all' | 'pinned'>('all');

  const filtered = announcements.filter((a) => filter === 'pinned' ? a.pinned : true);
  const pinned = filtered.filter((a) => a.pinned);
  const regular = filtered.filter((a) => !a.pinned);

  const renderCard = (ann: typeof announcements[0]) => {
    const AudienceIcon = audienceIcons[ann.audience];
    return (
      <div key={ann.id} className={cn('card p-5 space-y-3', ann.pinned && 'border-l-4 border-l-blue-500')}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {ann.pinned && <Pin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', categoryColors[ann.category])}>
                {ann.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <AudienceIcon className="w-3 h-3" /> {ann.audienceLabel}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900">{ann.title}</h3>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{ann.content}</p>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-400">
            By <span className="font-medium text-gray-600">{ann.author}</span> · {ann.authorTitle}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {ann.views}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatRelativeTime(ann.created)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Announcements</h1>
          <p className="page-subtitle">Company-wide and department announcements</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {[
          { id: 'all' as const, label: `All (${announcements.length})` },
          { id: 'pinned' as const, label: `Pinned (${announcements.filter((a) => a.pinned).length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              filter === tab.id ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {pinned.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <Pin className="w-3 h-3" /> Pinned
          </div>
          {pinned.map(renderCard)}
        </div>
      )}

      {regular.length > 0 && (
        <div className="space-y-3">
          {pinned.length > 0 && (
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent</div>
          )}
          {regular.map(renderCard)}
        </div>
      )}
    </div>
  );
}
