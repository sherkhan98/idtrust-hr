'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BarChart3, CheckCircle2, ChevronRight, Brain, Bell, CreditCard,
  Play, ArrowRight, Building2, GraduationCap, Baby, Star, Menu, X,
} from 'lucide-react';

const FEATURES_HR = ['Xodim boshqaruvi', 'Maosh hisoblash', 'Biometrik davomat', 'KPI va baholash', 'Rekrutment', 'Onboarding'];
const FEATURES_SCHOOL = ["O'quvchi yozuvi", 'Dars jadvali', 'Elektron jurnal', 'Ota-ona ilovasi', 'Yuz tanish davomat', 'Hisobotlar'];
const FEATURES_KINDER = ["Bolalar ro'yxati", 'Ota-ona kirish nazorati', 'Qabul/ketish SMS', 'Yuz tanish', 'Oziq-ovqat jadvali', 'Xavfsizlik kamerasi'];

const TESTIMONIALS = [
  { name: 'Alisher Nazarov', role: 'CEO, Nexus Group', text: "IDTrust bizning HR jarayonlarimizni butunlay o'zgartirdi. Maosh hisoblash avtomatik, davomat real-vaqtda.", avatar: 'AN', stars: 5 },
  { name: 'Gulnora Toshmatova', role: 'Maktab Direktori', text: 'Elektron jurnal va ota-onalarga avtomatik xabar funksiyasi ajoyib. Endi hamma narsa bir joyda.', avatar: 'GT', stars: 5 },
  { name: 'Bobur Yusupov', role: "Bog'cha Mudiri", text: "Bolalarni qabul qilish nazorati bizga juda ko'p vaqt tejaydi. Ota-onalar ham mamnun.", avatar: 'BY', stars: 5 },
];

const PRICING = [
  { name: 'Starter', price: '990,000', clouds: 1, users: '50 foydalanuvchi', features: ['1 ta bulut', 'Asosiy funksiyalar', '5 GB disk', "Email qo'llab-quvvatlash"], popular: false },
  { name: 'Professional', price: '2,490,000', clouds: 2, users: '200 foydalanuvchi', features: ['2 ta bulut', 'AI yuz tanish', 'API kirish', 'Telegram bot', 'Priority support'], popular: true },
  { name: 'Enterprise', price: 'Kelishuv', clouds: 3, users: 'Cheksiz', features: ['Barcha bulutlar', 'Custom integratsiya', 'Cheksiz disk', 'Dedicated server', '24/7 support'], popular: false },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="IDTrust" width={44} height={44} />
            <span className="font-bold text-xl text-gray-900">IDTrust</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Mahsulot', 'Narxlar', 'Blog', 'Demo'].map((item) => (
              <a key={item} href="#" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">{item}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all">
              Kirish
            </Link>
            <Link href="/register" className="text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2 rounded-xl hover:opacity-90 transition-all shadow-md">
              Bepul boshlash →
            </Link>
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
            {['Mahsulot', 'Narxlar', 'Blog', 'Demo'].map((item) => (
              <a key={item} href="#" className="block text-sm font-medium text-gray-600 py-1">{item}</a>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link href="/login" className="text-center text-sm font-semibold py-2.5 border border-gray-200 rounded-xl">Kirish</Link>
              <Link href="/register" className="text-center text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 py-2.5 rounded-xl">Bepul boshlash</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center bg-gradient-to-b from-violet-50/50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-violet-200">
            <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
            HR • Attendance • School
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            IDTrust — Ishonchli HR tizimi
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
            O&#39;zbekistondagi eng ishonchli HR, davomat va maktab boshqaruvi platformasi. Yuz tanish, avtomatik xabarnoma va AI tahlil.
          </p>
          <div className="flex items-center justify-center gap-4 mb-16">
            <Link href="/register" className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-violet-200 text-sm">
              Bepul demo boshlash <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="flex items-center gap-2 border border-gray-200 text-gray-700 font-semibold px-6 py-3.5 rounded-xl hover:bg-gray-50 transition-all text-sm">
              <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center">
                <Play className="w-3 h-3 text-violet-600 fill-violet-600 ml-0.5" />
              </div>
              Videoni ko&#39;ring
            </button>
          </div>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[['500+', 'Korxona'], ['50,000+', 'Foydalanuvchi'], ['3', 'Bulut moduli'], ['99.9%', 'Uptime']].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-2xl font-bold text-gray-900">{v}</p>
                <p className="text-xs text-gray-400">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Cloud Cards */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Bir platforma — uchta kuchli bulut</h2>
            <p className="text-gray-500">Har bir tashkilot turi uchun maxsus ishlab chiqilgan modullar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'HR Cloud', icon: Building2, color: 'from-blue-600 to-indigo-600', border: 'border-blue-200', features: FEATURES_HR, detailLink: '/hr', registerLink: '/register/hr', tag: 'Xodimlar' },
              { title: 'School Cloud', icon: GraduationCap, color: 'from-green-600 to-emerald-600', border: 'border-green-200', features: FEATURES_SCHOOL, detailLink: '/school-cloud', registerLink: '/register/school', tag: 'Maktab' },
              { title: 'Kindergarten Cloud', icon: Baby, color: 'from-orange-500 to-amber-500', border: 'border-orange-200', features: FEATURES_KINDER, detailLink: '/kinder-cloud', registerLink: '/register/kinder', tag: "Bog'cha" },
            ].map((cloud) => (
              <div key={cloud.title} className={`bg-white rounded-2xl border-2 ${cloud.border} overflow-hidden hover:shadow-xl transition-all`}>
                <div className={`bg-gradient-to-br ${cloud.color} p-5 text-white`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <cloud.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-lg leading-none">{cloud.title}</p>
                      <p className="text-white/70 text-xs">{cloud.tag} boshqaruvi</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <ul className="space-y-2 mb-5">
                    {cloud.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Link href={cloud.detailLink} className="flex items-center justify-center gap-1.5 flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-bold text-gray-700 transition-all">
                      Batafsil <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link href={cloud.registerLink} className={`flex items-center justify-center gap-1.5 flex-1 py-2.5 bg-gradient-to-r ${cloud.color} rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all`}>
                      Boshlash
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Comparison Table */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Qaysi platform sizga mos?</h2>
            <p className="text-gray-500">Har bir tashkilot turi uchun maxsus imkoniyatlar</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-4 font-semibold text-gray-700 w-1/3">Imkoniyat</th>
                  <th className="text-center px-4 py-4 font-semibold text-blue-700">
                    <Link href="/hr" className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
                      <span className="text-lg">🏢</span>
                      <span>HR Cloud</span>
                    </Link>
                  </th>
                  <th className="text-center px-4 py-4 font-semibold text-green-700">
                    <Link href="/school-cloud" className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
                      <span className="text-lg">🏫</span>
                      <span>School Cloud</span>
                    </Link>
                  </th>
                  <th className="text-center px-4 py-4 font-semibold text-orange-700">
                    <Link href="/kinder-cloud" className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
                      <span className="text-lg">🎠</span>
                      <span>Kinder Cloud</span>
                    </Link>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { feature: 'Xodim / Shaxs boshqaruvi', hr: true, school: true, kinder: true },
                  { feature: 'Biometrik yuz tanish', hr: true, school: true, kinder: true },
                  { feature: 'Telegram xabarnomalari', hr: true, school: true, kinder: true },
                  { feature: 'Maosh hisoblash', hr: true, school: true, kinder: false },
                  { feature: 'KPI va baholash tizimi', hr: true, school: false, kinder: false },
                  { feature: 'Rekrutment (ATS)', hr: true, school: false, kinder: false },
                  { feature: 'Elektron jurnal (baholar)', hr: false, school: true, kinder: false },
                  { feature: 'Dars jadvali', hr: false, school: true, kinder: false },
                  { feature: "Ota-onaga qabul/ketish SMS", hr: false, school: true, kinder: true },
                  { feature: "Begona shaxs signali", hr: false, school: false, kinder: true },
                  { feature: 'Allergen & sog\'liq nazorat', hr: false, school: false, kinder: true },
                  { feature: "To'lov nazorat", hr: true, school: true, kinder: true },
                  { feature: 'AI tahlil va hisobotlar', hr: true, school: true, kinder: true },
                  { feature: 'E-Imzo', hr: true, school: false, kinder: false },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-5 py-3.5 text-gray-700 font-medium">{row.feature}</td>
                    <td className="px-4 py-3.5 text-center">
                      {row.hr ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">✓</span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-300 rounded-full text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {row.school ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-xs font-bold">✓</span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-300 rounded-full text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {row.kinder ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs font-bold">✓</span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-300 rounded-full text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[
              { label: 'HR Cloud batafsil', href: '/hr', color: 'bg-blue-600 hover:bg-blue-700' },
              { label: 'School Cloud batafsil', href: '/school-cloud', color: 'bg-green-600 hover:bg-green-700' },
              { label: 'Kinder Cloud batafsil', href: '/kinder-cloud', color: 'bg-orange-500 hover:bg-orange-600' },
            ].map((btn) => (
              <Link
                key={btn.href}
                href={btn.href}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${btn.color}`}
              >
                {btn.label} <ChevronRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Core */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-violet-900/50 text-violet-300 text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-violet-800">
              ✨ Shared AI Core
            </div>
            <h2 className="text-3xl font-bold mb-3">Aqlli texnologiyalar — barchasi uchun</h2>
            <p className="text-gray-400">AI Core barcha bulutlar bilan ishlaydi</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: Brain, title: 'Yuz Tanish', desc: 'Hikvision kameralar, 99.7% aniqlik', color: 'text-violet-400 bg-violet-900/30' },
              { icon: Bell, title: 'Aqlli Xabarnomalar', desc: 'Telegram, SMS, Email — real-vaqt', color: 'text-blue-400 bg-blue-900/30' },
              { icon: BarChart3, title: 'AI Hisobotlar', desc: 'Bashoratli tahlil, anomaliya', color: 'text-green-400 bg-green-900/30' },
              { icon: CreditCard, title: 'Yagona Billing', desc: 'Barcha bulutlar — bitta hisob', color: 'text-orange-400 bg-orange-900/30' },
            ].map((f) => (
              <div key={f.title} className="bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-violet-700 transition-all">
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <p className="font-bold text-white mb-2">{f.title}</p>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Mijozlarimiz aytadi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all">
                <div className="flex mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">&#34;{t.text}&#34;</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Oddiy va shaffof narxlar</h2>
            <p className="text-gray-500">Yashirin to&#39;lovlar yo&#39;q. Istalgan vaqt o&#39;zgartiring.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map((plan) => (
              <div key={plan.name} className={`bg-white rounded-2xl border-2 p-6 relative ${plan.popular ? 'border-violet-500 shadow-xl shadow-violet-100' : 'border-gray-200'}`}>
                {plan.popular && <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">MASHHUR TARIF</span>}
                <p className="font-bold text-gray-900 text-lg mb-1">{plan.name}</p>
                <div className="mb-1">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== 'Kelishuv' && <span className="text-gray-400 text-sm"> so&#39;m/oy</span>}
                </div>
                <p className="text-xs text-gray-400 mb-4">{plan.clouds} bulut • {plan.users}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register"
                  className={`block text-center w-full py-2.5 rounded-xl text-sm font-bold transition-all ${plan.popular ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:opacity-90' : 'border-2 border-gray-200 text-gray-700 hover:border-violet-300'}`}>
                  {plan.price === 'Kelishuv' ? "Bog'lanish" : 'Boshlash'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-br from-violet-600 to-blue-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Bugun boshlang</h2>
          <p className="text-violet-200 mb-8">14 kunlik bepul sinov. Karta kerak emas.</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input type="email" placeholder="email@company.uz" className="flex-1 px-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none" />
            <Link href="/register" className="px-6 py-3 bg-white text-violet-700 font-bold rounded-xl hover:bg-violet-50 transition-all text-sm whitespace-nowrap">
              Bepul sinab ko&#39;ring
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image src="/logo.svg" alt="IDTrust" width={28} height={28} />
                <span className="text-white font-bold">IDTrust</span>
              </div>
              <p className="text-xs leading-relaxed">O&#39;zbekiston uchun yagona HR platformasi.</p>
            </div>
            {[
              { title: 'Mahsulot', links: ['HR Cloud', 'School Cloud', 'Kindergarten Cloud', 'AI Core'] },
              { title: 'Kompaniya', links: ['Haqimizda', 'Blog', 'Ishlar', 'Aloqa'] },
              { title: "Qo'llab-quvvatlash", links: ['Hujjatlar', 'API', 'Status', 'Telegram'] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-white font-semibold text-sm mb-3">{col.title}</p>
                <ul className="space-y-1.5">
                  {col.links.map((l) => <li key={l}><a href="#" className="text-xs hover:text-white transition-colors">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-xs">
            © 2024 IDTrust. O&#39;zbekistonda yaratilgan 🇺🇿
          </div>
        </div>
      </footer>
    </div>
  );
}
