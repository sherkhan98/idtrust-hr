'use client';

import { useState } from 'react';
import { Shield, Camera, AlertTriangle, CheckCircle2, XCircle, Plus, X, Phone, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const RECENT_PICKUPS = [
  { id:'r1', child:'Ali Toshmatov', group:'Quyosh', pickedBy:'Akbar Toshmatov', relation:'Ota', time:'17:15', faceMatch:98.2, authorized:true, photo:true },
  { id:'r2', child:'Zulfiya Nazarova', group:'Quyosh', pickedBy:'Nilufar Nazarova', relation:'Ona', time:'16:45', faceMatch:97.5, authorized:true, photo:true },
  { id:'r3', child:'Laylo Mirzayeva', group:'Oy', pickedBy:'Noma\'lum shaxs', relation:'—', time:'14:25', faceMatch:null, authorized:false, photo:true },
  { id:'r4', child:'Bekzod Yusupov', group:'Yulduz', pickedBy:'Laziz Yusupov', relation:'Ota', time:'17:30', faceMatch:99.1, authorized:true, photo:true },
  { id:'r5', child:'Nilufar Ergasheva', group:'Yulduz', pickedBy:'Hulkar Ergasheva', relation:'Buvi', time:'16:20', faceMatch:95.8, authorized:true, photo:true },
];

const CHILDREN_PICKUP = [
  {
    id:'c1', name:'Ali Toshmatov', group:'Quyosh', avatar:'AT',
    persons:[
      { name:'Akbar Toshmatov', relation:'Ota', phone:'+998901234567', telegram:'@akbar_t', faceRegistered:true, authorized:true },
      { name:'Nilufar Toshmatova', relation:'Ona', phone:'+998901234560', telegram:'@nilufar_t', faceRegistered:true, authorized:true },
      { name:'Rahim Toshmatov', relation:'Buva', phone:'+998901234561', telegram:null, faceRegistered:false, authorized:true },
    ],
  },
  {
    id:'c2', name:'Zulfiya Nazarova', group:'Quyosh', avatar:'ZN',
    persons:[
      { name:'Doniyor Nazarov', relation:'Ota', phone:'+998907654321', telegram:'@doniyor_n', faceRegistered:true, authorized:true },
      { name:'Sarvinoz Nazarova', relation:'Ona', phone:'+998907654322', telegram:null, faceRegistered:false, authorized:true },
    ],
  },
  {
    id:'c3', name:'Hasan Karimov', group:'Oy', avatar:'HK',
    persons:[
      { name:'Alisher Karimov', relation:'Ota', phone:'+998905555555', telegram:null, faceRegistered:false, authorized:true },
    ],
  },
  {
    id:'c4', name:'Bekzod Yusupov', group:'Yulduz', avatar:'BY',
    persons:[
      { name:'Laziz Yusupov', relation:'Ota', phone:'+998902222222', telegram:'@laziz_y', faceRegistered:true, authorized:true },
      { name:'Hulkar Yusupova', relation:'Ona', phone:'+998902222223', telegram:null, faceRegistered:true, authorized:true },
      { name:'Barno Xolmatova', relation:'Buvi', phone:'+998902222224', telegram:null, faceRegistered:false, authorized:false },
    ],
  },
];

export default function PickupPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFor, setAddFor] = useState<string|null>(null);
  const [newPerson, setNewPerson] = useState({ name:'', relation:'Ota', phone:'', telegram:'' });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Qabul/Ketish Nazorati</h1>
            <p className="text-xs text-gray-500">Kindergarten Cloud • Hikvision yuz tanish</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
            <Camera className="w-3.5 h-3.5" /> KAMERA AKTIV
          </span>
        </div>
      </div>

      {/* Alert banner */}
      <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 animate-pulse" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-800">⚠️ Ruxsatsiz qabul urinishi — 14:25</p>
            <p className="text-xs text-red-600 mt-0.5">Noma&#39;lum shaxs Hasan Karimovni olib ketmoqchi. Yuz tanilmadi. Ota-onaga Telegram va SMS yuborildi.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-xl">📞 Chaqiruv</button>
            <button onClick={()=>toast.success('Xavfsizlik xizmatiga xabar yuborildi')} className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-xl">Xabar</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { l:'Bugun qabul qilindi', v:RECENT_PICKUPS.filter(r=>r.authorized).length, c:'text-green-600 bg-green-50' },
          { l:'Yuz tasdiqlandi', v:RECENT_PICKUPS.filter(r=>r.faceMatch&&r.faceMatch>90).length, c:'text-blue-600 bg-blue-50' },
          { l:'Ruxsatsiz urinish', v:RECENT_PICKUPS.filter(r=>!r.authorized).length, c:'text-red-600 bg-red-50' },
          { l:"Ro'yxatdagi shaxslar", v:CHILDREN_PICKUP.reduce((a,c)=>a+c.persons.length,0), c:'text-orange-600 bg-orange-50' },
        ].map(s=>(
          <div key={s.l} className={`${s.c.split(' ')[1]} rounded-xl p-4`}>
            <p className={`text-2xl font-bold ${s.c.split(' ')[0]}`}>{s.v}</p>
            <p className="text-xs text-gray-500 mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Recent pickups */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-bold text-gray-800 mb-3">Bugungi qabul tarixi</p>
          <div className="space-y-2">
            {RECENT_PICKUPS.map(r=>(
              <div key={r.id} className={`flex items-center gap-3 p-3 rounded-xl text-sm ${r.authorized?'bg-green-50 border border-green-100':'bg-red-50 border border-red-200'}`}>
                <span className="text-xl">{r.authorized?'✅':'🚫'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-xs truncate">{r.child}</p>
                  <p className="text-xs text-gray-500 truncate">{r.pickedBy} ({r.relation})</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-mono text-gray-600">{r.time}</p>
                  {r.faceMatch ? (
                    <p className="text-xs font-bold text-green-600">{r.faceMatch}%</p>
                  ) : (
                    <p className="text-xs font-bold text-red-600">Tanilmadi</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Telegram notification preview */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-bold text-gray-800 mb-3">Telegram xabarnoma namunasi</p>
          <div className="bg-gray-50 rounded-xl p-4 font-mono text-xs text-gray-700 space-y-1 border border-gray-200">
            <p>🏠 <strong>Farzandingiz ketdi</strong></p>
            <p>👶 Bola: Ali Toshmatov</p>
            <p>👤 Kim oldi: Akbar Toshmatov (Ota)</p>
            <p>✅ Yuz tasdiqlandi: 98.2%</p>
            <p>🕐 Vaqt: 17:15</p>
            <p>📸 [Foto surati]</p>
            <p className="text-gray-400 mt-2">IDTrust Kindergarten Cloud</p>
          </div>
          <div className="mt-3 p-3 bg-red-50 rounded-xl font-mono text-xs text-red-700 border border-red-200">
            <p>⚠️ <strong>RUXSATSIZ URINISH</strong></p>
            <p>Noma&#39;lum shaxs bolangizni olib ketmoqchi!</p>
            <p>🕐 14:25 • Bog&#39;cha: Quyosh</p>
          </div>
        </div>
      </div>

      {/* Children & Authorized Persons */}
      <div>
        <p className="text-sm font-bold text-gray-800 mb-3">Ruxsatli shaxslar ro&#39;yxati</p>
        <div className="grid grid-cols-2 gap-4">
          {CHILDREN_PICKUP.map(child=>(
            <div key={child.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-50">
                <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center text-sm font-bold text-orange-700">{child.avatar}</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{child.name}</p>
                  <p className="text-xs text-gray-400">{child.group} guruhi</p>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                {child.persons.map((p,i)=>(
                  <div key={i} className={`flex items-center gap-2 p-2.5 rounded-xl text-xs ${p.authorized?'bg-green-50':'bg-gray-50 opacity-60'}`}>
                    <div className="w-7 h-7 bg-orange-200 rounded-full flex items-center justify-center font-bold text-orange-800 text-[10px]">{p.name.split(' ').map(n=>n[0]).join('')}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{p.name}</p>
                      <p className="text-gray-400">{p.relation}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {p.faceRegistered ? (
                        <span className="text-green-600" title="Yuz ro'yxatdan o'tgan"><CheckCircle2 className="w-3.5 h-3.5" /></span>
                      ) : (
                        <span className="text-gray-300" title="Yuz ro'yxatdan o'tmagan"><XCircle className="w-3.5 h-3.5" /></span>
                      )}
                      {p.telegram&&<Send className="w-3 h-3 text-blue-400" />}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={()=>{setAddFor(child.id);setShowAddModal(true);}}
                className="w-full py-2 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl flex items-center justify-center gap-1 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Shaxs qo&#39;shish
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Person Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Ruxsatli shaxs qo&#39;shish</h3>
              <button onClick={()=>setShowAddModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To&#39;liq ism</label>
                <input value={newPerson.name} onChange={e=>setNewPerson(p=>({...p,name:e.target.value}))} className="input-field" placeholder="Sardor Karimov" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qarindoshlik</label>
                <select value={newPerson.relation} onChange={e=>setNewPerson(p=>({...p,relation:e.target.value}))} className="input-field">
                  {['Ota','Ona','Buva','Buvi','Aka','Opa','Amaki','Xola','Boshqa'].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input value={newPerson.phone} onChange={e=>setNewPerson(p=>({...p,phone:e.target.value}))} className="input-field" placeholder="+998 90 123 45 67" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telegram (ixtiyoriy)</label>
                <input value={newPerson.telegram} onChange={e=>setNewPerson(p=>({...p,telegram:e.target.value}))} className="input-field" placeholder="@username" />
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="flex items-center gap-2 text-sm">
                  <Camera className="w-4 h-4 text-orange-600" />
                  <span className="text-orange-800 font-medium">Yuz ro&#39;yxatdan o&#39;tkazish</span>
                </div>
                <p className="text-xs text-orange-600 mt-1">Shaxs Hikvision kamera oldida turishi kerak. Ro&#39;yxatga olgach, kamera avtomatik taniydi.</p>
                <button onClick={()=>toast.success('Kamera faollashtirildi. Shaxsni kamera oldiga olib keling.')} className="mt-2 w-full py-2 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600">
                  📷 Kamerani faollashtirish
                </button>
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={()=>setShowAddModal(false)} className="flex-1 btn-secondary">Bekor qilish</button>
              <button onClick={()=>{setShowAddModal(false);toast.success('Shaxs muvaffaqiyatli qo\'shildi!');}} className="flex-1 btn-primary bg-orange-500 hover:bg-orange-600 border-orange-500">
                Qo&#39;shish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
