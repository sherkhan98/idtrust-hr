'use client';

import { useState } from 'react';
import {
  TrendingUp, Users, DollarSign, Target, Plus, Search,
  X, ChevronRight, ChevronLeft, Phone, Mail, Building2,
  Calendar, Clock, CheckCircle2, Star, Eye, MessageSquare,
  PhoneCall, Send, Coffee, BarChart2, ArrowRight, User,
} from 'lucide-react';

// ─── Demo Data ────────────────────────────────────────────────
const CLIENTS = [
  { id: 'c1', name: 'UzTech Solutions', type: 'COMPANY', contact: 'Alisher Nazarov', phone: '+998901234567', email: 'alisher@uztech.uz', status: 'ACTIVE', totalDeals: 5, totalRevenue: 450000000, avatar: 'UT' },
  { id: 'c2', name: 'GlobalMart Uzbekistan', type: 'COMPANY', contact: 'Sarvar Rashidov', phone: '+998907654321', email: 'sarvar@globalmart.uz', status: 'ACTIVE', totalDeals: 3, totalRevenue: 280000000, avatar: 'GM' },
  { id: 'c3', name: 'Nexus Holding', type: 'COMPANY', contact: 'Doniyor Karimov', phone: '+998905555555', email: 'doniyor@nexus.uz', status: 'VIP', totalDeals: 12, totalRevenue: 1200000000, avatar: 'NH' },
  { id: 'c4', name: 'StartupLab UZ', type: 'COMPANY', contact: 'Zulfiya Ergasheva', phone: '+998901111111', email: 'zulfiya@startuplab.uz', status: 'ACTIVE', totalDeals: 2, totalRevenue: 85000000, avatar: 'SL' },
];

const DEALS = [
  { id: 'd1', title: "ERP joriy qilish — UzTech", client: 'UzTech Solutions', value: 120000000, stage: 'NEGOTIATION', closeDate: '2024-02-15', probability: 75, owner: 'Jasur M.' },
  { id: 'd2', title: 'HR tizimi — GlobalMart', client: 'GlobalMart Uzbekistan', value: 85000000, stage: 'PROPOSAL', closeDate: '2024-02-28', probability: 50, owner: 'Dilnoza K.' },
  { id: 'd3', title: "To'liq avtomatlashtirish — Nexus", client: 'Nexus Holding', value: 450000000, stage: 'CLOSED_WON', closeDate: '2024-01-20', probability: 100, owner: 'Jasur M.' },
  { id: 'd4', title: 'Maktab tizimi — StartupLab', client: 'StartupLab UZ', value: 45000000, stage: 'LEAD', closeDate: '2024-03-10', probability: 20, owner: 'Otabek S.' },
  { id: 'd5', title: "Bog'cha modüli — Yangi", client: 'Yangi mijoz', value: 25000000, stage: 'LEAD', closeDate: '2024-03-20', probability: 15, owner: 'Dilnoza K.' },
];

const STAGES = [
  { id: 'LEAD', label: 'Lead', color: 'bg-slate-100 border-slate-200', headerColor: 'bg-slate-600', textColor: 'text-slate-700' },
  { id: 'PROPOSAL', label: 'Taklif', color: 'bg-blue-50 border-blue-200', headerColor: 'bg-blue-600', textColor: 'text-blue-700' },
  { id: 'NEGOTIATION', label: 'Muzokaralar', color: 'bg-amber-50 border-amber-200', headerColor: 'bg-amber-500', textColor: 'text-amber-700' },
  { id: 'CLOSED_WON', label: "Yopildi (Yutildi)", color: 'bg-emerald-50 border-emerald-200', headerColor: 'bg-emerald-600', textColor: 'text-emerald-700' },
  { id: 'CLOSED_LOST', label: "Yopildi (Yutqazildi)", color: 'bg-red-50 border-red-200', headerColor: 'bg-red-500', textColor: 'text-red-700' },
];

const DEAL_ACTIVITIES = [
  { icon: PhoneCall, label: "Qo'ng'iroq qilindi", time: '28 yan, 14:30', by: 'Jasur M.', color: 'text-blue-600 bg-blue-50' },
  { icon: Send, label: 'Taklif yuborildi', time: '26 yan, 10:00', by: 'Dilnoza K.', color: 'text-indigo-600 bg-indigo-50' },
  { icon: Coffee, label: "Uchrashuv bo'ldi", time: '22 yan, 09:00', by: 'Jasur M.', color: 'text-amber-600 bg-amber-50' },
];

// ─── Helpers ──────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

function daysUntil(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date('2024-01-28');
  const diff = Math.ceil((d.getTime() - now.getTime()) / 86400000);
  return diff;
}

type Deal = typeof DEALS[number];
type Client = typeof CLIENTS[number];

// ─── Deal Detail Modal ────────────────────────────────────────
interface DealModalProps { deal: Deal; onClose: () => void }
function DealModal({ deal, onClose }: DealModalProps) {
  const stage = STAGES.find(s => s.id === deal.stage);
  const days = daysUntil(deal.closeDate);
  const stageOrder = STAGES.map(s => s.id);
  const stageIdx = stageOrder.indexOf(deal.stage);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">{deal.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stage?.color} ${stage?.textColor} border`}>{stage?.label}</span>
                <span className="text-sm text-slate-500">{deal.client}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {/* Value + probability */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-xs text-emerald-600 font-medium">Shartnoma qiymati</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{fmt(deal.value)} so'm</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-blue-600 font-medium">Ehtimollik</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{deal.probability}%</p>
              <div className="mt-2 bg-blue-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${deal.probability}%` }} />
              </div>
            </div>
          </div>

          {/* Close date */}
          <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Yopilish sanasi</p>
                <p className="text-sm font-semibold text-slate-800">{deal.closeDate}</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${days < 0 ? 'bg-red-100 text-red-700' : days < 14 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {days < 0 ? `${Math.abs(days)} kun o'tdi` : `${days} kun qoldi`}
            </span>
          </div>

          {/* Stage pipeline */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Bosqich</p>
            <div className="flex items-center gap-1">
              {STAGES.slice(0, 4).map((s, i) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg ${i <= stageIdx ? `${s.headerColor} text-white` : 'bg-slate-100 text-slate-400'}`}>
                    {s.label.split(' ')[0]}
                  </div>
                  {i < 3 && <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Stage navigation */}
          <div className="flex gap-2">
            {stageIdx > 0 && (
              <button className="flex items-center gap-1 border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex-1">
                <ChevronLeft size={15} /> Orqaga
              </button>
            )}
            {stageIdx < STAGES.length - 1 && (
              <button className="flex items-center gap-1 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex-1 justify-center">
                Keyingi bosqich <ChevronRight size={15} />
              </button>
            )}
          </div>

          {/* Activity log */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faoliyat jurnali</p>
              <button className="flex items-center gap-1 text-emerald-600 text-xs font-medium hover:text-emerald-800">
                <Plus size={12} /> Faoliyat qo'shish
              </button>
            </div>
            <div className="space-y-3">
              {DEAL_ACTIVITIES.map((act, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${act.color}`}>
                    <act.icon size={15} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{act.label}</p>
                    <p className="text-xs text-slate-400">{act.by} · {act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Owner */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">{deal.owner.charAt(0)}</span>
            </div>
            <div>
              <p className="text-xs text-slate-400">Mas'ul xodim</p>
              <p className="text-sm font-semibold text-slate-800">{deal.owner}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Client Detail Modal ──────────────────────────────────────
interface ClientModalProps { client: Client; onClose: () => void }
function ClientModal({ client, onClose }: ClientModalProps) {
  const clientDeals = DEALS.filter(d => d.client === client.name);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">{client.avatar}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-800">{client.name}</h3>
                  {client.status === 'VIP' && (
                    <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full border border-amber-200">
                      <Star size={10} /> VIP
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{client.type}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-xs text-emerald-600">Jami daromad</p>
              <p className="text-xl font-bold text-emerald-700 mt-1">{fmt(client.totalRevenue)} so'm</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-blue-600">Kelishuvlar soni</p>
              <p className="text-xl font-bold text-blue-700 mt-1">{client.totalDeals} ta</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { icon: User, label: 'Aloqa shaxsi', value: client.contact },
              { icon: Phone, label: 'Telefon', value: client.phone },
              { icon: Mail, label: 'Email', value: client.email },
            ].map(r => (
              <div key={r.label} className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                <r.icon size={15} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">{r.label}</p>
                  <p className="text-sm font-medium text-slate-800">{r.value}</p>
                </div>
              </div>
            ))}
          </div>
          {clientDeals.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Kelishuvlar tarixi</p>
              <div className="space-y-2">
                {clientDeals.map(d => {
                  const s = STAGES.find(s => s.id === d.stage);
                  return (
                    <div key={d.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{d.title}</p>
                        <span className={`text-xs font-medium ${s?.textColor}`}>{s?.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-emerald-700">{fmt(d.value)} so'm</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Deal Card ────────────────────────────────────────────────
interface DealCardProps { deal: Deal; onClick: () => void }
function DealCard({ deal, onClick }: DealCardProps) {
  const days = daysUntil(deal.closeDate);
  return (
    <div onClick={onClick} className="bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all group">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-semibold text-slate-800 leading-snug flex-1 mr-2">{deal.title}</p>
        <Eye size={14} className="text-slate-300 group-hover:text-emerald-500 flex-shrink-0 mt-0.5 transition-colors" />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-white">{deal.client.charAt(0)}</span>
        </div>
        <span className="text-xs text-slate-500 truncate">{deal.client}</span>
      </div>
      <p className="text-lg font-bold text-emerald-700 mb-3">{fmt(deal.value)} so'm</p>
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-slate-400">Ehtimollik</span>
          <span className="text-xs font-semibold text-slate-600">{deal.probability}%</span>
        </div>
        <div className="bg-slate-100 rounded-full h-1.5">
          <div className={`h-1.5 rounded-full ${deal.probability >= 75 ? 'bg-emerald-500' : deal.probability >= 40 ? 'bg-amber-400' : 'bg-slate-400'}`}
            style={{ width: `${deal.probability}%` }} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${days < 0 ? 'bg-red-50 text-red-600' : days < 14 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {days < 0 ? `${Math.abs(days)}k o'tdi` : `${days}k qoldi`}
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-slate-600">{deal.owner.charAt(0)}</span>
          </div>
          <span className="text-xs text-slate-400">{deal.owner}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function SalesPage() {
  const [view, setView] = useState<'kanban' | 'clients'>('kanban');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [clientFilter, setClientFilter] = useState('ALL');

  const pipelineValue = DEALS.filter(d => !d.stage.startsWith('CLOSED')).reduce((s, d) => s + d.value, 0);
  const closedWon = DEALS.filter(d => d.stage === 'CLOSED_WON');
  const closedWonValue = closedWon.reduce((s, d) => s + d.value, 0);
  const avgDeal = DEALS.reduce((s, d) => s + d.value, 0) / DEALS.length;
  const conversionRate = Math.round((closedWon.length / DEALS.length) * 100);

  const filteredClients = CLIENTS.filter(c => {
    const ms = clientSearch === '' || c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.contact.toLowerCase().includes(clientSearch.toLowerCase());
    const mf = clientFilter === 'ALL' || c.status === clientFilter;
    return ms && mf;
  });

  return (
    <div className="min-h-screen bg-emerald-50/20">
      {selectedDeal && <DealModal deal={selectedDeal} onClose={() => setSelectedDeal(null)} />}
      {selectedClient && <ClientModal client={selectedClient} onClose={() => setSelectedClient(null)} />}

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Savdo & CRM</h1>
                <p className="text-sm text-slate-500">Mijozlar va kelishuvlar — IDTrust ERP</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
                <Plus size={15} /> Yangi mijoz
              </button>
              <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
                <Plus size={15} /> Yangi kelishuv
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-5">
            {[
              { label: 'Pipeline qiymati', value: fmt(pipelineValue) + " so'm", sub: 'Ochiq kelishuvlar', icon: BarChart2, color: 'bg-emerald-600' },
              { label: 'Yopildi (bu oy)', value: `${closedWon.length} ta · ${fmt(closedWonValue)} so'm`, sub: 'Yanvar 2024', icon: CheckCircle2, color: 'bg-blue-600' },
              { label: "O'rtacha kelishuv", value: fmt(avgDeal) + " so'm", sub: 'Barcha vaqt', icon: DollarSign, color: 'bg-amber-500' },
              { label: 'Konversiya', value: `${conversionRate}%`, sub: 'Lead → Won', icon: Target, color: 'bg-violet-600' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 ${s.color} rounded-lg flex items-center justify-center`}>
                    <s.icon size={16} className="text-white" />
                  </div>
                </div>
                <p className="text-base font-bold text-slate-800">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex gap-1 mt-4">
            {[
              { id: 'kanban', label: 'Kanban', icon: BarChart2 },
              { id: 'clients', label: 'Mijozlar', icon: Users },
            ].map(t => (
              <button key={t.id} onClick={() => setView(t.id as 'kanban' | 'clients')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === t.id ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-emerald-50'}`}>
                <t.icon size={15} />{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* ── KANBAN VIEW ── */}
        {view === 'kanban' && (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {STAGES.map(stage => {
                const stageDeals = DEALS.filter(d => d.stage === stage.id);
                const stageTotal = stageDeals.reduce((s, d) => s + d.value, 0);
                return (
                  <div key={stage.id} className="w-72 flex-shrink-0">
                    <div className={`rounded-xl border ${stage.color} overflow-hidden`}>
                      {/* Column header */}
                      <div className={`${stage.headerColor} px-4 py-3`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{stage.label}</span>
                            <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">{stageDeals.length}</span>
                          </div>
                          <button className="text-white/70 hover:text-white"><Plus size={16} /></button>
                        </div>
                        <p className="text-xs text-white/70 mt-0.5">{fmt(stageTotal)} so'm</p>
                      </div>
                      {/* Cards */}
                      <div className="p-3 space-y-3 min-h-32">
                        {stageDeals.map(deal => (
                          <DealCard key={deal.id} deal={deal} onClick={() => setSelectedDeal(deal)} />
                        ))}
                        {stageDeals.length === 0 && (
                          <div className="text-center py-6 text-slate-400 text-xs">
                            Kelishuv yo'q
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CLIENTS VIEW ── */}
        {view === 'clients' && (
          <div className="bg-white rounded-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
              <div className="relative flex-1 min-w-48">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input placeholder="Mijoz qidirish..." value={clientSearch} onChange={e => setClientSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <select value={clientFilter} onChange={e => setClientFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="ALL">Barcha holat</option>
                <option value="ACTIVE">Faol</option>
                <option value="VIP">VIP</option>
                <option value="INACTIVE">Nofaol</option>
              </select>
              <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 ml-auto">
                <Plus size={15} /> Yangi mijoz
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kompaniya</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aloqa</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kelishuvlar</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Daromad</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Holat</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredClients.map(c => (
                    <tr key={c.id} onClick={() => setSelectedClient(c)} className="hover:bg-emerald-50/40 cursor-pointer transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">{c.avatar}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                            <p className="text-xs text-slate-400">{c.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700">{c.contact}</p>
                        <p className="text-xs text-slate-400">{c.phone}</p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-sm font-semibold text-slate-800">{c.totalDeals}</span>
                        <span className="text-xs text-slate-400 ml-1">ta</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-sm font-semibold text-emerald-700">{fmt(c.totalRevenue)} so'm</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          c.status === 'VIP' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          c.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                          {c.status === 'VIP' && <Star size={10} />}
                          {c.status === 'VIP' ? 'VIP' : c.status === 'ACTIVE' ? 'Faol' : 'Nofaol'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={e => { e.stopPropagation(); setSelectedClient(c); }}
                          className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800 text-xs font-medium">
                          <Eye size={13} /> Ko'rish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 text-sm text-slate-500">
              {filteredClients.length} ta mijoz · Jami daromad: <strong className="text-slate-800">{fmt(filteredClients.reduce((s, c) => s + c.totalRevenue, 0))} so'm</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
