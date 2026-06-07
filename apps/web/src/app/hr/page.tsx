'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, MapPin, DollarSign, Target, ClipboardList, FileSignature,
  Smartphone, Bot, BarChart3, Menu, X, CheckCircle2, ArrowRight, ChevronRight,
} from 'lucide-react';

const FEATURES = [
  { icon: Users, emoji: '👥', title: 'Xodim boshqaruvi', desc: 'Shaxsiy fayl, lavozim, maosh tarixi' },
  { icon: MapPin, emoji: '📍', title: 'Biometrik Davomat', desc: 'Yuz tanish, GPS, ZKTeco terminal' },
  { icon: DollarSign, emoji: '💰', title: 'Maosh Hisoblash', desc: "UZS/USD/EUR, soliq, avans" },
  { icon: Target, emoji: '🎯', title: 'KPI & Natijalar', desc: 'Maqsad belgilash, ball tizimi' },
  { icon: ClipboardList, emoji: '📋', title: 'Rekrutment ATS', desc: 'CV, intervyu, onboarding' },
  { icon: FileSignature, emoji: '✍️', title: 'E-Imzo', desc: 'Blockchain tasdiqlash, shartnomalar' },
  { icon: Smartphone, emoji: '📱', title: 'Telegram Mini App', desc: "Xodim ilovani yuklamaydi" },
  { icon: Bot, emoji: '🤖', title: 'AI Tahlil', desc: 'Ketish xavfi, tavsiyalar' },
  { icon: BarChart3, emoji: '📊', title: 'Hisobotlar', desc: 'DXH, mehnat inspeksiyasi' },
];

const PRICING = [
  { name: 'Starter', price: '$29', period: '/oy', limit: '10 xodimgacha', features: ['Xodim boshqaruvi', 'Maosh hisoblash', 'Asosiy davomat', 'Email support'], popular: false },
  { name: 'Business', price: '$79', period: '/oy', limit: '50 xodimgacha', features: ['Starter + hamma narsa', 'Biometrik davomat', 'KPI tizimi', 'Telegram bot', 'API kirish'], popular: true },
  { name: 'Enterprise', price: '$199', period: '/oy', limit: 'Cheksiz', features: ['Business + hamma narsa', 'AI tahlil', 'E-Imzo', 'Dedicated server', '24/7 support'], popular: false },
];

const STATS = [
  { value: '200+', label: 'Kompaniya' },
  { value: '50,000+', label: 'Xodim' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9★', label: 'Reyting' },
];

export default function HrCloudPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg shadow-blue-900/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-lg text-white">IDTrust</span>
            </Link>
            <span className="hidden md:block text-blue-400 text-sm font-medium px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
              HR Cloud
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Imkoniyatlar</a>
            <a href="#pricing" className="hover:text-white transition-colors">Narxlar</a>
            <Link href="/" className="hover:text-white transition-colors">Asosiy sahifa</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all">
              Kirish
            </Link>
            <Link href="/register/hr" className="text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 rounded-xl hover:opacity-90 transition-all shadow-md shadow-blue-600/30">
              Bepul boshlash →
            </Link>
          </div>
          <button className="md:hidden p-2 text-slate-300" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-slate-900/98 border-t border-slate-800 px-6 py-4 space-y-3">
            {['#features', '#pricing'].map((href) => (
              <a key={href} href={href} className="block text-sm font-medium text-slate-300 py-1" onClick={() => setMobileMenu(false)}>
                {href === '#features' ? 'Imkoniyatlar' : 'Narxlar'}
              </a>
            ))}
            <Link href="/" className="block text-sm font-medium text-slate-300 py-1">Asosiy sahifa</Link>
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link href="/login" className="text-center text-sm font-semibold py-2.5 border border-slate-700 rounded-xl text-slate-300">Kirish</Link>
              <Link href="/register/hr" className="text-center text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 rounded-xl">Bepul boshlash</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-blue-500/20">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            O&apos;zbekiston №1 HR platformasi
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            🏢 HR Cloud
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-4 font-medium">
            O&apos;zbekistondagi eng kuchli HR tizimi
          </p>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Xodimlardan tortib maosh va KPIgacha — barchasi bir platformada. AI yordamida kadrlar boshqaruvini avtomatlashtiring.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register/hr"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-blue-600/30 text-sm"
            >
              Bepul boshlash <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login?cloud=hr"
              className="flex items-center gap-2 border border-slate-600 text-slate-300 font-semibold px-6 py-3.5 rounded-xl hover:bg-white/5 hover:border-slate-500 transition-all text-sm"
            >
              Demo ko&apos;rish
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-10 px-6 border-y border-slate-800 bg-slate-900/50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Barcha imkoniyatlar bir joyda</h2>
            <p className="text-slate-400 text-lg">Korxonangizni boshqarish uchun kerakli hamma narsa</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/40 hover:bg-slate-800 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-xl group-hover:bg-blue-500/20 transition-all">
                    {f.emoji}
                  </div>
                  <h3 className="font-bold text-white">{f.title}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-slate-900/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Oddiy va shaffof narxlar</h2>
            <p className="text-slate-400">Yashirin to&apos;lovlar yo&apos;q. 14 kun bepul sinab ko&apos;ring.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border-2 p-6 relative transition-all ${
                  plan.popular
                    ? 'border-blue-500 bg-blue-600/10 shadow-xl shadow-blue-600/20'
                    : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MASHHUR TARIF
                  </span>
                )}
                <p className="font-bold text-white text-lg mb-1">{plan.name}</p>
                <div className="mb-1 flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 text-sm mb-1">{plan.period}</span>
                </div>
                <p className="text-xs text-slate-400 mb-5">{plan.limit}</p>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register/hr"
                  className={`block text-center w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90'
                      : 'border border-slate-600 text-slate-300 hover:border-blue-500 hover:text-white'
                  }`}
                >
                  Boshlash
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 pointer-events-none" />
        <div className="max-w-2xl mx-auto relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hoziroq boshlang — 14 kun bepul
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Karta kerak emas. O&apos;rnatish 5 daqiqa.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Link
              href="/register/hr"
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-blue-600/30"
            >
              Bepul boshlash <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login?cloud=hr"
              className="flex-1 flex items-center justify-center gap-2 border border-slate-600 text-slate-300 font-semibold py-3.5 rounded-xl hover:bg-white/5 transition-all"
            >
              Demo ko&apos;rish
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
              <ChevronRight className="w-4 h-4 rotate-180" />
              Asosiy sahifaga qaytish
            </Link>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/school-cloud" className="hover:text-slate-300 transition-colors">School Cloud</Link>
            <Link href="/kinder-cloud" className="hover:text-slate-300 transition-colors">Kinder Cloud</Link>
            <Link href="/login" className="hover:text-slate-300 transition-colors">Kirish</Link>
          </div>
          <p className="text-xs text-slate-600">© 2024 IDTrust. O&apos;zbekistonda yaratilgan 🇺🇿</p>
        </div>
      </footer>
    </div>
  );
}
