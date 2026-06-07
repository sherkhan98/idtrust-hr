'use client';

import Link from 'next/link';
import { ChevronRight, Check, Users } from 'lucide-react';
import { IDTrustLogoWhite } from '@/components/ui/IDTrustLogo';

const CLOUDS = [
  {
    id: 'hr',
    emoji: '🏢',
    title: 'HR Cloud',
    subtitle: 'Korxona va tashkilotlar uchun',
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'border-blue-500/30 hover:border-blue-500/60',
    glowColor: 'hover:shadow-blue-500/10',
    badgeBg: 'bg-blue-500/10 text-blue-300 border border-blue-500/20',
    btnClass: 'from-blue-600 to-indigo-600 shadow-blue-500/30',
    checkBg: 'from-blue-600 to-indigo-600',
    features: [
      'Xodim boshqaruvi (50+ maydon)',
      'Biometrik davomat (Face-ID + GPS)',
      'Maosh hisoblash (UZS/USD/EUR)',
      'KPI, Rekrutment & AI Tahlil',
    ],
    badge: '50–500 xodim',
    stats: '200+ kompaniya ishlatmoqda',
    href: '/register/hr',
  },
  {
    id: 'school',
    emoji: '🏫',
    title: 'School Cloud',
    subtitle: 'Maktab va litseylar uchun',
    color: 'from-green-600 to-emerald-600',
    borderColor: 'border-green-500/30 hover:border-green-500/60',
    glowColor: 'hover:shadow-green-500/10',
    badgeBg: 'bg-green-500/10 text-green-300 border border-green-500/20',
    btnClass: 'from-green-600 to-emerald-600 shadow-green-500/30',
    checkBg: 'from-green-600 to-emerald-600',
    features: [
      "O'quvchi va o'qituvchi bazasi",
      'Elektron jurnal va baholar',
      'Yuz tanish davomat (Hikvision)',
      'Ota-onalarga Telegram xabar',
    ],
    badge: "100–1000+ o'quvchi",
    stats: '50+ maktab ishlatmoqda',
    href: '/register/school',
  },
  {
    id: 'kinder',
    emoji: '🎠',
    title: 'Kindergarten Cloud',
    subtitle: "Bog'cha va maktabgacha ta'lim",
    color: 'from-orange-500 to-amber-500',
    borderColor: 'border-orange-500/30 hover:border-orange-500/60',
    glowColor: 'hover:shadow-orange-500/10',
    badgeBg: 'bg-orange-500/10 text-orange-300 border border-orange-500/20',
    btnClass: 'from-orange-500 to-amber-500 shadow-orange-500/30',
    checkBg: 'from-orange-500 to-amber-500',
    features: [
      'Bolalar va guruhlar boshqaruvi',
      'Qabul/ketish yuz tanish',
      'Ota-onaga real-vaqt xabar',
      "To'lov, shartnomalar & dashboard",
    ],
    badge: '20–200+ bola',
    stats: "30+ bog'cha ishlatmoqda",
    href: '/register/kinder',
  },
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <IDTrustLogoWhite size="lg" href="/" className="justify-center mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Qaysi platformani tanlaysiz?
          </h1>
          <p className="text-slate-400 text-lg">
            14 kun bepul sinab ko&apos;ring — karta kerak emas
          </p>
        </div>

        {/* Cloud Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {CLOUDS.map((cloud) => (
            <div
              key={cloud.id}
              className={`relative group bg-white/5 border ${cloud.borderColor} rounded-2xl p-6 transition-all duration-200 hover:bg-white/8 hover:shadow-2xl ${cloud.glowColor} flex flex-col`}
            >
              {/* Top gradient bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cloud.color} rounded-t-2xl`}
              />

              {/* Emoji + Title */}
              <div className="text-5xl mb-4">{cloud.emoji}</div>
              <h3 className="text-xl font-bold text-white mb-1">{cloud.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{cloud.subtitle}</p>

              {/* Size badge */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-5 self-start ${cloud.badgeBg}`}>
                <Users className="w-3 h-3" />
                {cloud.badge}
              </span>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {cloud.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <div
                      className={`w-4 h-4 rounded-full bg-gradient-to-br ${cloud.checkBg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Stats */}
              <p className="text-xs text-slate-500 mb-4 text-center">
                {cloud.stats}
              </p>

              {/* CTA Button */}
              <Link
                href={cloud.href}
                className={`flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r ${cloud.btnClass} rounded-xl text-white text-sm font-bold shadow-lg hover:opacity-90 transition-all group-hover:shadow-xl`}
              >
                {cloud.title}&apos;ni boshlash
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-slate-500 text-sm">
            Bir nechta bulut kerakmi?{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold">
              Professional tarif →
            </Link>
          </p>
          <p className="text-slate-600 text-sm">
            Allaqachon hisobingiz bormi?{' '}
            <Link href="/login" className="text-slate-300 hover:text-white font-semibold">
              Kirish →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
