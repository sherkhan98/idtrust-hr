'use client';

import { useState } from 'react';
import { CreditCard, Check, X, Download, TrendingUp, Users, Database, Zap, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const SUBSCRIPTION = {
  plan: 'Professional', clouds: ['HR Cloud', 'School Cloud'],
  monthlyPrice: 2490000, currency: 'UZS', nextBilling: '2024-02-01', status: 'ACTIVE',
  usedEmployees: 45, maxEmployees: 200, usedStudents: 320, maxStudents: 500,
  storage: { used: 3.2, max: 20 }, apiCalls: { used: 8420, max: 50000 },
};

const INVOICES = [
  { id:'inv3', period:'Fevral 2024', amount:2490000, status:'PENDING', date:'2024-02-01', paidAt:null },
  { id:'inv1', period:'Yanvar 2024', amount:2490000, status:'PAID', date:'2024-01-01', paidAt:'2024-01-03' },
  { id:'inv2', period:'Dekabr 2023', amount:2490000, status:'PAID', date:'2023-12-01', paidAt:'2023-12-02' },
  { id:'inv4', period:'Noyabr 2023', amount:1990000, status:'PAID', date:'2023-11-01', paidAt:'2023-11-02' },
  { id:'inv5', period:'Oktyabr 2023', amount:1990000, status:'PAID', date:'2023-10-01', paidAt:'2023-10-03' },
];

const MONTHLY_COSTS = [1990000, 1990000, 1990000, 2490000, 2490000, 2490000];
const MONTH_LABELS = ['Sen', 'Okt', 'Noy', 'Dek', 'Yan', 'Fev'];

const PLANS = [
  {
    name:'Starter', price:990000, clouds:1, maxUsers:50,
    features:['1 ta bulut', '50 xodim/o\'quvchi', 'Asosiy funksiyalar', '5 GB disk', 'Email support'],
    noFeatures:['AI davomat', 'API kirish', 'Maxsus integratsiya'],
  },
  {
    name:'Professional', price:2490000, clouds:2, maxUsers:200, popular:true,
    features:['2 ta bulut', '200 xodim/o\'quvchi', 'AI yuz tanish', '20 GB disk', 'API kirish', 'Telegram bot', 'Priority support'],
    noFeatures:['Maxsus integratsiya'],
  },
  {
    name:'Enterprise', price:null, clouds:3, maxUsers:-1,
    features:['Barcha bulutlar', 'Cheksiz foydalanuvchilar', 'Custom integratsiya', 'Cheksiz disk', 'Dedicated server', 'SLA 99.9%', '24/7 support'],
    noFeatures:[],
  },
];

function fmt(n: number) { return n.toLocaleString('uz-UZ') + ' so\'m'; }

export default function BillingPage() {
  const [showUpgrade, setShowUpgrade] = useState(false);

  const maxBar = Math.max(...MONTHLY_COSTS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Billing</h1>
            <p className="text-xs text-gray-500">Yagona hisob-kitob tizimi — barcha bulutlar uchun</p>
          </div>
        </div>
      </div>

      {/* Current plan */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">JORIY TARIF</span>
            <h2 className="text-2xl font-bold mt-1">{SUBSCRIPTION.plan}</h2>
            <div className="flex gap-2 mt-1">
              {SUBSCRIPTION.clouds.map(c=>(
                <span key={c} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{c}</span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-violet-200 text-sm">Oylik to&#39;lov</p>
            <p className="text-3xl font-bold">{fmt(SUBSCRIPTION.monthlyPrice)}</p>
            <p className="text-violet-200 text-xs mt-0.5">Keyingi: {SUBSCRIPTION.nextBilling}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={()=>setShowUpgrade(true)}
            className="flex-1 py-2.5 bg-white text-violet-700 font-bold text-sm rounded-xl hover:bg-violet-50 transition-colors">
            Tarifni o&#39;zgartirish
          </button>
          <button onClick={()=>toast('Bekor qilish uchun support bilan bog\'laning', {icon:'ℹ️'})}
            className="py-2.5 px-4 bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-colors">
            Bekor qilish
          </button>
        </div>
      </div>

      {/* Usage */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-sm font-bold text-gray-800 mb-4">Foydalanish holati</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label:'Xodimlar', icon:Users, used:SUBSCRIPTION.usedEmployees, max:SUBSCRIPTION.maxEmployees, color:'bg-blue-500' },
            { label:"O'quvchilar", icon:Users, used:SUBSCRIPTION.usedStudents, max:SUBSCRIPTION.maxStudents, color:'bg-green-500' },
            { label:'Disk (GB)', icon:Database, used:SUBSCRIPTION.storage.used, max:SUBSCRIPTION.storage.max, color:'bg-orange-500' },
            { label:'API so\'rovlar', icon:Zap, used:SUBSCRIPTION.apiCalls.used, max:SUBSCRIPTION.apiCalls.max, color:'bg-purple-500' },
          ].map(m=>{
            const pct = Math.round((m.used/m.max)*100);
            return (
              <div key={m.label} className="bg-gray-50 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <m.icon className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-600">{m.label}</span>
                  </div>
                  <span className={`text-xs font-bold ${pct>80?'text-red-600':pct>60?'text-orange-600':'text-gray-600'}`}>
                    {m.used}/{m.max}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${m.color} rounded-full transition-all`} style={{width:`${pct}%`}} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{pct}% ishlatilgan</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly cost chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-gray-800">Oylik xarajatlar</p>
          <TrendingUp className="w-4 h-4 text-violet-500" />
        </div>
        <div className="flex items-end gap-3 h-32">
          {MONTHLY_COSTS.map((cost,i)=>{
            const h = Math.round((cost/maxBar)*100);
            const isLast = i===MONTHLY_COSTS.length-1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-500 font-mono">{(cost/1000000).toFixed(1)}M</span>
                <div className="w-full flex items-end" style={{height:'80px'}}>
                  <div
                    className={`w-full rounded-t-lg transition-all ${isLast?'bg-violet-500':'bg-violet-200'}`}
                    style={{height:`${h}%`}}
                  />
                </div>
                <span className="text-[10px] text-gray-400">{MONTH_LABELS[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-sm font-bold text-gray-800 mb-4">Hisob-fakturalar</p>
        <div className="space-y-2">
          {INVOICES.map(inv=>(
            <div key={inv.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${inv.status==='PAID'?'bg-green-100':'bg-yellow-100'}`}>
                {inv.status==='PAID'?<Check className="w-4 h-4 text-green-600"/>:<CreditCard className="w-4 h-4 text-yellow-600"/>}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{inv.period}</p>
                <p className="text-xs text-gray-400">{inv.status==='PAID'?`To'langan: ${inv.paidAt}`:'Kutilmoqda'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">{fmt(inv.amount)}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${inv.status==='PAID'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>
                  {inv.status==='PAID'?"To'langan":'Kutilmoqda'}
                </span>
              </div>
              <button onClick={()=>toast.success('PDF yuklab olindi')} className="p-2 text-gray-400 hover:text-gray-600">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment method */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">VISA</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Kapitalbank •••• 4242</p>
              <p className="text-xs text-gray-400">Muddati: 03/27</p>
            </div>
          </div>
          <button onClick={()=>toast.success("To'lov usuli o'zgartirildi")} className="text-sm text-violet-600 font-semibold hover:text-violet-700 flex items-center gap-1">
            O&#39;zgartirish <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-4">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">Tarif tanlash</h3>
              <button onClick={()=>setShowUpgrade(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-5 grid grid-cols-3 gap-4">
              {PLANS.map(plan=>(
                <div key={plan.name} className={`rounded-xl border-2 p-4 relative ${plan.name===SUBSCRIPTION.plan?'border-violet-500 bg-violet-50':plan.popular?'border-violet-200':'border-gray-200'}`}>
                  {plan.popular&&<span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold bg-violet-600 text-white px-3 py-0.5 rounded-full">MASHHUR</span>}
                  {plan.name===SUBSCRIPTION.plan&&<span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold bg-green-500 text-white px-3 py-0.5 rounded-full">JORIY</span>}
                  <p className="font-bold text-gray-900 text-lg mb-1">{plan.name}</p>
                  <p className="text-2xl font-bold text-violet-600 mb-1">
                    {plan.price?fmt(plan.price):'Kelishuv'}
                  </p>
                  {plan.price&&<p className="text-xs text-gray-400 mb-3">oyiga</p>}
                  <div className="space-y-1.5 mb-4">
                    {plan.features.map(f=>(
                      <div key={f} className="flex items-center gap-2 text-xs">
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{f}</span>
                      </div>
                    ))}
                    {plan.noFeatures.map(f=>(
                      <div key={f} className="flex items-center gap-2 text-xs">
                        <X className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                        <span className="text-gray-400">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={()=>{setShowUpgrade(false);toast.success(`${plan.name} tarifiga o'tildi!`);}}
                    disabled={plan.name===SUBSCRIPTION.plan}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${plan.name===SUBSCRIPTION.plan?'bg-gray-100 text-gray-400 cursor-not-allowed':plan.popular||!plan.price?'bg-violet-600 text-white hover:bg-violet-700':'bg-violet-50 text-violet-700 hover:bg-violet-100'}`}>
                    {plan.name===SUBSCRIPTION.plan?'Joriy tarif':plan.price?'Tanlash':'Bog\'lanish'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
