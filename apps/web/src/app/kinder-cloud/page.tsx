'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Baby, DoorOpen, Camera, ShieldAlert, UtensilsCrossed, HeartPulse,
  CreditCard, BarChart3, Menu, X, CheckCircle2, ArrowRight, ChevronRight,
} from 'lucide-react';

const FEATURES = [
  { emoji: '👶', icon: Baby, title: 'Bolalar bazasi', desc: "Tug'ilgan kun, allergiya, dori" },
  { emoji: '🚪', icon: DoorOpen, title: 'Qabul/Ketish', desc: 'Yuz tanish, ruxsat etilgan shaxslar' },
  { emoji: '📸', icon: Camera, title: 'Ota-onaga Xabar', desc: 'Real-vaqt foto + vaqt' },
  { emoji: '🚫', icon: ShieldAlert, title: 'Begona Shaxs', desc: 'Ruxsatsiz odam olganda signal' },
  { emoji: '🍱', icon: UtensilsCrossed, title: 'Kunlik Menyu', desc: 'Ovqat jadvali, allergen belgilash' },
  { emoji: '💊', icon: HeartPulse, title: "Sog'liq", desc: "Og'irlik, bo'y, emlash jadvali" },
  { emoji: '💳', icon: CreditCard, title: "To'lovlar", desc: "Oylik, qo'shimcha xizmatlar" },
  { emoji: '📊', icon: BarChart3, title: 'Mudira Panel', desc: 'Guruh, davomat, moliya' },
];

const PRICING = [
  { name: 'Mini', price: '$29', period: '/oy', limit: '50 gacha bola', features: ['Bolalar bazasi', 'Qabul/ketish', 'Asosiy hisobotlar', 'Email support'], popular: false },
  { name: 'Standart', price: '$59', period: '/oy', limit: '50-150 bola', features: ['Mini + hamma narsa', 'Yuz tanish', 'SMS xabarlar', "To'lov nazorat", 'Mudira panel'], popular: true },
  { name: 'Premium', price: '$99', period: '/oy', limit: '150+ bola', features: ['Standart + hamma narsa', 'Begona shaxs signal', 'Allergen tracking', 'Dedicated server', '24/7 support'], popular: false },
];

const STATS = [
  { value: '30+', label: "Bog'cha" },
  { value: '5,000+', label: 'Bola' },
  { value: '100%', label: 'Xavfsizlik' },
  { value: '4.8★', label: 'Reyting' },
];

export default function KinderCloudPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 text-white">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg shadow-orange-900/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-lg text-white">IDTrust</span>
            </Link>
            <span className="hidden md:block text-orange-400 text-sm font-medium px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
              Kinder Cloud
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
            <Link href="/register/kinder" className="text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 rounded-xl hover:opacity-90 transition-all shadow-md shadow-orange-500/30">
              Bog&apos;chani ro&apos;yxatdan o&apos;tkaz →
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
              <Link href="/register/kinder" className="text-center text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 py-2.5 rounded-xl">
                Bog&apos;chani ro&apos;yxatdan o&apos;tkaz
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/30 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            Bolalar xavfsizligi — birinchi o&apos;rinda
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            🎠 Kindergarten Cloud
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-4 font-medium">
            Bog&apos;cha va maktabgacha ta&apos;lim uchun xavfsiz tizim
          </p>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Bolalarning xavfsizligi, sog&apos;lig&apos;i va kundalik hayotini nazorat qiling. Ota-onalar har doim xabardor.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register/kinder"
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-orange-500/30 text-sm"
            >
              Bog&apos;chani ro&apos;yxatdan o&apos;tkaz <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login?cloud=kinder"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Bog&apos;cha uchun barcha imkoniyatlar</h2>
            <p className="text-slate-400 text-lg">Bolalar xavfsizligidan moliyagacha — yagona tizimda</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-orange-500/40 hover:bg-slate-800 transition-all group"
              >
                <div className="w-11 h-11 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center text-xl mb-3 group-hover:bg-orange-500/20 transition-all">
                  {f.emoji}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Bog&apos;cha uchun narxlar</h2>
            <p className="text-slate-400">14 kunlik bepul sinov. Karta kerak emas.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border-2 p-6 relative transition-all ${
                  plan.popular
                    ? 'border-orange-500 bg-orange-600/10 shadow-xl shadow-orange-600/20'
                    : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full">
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
                      <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register/kinder"
                  className={`block text-center w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-90'
                      : 'border border-slate-600 text-slate-300 hover:border-orange-500 hover:text-white'
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
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 to-amber-900/40 pointer-events-none" />
        <div className="max-w-2xl mx-auto relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bog&apos;changizni xavfsiz va raqamli qiling
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            14 kun bepul. O&apos;rnatish 5 daqiqa.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Link
              href="/register/kinder"
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-orange-500/30"
            >
              Bog&apos;chani ro&apos;yxatdan o&apos;tkaz <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login?cloud=kinder"
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
            <Link href="/school-cloud" className="hover:text-slate-300 transition-colors">School Cloud</Link>
            <Link href="/login" className="hover:text-slate-300 transition-colors">Kirish</Link>
          </div>
          <p className="text-xs text-slate-600">© 2024 IDTrust. O&apos;zbekistonda yaratilgan 🇺🇿</p>
        </div>
      </footer>
    </div>
  );
}
