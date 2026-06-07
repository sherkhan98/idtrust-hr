'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { IDTrustLogoWhite } from '@/components/ui/IDTrustLogo';
import {
  Building2,
  Users,
  DollarSign,
  Target,
  Clock,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Loader2,
  Check,
} from 'lucide-react';

// ─── Schema ───────────────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    orgName: z.string().min(2, 'Nom kamida 2 ta belgi'),
    orgSize: z.string().min(1, "O'quvchilar sonini tanlang"),
    orgType: z.string().min(1, 'Maktab turini tanlang'),
    adminName: z.string().min(2, 'Ism kamida 2 ta belgi'),
    email: z.string().email("Email noto'g'ri"),
    phone: z.string().min(9, 'Telefon raqam kiriting'),
    password: z
      .string()
      .min(8, 'Kamida 8 ta belgi')
      .regex(/[A-Z]/, 'Katta harf kerak')
      .regex(/[0-9]/, 'Raqam kerak'),
    confirmPassword: z.string(),
    telegramId: z.string().optional(),
    agree: z.boolean().refine((v) => v, 'Shartlarga rozilik kerak'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Parollar mos kelmayapti',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const SIZES = ['100 gacha', '100-300', '300-600', '600-1000', '1000+'];
const SCHOOL_TYPES = ["Umumta'lim", 'Litsey', 'Gimnaziya', 'Xususiy', 'Kollej'];

const SCHOOL_FEATURES = [
  "O'quvchi va o'qituvchi bazasi",
  'Elektron jurnal (baholar)',
  'Yuz tanish davomat (Hikvision)',
  'Ota-onalarga Telegram xabar',
  'Dars jadvali',
  'Imtihon natijalar',
  "To'lov nazorati",
  'Direktor hisobotlari',
];

function PasswordStrength({ password }: { password: string }) {
  const getStrength = (p: string) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };
  const strength = getStrength(password || '');
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const labels = ['Juda zaif', 'Zaif', "O'rtacha", 'Kuchli'];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i < strength ? colors[strength - 1] : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      {password && (
        <p className={`text-xs ${strength >= 3 ? 'text-green-400' : 'text-slate-400'}`}>
          {labels[strength - 1] ?? 'Parol kiriting'}
        </p>
      )}
    </div>
  );
}

const STEPS = [
  { id: 1, title: 'Maktab ma\'lumotlari' },
  { id: 2, title: 'Admin hisobi' },
  { id: 3, title: 'Yakunlash' },
];

export default function SchoolRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { orgSize: '', orgType: '', agree: false },
  });

  const watchPassword = watch('password', '');
  const watchOrgName = watch('orgName', '');
  const watchEmail = watch('email', '');

  const nextStep = async () => {
    const fields: Record<number, (keyof RegisterForm)[]> = {
      1: ['orgName', 'orgSize', 'orgType'],
      2: ['adminName', 'email', 'phone', 'password', 'confirmPassword'],
    };
    const valid = await trigger(fields[step]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: data.orgName,
          companySize: data.orgSize,
          industry: data.orgType,
          adminName: data.adminName,
          email: data.email,
          phone: data.phone,
          telegramId: data.telegramId || null,
          password: data.password,
          cloudType: 'school',
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Xato yuz berdi');
      }
      toast.success('School Cloud hisob muvaffaqiyatli yaratildi!');
      router.push('/login?cloud=school');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Xato yuz berdi';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 flex items-start justify-center p-4 py-8">
      <div className="w-full max-w-5xl">
        {/* Back link */}
        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Bulut tanlashga qaytish
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <IDTrustLogoWhite size="lg" href="/" className="justify-center mb-2" />
          <div className="flex items-center justify-center gap-3 mb-3">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              🏫 School Cloud — Ro&apos;yxatdan o&apos;tish
            </h1>
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full text-white text-sm font-bold shadow-lg shadow-green-500/30">
            <Building2 className="w-4 h-4" />
            School Cloud
          </span>
        </div>

        {/* Progress bar */}
        <div className="max-w-lg mx-auto mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step > s.id
                        ? 'bg-green-500 text-white'
                        : step === s.id
                        ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/40'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                  </div>
                  <span
                    className={`text-[10px] mt-1.5 font-semibold text-center max-w-[80px] leading-tight ${
                      step === s.id ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 mb-5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: step > s.id ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start max-w-5xl mx-auto">
          {/* Form card */}
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* ── Step 1: Maktab ma'lumotlari ── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">
                      Maktab ma&apos;lumotlari
                    </h2>
                    <p className="text-slate-400 text-sm">
                      Maktabingiz haqida asosiy ma&apos;lumotlarni kiriting
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                      <Building2 className="inline w-4 h-4 mr-1 text-green-400" />
                      Maktab nomi *
                    </label>
                    <input
                      {...register('orgName')}
                      className="w-full px-3 py-2.5 text-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/5 text-white placeholder:text-slate-500"
                      placeholder="1-sonli Umumta'lim Maktabi"
                    />
                    {errors.orgName && (
                      <p className="text-red-400 text-xs mt-1">{errors.orgName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                      <Users className="inline w-4 h-4 mr-1 text-green-400" />
                      O&apos;quvchilar soni *
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {SIZES.map((size) => (
                        <label key={size} className="cursor-pointer">
                          <input
                            {...register('orgSize')}
                            type="radio"
                            value={size}
                            className="sr-only"
                          />
                          <div
                            className={`text-center py-2 rounded-lg border text-xs font-semibold transition-all ${
                              watch('orgSize') === size
                                ? 'border-green-500 bg-green-600/40 text-green-300'
                                : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                            }`}
                          >
                            {size}
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.orgSize && (
                      <p className="text-red-400 text-xs mt-1">{errors.orgSize.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                      <Target className="inline w-4 h-4 mr-1 text-green-400" />
                      Maktab turi *
                    </label>
                    <select
                      {...register('orgType')}
                      className="w-full px-3 py-2.5 text-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-slate-800 text-white"
                    >
                      <option value="">Tanlang...</option>
                      {SCHOOL_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {errors.orgType && (
                      <p className="text-red-400 text-xs mt-1">{errors.orgType.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* ── Step 2: Admin hisobi ── */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">Admin hisobi</h2>
                    <p className="text-slate-400 text-sm">
                      Tizimga kirish uchun admin ma&apos;lumotlarini kiriting
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                      Ism Familiya *
                    </label>
                    <input
                      {...register('adminName')}
                      className="w-full px-3 py-2.5 text-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/5 text-white placeholder:text-slate-500"
                      placeholder="Alisher Karimov"
                    />
                    {errors.adminName && (
                      <p className="text-red-400 text-xs mt-1">{errors.adminName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-3 py-2.5 text-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/5 text-white placeholder:text-slate-500"
                      placeholder="direktor@maktab.uz"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                      Telefon (+998) *
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-3 py-2.5 text-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/5 text-white placeholder:text-slate-500"
                      placeholder="+998 90 123 45 67"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                      Parol *
                    </label>
                    <div className="relative">
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-3 py-2.5 text-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/5 text-white placeholder:text-slate-500 pr-10"
                        placeholder="Kamida 8 belgi, katta harf, raqam"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <PasswordStrength password={watchPassword} />
                    {errors.password && (
                      <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                      Parolni tasdiqlang *
                    </label>
                    <div className="relative">
                      <input
                        {...register('confirmPassword')}
                        type={showConfirm ? 'text' : 'password'}
                        className="w-full px-3 py-2.5 text-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/5 text-white placeholder:text-slate-500 pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* ── Step 3: Yakunlash ── */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">Yakunlash</h2>
                    <p className="text-slate-400 text-sm">
                      Ma&apos;lumotlaringizni tekshirib, ro&apos;yxatdan o&apos;ting
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="bg-green-600/10 border border-green-500/20 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-bold text-green-400 uppercase tracking-wide mb-3">
                      Xulosa
                    </p>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">
                        Maktab:{' '}
                        <span className="text-white font-semibold">
                          {watchOrgName || '—'}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">
                        Admin email:{' '}
                        <span className="text-white font-semibold">
                          {watchEmail || '—'}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">
                        Tarif:{' '}
                        <span className="text-green-400 font-semibold">
                          14 kun bepul
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Telegram ID */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                      Telegram ID (ixtiyoriy)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                        @
                      </span>
                      <input
                        {...register('telegramId')}
                        className="w-full pl-8 pr-3 py-2.5 text-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/5 text-white placeholder:text-slate-500"
                        placeholder="username"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Bot: <span className="font-mono text-green-400">@IDTrustBot</span>
                    </p>
                  </div>

                  {/* Agree */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      {...register('agree')}
                      type="checkbox"
                      className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 accent-green-500"
                    />
                    <span className="text-sm text-slate-300">
                      <Link href="/terms" className="text-green-400 hover:text-green-300 font-medium">
                        Foydalanish shartlari
                      </Link>{' '}
                      va{' '}
                      <Link href="/privacy" className="text-green-400 hover:text-green-300 font-medium">
                        Maxfiylik siyosati
                      </Link>
                      {' '}ga roziman *
                    </span>
                  </label>
                  {errors.agree && (
                    <p className="text-red-400 text-xs">{errors.agree.message}</p>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className={`flex mt-7 gap-3 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="flex items-center gap-1.5 px-5 py-2.5 border border-white/10 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Orqaga
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-green-500/30"
                  >
                    Davom etish <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-green-500/30"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Yaratilmoqda...
                      </>
                    ) : (
                      <>
                        School Cloud&apos;ni boshlash <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Feature panel — desktop only */}
          <div className="hidden lg:block w-72 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex-shrink-0">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-lg">🏫</span>
              School Cloud&apos;da nima bor?
            </h3>
            <div className="space-y-3">
              {SCHOOL_FEATURES.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-slate-300">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wide">
                Statistika
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-slate-400">50+ maktab</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-slate-400">30,000+ o&apos;quvchi</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-slate-400">14 kun bepul</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Hisobingiz bormi?{' '}
          <Link href="/login" className="text-green-400 hover:text-green-300 font-semibold">
            Kirish
          </Link>
        </p>
      </div>
    </div>
  );
}
