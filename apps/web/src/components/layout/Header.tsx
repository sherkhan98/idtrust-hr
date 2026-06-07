'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Bell, Search, ChevronDown, LogOut, User, Settings, Check } from 'lucide-react';
import Link from 'next/link';
import { useLang } from '@/contexts/LanguageContext';
import { LANGUAGES, t } from '@/lib/i18n/translations';

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Ta\'til so\'rovi tasdiqlandi', body: 'Yillik ta\'tilingiz tasdiqlandi', time: '5 min', read: false },
  { id: '2', title: 'Yangi vazifa tayinlandi', body: 'Alisher sizga yangi vazifa tayinladi', time: '1 soat', read: false },
  { id: '3', title: 'Maosh hisoblandi', body: 'May 2024 maoshi hisoblandi', time: '2 soat', read: true },
  { id: '4', title: 'Yangi e\'lon', body: 'Direktor: Q2 natijalari ajoyib!', time: 'Kecha', read: true },
];

export function Header() {
  const { lang, setLang } = useLang();
  const { data: session } = useSession();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setShowLangPicker(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const user = session?.user;
  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U' : 'U';
  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User' : 'User';
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;
  const currentLang = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`${t(lang, 'search')}...`}
            className="w-full pl-9 pr-10 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all placeholder:text-gray-400"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100 rounded border border-gray-200">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        {/* Language Picker */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => { setShowLangPicker(!showLangPicker); setShowProfile(false); setShowNotifications(false); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <span className="text-base leading-none">{currentLang.flag}</span>
            <span className="hidden sm:block text-xs font-semibold">{currentLang.nativeName}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showLangPicker && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t(lang, 'language')}</p>
              </div>
              <div className="py-1 max-h-72 overflow-y-auto">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setShowLangPicker(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-lg leading-none">{l.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{l.nativeName}</p>
                      <p className="text-xs text-gray-400">{l.label}</p>
                    </div>
                    {lang === l.code && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); setShowLangPicker(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-semibold text-sm text-gray-900">{t(lang, 'notifications')}</span>
                <button className="text-xs text-blue-600 font-medium hover:text-blue-700">{t(lang, 'mark_all_read')}</button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/40' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-gray-200'}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{n.body}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 bg-gray-50 text-center border-t border-gray-100">
                <Link href="/notifications" className="text-xs text-blue-600 font-medium hover:text-blue-700">
                  {t(lang, 'view')} {t(lang, 'notifications').toLowerCase()}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); setShowLangPicker(false); }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-gray-800 leading-none">{fullName}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{user?.role?.toLowerCase().replace(/_/g, ' ')}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-sm text-gray-900">{fullName}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
              </div>
              <div className="p-1">
                <Link href="/profile" onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <User className="w-4 h-4 text-gray-400" />
                  {t(lang, 'profile')}
                </Link>
                <Link href="/settings" onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4 text-gray-400" />
                  {t(lang, 'settings')}
                </Link>
              </div>
              <div className="p-1 border-t border-gray-100">
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t(lang, 'logout')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
