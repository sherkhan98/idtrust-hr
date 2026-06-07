'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { IDTrustLogo } from '@/components/ui/IDTrustLogo';
import {
  LayoutDashboard, BarChart3, Baby, Users2, UserPlus,
  Shield, Clock, Camera, FileText, MessageSquare,
  Send, Phone, Utensils, AlertTriangle, CreditCard,
  Settings, ChevronLeft, ChevronRight, ChevronDown,
  Building2, Users,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    groupLabel: 'Asosiy',
    items: [
      { href: '/kinder', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/kinder/stats', icon: BarChart3, label: 'Statistika' },
    ],
  },
  {
    groupLabel: 'Bolalar',
    items: [
      { href: '/kinder/children', icon: Baby, label: "Bolalar ro'yxati" },
      { href: '/kinder/groups', icon: Users2, label: 'Guruhlar' },
      { href: '/kinder/admissions', icon: UserPlus, label: 'Qabul' },
    ],
  },
  {
    groupLabel: 'Qabul/Ketish',
    items: [
      { href: '/kinder/pickup', icon: Shield, label: 'Nazorat' },
      { href: '/kinder/face-recognition', icon: Camera, label: 'Yuz tanish' },
      { href: '/kinder/authorized', icon: Users, label: 'Ruxsat etilganlar' },
    ],
  },
  {
    groupLabel: 'Davomat',
    items: [
      { href: '/kinder/attendance', icon: Clock, label: 'Kunlik davomat' },
      { href: '/kinder/cameras', icon: Camera, label: 'Kamera' },
      { href: '/kinder/attendance-report', icon: FileText, label: 'Hisobot' },
    ],
  },
  {
    groupLabel: 'Ota-onalar',
    items: [
      { href: '/kinder/notifications', icon: MessageSquare, label: 'Xabarnomalar' },
      { href: '/kinder/telegram', icon: Send, label: 'Telegram kanal' },
      { href: '/kinder/contacts', icon: Phone, label: 'Kontaktlar' },
    ],
  },
  {
    groupLabel: 'Ovqatlanish',
    items: [
      { href: '/kinder/menu', icon: Utensils, label: 'Kunlik menyu' },
      { href: '/kinder/allergens', icon: AlertTriangle, label: 'Allergenlar' },
    ],
  },
  {
    groupLabel: 'Sozlamalar',
    items: [
      { href: '/kinder/profile', icon: Building2, label: "Bog'cha profili" },
      { href: '/kinder/staff', icon: Users2, label: 'Xodimlar' },
      { href: '/kinder/payments', icon: CreditCard, label: "To'lovlar" },
    ],
  },
];

export function KinderSidebar() {
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
        cloudBadge="Kindergarten"
        cloudBadgeColor="bg-orange-100 text-orange-700"
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
                    (item.href !== '/kinder' &&
                      item.href.length > 1 &&
                      pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href + item.label}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'nav-item',
                        isActive && 'bg-orange-50 text-orange-700 font-medium',
                        collapsed && 'justify-center px-2',
                      )}
                    >
                      <item.icon
                        className={cn(
                          'w-4 h-4 flex-shrink-0',
                          isActive ? 'text-orange-500' : 'text-gray-500',
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
          href="/kinder/billing"
          className={cn(
            'nav-item',
            pathname === '/kinder/billing' && 'bg-orange-50 text-orange-700 font-medium',
            collapsed && 'justify-center px-2',
          )}
        >
          <CreditCard className="w-4 h-4 text-orange-500 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Tariflar</span>}
        </Link>
        <Link
          href="/kinder/settings"
          className={cn(
            'nav-item',
            pathname === '/kinder/settings' && 'bg-orange-50 text-orange-700 font-medium',
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

export default KinderSidebar;
