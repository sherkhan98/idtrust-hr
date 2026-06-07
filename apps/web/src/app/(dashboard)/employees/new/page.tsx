'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  ArrowLeft, ChevronRight, Save, User, Briefcase, CreditCard,
  AlertCircle, Eye, EyeOff, Shuffle, Copy, Check,
  Shield, Lock, Send, MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  firstName: z.string().min(2, 'Majburiy'),
  lastName: z.string().min(2, 'Majburiy'),
  middleName: z.string().optional(),
  email: z.string().email("Noto'g'ri email"),
  phone: z.string().min(9, 'Majburiy'),
  gender: z.enum(['MALE', 'FEMALE']),
  birthDate: z.string().min(1, 'Majburiy'),
  address: z.string().optional(),
  departmentId: z.string().min(1, 'Majburiy'),
  positionId: z.string().min(1, 'Majburiy'),
  branchId: z.string().min(1, 'Majburiy'),
  workType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE', 'INTERN']),
  hireDate: z.string().min(1, 'Majburiy'),
  salary: z.coerce.number().min(1, 'Majburiy'),
  pinfl: z.string().optional(),
  passportSeries: z.string().optional(),
  account: z.object({
    createAccount: z.boolean().default(true),
    appEmail: z.string().optional(),
    appPassword: z.string().optional(),
    telegramId: z.string().optional(),
    sendWelcome: z.boolean().default(true),
    permissions: z.object({
      viewAttendance: z.boolean().default(true),
      viewSalary: z.boolean().default(false),
      requestLeave: z.boolean().default(true),
      viewKpi: z.boolean().default(true),
      downloadDocuments: z.boolean().default(false),
      viewColleagues: z.boolean().default(true),
    }).default({}),
  }).default({}),
});

type FormData = z.infer<typeof schema>;

const STEPS = [
  { id: 1, label: "Shaxsiy ma'lumotlar", icon: User },
  { id: 2, label: 'Ish ma\'lumotlari', icon: Briefcase },
  { id: 3, label: 'Hujjatlar', icon: CreditCard },
  { id: 4, label: 'Kirish va ruxsatlar', icon: Shield },
];

const DEPARTMENTS = [
  { id: '1', name: 'IT' }, { id: '2', name: 'HR' }, { id: '3', name: 'Moliya' },
  { id: '4', name: 'Savdo' }, { id: '5', name: 'Marketing' }, { id: '6', name: 'Admin' },
];
const POSITIONS = [
  { id: '1', name: 'Dasturchi' }, { id: '2', name: 'HR Menejer' }, { id: '3', name: 'Buxgalter' },
  { id: '4', name: 'Savdo menejeri' }, { id: '5', name: 'Designer' }, { id: '6', name: 'Kotib' },
];
const BRANCHES = [
  { id: '1', name: 'Toshkent (Asosiy)' }, { id: '2', name: 'Samarqand' }, { id: '3', name: 'Namangan' },
];

const PERMISSIONS = [
  { key: 'viewAttendance', icon: '🕐', label: 'Ish soatlari', desc: "O'z davomat va ish soatlarini ko'radi", defaultOn: true },
  { key: 'viewSalary', icon: '💰', label: 'Maosh ma\'lumotlari', desc: "Oylik maoshi va to'lovlarni ko'radi", defaultOn: false },
  { key: 'requestLeave', icon: '📋', label: "Ta'til so'rash", desc: "Ta'til, kasal, safari so'rovlarini yuboradi", defaultOn: true },
  { key: 'viewKpi', icon: '📊', label: 'KPI natijalar', desc: "O'z KPI va baholash natijalarini ko'radi", defaultOn: true },
  { key: 'downloadDocuments', icon: '📄', label: 'Hujjatlar', desc: 'Maosh varaqasi va hujjatlarni yuklab oladi', defaultOn: false },
  { key: 'viewColleagues', icon: '👥', label: "Xodimlar ro'yxati", desc: "Boshqa xodimlar ismini ko'radi", defaultOn: true },
] as const;

function generatePassword() {
  const upper = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const special = '@#!$';
  const all = upper + lower + digits + special;
  let pass = upper[Math.floor(Math.random() * upper.length)]
    + lower[Math.floor(Math.random() * lower.length)]
    + digits[Math.floor(Math.random() * digits.length)]
    + special[Math.floor(Math.random() * special.length)];
  for (let i = 4; i < 12; i++) pass += all[Math.floor(Math.random() * all.length)];
  return pass.split('').sort(() => Math.random() - 0.5).join('');
}

export default function NewEmployeePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successData, setSuccessData] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const { register, handleSubmit, formState: { errors }, trigger, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: 'MALE', workType: 'FULL_TIME',
      // Leave hireDate empty initially; set it client-side in useEffect to avoid hydration mismatch
      hireDate: '',
      account: {
        createAccount: true, sendWelcome: true,
        permissions: { viewAttendance: true, viewSalary: false, requestLeave: true, viewKpi: true, downloadDocuments: false, viewColleagues: true },
      },
    },
  });

  const createAccount = watch('account.createAccount');
  const permissions = watch('account.permissions');

  // Set today's date client-side only to avoid hydration mismatch with new Date()
  useEffect(() => {
    setValue('hireDate', new Date().toISOString().split('T')[0]);
  }, [setValue]);

  const validateStep = async (s: number) => {
    const fields: Record<number, (keyof FormData)[]> = {
      1: ['firstName', 'lastName', 'email', 'phone', 'gender', 'birthDate'],
      2: ['departmentId', 'positionId', 'branchId', 'workType', 'hireDate', 'salary'],
      3: [],
    };
    const valid = await trigger(fields[s] || []);
    if (valid) {
      if (s === 1) {
        const email = watch('email');
        setValue('account.appEmail', email);
      }
      setStep(s + 1);
    }
  };

  const handleGenPassword = () => {
    const p = generatePassword();
    setValue('account.appPassword', p);
    setShowPassword(true);
  };

  const copyCredentials = () => {
    const email = successData?.email || '';
    const pwd = successData?.password || '';
    navigator.clipboard.writeText(`Login: ${email}\nParol: ${pwd}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/backend/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Xato yuz berdi');

      if (data.account?.createAccount && data.account.appEmail) {
        setSuccessData({ email: data.account.appEmail, password: data.account.appPassword || '(yuborildi)' });
      } else {
        toast.success("Xodim muvaffaqiyatli qo'shildi!");
        router.push('/employees');
      }
    } catch (err: any) {
      toast.error(err.message || 'Xato yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (err?: { message?: string }) =>
    cn('input-field', err && 'border-red-300 focus:ring-red-100');

  const FieldError = ({ error }: { error?: { message?: string } }) =>
    error?.message ? <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" />{error.message}</p> : null;

  // Success modal
  if (successData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Xodim muvaffaqiyatli qo&#39;shildi!</h2>
          <p className="text-gray-500 text-sm mb-6">Quyidagi ma&#39;lumotlarni xodimga yuboring:</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Login (Email)</p>
            <p className="font-mono font-semibold text-gray-900 text-sm mb-3">{successData.email}</p>
            <p className="text-xs text-gray-500 mb-1">Parol</p>
            <p className="font-mono font-bold text-blue-700 text-lg tracking-wider">{successData.password}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button onClick={copyCredentials}
              className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Nusxalandi!' : 'Nusxalash'}
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
              <Send className="w-4 h-4" /> Email yuborish
            </button>
          </div>
          <button onClick={() => router.push('/employees')}
            className="w-full py-2.5 text-gray-500 hover:text-gray-700 text-sm font-medium">
            Xodimlar ro&#39;yxatiga qaytish →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-0.5">
            <Link href="/employees" className="hover:text-blue-600">Xodimlar</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-700">Yangi xodim</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Yangi xodim qo&#39;shish</h1>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isDone = s.id < step;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg', isActive ? 'bg-blue-50' : '')}>
                  <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    isDone ? 'bg-green-500 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400')}>
                    {isDone ? '✓' : <Icon className="w-3 h-3" />}
                  </div>
                  <span className={cn('text-xs font-medium hidden sm:block',
                    isActive ? 'text-blue-700' : isDone ? 'text-green-600' : 'text-gray-400')}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && <div className={cn('flex-1 h-px mx-1', isDone ? 'bg-green-300' : 'bg-gray-200')} />}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* STEP 1 */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Shaxsiy ma&#39;lumotlar</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Familiya *</label>
                <input {...register('lastName')} className={inputClass(errors.lastName)} placeholder="Karimov" />
                <FieldError error={errors.lastName} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ism *</label>
                <input {...register('firstName')} className={inputClass(errors.firstName)} placeholder="Jasur" />
                <FieldError error={errors.firstName} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Otasining ismi</label>
                <input {...register('middleName')} className="input-field" placeholder="Bekmurodovich" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Jinsi *</label>
                <select {...register('gender')} className="input-field">
                  <option value="MALE">Erkak</option>
                  <option value="FEMALE">Ayol</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tug&#39;ilgan sana *</label>
                <input type="date" {...register('birthDate')} className={inputClass(errors.birthDate)} />
                <FieldError error={errors.birthDate} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon *</label>
                <input {...register('phone')} className={inputClass(errors.phone)} placeholder="+998 90 123 45 67" />
                <FieldError error={errors.phone} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                <input type="email" {...register('email')} className={inputClass(errors.email)} placeholder="jasur@kompaniya.uz" />
                <FieldError error={errors.email} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Manzil</label>
                <input {...register('address')} className="input-field" placeholder="Toshkent, Chilonzor tumani" />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => validateStep(1)} className="btn-primary">
                Keyingisi: Ish ma&#39;lumotlari <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Ish ma&#39;lumotlari</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bo&#39;lim *</label>
                <select {...register('departmentId')} className={inputClass(errors.departmentId)}>
                  <option value="">Tanlang</option>
                  {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                <FieldError error={errors.departmentId} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Lavozim *</label>
                <select {...register('positionId')} className={inputClass(errors.positionId)}>
                  <option value="">Tanlang</option>
                  {POSITIONS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <FieldError error={errors.positionId} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Filial *</label>
                <select {...register('branchId')} className={inputClass(errors.branchId)}>
                  <option value="">Tanlang</option>
                  {BRANCHES.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <FieldError error={errors.branchId} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ish turi *</label>
                <select {...register('workType')} className="input-field">
                  <option value="FULL_TIME">To&#39;liq stavka</option>
                  <option value="PART_TIME">Yarim stavka</option>
                  <option value="CONTRACT">Shartnoma</option>
                  <option value="REMOTE">Masofaviy</option>
                  <option value="INTERN">Intern</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ishga kirgan sana *</label>
                <input type="date" {...register('hireDate')} className={inputClass(errors.hireDate)} />
                <FieldError error={errors.hireDate} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Maosh (UZS) *</label>
                <input type="number" {...register('salary')} className={inputClass(errors.salary)} placeholder="5000000" />
                <FieldError error={errors.salary} />
              </div>
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary">Orqaga</button>
              <button type="button" onClick={() => validateStep(2)} className="btn-primary">Keyingisi: Hujjatlar <ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Shaxs hujjatlari</h2>
            <p className="text-sm text-gray-500">Ixtiyoriy — keyinroq ham to&#39;ldirish mumkin.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">PINFL (14 raqam)</label>
                <input {...register('pinfl')} className="input-field" placeholder="12345678901234" maxLength={14} />
                <FieldError error={errors.pinfl} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Pasport seriyasi</label>
                <input {...register('passportSeries')} className="input-field" placeholder="AA 1234567" />
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
              <strong>Face ID / Biometrik:</strong> Xodim profili yaratilgandan so&#39;ng profildan sozlash mumkin.
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(2)} className="btn-secondary">Orqaga</button>
              <button type="button" onClick={() => validateStep(3)} className="btn-primary">Keyingisi: Kirish sozlamalari <ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {/* STEP 4 — Account & Permissions */}
        {step === 4 && (
          <div className="space-y-4">
            {/* Account Setup */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Ilova kirish sozlamalari</h2>
                  <p className="text-xs text-gray-500">Xodimga StaffFlow HR ilovasiga kirish imkonini bering</p>
                </div>
              </div>

              {/* Create account toggle */}
              <label className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl cursor-pointer">
                <div className="relative flex-shrink-0">
                  <input type="checkbox" {...register('account.createAccount')} className="sr-only" />
                  <div className={cn('w-11 h-6 rounded-full transition-colors', createAccount ? 'bg-blue-600' : 'bg-gray-200')}
                    onClick={() => setValue('account.createAccount', !createAccount)}>
                    <div className={cn('absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                      createAccount ? 'translate-x-5' : 'translate-x-0')} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Xodimga ilova kirishi bering</p>
                  <p className="text-xs text-gray-500">Xodim StaffFlow HR ilovasiga login/parol bilan kiradi</p>
                </div>
              </label>

              {createAccount && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Login email</label>
                    <input {...register('account.appEmail')} type="email" className="input-field"
                      placeholder="jasur@kompaniya.uz" />
                    <p className="text-xs text-gray-400 mt-1">Xodim bu email bilan tizimga kiradi</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Parol *</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input {...register('account.appPassword')} type={showPassword ? 'text' : 'password'}
                          className="input-field pr-10" placeholder="••••••••••••" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <button type="button" onClick={handleGenPassword}
                        className="flex items-center gap-1.5 px-3 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium transition-colors flex-shrink-0">
                        <Shuffle className="w-3.5 h-3.5" /> Avtomatik
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Kamida 8 ta belgi</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Telegram ID (ixtiyoriy)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                      <input {...register('account.telegramId')} className="input-field pl-7"
                        placeholder="username yoki +998901234567" />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl">
                    <input type="checkbox" {...register('account.sendWelcome')} className="w-4 h-4 rounded text-blue-600" />
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">Xush kelibsiz emaili yuborish (login va parol bilan)</span>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Xodim ko&#39;rishi mumkin bo&#39;lgan ma&#39;lumotlar</h2>
                  <p className="text-xs text-gray-500">Keyinchalik xodim profilidan o&#39;zgartirish mumkin</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {PERMISSIONS.map((perm) => {
                  const val = permissions?.[perm.key] ?? perm.defaultOn;
                  return (
                    <label key={perm.key} className={cn(
                      'flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                      val ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                    )}>
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input type="checkbox" checked={val}
                          onChange={(e) => setValue(`account.permissions.${perm.key}` as any, e.target.checked)}
                          className="sr-only" />
                        <div className={cn('w-9 h-5 rounded-full transition-colors', val ? 'bg-green-500' : 'bg-gray-300')}>
                          <div className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                            val ? 'translate-x-[18px]' : 'translate-x-0.5')} />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{perm.icon} {perm.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{perm.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between">
              <button type="button" onClick={() => setStep(3)} className="btn-secondary">Orqaga</button>
              <button type="submit" disabled={isSubmitting}
                className="btn-primary min-w-[160px] flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saqlanmoqda...</>
                ) : (
                  <><Save className="w-4 h-4" />Xodim yaratish</>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
