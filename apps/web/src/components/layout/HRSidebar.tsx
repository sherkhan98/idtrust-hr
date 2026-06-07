'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { IDTrustLogo } from '@/components/ui/IDTrustLogo';
import {
  LayoutDashboard, Users, Clock, DollarSign, Calendar, Target,
  Briefcase, CheckSquare, FileText, MessageSquare, BookOpen,
  HelpCircle, BarChart3, Settings, ChevronLeft, ChevronRight,
  Building2, Megaphone, Brain, ChevronDown, Plug, UserPlus, Zap,
  Shield, PenTool, Palette, GitBranch,
  Globe, CreditCard, TrendingDown,
  MessageSquareText, Download, Package, TrendingUp,
  Store, Network, Users as UsersIcon, Fingerprint,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    groupLabel: 'Asosiy',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/employees', icon: Users, label: 'Xodimlar' },
      { href: '/organization', icon: Building2, label: 'Tashkilot' },
    ],
  },
  {
    groupLabel: 'HR Operatsiyalar',
    items: [
      { href: '/attendance', icon: Clock, label: 'Davomat' },
      { href: '/attendance/shifts', icon: Calendar, label: 'Smena Jadvali' },
      { href: '/leave', icon: Calendar, label: "Ta'til" },
      { href: '/payroll', icon: DollarSign, label: 'Maosh' },
      { href: '/kpi', icon: Target, label: 'KPI' },
    ],
  },
  {
    groupLabel: "Iste'dod & Ish",
    items: [
      { href: '/recruitment', icon: Briefcase, label: 'Rekrutment' },
      { href: '/onboarding', icon: UserPlus, label: 'Onboarding' },
      { href: '/tasks', icon: CheckSquare, label: 'Vazifalar' },
      { href: '/documents', icon: FileText, label: 'Hujjatlar' },
      { href: '/training', icon: BookOpen, label: "Ta'lim (LMS)" },
    ],
  },
  {
    groupLabel: 'Kommunikatsiya',
    items: [
      { href: '/social', icon: MessageSquare, label: 'Social Feed' },
      { href: '/announcements', icon: Megaphone, label: "E'lonlar" },
      { href: '/helpdesk', icon: HelpCircle, label: 'Yordam' },
      { href: '/messages', icon: MessageSquareText, label: 'Chat' },
    ],
  },
  {
    groupLabel: 'Tahlil & AI',
    items: [
      { href: '/analytics', icon: BarChart3, label: 'Tahlil' },
      { href: '/ai', icon: Brain, label: 'AI Yordamchi' },
      { href: '/security', icon: Shield, label: 'Xavfsizlik' },
      { href: '/analytics/turnover', icon: TrendingDown, label: 'Ketish xavfi' },
    ],
  },
  {
    groupLabel: 'ERP',
    items: [
      { href: '/erp', icon: Network, label: 'ERP Hub' },
      { href: '/erp/accounting', icon: BookOpen, label: 'Buxgalteriya' },
      { href: '/erp/warehouse', icon: Package, label: 'Omborxona' },
      { href: '/erp/sales', icon: TrendingUp, label: 'Savdo & CRM' },
      { href: '/franchise', icon: Store, label: 'Franchise HR' },
      { href: '/labor-exchange', icon: UsersIcon, label: 'Mehnat Birjasi' },
    ],
  },
  {
    groupLabel: 'Integratsiyalar',
    items: [
      { href: '/automation', icon: Zap, label: 'Avtomatika' },
      { href: '/integrations', icon: Plug, label: 'Integratsiyalar' },
      { href: '/integrations/marketplace', icon: Globe, label: 'Bozor' },
      { href: '/integrations/zkteco', icon: Fingerprint, label: 'ZKTeco Terminal' },
      { href: '/workflows', icon: GitBranch, label: 'Workflow' },
      { href: '/e-signature', icon: PenTool, label: 'E-imzo' },
      { href: '/white-label', icon: Palette, label: 'White-label' },
      { href: '/reports/export', icon: Download, label: 'Eksport' },
    ],
  },
];

export function HRSidebar() {
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
        cloudBadge="HR Cloud"
        cloudBadgeColor="bg-blue-100 text-blue-700"
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
                    (item.href.length > 1 &&
                      pathname.startsWith(item.href) &&
                      item.href !== '/dashboard');
                  return (
                    <Link
                      key={item.href + item.label}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'nav-item',
                        isActive && 'bg-blue-50 text-blue-700 font-medium',
                        collapsed && 'justify-center px-2',
                      )}
                    >
                      <item.icon
                        className={cn(
                          'w-4 h-4 flex-shrink-0',
                          isActive ? 'text-blue-700' : 'text-gray-500',
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
          href="/billing"
          className={cn(
            'nav-item',
            pathname === '/billing' && 'nav-item-active',
            collapsed && 'justify-center px-2',
          )}
        >
          <CreditCard className="w-4 h-4 text-blue-500 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Tariflar</span>}
        </Link>
        <Link
          href="/settings"
          className={cn(
            'nav-item',
            pathname === '/settings' && 'nav-item-active',
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

export default HRSidebar;
