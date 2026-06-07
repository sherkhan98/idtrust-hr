'use client';

import { useState } from 'react';
import {
  Briefcase, Users, Star, Clock, MapPin, Zap, MessageSquare,
  Plus, X, ChevronRight, CheckCircle2, ArrowRight, Filter,
  Building2, Calendar, DollarSign, TrendingUp, Shield,
} from 'lucide-react';

// ─── Demo Data ────────────────────────────────────────────────────────────────

interface JobPost {
  id: string;
  company: string;
  avatar: string;
  title: string;
  skills: string[];
  duration: string;
  rate: number;
  rateType: 'kunlik' | 'oylik';
  workers: number;
  urgency: 'URGENT' | 'NORMAL';
  posted: string;
  location: string;
  responses: number;
}

interface Worker {
  id: string;
  name: string;
  skill: string;
  available: string;
  rate: number;
  rating: number;
  completedJobs: number;
  avatar: string;
}

interface Hire {
  id: string;
  worker: string;
  from: string;
  skill: string;
  period: string;
  rate: number;
  status: 'ACTIVE' | 'COMPLETED';
  rating: number | null;
}

const JOB_POSTS: JobPost[] = [
  { id: 'j1', company: 'TechStar UZ', avatar: 'TS', title: 'React Developer (2 hafta)', skills: ['React', 'TypeScript', 'Git'], duration: '2 hafta', rate: 500000, rateType: 'kunlik', workers: 1, urgency: 'URGENT', posted: '2 soat oldin', location: 'Toshkent/Remote', responses: 3 },
  { id: 'j2', company: 'MegaMart', avatar: 'MM', title: 'Omborchi yordamchisi (1 oy)', skills: ['Omborxona', 'Excel', 'Forklift'], duration: '1 oy', rate: 250000, rateType: 'kunlik', workers: 3, urgency: 'NORMAL', posted: '5 soat oldin', location: 'Toshkent, Yunusobod', responses: 8 },
  { id: 'j3', company: 'FinanceGroup', avatar: 'FG', title: 'Buxgalter (2 hafta, audit)', skills: ['1C', 'Excel', 'IFRS'], duration: '2 hafta', rate: 600000, rateType: 'kunlik', workers: 1, urgency: 'URGENT', posted: '1 kun oldin', location: 'Toshkent, Chilonzor', responses: 5 },
  { id: 'j4', company: 'BuildPro', avatar: 'BP', title: 'Qurilish menejeri (3 oy)', skills: ['AutoCAD', 'Loyiha boshqaruvi'], duration: '3 oy', rate: 8000000, rateType: 'oylik', workers: 1, urgency: 'NORMAL', posted: '2 kun oldin', location: 'Samarqand', responses: 2 },
  { id: 'j5', company: 'MediaLab', avatar: 'ML', title: 'Grafik dizayner (proekt)', skills: ['Figma', 'Illustrator', 'Branding'], duration: '3 hafta', rate: 400000, rateType: 'kunlik', workers: 1, urgency: 'NORMAL', posted: '3 kun oldin', location: 'Remote', responses: 11 },
];

const MY_WORKERS: Worker[] = [
  { id: 'w1', name: 'Sardor Toshmatov', skill: 'Senior React Dev', available: 'Fevral 1-15', rate: 450000, rating: 4.9, completedJobs: 3, avatar: 'ST' },
  { id: 'w2', name: 'Nilufar Ergasheva', skill: 'HR Specialist', available: 'Hozir', rate: 300000, rating: 4.7, completedJobs: 1, avatar: 'NE' },
  { id: 'w3', name: 'Bobur Rakhimov', skill: 'Buxgalter (1C)', available: 'Hozir', rate: 350000, rating: 4.8, completedJobs: 5, avatar: 'BR' },
];

const MY_HIRES: Hire[] = [
  { id: 'h1', worker: 'Jasur Mirzayev', from: 'GlobalMart', skill: 'Savdo menejeri', period: 'Yan 15-31', rate: 400000, status: 'ACTIVE', rating: null },
  { id: 'h2', worker: 'Kamola Ergasheva', from: 'TechStar', skill: 'SMM Manager', period: 'Yan 1-14', rate: 280000, status: 'COMPLETED', rating: 4.5 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRate(rate: number, type: 'kunlik' | 'oylik') {
  if (rate >= 1000000) return `${(rate / 1000000).toFixed(0)}M/${type === 'kunlik' ? 'kun' : 'oy'}`;
  if (rate >= 1000) return `${(rate / 1000).toFixed(0)}K/${type === 'kunlik' ? 'kun' : 'oy'}`;
  return `${rate}/${type === 'kunlik' ? 'kun' : 'oy'}`;
}

function formatRateSimple(rate: number) {
  if (rate >= 1000000) return `${(rate / 1000000).toFixed(0)}M`;
  if (rate >= 1000) return `${(rate / 1000).toFixed(0)}K`;
  return `${rate}`;
}

const SKILL_COLORS = [
  'bg-violet-100 text-violet-700',
  'bg-purple-100 text-purple-700',
  'bg-indigo-100 text-indigo-700',
  'bg-fuchsia-100 text-fuchsia-700',
  'bg-pink-100 text-pink-700',
  'bg-blue-100 text-blue-700',
];

const AVATAR_COLORS = [
  'bg-violet-500', 'bg-purple-500', 'bg-indigo-500', 'bg-fuchsia-500',
  'bg-pink-500', 'bg-blue-500', 'bg-violet-600', 'bg-purple-600',
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
      <span className="text-xs text-gray-600 ml-1 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

// ─── Apply Modal ──────────────────────────────────────────────────────────────

function ApplyModal({ job, onClose }: { job: JobPost; onClose: () => void }) {
  const [selectedWorker, setSelectedWorker] = useState<string>('');
  const [message, setMessage] = useState('');
  const [proposedRate, setProposedRate] = useState(job.rate);
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!selectedWorker) return;
    setSent(true);
    setTimeout(onClose, 1800);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="font-bold text-gray-900">Taklif yuborish</h2>
            <p className="text-sm text-gray-500">{job.company} — {job.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Job summary */}
          <div className="p-3 bg-violet-50 rounded-xl border border-violet-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-medium">{job.duration}</span>
              <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-medium">{formatRate(job.rate, job.rateType)}</span>
              <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-medium">{job.location}</span>
            </div>
          </div>

          {/* Select worker */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Xodimni tanlang *</label>
            <div className="space-y-2">
              {MY_WORKERS.map((w, idx) => (
                <label
                  key={w.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedWorker === w.id ? 'border-violet-400 bg-violet-50' : 'border-gray-200 hover:border-violet-200 hover:bg-violet-50/40'}`}
                >
                  <input
                    type="radio"
                    name="worker"
                    value={w.id}
                    checked={selectedWorker === w.id}
                    onChange={() => setSelectedWorker(w.id)}
                    className="sr-only"
                  />
                  <div className={`w-9 h-9 rounded-full ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {w.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm">{w.name}</p>
                    <p className="text-xs text-gray-500">{w.skill}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-violet-700">{formatRateSimple(w.rate)}K/kun</p>
                    <StarRating rating={w.rating} />
                  </div>
                  {selectedWorker === w.id && (
                    <CheckCircle2 className="w-5 h-5 text-violet-500 flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Proposed rate */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Taklif narxi (kunlik, so'm)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={proposedRate}
                onChange={(e) => setProposedRate(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Taklif narxi: {formatRate(proposedRate, 'kunlik')}</p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Xabar (ixtiyoriy)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`${job.company} kompaniyasiga xabar yozing...`}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedWorker}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${sent ? 'bg-emerald-500 text-white' : selectedWorker ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            {sent ? '✓ Taklif yuborildi!' : 'Taklif yuborish'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Worker Modal ─────────────────────────────────────────────────────────

function AddWorkerModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', skill: '', available: '', rate: '' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!form.name || !form.skill) return;
    setSaved(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Xodim qo'shish</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { key: 'name', label: "Xodim ismi *", placeholder: 'Masalan: Sardor Toshmatov' },
            { key: 'skill', label: 'Mutaxassislik *', placeholder: 'Masalan: Senior React Developer' },
            { key: 'available', label: 'Mavjudlik muddati', placeholder: 'Masalan: Fevral 1-15 yoki Hozir' },
            { key: 'rate', label: 'Kunlik narx (so\'m)', placeholder: 'Masalan: 500000' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
              <input
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Bekor qilish</button>
            <button onClick={handleSave} className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors ${saved ? 'bg-emerald-500 text-white' : 'bg-violet-600 hover:bg-violet-700 text-white'}`}>
              {saved ? '✓ Qo\'shildi!' : 'Qo\'shish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Rate Modal ───────────────────────────────────────────────────────────────

function RateModal({ hire, onClose }: { hire: Hire; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Xodimni baholash</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 text-center space-y-4">
          <p className="text-gray-700 font-medium">{hire.worker}</p>
          <p className="text-sm text-gray-500">{hire.skill} • {hire.period}</p>
          <div className="flex justify-center gap-2 my-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(s)}
                className="transition-transform hover:scale-110"
              >
                <Star className={`w-8 h-8 ${s <= (hover || rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
              </button>
            ))}
          </div>
          {rating > 0 && <p className="text-violet-600 font-semibold">{['', "Yomon", "Qoniqarli", "Yaxshi", "Juda yaxshi", "Ajoyib!"][rating]}</p>}
          <button
            onClick={() => { if (rating > 0) { setSubmitted(true); setTimeout(onClose, 1200); } }}
            disabled={rating === 0}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${submitted ? 'bg-emerald-500 text-white' : rating > 0 ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            {submitted ? '✓ Baholandi!' : 'Baholash'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────

function JobCard({ job, idx, onApply }: { job: JobPost; idx: number; onApply: (j: JobPost) => void }) {
  const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];

  return (
    <div className={`bg-white rounded-xl border p-5 hover:shadow-md transition-all ${job.urgency === 'URGENT' ? 'border-red-200 hover:border-red-300' : 'border-gray-200'}`}>
      {/* Top */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${avatarColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
          {job.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">{job.company}</p>
              <h3 className="font-semibold text-gray-900 text-sm leading-snug">{job.title}</h3>
            </div>
            {job.urgency === 'URGENT' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold animate-pulse whitespace-nowrap flex-shrink-0">
                <Zap className="w-3 h-3" />SHOSHILINCH
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {job.skills.map((s, i) => (
          <span key={s} className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${SKILL_COLORS[i % SKILL_COLORS.length]}`}>{s}</span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.duration}</span>
        <span className="flex items-center gap-1 font-semibold text-violet-700"><DollarSign className="w-3.5 h-3.5" />{formatRate(job.rate, job.rateType)}</span>
        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{job.workers} xodim kerak</span>
          <span>{job.responses} taklif</span>
          <span>{job.posted}</span>
        </div>
        <button
          onClick={() => onApply(job)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-colors shadow-sm"
        >
          Taklif berish <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = 'posts' | 'workers' | 'deals';

const FILTER_URGENCY = ['Barchasi', 'URGENT', 'NORMAL'];
const FILTER_LOCATIONS = ['Barchasi', 'Toshkent', 'Remote', 'Samarqand'];

export default function LaborExchangePage() {
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [applyJob, setApplyJob] = useState<JobPost | null>(null);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [rateHire, setRateHire] = useState<Hire | null>(null);
  const [urgencyFilter, setUrgencyFilter] = useState('Barchasi');
  const [locationFilter, setLocationFilter] = useState('Barchasi');

  const filteredJobs = JOB_POSTS.filter((j) => {
    if (urgencyFilter !== 'Barchasi' && j.urgency !== urgencyFilter) return false;
    if (locationFilter !== 'Barchasi' && !j.location.includes(locationFilter)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mehnat Birjasi</h1>
                <p className="text-sm text-gray-500">Vaqtincha xodim kerak? Yoki bo'sh xodimingizni ijaraga bering</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mt-3 mb-4">
            {[
              { label: "Aktiv e'lonlar", value: '47', icon: Briefcase },
              { label: 'Bu oyda kelishuvlar', value: '23', icon: CheckCircle2 },
              { label: 'Kompaniyalar', value: '156', icon: Building2 },
              { label: "O'rtacha baho", value: '⭐ 4.7', icon: Star },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-base font-bold text-violet-700">{value}</span>
                <span className="text-xs text-gray-500">{label}</span>
                <span className="w-px h-4 bg-gray-200 last:hidden" />
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {([
              { key: 'posts', label: "E'lonlar", count: JOB_POSTS.length },
              { key: 'workers', label: 'Mening xodimlarim', count: MY_WORKERS.length },
              { key: 'deals', label: 'Faol kelishuvlar', count: MY_HIRES.length },
            ] as const).map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === key ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-600 hover:bg-violet-50 hover:text-violet-700'}`}
              >
                {label}
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${activeTab === key ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'}`}>{count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-7xl mx-auto">

        {/* ── TAB 1: Job Posts ── */}
        {activeTab === 'posts' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filter:</span>
              </div>
              {/* Urgency */}
              <div className="flex gap-1">
                {FILTER_URGENCY.map((u) => (
                  <button
                    key={u}
                    onClick={() => setUrgencyFilter(u)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${urgencyFilter === u ? 'bg-violet-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600'}`}
                  >
                    {u === 'URGENT' ? 'Shoshilinch' : u === 'NORMAL' ? 'Oddiy' : u}
                  </button>
                ))}
              </div>
              {/* Location */}
              <div className="flex gap-1">
                {FILTER_LOCATIONS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocationFilter(l)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${locationFilter === l ? 'bg-violet-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <span className="text-xs text-gray-400 ml-auto">{filteredJobs.length} ta e'lon topildi</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredJobs.map((job, idx) => (
                <JobCard key={job.id} job={job} idx={idx} onApply={setApplyJob} />
              ))}
              {filteredJobs.length === 0 && (
                <div className="col-span-2 text-center py-16 text-gray-400">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Hozircha e'lonlar yo'q</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── TAB 2: My Workers ── */}
        {activeTab === 'workers' && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Ijaraga berish uchun mavjud xodimlar</h2>
                <p className="text-sm text-gray-500 mt-0.5">Kompaniyangiz xodimlarini vaqtincha boshqa kompaniyalarga bering</p>
              </div>
              <button
                onClick={() => setShowAddWorker(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />Xodim qo'shish
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {MY_WORKERS.map((w, idx) => {
                const isAvailableNow = w.available === 'Hozir';
                const matchedJobs = JOB_POSTS.filter((j) =>
                  j.skills.some((s) => w.skill.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(w.skill.split(' ')[0].toLowerCase()))
                );
                return (
                  <div key={w.id} className={`bg-white rounded-xl border p-5 hover:shadow-md transition-shadow ${isAvailableNow ? 'border-violet-200' : 'border-gray-200'}`}>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                        {w.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{w.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{w.skill}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${isAvailableNow ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {isAvailableNow ? '● Hozir' : 'Keyinroq'}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 bg-violet-50 rounded-lg">
                        <p className="text-sm font-bold text-violet-700">{formatRateSimple(w.rate)}K</p>
                        <p className="text-xs text-gray-400">Kunlik</p>
                      </div>
                      <div className="text-center p-2 bg-violet-50 rounded-lg">
                        <div className="flex items-center justify-center gap-0.5">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-bold text-gray-700">{w.rating}</span>
                        </div>
                        <p className="text-xs text-gray-400">Reyting</p>
                      </div>
                      <div className="text-center p-2 bg-violet-50 rounded-lg">
                        <p className="text-sm font-bold text-gray-700">{w.completedJobs}</p>
                        <p className="text-xs text-gray-400">Bajarildi</p>
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Mavjud: <span className="font-medium text-gray-700">{w.available}</span></span>
                    </div>

                    {/* Matched jobs */}
                    {matchedJobs.length > 0 && (
                      <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100 mb-3">
                        <p className="text-xs text-amber-700 font-medium">{matchedJobs.length} ta mos e'lon topildi</p>
                        <p className="text-xs text-amber-600 mt-0.5">{matchedJobs[0].company} — {matchedJobs[0].title}</p>
                      </div>
                    )}

                    <button
                      onClick={() => setActiveTab('posts')}
                      className="w-full py-2 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      E'lonlarni ko'rish <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100 p-5">
              <h3 className="font-semibold text-violet-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />Maslahat
              </h3>
              <ul className="space-y-1.5 text-sm text-violet-700">
                <li className="flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />Xodimni ijaraga berish orqali siz ham daromad olasiz, xodim ham tajriba orttiradi</li>
                <li className="flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />Barcha to'lovlar IDTrust orqali avtomatik amalga oshiriladi</li>
                <li className="flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />Reyting tizimi orqali ishonchli hamkorlik ta'minlanadi</li>
              </ul>
            </div>
          </>
        )}

        {/* ── TAB 3: Active Deals ── */}
        {activeTab === 'deals' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main deals list */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-base font-semibold text-gray-900 mb-1">Ijaradagi xodimlar</h2>

              {MY_HIRES.map((hire) => {
                const isActive = hire.status === 'ACTIVE';
                const dailyDays = isActive ? 17 : 14;
                const totalCost = hire.rate * dailyDays;

                return (
                  <div key={hire.id} className={`bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow ${isActive ? 'border-violet-200' : 'border-gray-200'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 ${isActive ? 'bg-violet-500' : 'bg-gray-400'}`}>
                        {hire.worker.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <h3 className="font-semibold text-gray-900">{hire.worker}</h3>
                            <p className="text-sm text-gray-500">{hire.skill} • <span className="text-violet-600 font-medium">{hire.from}</span> kompaniyasidan</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            {isActive ? '● Aktiv' : 'Yakunlandi'}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{hire.period}</span>
                          <span className="flex items-center gap-1 text-violet-700 font-semibold">
                            <DollarSign className="w-3.5 h-3.5" />{formatRateSimple(hire.rate)}K/kun
                          </span>
                          <span className="flex items-center gap-1 font-medium text-gray-700">
                            Jami: {formatRateSimple(totalCost)}K
                          </span>
                        </div>

                        {hire.rating && (
                          <div className="mt-2">
                            <StarRating rating={hire.rating} />
                          </div>
                        )}

                        {isActive && (
                          <div className="flex gap-2 mt-3">
                            <button className="px-3 py-1.5 rounded-lg bg-violet-100 hover:bg-violet-200 text-violet-700 text-xs font-semibold transition-colors flex items-center gap-1">
                              <Calendar className="w-3 h-3" />Shartnomani uzaytirish
                            </button>
                            <button
                              onClick={() => setRateHire(hire)}
                              className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <Star className="w-3 h-3" />Baholash
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {MY_HIRES.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Hozircha kelishuvlar yo'q</p>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-4">
              {/* My workers availability panel */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-violet-500" />
                  Xodimlarimni ijaraga berish
                </h3>
                <div className="space-y-3">
                  {MY_WORKERS.map((w, idx) => {
                    const isNow = w.available === 'Hozir';
                    return (
                      <div key={w.id} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          {w.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{w.name}</p>
                          <p className="text-xs text-gray-400 truncate">{w.skill}</p>
                        </div>
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isNow ? 'bg-emerald-400' : 'bg-amber-400'}`} title={w.available} />
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setActiveTab('workers')} className="w-full mt-4 py-2 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1">
                  Barchasini ko'rish <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Legal disclaimer */}
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-violet-900 text-sm mb-1">Huquqiy himoya</h4>
                    <p className="text-xs text-violet-700 leading-relaxed">
                      Barcha shartnomalar IDTrust orqali rasmiylashtiriladi. Soliq to'lovlari avtomatik hisoblanadi.
                    </p>
                    <div className="mt-3 space-y-1.5">
                      {[
                        "Mehnat shartnomasi avtomatik tuziladi",
                        "INPS va soliq to'lovlar hisoblangan",
                        "Tomonlar huquqlari himoyalangan",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-violet-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Oylik statistika</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Ijaradagi xodimlar', value: '1', color: 'text-violet-600' },
                    { label: 'Yakunlangan kelishuvlar', value: '1', color: 'text-emerald-600' },
                    { label: "Umumiy to'lov", value: '9.9M', color: 'text-amber-600' },
                    { label: "O'rtacha baho", value: '4.5 ⭐', color: 'text-gray-700' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{label}</span>
                      <span className={`text-sm font-bold ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
      {showAddWorker && <AddWorkerModal onClose={() => setShowAddWorker(false)} />}
      {rateHire && <RateModal hire={rateHire} onClose={() => setRateHire(null)} />}
    </div>
  );
}
