'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, Clock, DollarSign, Calendar, Target,
  Briefcase, CheckSquare, FileText, MessageSquare, BookOpen,
  HelpCircle, BarChart3, Settings, ChevronLeft, ChevronRight,
  Building2, Megaphone, Brain, ChevronDown, Plug, UserPlus, Zap,
  Shield, PenTool, Palette, GitBranch, GraduationCap, Camera,
  Baby, Globe, CreditCard, BookMarked, Users2, TrendingDown,
  MessageSquareText, Download, Bot, Package, TrendingUp,
  Store, Network, Users as UsersIcon, Fingerprint,
} from 'lucide-react';

type Cloud = 'hr' | 'school' | 'kinder';

const CLOUD_NAV: Record<Cloud, { groupLabel: string; items: { href: string; icon: any; label: string }[] }[]> = {
  hr: [
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
      ],
    },
    {
      groupLabel: 'Tahlil & AI',
      items: [
        { href: '/analytics', icon: BarChart3, label: 'Tahlil' },
        { href: '/ai', icon: Brain, label: 'AI Yordamchi' },
        { href: '/security', icon: Shield, label: 'Xavfsizlik' },
        { href: '/analytics/turnover', icon: TrendingDown, label: 'Ketish xavfi' },
        { href: '/education', icon: GraduationCap, label: "Ta'lim sektori" },
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
        { href: '/messages', icon: MessageSquareText, label: 'Chat' },
        { href: '/reports/export', icon: Download, label: 'Eksport' },
      ],
    },
  ],
  school: [
    {
      groupLabel: 'Asosiy',
      items: [
        { href: '/school', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/school/students', icon: Users, label: "O'quvchilar" },
        { href: '/school/teachers', icon: Users2, label: "O'qituvchilar" },
      ],
    },
    {
      groupLabel: "O'quv jarayon",
      items: [
        { href: '/school/journal', icon: BookMarked, label: 'Elektron jurnal' },
        { href: '/education', icon: Calendar, label: 'Dars jadvali' },
        { href: '/school', icon: Building2, label: 'Sinflar' },
      ],
    },
    {
      groupLabel: 'Davomat',
      items: [
        { href: '/school/attendance', icon: Clock, label: 'Davomat' },
        { href: '/school/cameras', icon: Camera, label: 'Kameralar' },
        { href: '/school', icon: BarChart3, label: 'Hisobotlar' },
      ],
    },
    {
      groupLabel: 'Ota-onalar',
      items: [
        { href: '/school/notifications', icon: MessageSquare, label: 'Xabarnomalar' },
        { href: '/school/settings', icon: Bot, label: 'Telegram Bot' },
      ],
    },
  ],
  kinder: [
    {
      groupLabel: 'Asosiy',
      items: [
        { href: '/kinder', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/kinder', icon: Baby, label: 'Bolalar' },
        { href: '/kinder', icon: Users2, label: 'Guruhlar' },
      ],
    },
    {
      groupLabel: 'Nazorat',
      items: [
        { href: '/kinder/pickup', icon: Shield, label: 'Qabul/Ketish' },
        { href: '/kinder', icon: Clock, label: 'Davomat' },
        { href: '/kinder', icon: Camera, label: 'Kameralar' },
      ],
    },
    {
      groupLabel: 'Ota-onalar',
      items: [
        { href: '/kinder', icon: MessageSquare, label: 'Bildirishnomalar' },
        { href: '/kinder', icon: Users, label: 'Portal' },
      ],
    },
    {
      groupLabel: 'Kun tartibi',
      items: [
        { href: '/kinder', icon: FileText, label: 'Menyu' },
        { href: '/kinder', icon: HelpCircle, label: 'Allergiya' },
      ],
    },
  ],
};

const CLOUD_CONFIG: Record<Cloud, { label: string; emoji: string; color: string; activeBg: string }> = {
  hr: { label: 'HR', emoji: '🏢', color: 'bg-blue-600', activeBg: 'bg-blue-600 text-white' },
  school: { label: 'Maktab', emoji: '🏫', color: 'bg-green-600', activeBg: 'bg-green-600 text-white' },
  kinder: { label: "Bog'cha", emoji: '🎠', color: 'bg-orange-500', activeBg: 'bg-orange-500 text-white' },
};

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [cloud, setCloud] = useState<Cloud>('hr');

  useEffect(() => {
    const saved = localStorage.getItem('peopleos_cloud') as Cloud;
    if (saved && ['hr', 'school', 'kinder'].includes(saved)) setCloud(saved);
    // Auto-detect from pathname
    if (pathname.startsWith('/school')) setCloud('school');
    else if (pathname.startsWith('/kinder')) setCloud('kinder');
  }, [pathname]);

  const switchCloud = (c: Cloud) => {
    setCloud(c);
    localStorage.setItem('peopleos_cloud', c);
  };

  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const navGroups = CLOUD_NAV[cloud];
  const cloudConf = CLOUD_CONFIG[cloud];

  return (
    <aside className={cn(
      'flex flex-col h-screen bg-white border-r border-gray-100 transition-all duration-300 flex-shrink-0',
      collapsed ? 'w-16' : 'w-60',
    )}>
      {/* Logo */}
      <div className={cn('flex items-center h-14 px-3 border-b border-gray-100', collapsed && 'justify-center')}>
        <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        {!collapsed && (
          <div className="ml-2.5 overflow-hidden">
            <div className="font-bold text-gray-900 text-sm leading-none whitespace-nowrap">IDTrust</div>
            <div className="text-violet-600 text-[10px] font-medium whitespace-nowrap">AI Platform</div>
          </div>
        )}
      </div>

      {/* Cloud Selector */}
      {!collapsed && (
        <div className="px-3 py-2.5 border-b border-gray-100">
          <div className="flex gap-1 bg-gray-50 rounded-lg p-0.5">
            {(Object.keys(CLOUD_CONFIG) as Cloud[]).map((c) => (
              <button
                key={c}
                onClick={() => switchCloud(c)}
                title={CLOUD_CONFIG[c].label}
                className={cn(
                  'flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all',
                  cloud === c ? cloudConf.activeBg : 'text-gray-400 hover:text-gray-600',
                )}
              >
                {CLOUD_CONFIG[c].emoji} {CLOUD_CONFIG[c].label}
              </button>
            ))}
          </div>
        </div>
      )}

      {collapsed && (
        <div className="px-2 py-2 border-b border-gray-100 space-y-1">
          {(Object.keys(CLOUD_CONFIG) as Cloud[]).map((c) => (
            <button
              key={c}
              onClick={() => switchCloud(c)}
              title={CLOUD_CONFIG[c].label}
              className={cn('w-full h-8 rounded-lg text-sm transition-all flex items-center justify-center', cloud === c ? cloudConf.activeBg : 'hover:bg-gray-100')}
            >
              {CLOUD_CONFIG[c].emoji}
            </button>
          ))}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navGroups.map((group) => (
          <div key={group.groupLabel} className="mb-3">
            {!collapsed && (
              <button
                onClick={() => toggleGroup(group.groupLabel)}
                className="w-full flex items-center justify-between px-3 py-1 mb-1"
              >
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{group.groupLabel}</span>
                <ChevronDown className={cn('w-3 h-3 text-gray-400 transition-transform', collapsedGroups[group.groupLabel] && '-rotate-90')} />
              </button>
            )}
            {!collapsedGroups[group.groupLabel] && (
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href.length > 1 && pathname.startsWith(item.href) && item.href !== '/dashboard');
                  return (
                    <Link
                      key={item.href + item.label}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'nav-item',
                        isActive && 'nav-item-active',
                        collapsed && 'justify-center px-2',
                      )}
                    >
                      <item.icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-blue-600' : 'text-gray-500')} />
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
          className={cn('nav-item', pathname === '/billing' && 'nav-item-active', collapsed && 'justify-center px-2')}
        >
          <CreditCard className="w-4 h-4 text-violet-500 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Tariflar</span>}
        </Link>
        <Link
          href="/settings"
          className={cn('nav-item', pathname === '/settings' && 'nav-item-active', collapsed && 'justify-center px-2')}
        >
          <Settings className="w-4 h-4 text-gray-500 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Sozlamalar</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn('nav-item w-full', collapsed && 'justify-center px-2')}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4 text-gray-500" />
            : <><ChevronLeft className="w-4 h-4 text-gray-500" /><span className="text-sm">Yig&#39;ish</span></>
          }
        </button>
      </div>
    </aside>
  );
}
