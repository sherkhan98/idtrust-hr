'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn, getSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Building2, GraduationCap, Baby } from 'lucide-react';
import { IDTrustLogoWhite } from '@/components/ui/IDTrustLogo';

type CloudType = 'hr' | 'school' | 'kinder' | null;

const CLOUD_CONFIG: Record<NonNullable<CloudType>, {
  label: string;
  emoji: string;
  gradient: string;
  bgGradient: string;
  accent: string;
  border: string;
  backLink: string;
  backLabel: string;
  registerLink: string;
}> = {
  hr: {
    label: 'HR Cloud',
    emoji: '🏢',
    gradient: 'from-blue-600 to-indigo-600',
    bgGradient: 'from-slate-900 via-blue-950 to-slate-900',
    accent: 'text-blue-400',
    border: 'border-blue-500/20',
    backLink: '/hr',
    backLabel: 'HR Cloud',
    registerLink: '/register/hr',
  },
  school: {
    label: 'School Cloud',
    emoji: '🏫',
    gradient: 'from-green-600 to-emerald-600',
    bgGradient: 'from-slate-900 via-green-950 to-slate-900',
    accent: 'text-green-400',
    border: 'border-green-500/20',
    backLink: '/school-cloud',
    backLabel: 'School Cloud',
    registerLink: '/register/school',
  },
  kinder: {
    label: 'Kindergarten Cloud',
    emoji: '🎠',
    gradient: 'from-orange-500 to-amber-500',
    bgGradient: 'from-slate-900 via-orange-950 to-slate-900',
    accent: 'text-orange-400',
    border: 'border-orange-500/20',
    backLink: '/kinder-cloud',
    backLabel: 'Kinder Cloud',
    registerLink: '/register/kinder',
  },
};

const loginSchema = z.object({
  email: z.string().email('Email noto\'g\'ri'),
  password: z.string().min(6, 'Parol kamida 6 ta belgi'),
  mfaCode: z.string().length(6).optional().or(z.literal('')),
});

type LoginForm = z.infer<typeof loginSchema>;

const DEMO_ACCOUNTS = [
  { label: 'HR Cloud — CEO', email: 'ceo@nexusgroup.uz', password: 'Admin@123456', cloud: 'hr', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: 'HR Cloud — HR', email: 'hr@nexusgroup.uz', password: 'Hr@123456', cloud: 'hr', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { label: 'School Cloud', email: 'direktor@maktab1.uz', password: 'Maktab@123', cloud: 'school', color: 'bg-green-50 border-green-200 text-green-700' },
  { label: 'Kindergarten', email: 'admin@maktab1.uz', password: 'Admin@123', cloud: 'kinder', color: 'bg-orange-50 border-orange-200 text-orange-700' },
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [activeCloud, setActiveCloud] = useState<CloudType>(null);

  useEffect(() => {
    const cloudParam = searchParams.get('cloud') as CloudType;
    if (cloudParam && cloudParam in CLOUD_CONFIG) {
      setActiveCloud(cloudParam);
    }
  }, [searchParams]);

  const cloudCfg = activeCloud ? CLOUD_CONFIG[activeCloud] : null;
  const bgGradient = cloudCfg?.bgGradient ?? 'from-slate-900 via-violet-950 to-slate-900';
  const btnGradient = cloudCfg?.gradient ?? 'from-violet-600 to-blue-600';
  const registerHref = cloudCfg?.registerLink ?? '/register';

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const getRedirectPath = (cloud: string | null) => {
    if (cloud === 'school') return '/school';
    if (cloud === 'kinder') return '/kinder';
    return '/dashboard';
  };

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        ...(data.mfaCode && data.mfaCode.length === 6 ? { mfaCode: data.mfaCode } : {}),
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'REQUIRES_MFA') {
          setRequiresMfa(true);
          toast('MFA kodni kiriting', { icon: '🔐' });
        } else {
          toast.error('Email yoki parol noto\'g\'ri');
        }
      } else {
        toast.success('Xush kelibsiz! 👋');
        const redirectParam = searchParams.get('redirect');
        if (redirectParam) {
          router.push(redirectParam);
        } else {
          const session = await getSession();
          const cloudType = (session?.user as any)?.cloudType || activeCloud || 'hr';
          router.push(getRedirectPath(cloudType));
        }
        router.refresh();
      }
    } catch {
      toast.error('Xato yuz berdi. Qayta urinib ko\'ring.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setValue('email', acc.email);
    setValue('password', acc.password);
    toast.success(`${acc.label} demo hisob to'ldirildi`, { duration: 1500 });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        {/* Back link for cloud-specific entries */}
        {cloudCfg && (
          <div className="mb-4">
            <Link
              href={cloudCfg.backLink}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              ← {cloudCfg.backLabel} sahifasiga qaytish
            </Link>
          </div>
        )}

        {/* Logo */}
        <div className="text-center mb-8">
          <IDTrustLogoWhite size="lg" href="/" className="justify-center mb-2" />
          <p className="text-slate-400 text-sm mt-1">
            {cloudCfg ? cloudCfg.label : 'HR • School • Kindergarten Cloud'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-violet-900/20 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Tizimga kiring</h2>
          <p className="text-gray-400 text-sm mb-6">Hisobingiz bilan davom eting</p>

          {/* Demo accounts */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Demo hisoblar</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all hover:shadow-sm ${acc.color}`}
                >
                  <span className="text-lg">
                    {acc.cloud === 'hr' ? '🏢' : acc.cloud === 'school' ? '🏫' : '🎠'}
                  </span>
                  <span className="text-xs font-semibold leading-tight">{acc.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-400">yoki email bilan</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                {...register('email')}
                type="email"
                className="input-field"
                placeholder="email@company.uz"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Parol</label>
                <button type="button" className="text-xs text-violet-600 hover:text-violet-700 font-medium">
                  Parolni unutdingizmi?
                </button>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {requiresMfa && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">MFA Kod</label>
                <input
                  {...register('mfaCode')}
                  type="text"
                  className="input-field text-center tracking-widest text-lg"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-gradient-to-r ${btnGradient} text-white font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg`}
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Kirilmoqda...</>
              ) : (
                'Kirish →'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Hisobingiz yo&#39;qmi?{' '}
            <Link href={registerHref} className="text-violet-600 hover:text-violet-700 font-semibold">
              Ro&#39;yxatdan o&#39;ting
            </Link>
          </p>
        </div>

        {/* Cloud badges */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {[
            { icon: Building2, label: 'HR Cloud', color: 'text-blue-400', href: '/hr' },
            { icon: GraduationCap, label: 'School', color: 'text-green-400', href: '/school-cloud' },
            { icon: Baby, label: "Bog'cha", color: 'text-orange-400', href: '/kinder-cloud' },
          ].map((b) => (
            <Link key={b.label} href={b.href} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors">
              <b.icon className={`w-3.5 h-3.5 ${b.color}`} />
              {b.label}
            </Link>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          © 2024 IDTrust. O&#39;zbekistonda yaratilgan 🇺🇿
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
