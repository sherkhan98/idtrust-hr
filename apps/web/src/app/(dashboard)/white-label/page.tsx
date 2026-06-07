'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Palette, Globe, Mail, Image, Upload, Check, Copy,
  Eye, EyeOff, Save, RefreshCw, Shield, Zap, Users, BarChart3,
  ToggleLeft, ToggleRight, ChevronDown, ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type BgMode = 'gradient' | 'solid' | 'image';
type ThemePreset = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'dark';

interface ThemeConfig {
  primary: string;
  accent: string;
  name: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRESET_THEMES: Record<ThemePreset, ThemeConfig> = {
  blue:   { primary: '#2563EB', accent: '#0EA5E9', name: 'Blue' },
  purple: { primary: '#7C3AED', accent: '#A78BFA', name: 'Purple' },
  green:  { primary: '#059669', accent: '#34D399', name: 'Green' },
  orange: { primary: '#EA580C', accent: '#FB923C', name: 'Orange' },
  red:    { primary: '#DC2626', accent: '#F87171', name: 'Red' },
  dark:   { primary: '#1E293B', accent: '#64748B', name: 'Dark' },
};

const SECTIONS = [
  { id: 'brand',     icon: Image,   label: 'Brand Identity' },
  { id: 'colors',    icon: Palette, label: 'Color Scheme' },
  { id: 'login',     icon: Eye,     label: 'Login Page' },
  { id: 'domain',    icon: Globe,   label: 'Domain & URLs' },
  { id: 'email',     icon: Mail,    label: 'Email Templates' },
] as const;

type SectionId = typeof SECTIONS[number]['id'];

// ─── Utility ─────────────────────────────────────────────────────────────────

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function isLight(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}

function SectionHeader({ icon: Icon, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Live Preview Panel ───────────────────────────────────────────────────────

interface LivePreviewProps {
  primaryColor: string;
  accentColor: string;
  companyName: string;
  logoPreview: string | null;
  bgMode: BgMode;
  welcomeText: string;
  showFeatures: boolean;
  emailHeaderColor: string;
}

function LivePreview({
  primaryColor, accentColor, companyName, logoPreview,
  bgMode, welcomeText, showFeatures, emailHeaderColor,
}: LivePreviewProps) {
  const textColor = isLight(primaryColor) ? '#1e293b' : '#ffffff';
  const accentText = isLight(accentColor) ? '#1e293b' : '#ffffff';

  return (
    <div className="space-y-4">
      {/* Sidebar + Header Preview */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="text-xs text-gray-400 font-medium px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
          <Eye className="w-3.5 h-3.5" /> App Preview
        </div>
        <div className="flex h-32 overflow-hidden">
          {/* Mini sidebar */}
          <div className="w-16 flex flex-col items-center py-3 gap-3 flex-shrink-0" style={{ backgroundColor: primaryColor }}>
            {logoPreview ? (
              <img src={logoPreview} alt="logo" className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-[10px] font-bold" style={{ color: textColor }}>
                {companyName.slice(0, 2).toUpperCase() || 'SF'}
              </div>
            )}
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-8 h-2 rounded-full bg-white/20" />
            ))}
          </div>
          {/* Main area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="h-8 flex items-center px-3 gap-2 border-b border-gray-100 bg-white">
              <div className="flex-1 h-2 bg-gray-100 rounded-full" />
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
            </div>
            {/* Content */}
            <div className="flex-1 bg-gray-50 p-2 grid grid-cols-3 gap-1.5 content-start">
              {[primaryColor, accentColor, '#e2e8f0'].map((c, i) => (
                <div key={i} className="h-7 rounded" style={{ backgroundColor: c, opacity: i === 2 ? 1 : 0.85 }} />
              ))}
              <div className="col-span-3 h-3 bg-gray-200 rounded-full" />
              <div className="col-span-2 h-3 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Login Page Preview */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="text-xs text-gray-400 font-medium px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
          <Eye className="w-3.5 h-3.5" /> Login Page Preview
        </div>
        <div
          className="h-48 flex items-center justify-center p-4 relative overflow-hidden"
          style={
            bgMode === 'gradient'
              ? { background: `linear-gradient(135deg, ${primaryColor}22 0%, ${accentColor}33 100%)` }
              : bgMode === 'solid'
              ? { backgroundColor: primaryColor + '18' }
              : { background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f4fd 100%)' }
          }
        >
          <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-[180px] space-y-2.5">
            <div className="flex items-center justify-center">
              {logoPreview ? (
                <img src={logoPreview} alt="logo" className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: primaryColor }}>
                  {companyName.slice(0, 2).toUpperCase() || 'SF'}
                </div>
              )}
            </div>
            <p className="text-[9px] font-semibold text-gray-800 text-center leading-tight truncate">
              {welcomeText || 'Welcome back!'}
            </p>
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-5 rounded w-full flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: primaryColor }}>
              Sign In
            </div>
            {showFeatures && (
              <div className="flex gap-1 justify-center flex-wrap">
                {[Zap, Shield, BarChart3].map((Icon, i) => (
                  <div key={i} className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: primaryColor + '22' }}>
                    <Icon className="w-2.5 h-2.5" style={{ color: primaryColor }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Template Preview */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="text-xs text-gray-400 font-medium px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
          <Mail className="w-3.5 h-3.5" /> Email Template
        </div>
        <div className="p-3 bg-gray-50">
          <div className="bg-white rounded-lg overflow-hidden border border-gray-100 max-w-[240px] mx-auto">
            <div className="h-7 flex items-center px-3" style={{ backgroundColor: emailHeaderColor }}>
              <span className="text-white text-[9px] font-bold">{companyName || 'StaffFlow'}</span>
            </div>
            <div className="p-3 space-y-1.5">
              <div className="h-2 bg-gray-200 rounded-full w-3/4" />
              <div className="h-1.5 bg-gray-100 rounded-full w-full" />
              <div className="h-1.5 bg-gray-100 rounded-full w-5/6" />
              <div className="mt-2 h-4 rounded flex items-center justify-center text-[7px] font-bold text-white w-20" style={{ backgroundColor: primaryColor }}>
                Action
              </div>
            </div>
            <div className="h-5 border-t border-gray-100 flex items-center justify-center">
              <span className="text-[7px] text-gray-400">© {companyName || 'StaffFlow'} 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WhiteLabelPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('brand');
  const [saved, setSaved] = useState(false);
  const [testEmailSent, setTestEmailSent] = useState(false);
  const [copiedCname, setCopiedCname] = useState(false);

  // Brand
  const [companyName, setCompanyName] = useState('StaffFlow HR');
  const [tagline, setTagline] = useState("O'zbekistonning zamonaviy HR platformasi");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  // Colors
  const [activePreset, setActivePreset] = useState<ThemePreset>('blue');
  const [primaryColor, setPrimaryColor] = useState('#2563EB');
  const [accentColor, setAccentColor] = useState('#0EA5E9');

  // Login
  const [bgMode, setBgMode] = useState<BgMode>('gradient');
  const [welcomeText, setWelcomeText] = useState('Xush kelibsiz!');
  const [showFeatures, setShowFeatures] = useState(true);

  // Domain
  const [customDomain, setCustomDomain] = useState('app.yourcompany.uz');
  const [subdomain, setSubdomain] = useState('yourcompany');
  const sslActive = true;

  // Email
  const [fromName, setFromName] = useState('StaffFlow HR');
  const [fromEmail, setFromEmail] = useState('noreply@yourcompany.uz');
  const [emailHeaderColor, setEmailHeaderColor] = useState('#2563EB');
  const [emailFooter, setEmailFooter] = useState('© 2024 YourCompany. Barcha huquqlar himoyalangan.');

  const handlePreset = (preset: ThemePreset) => {
    setActivePreset(preset);
    setPrimaryColor(PRESET_THEMES[preset].primary);
    setAccentColor(PRESET_THEMES[preset].accent);
    setEmailHeaderColor(PRESET_THEMES[preset].primary);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setFaviconPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTestEmail = () => {
    setTestEmailSent(true);
    setTimeout(() => setTestEmailSent(false), 3000);
  };

  const handleCopyCname = () => {
    navigator.clipboard.writeText(`staffflow-cname.yourcompany.uz → app.staffflow.uz`).catch(() => {});
    setCopiedCname(true);
    setTimeout(() => setCopiedCname(false), 2000);
  };

  const cnameBlock = `CNAME  app  →  app.staffflow.uz\nTXT    _staffflow-verify  →  verify=sf_${subdomain}_2024`;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Palette className="w-6 h-6 text-blue-600" /> White Label & Branding
          </h1>
          <p className="page-subtitle">Platformani o'z brendingizga moslashtiring</p>
        </div>
        <button className="btn-secondary">
          <Eye className="w-4 h-4" /> Oldindan ko'rish
        </button>
      </div>

      {/* Split layout */}
      <div className="flex gap-5 items-start">

        {/* LEFT: Settings form */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Section nav */}
          <div className="bg-white rounded-xl border border-gray-100 p-1.5 flex gap-1 overflow-x-auto no-scrollbar">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0',
                  activeSection === s.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                )}
              >
                <s.icon className="w-3.5 h-3.5" />
                {s.label}
              </button>
            ))}
          </div>

          {/* ── Brand Identity ── */}
          {activeSection === 'brand' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
              <SectionHeader icon={Image} title="Brand Identity" subtitle="Logo, company name and tagline" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Company Logo</label>
                  <div
                    onClick={() => logoRef.current?.click()}
                    className="h-28 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="max-h-20 max-w-full object-contain rounded-lg" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-300 group-hover:text-blue-400 transition-colors" />
                        <p className="text-xs text-gray-400 group-hover:text-blue-500">Click to upload</p>
                        <p className="text-[10px] text-gray-300">PNG, SVG, WebP • max 2MB</p>
                      </>
                    )}
                  </div>
                  <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </div>

                {/* Favicon Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Favicon</label>
                  <div
                    onClick={() => faviconRef.current?.click()}
                    className="h-28 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                  >
                    {faviconPreview ? (
                      <img src={faviconPreview} alt="Favicon" className="w-12 h-12 object-contain rounded-lg" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-300 group-hover:text-blue-400 transition-colors" />
                        <p className="text-xs text-gray-400 group-hover:text-blue-500">Click to upload</p>
                        <p className="text-[10px] text-gray-300">ICO, PNG • 32×32 px</p>
                      </>
                    )}
                  </div>
                  <input ref={faviconRef} type="file" accept="image/*" className="hidden" onChange={handleFaviconUpload} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Your Company Name"
                  className="input-field"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Tagline / Slogan</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder="Your company tagline"
                  className="input-field"
                />
              </div>
            </div>
          )}

          {/* ── Color Scheme ── */}
          {activeSection === 'colors' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
              <SectionHeader icon={Palette} title="Color Scheme" subtitle="Choose a theme preset or create custom" />

              {/* Presets */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-gray-600">Theme Presets</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(Object.entries(PRESET_THEMES) as [ThemePreset, ThemeConfig][]).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => handlePreset(key)}
                      className={cn(
                        'relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:shadow-md',
                        activePreset === key ? 'border-gray-800 shadow-md' : 'border-gray-100 hover:border-gray-300'
                      )}
                    >
                      <div
                        className="w-8 h-8 rounded-full shadow-sm"
                        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}
                      />
                      <span className="text-[10px] font-medium text-gray-600">{theme.name}</span>
                      {activePreset === key && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Primary Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={e => { setPrimaryColor(e.target.value); setActivePreset('blue'); }}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={e => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) setPrimaryColor(e.target.value); }}
                      className="input-field font-mono uppercase"
                      maxLength={7}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Accent Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={e => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) setAccentColor(e.target.value); }}
                      className="input-field font-mono uppercase"
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>

              {/* Color swatch */}
              <div className="rounded-xl overflow-hidden h-10 flex border border-gray-100">
                {[
                  primaryColor,
                  primaryColor + 'cc',
                  accentColor,
                  accentColor + 'aa',
                  '#f8fafc',
                  '#1e293b',
                ].map((c, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          )}

          {/* ── Login Page ── */}
          {activeSection === 'login' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
              <SectionHeader icon={Eye} title="Login Page" subtitle="Customize your login experience" />

              {/* Background Mode */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">Background Style</p>
                <div className="flex gap-2">
                  {(['gradient', 'solid', 'image'] as BgMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setBgMode(mode)}
                      className={cn(
                        'flex-1 py-2 rounded-lg text-sm font-medium border capitalize transition-colors',
                        bgMode === mode
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Welcome Text</label>
                <textarea
                  rows={3}
                  value={welcomeText}
                  onChange={e => setWelcomeText(e.target.value)}
                  className="input-field resize-none"
                  placeholder="Welcome message shown on the login page…"
                />
              </div>

              <div className="flex items-center justify-between py-3 border border-gray-100 rounded-xl px-4">
                <div>
                  <p className="text-sm font-medium text-gray-800">Show Feature Highlights</p>
                  <p className="text-xs text-gray-400 mt-0.5">Display feature icons below the login form</p>
                </div>
                <button onClick={() => setShowFeatures(p => !p)}>
                  {showFeatures
                    ? <ToggleRight className="w-8 h-8 text-blue-600" />
                    : <ToggleLeft className="w-8 h-8 text-gray-300" />
                  }
                </button>
              </div>

              {showFeatures && (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: Zap,      label: 'Fast & Reliable' },
                    { icon: Shield,   label: 'Secure' },
                    { icon: BarChart3,label: 'Analytics' },
                    { icon: Users,    label: 'Team Management' },
                  ].map((f, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                      <f.icon className="w-4 h-4 text-blue-500" />
                      <span className="text-[10px] text-gray-500 font-medium text-center">{f.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Domain & URLs ── */}
          {activeSection === 'domain' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
              <SectionHeader icon={Globe} title="Domain & URLs" subtitle="Configure custom domain and SSL" />

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Custom Domain</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={customDomain}
                    onChange={e => setCustomDomain(e.target.value)}
                    className="input-field pl-9"
                    placeholder="app.yourcompany.uz"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Subdomain</label>
                <div className="flex items-center gap-0 border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="text"
                    value={subdomain}
                    onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 px-3 py-2 text-sm outline-none bg-white"
                    placeholder="yourcompany"
                  />
                  <span className="px-3 py-2 text-sm text-gray-500 bg-gray-50 border-l border-gray-200 whitespace-nowrap">
                    .staffflow.uz
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Your URL: <span className="font-mono text-blue-600">{subdomain || 'yourcompany'}.staffflow.uz</span>
                </p>
              </div>

              {/* SSL Status */}
              <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl p-4">
                <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-800">SSL Certificate — Active</p>
                  <p className="text-xs text-green-600 mt-0.5">Auto-renewed • Expires 2025-06-01 • Let's Encrypt</p>
                </div>
                <Check className="w-5 h-5 text-green-500" />
              </div>

              {/* CNAME Instructions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-700">DNS Configuration (CNAME)</p>
                  <button
                    onClick={handleCopyCname}
                    className={cn('flex items-center gap-1.5 text-xs font-medium transition-colors', copiedCname ? 'text-green-600' : 'text-gray-500 hover:text-gray-700')}
                  >
                    {copiedCname ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCname ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-green-400 space-y-1.5">
                  <div className="text-slate-500 text-[10px] mb-2"># Add these DNS records at your domain registrar</div>
                  {cnameBlock.split('\n').map((line, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-slate-400">$</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400">DNS propagation may take up to 48 hours</p>
              </div>
            </div>
          )}

          {/* ── Email Templates ── */}
          {activeSection === 'email' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
              <SectionHeader icon={Mail} title="Email Templates" subtitle="Customize transactional emails" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">From Name</label>
                  <input type="text" value={fromName} onChange={e => setFromName(e.target.value)} className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">From Email</label>
                  <input type="email" value={fromEmail} onChange={e => setFromEmail(e.target.value)} className="input-field" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Email Header Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={emailHeaderColor}
                    onChange={e => setEmailHeaderColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={emailHeaderColor}
                    onChange={e => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) setEmailHeaderColor(e.target.value); }}
                    className="input-field font-mono uppercase"
                    maxLength={7}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Footer Text</label>
                <textarea
                  rows={2}
                  value={emailFooter}
                  onChange={e => setEmailFooter(e.target.value)}
                  className="input-field resize-none"
                />
              </div>

              <button
                onClick={handleTestEmail}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border',
                  testEmailSent
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                )}
              >
                {testEmailSent ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                {testEmailSent ? 'Test email yuborildi!' : 'Test email yuborish'}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Live Preview Panel */}
        <div className="w-72 flex-shrink-0 hidden lg:block">
          <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-50">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-xs font-semibold text-gray-700">Live Preview</p>
              <span className="ml-auto text-[10px] text-gray-400">Auto-updates</span>
            </div>
            <LivePreview
              primaryColor={primaryColor}
              accentColor={accentColor}
              companyName={companyName}
              logoPreview={logoPreview}
              bgMode={bgMode}
              welcomeText={welcomeText}
              showFeatures={showFeatures}
              emailHeaderColor={emailHeaderColor}
            />
          </div>
        </div>
      </div>

      {/* Fixed Save Bar */}
      <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-white border-t border-gray-100 shadow-lg flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
            <Palette className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{companyName}</p>
            <p className="text-xs text-gray-400">{subdomain}.staffflow.uz</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCompanyName('StaffFlow HR');
              setTagline("O'zbekistonning zamonaviy HR platformasi");
              handlePreset('blue');
              setBgMode('gradient');
              setWelcomeText('Xush kelibsiz!');
              setShowFeatures(true);
            }}
            className="btn-secondary"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          <button
            onClick={handleSave}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all',
              saved
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saqlandi!' : 'Saqlash'}
          </button>
        </div>
      </div>
    </div>
  );
}
