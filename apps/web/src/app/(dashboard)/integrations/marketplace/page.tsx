'use client';

import { useState } from 'react';
import {
  Search, Star, Users, Check, Clock, Plug, X, ChevronDown,
  RefreshCw, AlertCircle, CheckCircle, Zap, Shield, Settings,
  ExternalLink, Eye, EyeOff, Wifi
} from 'lucide-react';

type IntegrationStatus = 'Connected' | 'Available' | 'Coming Soon';
type Category = 'All' | 'Accounting' | 'ERP' | 'Communication' | 'HR Systems' | 'Analytics' | 'CRM';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: Exclude<Category, 'All'>;
  rating: number;
  companies: number;
  status: IntegrationStatus;
  initials: string;
  color: string;
  authType: 'apikey' | 'oauth' | 'webhook';
  lastSync?: string;
  syncStatus?: 'success' | 'error' | 'syncing';
}

const INTEGRATIONS: Integration[] = [
  { id: 'xero', name: 'Xero', description: 'Avtomatik maosh sinxronizatsiyasi', category: 'Accounting', rating: 4.5, companies: 234, status: 'Available', initials: 'XE', color: 'bg-blue-100 text-blue-700', authType: 'oauth' },
  { id: 'sap', name: 'SAP HR', description: 'SAP SuccessFactors integratsiyasi', category: 'ERP', rating: 4.7, companies: 89, status: 'Available', initials: 'SAP', color: 'bg-blue-900 text-white', authType: 'apikey' },
  { id: 'oracle', name: 'Oracle HCM', description: 'Oracle HR Cloud bilan to\'liq sync', category: 'HR Systems', rating: 4.6, companies: 56, status: 'Coming Soon', initials: 'ORA', color: 'bg-red-100 text-red-700', authType: 'oauth' },
  { id: 'quickbooks', name: 'QuickBooks', description: 'Maosh va xarajat hisobi', category: 'Accounting', rating: 4.4, companies: 412, status: 'Available', initials: 'QB', color: 'bg-green-100 text-green-700', authType: 'oauth' },
  { id: 'salesforce', name: 'Salesforce', description: 'Xodim-mijoz bog\'liqlik tahlili', category: 'CRM', rating: 4.8, companies: 178, status: 'Coming Soon', initials: 'SF', color: 'bg-blue-100 text-blue-800', authType: 'oauth' },
  { id: 'slack', name: 'Slack', description: 'Bildirishnomalar va HR bot', category: 'Communication', rating: 4.9, companies: 621, status: 'Connected', initials: 'SL', color: 'bg-purple-100 text-purple-700', authType: 'oauth', lastSync: '5 daqiqa oldin', syncStatus: 'success' },
  { id: 'teams', name: 'Microsoft Teams', description: 'Teams HR Assistant', category: 'Communication', rating: 4.6, companies: 534, status: 'Available', initials: 'MT', color: 'bg-indigo-100 text-indigo-700', authType: 'oauth' },
  { id: 'google', name: 'Google Workspace', description: 'Gmail, Calendar, Meet sync', category: 'Communication', rating: 4.8, companies: 743, status: 'Connected', initials: 'GW', color: 'bg-red-100 text-red-600', authType: 'oauth', lastSync: '1 soat oldin', syncStatus: 'success' },
  { id: 'workday', name: 'Workday', description: "Workday to StaffFlow migration", category: 'HR Systems', rating: 4.5, companies: 167, status: 'Available', initials: 'WD', color: 'bg-orange-100 text-orange-700', authType: 'apikey' },
  { id: 'zoho', name: 'Zoho People', description: "Zoho HR ma'lumot ko'chirish", category: 'HR Systems', rating: 4.2, companies: 289, status: 'Available', initials: 'ZP', color: 'bg-yellow-100 text-yellow-700', authType: 'apikey' },
  { id: 'powerbi', name: 'Power BI', description: 'HR dashboard Power BI da', category: 'Analytics', rating: 4.7, companies: 356, status: 'Available', initials: 'PBI', color: 'bg-yellow-100 text-yellow-800', authType: 'apikey' },
  { id: 'tableau', name: 'Tableau', description: 'Chuqur tahlil va vizualizatsiya', category: 'Analytics', rating: 4.6, companies: 198, status: 'Coming Soon', initials: 'TAB', color: 'bg-blue-100 text-blue-600', authType: 'apikey' },
];

const CATEGORIES: Category[] = ['All', 'Accounting', 'ERP', 'Communication', 'HR Systems', 'Analytics', 'CRM'];

const SYNC_OPTIONS = ['Real-time', 'Har soatda', 'Har kuni', 'Har haftada'];

interface ConnectModalProps {
  integration: Integration;
  onClose: () => void;
  onConnect: (id: string) => void;
}

function ConnectModal({ integration, onClose, onConnect }: ConnectModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [syncFreq, setSyncFreq] = useState('Har soatda');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [scopes, setScopes] = useState({
    read_employees: true,
    write_payroll: false,
    read_reports: true,
    sync_calendar: false,
    manage_notifications: true,
  });

  const scopeLabels: Record<string, string> = {
    read_employees: 'Xodimlar ma\'lumotini o\'qish',
    write_payroll: 'Maosh ma\'lumotini yozish',
    read_reports: 'Hisobotlarni o\'qish',
    sync_calendar: 'Kalendar sinxronizatsiyasi',
    manage_notifications: 'Bildirishnomalarni boshqarish',
  };

  const handleTest = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult(apiKey.length > 5 || integration.authType === 'oauth' ? 'success' : 'error');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${integration.color}`}>
                {integration.initials}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{integration.name}</h3>
                <p className="text-sm text-gray-500">{integration.description}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Auth fields */}
          {integration.authType === 'oauth' ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
              <Shield size={18} className="text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-800">OAuth 2.0 autentifikatsiya</p>
                <p className="text-xs text-blue-600 mt-0.5">Ulash tugmasini bosgach, {integration.name} saytiga yo'naltirilasiz</p>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">API Kalit</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          {(integration.id === 'slack' || integration.id === 'teams') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Webhook URL</label>
              <input
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.slack.com/..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Scopes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ruxsatlar (Scopes)</label>
            <div className="space-y-2">
              {Object.entries(scopes).map(([key, val]) => (
                <label key={key} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${val ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}
                    onClick={() => setScopes(prev => ({ ...prev, [key]: !prev[key as keyof typeof scopes] }))}
                  >
                    {val && <Check size={12} className="text-white" />}
                  </div>
                  <span className="text-sm text-gray-600">{scopeLabels[key]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sync frequency */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sinxronizatsiya tezligi</label>
            <div className="grid grid-cols-2 gap-2">
              {SYNC_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSyncFreq(opt)}
                  className={`py-2 rounded-xl border text-sm font-medium transition-all ${syncFreq === opt ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Test result */}
          {testResult && (
            <div className={`p-3 rounded-xl flex items-center gap-2 ${testResult === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {testResult === 'success' ? (
                <><CheckCircle size={16} className="text-green-600" /><span className="text-sm font-medium text-green-700">Ulanish muvaffaqiyatli!</span></>
              ) : (
                <><AlertCircle size={16} className="text-red-600" /><span className="text-sm font-medium text-red-700">API kalit noto'g'ri. Qayta tekshiring.</span></>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleTest}
              disabled={testing}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              {testing ? <><RefreshCw size={14} className="animate-spin" />Tekshirilmoqda...</> : <><Wifi size={14} />Ulanishni test qilish</>}
            </button>
            <button
              onClick={() => { onConnect(integration.id); onClose(); }}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm"
            >
              Ulash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          className={i <= Math.floor(rating) ? 'text-amber-400 fill-amber-400' : i - 0.5 <= rating ? 'text-amber-400 fill-amber-200' : 'text-gray-200 fill-gray-200'}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}</span>
    </div>
  );
}

export default function MarketplacePage() {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [activeTab, setActiveTab] = useState<'marketplace' | 'connected'>('marketplace');
  const [connectingIntegration, setConnectingIntegration] = useState<Integration | null>(null);

  const handleConnect = (id: string) => {
    setIntegrations(prev => prev.map(i =>
      i.id === id ? { ...i, status: 'Connected', lastSync: 'Hozir', syncStatus: 'success' } : i
    ));
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => prev.map(i =>
      i.id === id ? { ...i, status: 'Available', lastSync: undefined, syncStatus: undefined } : i
    ));
  };

  const handleSync = (id: string) => {
    setIntegrations(prev => prev.map(i =>
      i.id === id ? { ...i, syncStatus: 'syncing' } : i
    ));
    setTimeout(() => {
      setIntegrations(prev => prev.map(i =>
        i.id === id ? { ...i, syncStatus: 'success', lastSync: 'Hozir' } : i
      ));
    }, 2000);
  };

  const filtered = integrations.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'All' || i.category === activeCategory;
    const matchTab = activeTab === 'marketplace' ? true : i.status === 'Connected';
    return matchSearch && matchCategory && matchTab;
  });

  const connectedCount = integrations.filter(i => i.status === 'Connected').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Marketplace</h1>
          <p className="text-sm text-gray-500 mt-1">{integrations.length} ta integratsiya mavjud · {connectedCount} ta ulangan</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'marketplace' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Marketplace
        </button>
        <button
          onClick={() => setActiveTab('connected')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'connected' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Ulangan
          {connectedCount > 0 && (
            <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{connectedCount}</span>
          )}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Integratsiya qidirish..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Integration Grid */}
      {activeTab === 'marketplace' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(integration => (
            <div key={integration.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition-all flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${integration.color}`}>
                    {integration.initials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{integration.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      integration.category === 'Accounting' ? 'bg-green-50 text-green-600' :
                      integration.category === 'ERP' ? 'bg-blue-50 text-blue-600' :
                      integration.category === 'Communication' ? 'bg-purple-50 text-purple-600' :
                      integration.category === 'HR Systems' ? 'bg-orange-50 text-orange-600' :
                      integration.category === 'Analytics' ? 'bg-amber-50 text-amber-600' :
                      'bg-pink-50 text-pink-600'
                    }`}>{integration.category}</span>
                  </div>
                </div>
                <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${
                  integration.status === 'Connected' ? 'bg-green-100 text-green-700' :
                  integration.status === 'Available' ? 'bg-blue-50 text-blue-600' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {integration.status === 'Connected' && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                  {integration.status === 'Coming Soon' && <Clock size={10} />}
                  {integration.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-4 flex-1">{integration.description}</p>

              <div className="flex items-center justify-between mb-4">
                <StarRating rating={integration.rating} />
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Users size={12} />
                  <span>{integration.companies.toLocaleString()} kompaniya</span>
                </div>
              </div>

              <button
                onClick={() => integration.status !== 'Coming Soon' && setConnectingIntegration(integration)}
                disabled={integration.status === 'Coming Soon'}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  integration.status === 'Connected'
                    ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                    : integration.status === 'Available'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
                }`}
              >
                {integration.status === 'Connected' ? <><Settings size={14} />Sozlash</> :
                 integration.status === 'Available' ? <><Plug size={14} />Ulash</> :
                 <><Clock size={14} />Tez kunda</>}
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* My Integrations Tab */
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <Plug size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Hali hech qanday integratsiya ulanmagan</p>
              <button onClick={() => setActiveTab('marketplace')} className="mt-3 text-blue-600 text-sm font-medium hover:underline">Marketplace ga o'tish</button>
            </div>
          ) : (
            filtered.map(integration => (
              <div key={integration.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${integration.color}`}>
                      {integration.initials}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{integration.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`flex items-center gap-1.5 text-xs font-medium ${
                          integration.syncStatus === 'success' ? 'text-green-600' :
                          integration.syncStatus === 'error' ? 'text-red-500' :
                          'text-blue-500'
                        }`}>
                          {integration.syncStatus === 'syncing'
                            ? <><RefreshCw size={11} className="animate-spin" />Sinxronlanmoqda...</>
                            : integration.syncStatus === 'success'
                            ? <><CheckCircle size={11} />Muvaffaqiyatli</>
                            : <><AlertCircle size={11} />Xatolik</>
                          }
                        </span>
                        <span className="text-xs text-gray-400">Oxirgi sync: {integration.lastSync}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSync(integration.id)}
                      disabled={integration.syncStatus === 'syncing'}
                      className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
                    >
                      <RefreshCw size={13} className={integration.syncStatus === 'syncing' ? 'animate-spin' : ''} />
                      Sync
                    </button>
                    <button
                      onClick={() => setConnectingIntegration(integration)}
                      className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      <Settings size={13} />Sozlash
                    </button>
                    <button
                      onClick={() => handleDisconnect(integration.id)}
                      className="flex items-center gap-1.5 px-3 py-2 border border-red-200 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 transition-all"
                    >
                      <X size={13} />Uzish
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {connectingIntegration && (
        <ConnectModal
          integration={connectingIntegration}
          onClose={() => setConnectingIntegration(null)}
          onConnect={handleConnect}
        />
      )}
    </div>
  );
}
