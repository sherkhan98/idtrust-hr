'use client';

import { useState, useEffect } from 'react';
import {
  FileText, CheckCircle, Clock, AlertCircle, Plus, Eye,
  PenTool, X, Globe, Download, Shield, FileCheck,
  LayoutTemplate, ChevronDown, Search, Smartphone,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type DocStatus = 'SIGNED' | 'PENDING' | 'DRAFT' | 'EXPIRED';
type DocType = 'CONTRACT' | 'NDA' | 'ORDER' | 'AGREEMENT' | 'POLICY';

interface Signatory {
  name: string;
  role: string;
  signed: boolean;
  avatar: string;
}

interface EDocument {
  id: string;
  title: string;
  type: DocType;
  status: DocStatus;
  created: string;
  completedAt?: string;
  signatories: Signatory[];
  pages: number;
  dueDate: string | null;
}

// ─── Demo Data ─────────────────────────────────────────────────────────────────

const DEMO_DOCS: EDocument[] = [
  {
    id: 'd1', title: 'Mehnat shartnomasi — Sardor Toshmatov', type: 'CONTRACT', status: 'PENDING',
    created: '2024-01-20',
    signatories: [
      { name: 'Sardor Toshmatov', role: 'Xodim', signed: false, avatar: 'ST' },
      { name: 'Alisher Karimov (CEO)', role: 'Direktor', signed: true, avatar: 'AK' },
      { name: 'Malika Yusupova (HR)', role: 'HR Manager', signed: true, avatar: 'MY' },
    ],
    pages: 4, dueDate: '2024-01-30',
  },
  {
    id: 'd2', title: 'Maxfiylik shartnomasi (NDA) — Bobur Rakhimov', type: 'NDA', status: 'SIGNED',
    created: '2024-01-15', completedAt: '2024-01-16',
    signatories: [
      { name: 'Bobur Rakhimov', role: 'Xodim', signed: true, avatar: 'BR' },
      { name: 'Alisher Karimov (CEO)', role: 'Direktor', signed: true, avatar: 'AK' },
    ],
    pages: 2, dueDate: null,
  },
  {
    id: 'd3', title: "Ta'til buyrug'i #2024-01 — Jasur Mirzayev", type: 'ORDER', status: 'SIGNED',
    created: '2024-01-18', completedAt: '2024-01-19',
    signatories: [
      { name: 'Jasur Mirzayev', role: 'Xodim', signed: true, avatar: 'JM' },
      { name: 'Malika Yusupova (HR)', role: 'HR Manager', signed: true, avatar: 'MY' },
    ],
    pages: 1, dueDate: null,
  },
  {
    id: 'd4', title: 'Material javobgarlik shartnomasi — Dilnoza Karimova', type: 'CONTRACT', status: 'PENDING',
    created: '2024-01-22',
    signatories: [
      { name: 'Dilnoza Karimova', role: 'Xodim', signed: false, avatar: 'DK' },
      { name: 'Alisher Karimov (CEO)', role: 'Direktor', signed: false, avatar: 'AK' },
    ],
    pages: 3, dueDate: '2024-01-31',
  },
  {
    id: 'd5', title: 'Ish haqi kelishuvi — Otabek Sobirov', type: 'AGREEMENT', status: 'DRAFT',
    created: '2024-01-23',
    signatories: [
      { name: 'Otabek Sobirov', role: 'Xodim', signed: false, avatar: 'OS' },
      { name: 'Alisher Karimov (CEO)', role: 'Direktor', signed: false, avatar: 'AK' },
    ],
    pages: 2, dueDate: null,
  },
  {
    id: 'd6', title: 'Ichki tartib qoidalar 2024 — Barcha xodimlar', type: 'POLICY', status: 'PENDING',
    created: '2024-01-10',
    signatories: [
      { name: 'Sardor Toshmatov', role: 'Xodim', signed: true, avatar: 'ST' },
      { name: 'Malika Yusupova', role: 'Xodim', signed: false, avatar: 'MY' },
      { name: 'Bobur Rakhimov', role: 'Xodim', signed: false, avatar: 'BR' },
    ],
    pages: 8, dueDate: '2024-02-01',
  },
  {
    id: 'd7', title: 'Bonus kelishuvi — Jasur Mirzayev', type: 'AGREEMENT', status: 'EXPIRED',
    created: '2023-12-01',
    signatories: [
      { name: 'Jasur Mirzayev', role: 'Xodim', signed: false, avatar: 'JM' },
      { name: 'Alisher Karimov (CEO)', role: 'Direktor', signed: true, avatar: 'AK' },
    ],
    pages: 1, dueDate: '2023-12-31',
  },
  {
    id: 'd8', title: "Probatsion davr buyrug'i — Kamola Ergasheva", type: 'ORDER', status: 'SIGNED',
    created: '2024-01-05', completedAt: '2024-01-06',
    signatories: [
      { name: 'Kamola Ergasheva', role: 'Xodim', signed: true, avatar: 'KE' },
      { name: 'Malika Yusupova (HR)', role: 'HR Manager', signed: true, avatar: 'MY' },
    ],
    pages: 1, dueDate: null,
  },
];

const EMPLOYEES = [
  'Sardor Toshmatov', 'Bobur Rakhimov', 'Jasur Mirzayev', 'Dilnoza Karimova',
  'Otabek Sobirov', 'Kamola Ergasheva', 'Malika Yusupova', 'Alisher Karimov',
];

const TEMPLATES = [
  { id: 'tpl1', title: 'Mehnat shartnomasi', icon: '📋', description: 'Standart ish shartnomasi (muddatli / muddatsiz)', type: 'CONTRACT' as DocType },
  { id: 'tpl2', title: 'NDA', icon: '🔒', description: 'Maxfiylik bitimi (Non-Disclosure Agreement)', type: 'NDA' as DocType },
  { id: 'tpl3', title: "Ta'til buyrug'i", icon: '🏖️', description: "Yillik ta'til rasmiylashtirish buyrug'i", type: 'ORDER' as DocType },
  { id: 'tpl4', title: 'Ish haqi kelishuvi', icon: '💰', description: "Ish haqi va bonuslar bo'yicha kelishuv", type: 'AGREEMENT' as DocType },
  { id: 'tpl5', title: 'Ichki qoidalar', icon: '📜', description: "Kompaniya ichki tartib qoidalari", type: 'POLICY' as DocType },
];

const FAKE_HASH = 'a3f9b2c8d4e7f1a2b5c9d3e6f0a1b4c7d8e2f5a9b3c6d0e4f7a2b8c1d5e9f3a6';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_ICONS: Record<DocType, string> = {
  CONTRACT: '📄', NDA: '🔒', ORDER: '📋', AGREEMENT: '🤝', POLICY: '📜',
};

const TYPE_LABELS: Record<DocType, string> = {
  CONTRACT: 'Shartnoma', NDA: 'NDA', ORDER: 'Buyruq', AGREEMENT: 'Kelishuv', POLICY: 'Qoida',
};

const TYPE_COLORS: Record<DocType, string> = {
  CONTRACT: 'bg-blue-100 text-blue-700',
  NDA: 'bg-purple-100 text-purple-700',
  ORDER: 'bg-orange-100 text-orange-700',
  AGREEMENT: 'bg-teal-100 text-teal-700',
  POLICY: 'bg-indigo-100 text-indigo-700',
};

const STATUS_STYLES: Record<DocStatus, string> = {
  SIGNED: 'bg-green-50 text-green-700 border border-green-200',
  PENDING: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  DRAFT: 'bg-gray-100 text-gray-500 border border-gray-200',
  EXPIRED: 'bg-red-50 text-red-700 border border-red-200',
};

const STATUS_LABELS: Record<DocStatus, string> = {
  SIGNED: 'Imzolangan', PENDING: 'Kutilmoqda', DRAFT: 'Qoralama', EXPIRED: "Muddati o'tgan",
};

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
  'bg-teal-500', 'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500',
];

function avatarColor(initials: string): string {
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function daysRemaining(dueDate: string): number {
  const due = new Date(dueDate).getTime();
  const now = new Date().getTime();
  return Math.ceil((due - now) / (1000 * 60 * 60 * 24));
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

function nowString(): string {
  return new Date().toLocaleString('uz-UZ', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Sign Modal ────────────────────────────────────────────────────────────────

interface SignModalProps {
  doc: EDocument;
  onClose: () => void;
  onSigned: (id: string) => void;
}

function SignModal({ doc, onClose, onSigned }: SignModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [signatureDrawn, setSignatureDrawn] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [currentTime] = useState(nowString());

  const canSign = smsSent && smsCode.length === 6;

  function handleSign() {
    if (!canSign) return;
    setStep(3);
  }

  function handleClose() {
    if (step === 3) {
      onSigned(doc.id);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <PenTool className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Hujjatni imzolash</p>
              <p className="text-xs text-gray-400 truncate max-w-64">{doc.title}</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 border-b border-gray-100 flex-shrink-0">
          {[
            { n: 1, label: "Ko'rish" },
            { n: 2, label: 'Imzolash' },
            { n: 3, label: 'Tasdiqlash' },
          ].map(({ n, label }, i) => (
            <div key={n} className="flex items-center gap-2">
              {i > 0 && <div className={cn('h-px w-6 transition-colors', step > i ? 'bg-blue-500' : 'bg-gray-200')} />}
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  step === n ? 'bg-blue-600 text-white' :
                  step > n ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-500'
                )}>
                  {step > n ? '✓' : n}
                </div>
                <span className={cn('text-xs font-medium', step === n ? 'text-blue-600' : step > n ? 'text-green-600' : 'text-gray-400')}>
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">

          {/* ── Step 1: Preview ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{TYPE_ICONS[doc.type]}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{doc.title}</p>
                  <p className="text-xs text-gray-400">{doc.pages} sahifa • {TYPE_LABELS[doc.type]}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-xs text-gray-700 leading-relaxed font-mono space-y-3 max-h-56 overflow-y-auto">
                <div className="text-center font-bold text-sm text-gray-900">MEHNAT SHARTNOMASI №2024-01</div>
                <div className="border-t border-gray-200 pt-2">
                  <p>Ushbu mehnat shartnomasi:</p>
                  <p className="mt-1">&quot;Nexus Group&quot; MChJ (keyingi o&apos;rinlarda &quot;Ish beruvchi&quot;) va</p>
                  <p>Sardor Toshmatov (keyingi o&apos;rinlarda &quot;Xodim&quot;) o&apos;rtasida tuzildi.</p>
                </div>
                <div>
                  <p className="font-bold text-gray-800">1. SHARTNOMA PREDMETI</p>
                  <p className="mt-1">Xodim IT bo&apos;limida Senior Dasturchi lavozimida ishlash majburiyatini oladi.</p>
                </div>
                <div>
                  <p className="font-bold text-gray-800">2. MEHNAT HAQI</p>
                  <p className="mt-1">Ish haqi: 8,000,000 so&apos;m/oy (sakkiz million so&apos;m).</p>
                </div>
                <div>
                  <p className="font-bold text-gray-800">3. ISH VAQTI</p>
                  <p className="mt-1">Dushanba-Juma, 09:00-18:00. Tushlik: 13:00-14:00.</p>
                </div>
                <div>
                  <p className="font-bold text-gray-800">4. TOMONLARNING MAJBURIYATLARI</p>
                  <p className="mt-1">Xodim o&apos;z lavozim vazifalarini sifatli va o&apos;z vaqtida bajarish majburiyatini oladi.</p>
                  <p className="mt-1">Ish beruvchi mehnat qonunchiligiga rioya qilgan holda xodim huquqlarini ta&apos;minlaydi.</p>
                </div>
                <div className="border-t border-gray-200 pt-2 text-gray-400">
                  <p>... (qolgan 3 sahifa) ...</p>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Davom etish <span className="text-lg">→</span>
              </button>
            </div>
          )}

          {/* ── Step 2: Draw Signature ── */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Quyidagi maydonga imzongizni chizing yoki tugmani bosing</p>

              {/* Signature canvas */}
              <button
                onClick={() => setSignatureDrawn(true)}
                className={cn(
                  'w-full h-32 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer',
                  signatureDrawn
                    ? 'border-green-400 bg-green-50'
                    : 'border-dashed border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
                )}
              >
                {signatureDrawn ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <p className="text-sm font-semibold text-green-700">Imzo qabul qilindi</p>
                    <p
                      className="text-2xl text-blue-600"
                      style={{ fontFamily: 'cursive', fontStyle: 'italic' }}
                    >
                      S. Toshmatov
                    </p>
                  </>
                ) : (
                  <>
                    <PenTool className="w-7 h-7 text-gray-300" />
                    <p className="text-sm text-gray-400">Bu yerga bosing</p>
                  </>
                )}
              </button>

              {/* Meta info */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 text-gray-400 mb-1">
                    <Globe className="w-3 h-3" />
                    <span>IP manzili</span>
                  </div>
                  <p className="font-semibold text-gray-700">192.168.1.45</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-gray-400 mb-1">Sana va vaqt</p>
                  <p className="font-semibold text-gray-700">{currentTime}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-gray-400 mb-1">Qurilma</p>
                  <p className="font-semibold text-gray-700">Chrome / Win</p>
                </div>
              </div>

              {/* SMS */}
              <div className="space-y-2">
                <button
                  onClick={() => setSmsSent(true)}
                  disabled={!signatureDrawn}
                  className={cn(
                    'w-full py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2',
                    signatureDrawn
                      ? smsSent
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  )}
                >
                  <Smartphone className="w-4 h-4" />
                  {smsSent ? '✓ SMS yuborildi (+998 ** *** **12)' : 'SMS kod yuborish'}
                </button>

                {smsSent && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">SMS tasdiqlash kodi</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={smsCode}
                      onChange={e => setSmsCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-center text-xl font-bold tracking-widest outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-400 text-center">Istalgan 6 raqamni kiriting (demo)</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleSign}
                disabled={!canSign}
                className={cn(
                  'w-full py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2',
                  canSign
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                <FileCheck className="w-4 h-4" /> Imzolash
              </button>
            </div>
          )}

          {/* ── Step 3: Confirmation ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-9 h-9 text-green-600" />
                </div>
                <p className="text-lg font-bold text-gray-900">Hujjat muvaffaqiyatli imzolandi!</p>
                <p className="text-sm text-gray-500">{currentTime}</p>
              </div>

              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Hujjat SHA-256 xeshi</p>
                    <p className="text-xs font-mono text-gray-700 break-all">{FAKE_HASH}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0" />
                  <p className="text-xs text-gray-600">Block #1847392 • Ethereum Testnet</p>
                </div>
              </div>

              <button className="w-full border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Imzolangan hujjatni yuklash
              </button>

              <button
                onClick={handleClose}
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Yopish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── New Document Modal ───────────────────────────────────────────────────────

interface NewDocModalProps {
  prefillType?: DocType;
  prefillTitle?: string;
  onClose: () => void;
  onAdd: (doc: EDocument) => void;
}

function NewDocModal({ prefillType, prefillTitle, onClose, onAdd }: NewDocModalProps) {
  const [docType, setDocType] = useState<DocType>(prefillType ?? 'CONTRACT');
  const [title, setTitle] = useState(prefillTitle ?? '');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');

  function toggleEmployee(name: string) {
    setSelectedEmployees(prev =>
      prev.includes(name) ? prev.filter(e => e !== name) : [...prev, name]
    );
  }

  function handleSubmit() {
    if (!title.trim() || selectedEmployees.length === 0) return;
    const signatories: Signatory[] = selectedEmployees.map(name => ({
      name,
      role: 'Xodim',
      signed: false,
      avatar: name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
    }));
    const newDoc: EDocument = {
      id: 'd' + Date.now(),
      title: title.trim(),
      type: docType,
      status: 'PENDING',
      created: new Date().toISOString().split('T')[0],
      signatories,
      pages: 1,
      dueDate: dueDate || null,
    };
    onAdd(newDoc);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <p className="font-semibold text-gray-900">Yangi hujjat</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">Hujjat turi</label>
            <div className="relative">
              <select
                value={docType}
                onChange={e => setDocType(e.target.value as DocType)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="CONTRACT">Shartnoma</option>
                <option value="NDA">NDA</option>
                <option value="ORDER">Buyruq</option>
                <option value="AGREEMENT">Kelishuv</option>
                <option value="POLICY">Qoida</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">Sarlavha</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Hujjat nomi..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">Imzolaydigan xodimlar</label>
            <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
              {EMPLOYEES.map(emp => (
                <label key={emp} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(emp)}
                    onChange={() => toggleEmployee(emp)}
                    className="w-4 h-4 rounded accent-blue-600"
                  />
                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0', avatarColor(emp.split(' ').map(w => w[0]).join('')))}>
                    {emp.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <span className="text-sm text-gray-700">{emp}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">Muddat (ixtiyoriy)</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || selectedEmployees.length === 0}
            className={cn(
              'w-full py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2',
              title.trim() && selectedEmployees.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            <Plus className="w-4 h-4" /> Yuborish
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Document Card ─────────────────────────────────────────────────────────────

interface DocCardProps {
  doc: EDocument;
  onSign: (doc: EDocument) => void;
}

function DocCard({ doc, onSign }: DocCardProps) {
  const signedCount = doc.signatories.filter(s => s.signed).length;
  const totalCount = doc.signatories.length;
  const progressPct = totalCount > 0 ? Math.round((signedCount / totalCount) * 100) : 0;

  const days = doc.dueDate ? daysRemaining(doc.dueDate) : null;
  const isUrgent = days !== null && days < 3;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all space-y-4 flex flex-col">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{TYPE_ICONS[doc.type]}</span>
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', TYPE_COLORS[doc.type])}>
            {TYPE_LABELS[doc.type]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{doc.pages} sahifa</span>
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1', STATUS_STYLES[doc.status])}>
            {doc.status === 'SIGNED' && <CheckCircle className="w-3 h-3" />}
            {doc.status === 'PENDING' && <Clock className="w-3 h-3" />}
            {doc.status === 'DRAFT' && <FileText className="w-3 h-3" />}
            {doc.status === 'EXPIRED' && <AlertCircle className="w-3 h-3" />}
            {STATUS_LABELS[doc.status]}
          </span>
        </div>
      </div>

      {/* Title */}
      <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{doc.title}</p>

      {/* Due date */}
      {doc.dueDate && doc.status === 'PENDING' && days !== null && (
        <div className={cn(
          'flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg w-fit',
          isUrgent ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
        )}>
          <Clock className="w-3 h-3" />
          {days > 0 ? `${days} kun qoldi` : days === 0 ? 'Bugun tugaydi' : "Muddati o'tdi"}
        </div>
      )}
      {doc.completedAt && (
        <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
          <CheckCircle className="w-3 h-3" />
          Imzolangan: {doc.completedAt}
        </div>
      )}

      {/* Signatories */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {doc.signatories.map((s, i) => (
            <div key={i} className="relative flex-shrink-0">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white',
                avatarColor(s.avatar)
              )}>
                {s.avatar}
              </div>
              <div className={cn(
                'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center',
                s.signed ? 'bg-green-500' : 'bg-gray-300'
              )}>
                {s.signed
                  ? <span className="text-white text-[7px] font-bold">✓</span>
                  : <Clock className="w-2 h-2 text-gray-100" />
                }
              </div>
            </div>
          ))}
          <span className="text-xs text-gray-500 ml-1">{signedCount}/{totalCount} imzolandi</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className={cn('h-1.5 rounded-full transition-all', progressPct === 100 ? 'bg-green-500' : 'bg-blue-500')}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1">
        <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 rounded-lg py-1.5 text-xs font-semibold hover:bg-gray-50 transition-colors">
          <Eye className="w-3.5 h-3.5" /> Ko&apos;rish
        </button>
        {doc.status === 'PENDING' && (
          <button
            onClick={() => onSign(doc)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white rounded-lg py-1.5 text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            <PenTool className="w-3.5 h-3.5" /> Imzolash
          </button>
        )}
        {doc.status === 'SIGNED' && (
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg py-1.5 text-xs font-semibold hover:bg-green-100 transition-colors">
            <Download className="w-3.5 h-3.5" /> Yuklash
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ESignaturePage() {
  const [activeTab, setActiveTab] = useState<'documents' | 'templates'>('documents');
  const [docs, setDocs] = useState<EDocument[]>(DEMO_DOCS);
  const [signingDoc, setSigningDoc] = useState<EDocument | null>(null);
  const [showNewDoc, setShowNewDoc] = useState(false);
  const [newDocTemplate, setNewDocTemplate] = useState<{ type?: DocType; title?: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<DocStatus | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<DocType | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    function handler() { setShowTypeDropdown(false); }
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  function handleSigned(id: string) {
    setDocs(prev => prev.map(d => {
      if (d.id !== id) return d;
      return {
        ...d,
        status: 'SIGNED' as DocStatus,
        completedAt: new Date().toISOString().split('T')[0],
        signatories: d.signatories.map((s, i) => i === 0 ? { ...s, signed: true } : s),
      };
    }));
  }

  function handleAddDoc(doc: EDocument) {
    setDocs(prev => [doc, ...prev]);
  }

  const filtered = docs.filter(d => {
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && d.type !== typeFilter) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: docs.length,
    signed: docs.filter(d => d.status === 'SIGNED').length,
    pending: docs.filter(d => d.status === 'PENDING').length,
    expired: docs.filter(d => d.status === 'EXPIRED').length,
  };

  const TYPE_FILTER_OPTIONS: { value: DocType | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'Barchasi' },
    { value: 'CONTRACT', label: 'Shartnoma' },
    { value: 'NDA', label: 'NDA' },
    { value: 'ORDER', label: 'Buyruq' },
    { value: 'AGREEMENT', label: 'Kelishuv' },
    { value: 'POLICY', label: 'Qoida' },
  ];

  const currentTypeLabel = TYPE_FILTER_OPTIONS.find(o => o.value === typeFilter)?.label ?? 'Barchasi';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PenTool className="w-6 h-6 text-blue-600" />
            Elektron Imzo
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Raqamli hujjat imzolash tizimi</p>
        </div>
        <button
          onClick={() => { setNewDocTemplate(null); setShowNewDoc(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Yangi hujjat
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Jami', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50', Icon: FileText },
          { label: 'Imzolangan', value: stats.signed, color: 'text-green-600', bg: 'bg-green-50', Icon: CheckCircle },
          { label: 'Kutilmoqda', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-50', Icon: Clock },
          { label: "Muddati o'tgan", value: stats.expired, color: 'text-red-600', bg: 'bg-red-50', Icon: AlertCircle },
        ].map(({ label, value, color, bg, Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', bg)}>
              <Icon className={cn('w-5 h-5', color)} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className={cn('text-2xl font-bold', color)}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { id: 'documents', label: 'Hujjatlar', Icon: FileText },
          { id: 'templates', label: 'Shablonlar', Icon: LayoutTemplate },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as 'documents' | 'templates')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Hujjat qidirish..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Type dropdown */}
            <div className="relative">
              <button
                onClick={e => { e.stopPropagation(); setShowTypeDropdown(v => !v); }}
                className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white transition-colors"
              >
                {currentTypeLabel}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {showTypeDropdown && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10 min-w-36">
                  {TYPE_FILTER_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={e => { e.stopPropagation(); setTypeFilter(opt.value); setShowTypeDropdown(false); }}
                      className={cn(
                        'w-full text-left px-4 py-2 text-sm transition-colors',
                        typeFilter === opt.value ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status tabs */}
          <div className="flex flex-wrap gap-2">
            {(['ALL', 'PENDING', 'SIGNED', 'DRAFT', 'EXPIRED'] as const).map(f => {
              const count = f === 'ALL' ? docs.length : docs.filter(d => d.status === f).length;
              const active = statusFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border',
                    active ? (
                      f === 'ALL' ? 'bg-gray-800 text-white border-gray-800' :
                      f === 'PENDING' ? 'bg-yellow-500 text-white border-yellow-500' :
                      f === 'SIGNED' ? 'bg-green-600 text-white border-green-600' :
                      f === 'DRAFT' ? 'bg-gray-500 text-white border-gray-500' :
                      'bg-red-500 text-white border-red-500'
                    ) : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  )}
                >
                  {f === 'ALL' ? 'Barchasi' : STATUS_LABELS[f]}
                  <span className={cn(
                    'px-1.5 py-0.5 rounded text-[10px] font-bold',
                    active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map(doc => (
                <DocCard key={doc.id} doc={doc} onSign={setSigningDoc} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Hujjatlar topilmadi</p>
            </div>
          )}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map(tpl => (
            <div key={tpl.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                  {tpl.icon}
                </div>
                <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', TYPE_COLORS[tpl.type])}>
                  {TYPE_LABELS[tpl.type]}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{tpl.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{tpl.description}</p>
              </div>
              <button
                onClick={() => {
                  setNewDocTemplate({ type: tpl.type, title: tpl.title });
                  setShowNewDoc(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors mt-auto"
              >
                Ishlatish
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Sign Modal */}
      {signingDoc && (
        <SignModal
          doc={signingDoc}
          onClose={() => setSigningDoc(null)}
          onSigned={handleSigned}
        />
      )}

      {/* New Document Modal */}
      {showNewDoc && (
        <NewDocModal
          prefillType={newDocTemplate?.type}
          prefillTitle={newDocTemplate?.title}
          onClose={() => { setShowNewDoc(false); setNewDocTemplate(null); }}
          onAdd={handleAddDoc}
        />
      )}
    </div>
  );
}
