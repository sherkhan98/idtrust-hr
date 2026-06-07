'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, BookOpen, CalendarDays, Camera, MessageSquare, DollarSign,
  BarChart3, UserCheck, Menu, X, CheckCircle2, ArrowRight, ChevronRight,
} from 'lucide-react';

const FEATURES = [
  { emoji: '👨‍🎓', icon: Users, title: "O'quvchilar bazasi", desc: "JSHIR, sinf, ota-ona kontakti" },
  { emoji: '👩‍🏫', icon: UserCheck, title: "O'qituvchilar", desc: 'Dars jadvali, ish haq, attestatsiya' },
  { emoji: '📓', icon: BookOpen, title: 'Elektron Jurnal', desc: "Baholar, izohlar, ota-onaga ko'rinish" },
  { emoji: '📸', icon: Camera, title: 'Yuz tanish', desc: 'Hikvision kamera, avtomatik davomat' },
  { emoji: '📲', icon: MessageSquare, title: 'Ota-onalarga SMS', desc: "Keldi/ketdi foto xabar" },
  { emoji: '🗓️', icon: CalendarDays, title: 'Dars Jadvali', desc: "Haftalik, zal bron, o'rinbosar" },
  { emoji: '💳', icon: DollarSign, title: "To'lov Nazorat", desc: 'Kontrakt, qoldiq, eslatma' },
  { emoji: '📊', icon: BarChart3, title: 'Direktor Panel', desc: 'Davomat, baho, moliya statistika' },
];

const PRICING = [
  { name: 'Kichik', price: '$49', period: '/oy', limit: "300 gacha o'quvchi", features: ["O'quvchi bazasi", 'Elektron jurnal', 'Asosiy hisobotlar', 'Email support'], popular: false },
  { name: "O'rta", price: '$99', period: '/oy', limit: "300-800 o'quvchi", features: ['Kichik + hamma narsa', 'Yuz tanish davomat', 'SMS xabarlar', 'Dars jadvali', 'API kirish'], popular: true },
  { name: 'Yirik', price: '$199', period: '/oy', limit: "800+ o'quvchi", features: ["O'rta + hamma narsa", "To'lov nazorat", 'Direktor panel', 'Dedicated server', '24/7 support'], popular: false },
];

const STATS = [
  { value: '50+', label: 'Maktab' },
  { value: "30,000+", label: "O'quvchi" },
  { value: '500+', label: "O'qituvchi" },
  { value: '95%', label: 'Davomat aniqligi' },
];

export default function SchoolCloudPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 text-white">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg shadow-green-900/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-lg text-white">IDTrust</span>
            </Link>
            <span className="hidden md:block text-green-400 text-sm font-medium px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full">
              School Cloud
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
            <Link href="/register/school" className="text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-2 rounded-xl hover:opacity-90 transition-all shadow-md shadow-green-600/30">
              Maktabni ro&apos;yxatdan o&apos;tkaz →
            </Link>
          </div>
          <button className="md:hidden p-2 text-slate-300" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-slate-900/98 border-t border-slate-800 px-6 py-4 space-y-3">
            <a href="#features" className="block text-sm font-medium text-slate-300 py-1" onClick={() => setMobileMenu(false)}>Imkoniyatlar</a>
            <a href="#pricing" className="block text-sm font-medium text-slate-300 py-1" onClick={() => setMobileMenu(false)}>Narxlar</a>
            <Link href="/" className="block text-sm font-medium text-slate-300 py-1">Asosiy sahifa</Link>
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link href="/login" className="text-center text-sm font-semibold py-2.5 border border-slate-700 rounded-xl text-slate-300">Kirish</Link>
              <Link href="/register/school" className="text-center text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 py-2.5 rounded-xl">
                Maktabni ro&apos;yxatdan o&apos;tkaz
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/30 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-green-500/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Maktablar uchun maxsus ishlab chiqilgan
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            🏫 School Cloud
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-4 font-medium">
            O&apos;zbekiston maktablari uchun raqamli tizim
          </p>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Elektron jurnal, yuz tanish davomat, ota-onalarga SMS — barchasi bir platformada. Maktab boshqaruvini zamonaviylashtiring.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register/school"
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-green-600/30 text-sm"
            >
              Maktabni ro&apos;yxatdan o&apos;tkaz <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login?cloud=school"
              className="flex items-center gap-2 border border-slate-600 text-slate-300 font-semibold px-6 py-3.5 rounded-xl hover:bg-white/5 hover:border-slate-500 transition-all text-sm"
            >
              Demo
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Maktab uchun barcha imkoniyatlar</h2>
            <p className="text-slate-400 text-lg">O&apos;quvchilardan moliyagacha — yagona tizimda</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-green-500/40 hover:bg-slate-800 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center text-xl group-hover:bg-green-500/20 transition-all">
                    {f.emoji}
                  </div>
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Maktab uchun narxlar</h2>
            <p className="text-slate-400">14 kunlik bepul sinov. Karta kerak emas.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border-2 p-6 relative transition-all ${
                  plan.popular
                    ? 'border-green-500 bg-green-600/10 shadow-xl shadow-green-600/20'
                    : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full">
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
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register/school"
                  className={`block text-center w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90'
                      : 'border border-slate-600 text-slate-300 hover:border-green-500 hover:text-white'
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
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 to-emerald-900/40 pointer-events-none" />
        <div className="max-w-2xl mx-auto relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Maktabingizni raqamlashtiring
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            14 kun bepul. O&apos;rnatish 5 daqiqa.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Link
              href="/register/school"
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-green-600/30"
            >
              Maktabni ro&apos;yxatdan o&apos;tkaz <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login?cloud=school"
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
            <Link href="/hr" className="hover:text-slate-300 transition-colors">HR Cloud</Link>
            <Link href="/kinder-cloud" className="hover:text-slate-300 transition-colors">Kinder Cloud</Link>
            <Link href="/login" className="hover:text-slate-300 transition-colors">Kirish</Link>
          </div>
          <p className="text-xs text-slate-600">© 2024 IDTrust. O&apos;zbekistonda yaratilgan 🇺🇿</p>
        </div>
      </footer>
    </div>
  );
}
