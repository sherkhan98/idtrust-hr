'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { IDTrustLogo } from '@/components/ui/IDTrustLogo';
import {
  LayoutDashboard, BarChart3, Users, Users2, UserPlus,
  BookMarked, Calendar, Award, Clock, Camera, FileText,
  MessageSquare, Bot, CreditCard, Settings,
  ChevronLeft, ChevronRight, ChevronDown,
  Building2, Plug, GraduationCap,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    groupLabel: 'Asosiy',
    items: [
      { href: '/school', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/school/stats', icon: BarChart3, label: 'Statistika' },
    ],
  },
  {
    groupLabel: "O'quvchilar",
    items: [
      { href: '/school/students', icon: Users, label: "O'quvchilar ro'yxati" },
      { href: '/school/classes', icon: Building2, label: 'Guruhlar va sinflar' },
      { href: '/school/admissions', icon: UserPlus, label: 'Qabul' },
    ],
  },
  {
    groupLabel: "O'qituvchilar",
    items: [
      { href: '/school/teachers', icon: Users2, label: "O'qituvchilar" },
      { href: '/school/schedule', icon: Calendar, label: 'Ish jadvali' },
      { href: '/school/grading', icon: Award, label: 'Baholash' },
    ],
  },
  {
    groupLabel: 'Elektron Jurnal',
    items: [
      { href: '/school/journal', icon: BookMarked, label: 'Baholar' },
      { href: '/school/timetable', icon: Calendar, label: 'Dars jadvali' },
      { href: '/school/exams', icon: GraduationCap, label: 'Imtihonlar' },
    ],
  },
  {
    groupLabel: 'Davomat',
    items: [
      { href: '/school/attendance', icon: Clock, label: 'Yuz tanish' },
      { href: '/school/cameras', icon: Camera, label: 'Kamera nazorati' },
      { href: '/school/attendance-report', icon: FileText, label: 'Hisobot' },
    ],
  },
  {
    groupLabel: 'Ota-onalar',
    items: [
      { href: '/school/notifications', icon: MessageSquare, label: 'Xabarnomalar' },
      { href: '/school/telegram-bot', icon: Bot, label: 'Telegram Bot' },
      { href: '/school/payments', icon: CreditCard, label: "To'lovlar" },
    ],
  },
  {
    groupLabel: 'Sozlamalar',
    items: [
      { href: '/school/profile', icon: Building2, label: 'Maktab profili' },
      { href: '/school/users', icon: Users, label: 'Foydalanuvchilar' },
      { href: '/school/integrations', icon: Plug, label: 'Integratsiyalar' },
    ],
  },
];

export function SchoolSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className={cn(
      'flex flex-col h-screen bg-white border-r border-gray-100 transition-all duration-300 flex-shrink-0',
      collapsed ? 'w-16' : 'w-60',
    )}>
      {/* Logo */}
      <IDTrustLogo
        size="md"
        cloudBadge="School Cloud"
        cloudBadgeColor="bg-green-100 text-green-700"
        className="px-4 py-4"
      />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.groupLabel} className="mb-3">
            {!collapsed && (
              <button
                onClick={() => toggleGroup(group.groupLabel)}
                className="w-full flex items-center justify-between px-3 py-1 mb-1"
              >
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {group.groupLabel}
                </span>
                <ChevronDown
                  className={cn(
                    'w-3 h-3 text-gray-400 transition-transform',
                    collapsedGroups[group.groupLabel] && '-rotate-90',
                  )}
                />
              </button>
            )}
            {!collapsedGroups[group.groupLabel] && (
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/school' &&
                      item.href.length > 1 &&
                      pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href + item.label}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'nav-item',
                        isActive && 'bg-green-50 text-green-700 font-medium',
                        collapsed && 'justify-center px-2',
                      )}
                    >
                      <item.icon
                        className={cn(
                          'w-4 h-4 flex-shrink-0',
                          isActive ? 'text-green-600' : 'text-gray-500',
                        )}
                      />
                      {!collapsed && <span className="truncate text-sm">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-100 p-2 space-y-0.5">
        <Link
          href="/school/billing"
          className={cn(
            'nav-item',
            pathname === '/school/billing' && 'bg-green-50 text-green-700 font-medium',
            collapsed && 'justify-center px-2',
          )}
        >
          <CreditCard className="w-4 h-4 text-green-500 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Tariflar</span>}
        </Link>
        <Link
          href="/school/settings"
          className={cn(
            'nav-item',
            pathname === '/school/settings' && 'bg-green-50 text-green-700 font-medium',
            collapsed && 'justify-center px-2',
          )}
        >
          <Settings className="w-4 h-4 text-gray-500 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Sozlamalar</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn('nav-item w-full', collapsed && 'justify-center px-2')}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Yig&#39;ish</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export default SchoolSidebar;
