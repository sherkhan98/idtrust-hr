'use client';

import { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle2, XCircle, AlertTriangle, Send, Camera, Baby, RefreshCw, Bell, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const GROUPS = [
  { id:'g1', name:'Quyosh', emoji:'☀️', age:'3-4 yosh', capacity:20, enrolled:18, teacher:'Mohira Karimova', room:'101', present:15 },
  { id:'g2', name:'Oy', emoji:'🌙', age:'4-5 yosh', capacity:20, enrolled:20, teacher:'Barno Nazarova', room:'102', present:17 },
  { id:'g3', name:'Yulduz', emoji:'⭐', age:'5-6 yosh', capacity:20, enrolled:17, teacher:'Kamola Sobirov', room:'103', present:14 },
  { id:'g4', name:'Kamalak', emoji:'🌈', age:'2-3 yosh', capacity:15, enrolled:12, teacher:'Hulkar Ergasheva', room:'201', present:10 },
];

const CHILDREN = [
  { id:'c1', name:'Ali Toshmatov', group:'Quyosh', age:3, parent:'Akbar Toshmatov', phone:'+998901234567', telegram:'@akbar_t', arrived:'08:15', left:null, status:'PRESENT', avatar:'AT' },
  { id:'c2', name:'Zulfiya Nazarova', group:'Quyosh', age:4, parent:'Doniyor Nazarov', phone:'+998907654321', telegram:'@doniyor_n', arrived:'08:30', left:null, status:'PRESENT', avatar:'ZN' },
  { id:'c3', name:'Hasan Karimov', group:'Oy', age:5, parent:'Alisher Karimov', phone:'+998905555555', telegram:null, arrived:null, left:null, status:'ABSENT', avatar:'HK' },
  { id:'c4', name:'Laylo Mirzayeva', group:'Oy', age:4, parent:'Sarvar Mirzayev', phone:'+998901111111', telegram:'@sarvar_m', arrived:'08:45', left:'14:30', status:'DEPARTED', avatar:'LM' },
  { id:'c5', name:'Bekzod Yusupov', group:'Yulduz', age:6, parent:'Laziz Yusupov', phone:'+998902222222', telegram:'@laziz_y', arrived:'09:00', left:null, status:'PRESENT', avatar:'BY' },
  { id:'c6', name:'Nilufar Ergasheva', group:'Yulduz', age:5, parent:'Sherzod Ergashev', phone:'+998903333333', telegram:'@sherzod_e', arrived:'08:20', left:null, status:'PRESENT', avatar:'NE' },
  { id:'c7', name:'Kamol Sobirov', group:'Kamalak', age:3, parent:'Mansur Sobirov', phone:'+998904444444', telegram:'@mansur_s', arrived:null, left:null, status:'ABSENT', avatar:'KS' },
];

const SCHEDULE = [
  { time:'08:00–09:00', activity:'Bolalar qabuli', icon:'🚪', color:'bg-blue-100' },
  { time:'09:00–09:30', activity:'Nonushta', icon:'🥣', color:'bg-yellow-100' },
  { time:'09:30–10:30', activity:'Rivojlantiruvchi mashg\'ulotlar', icon:'📚', color:'bg-green-100' },
  { time:'10:30–11:30', activity:'Sayr (ochiq havo)', icon:'🌳', color:'bg-emerald-100' },
  { time:'12:00–12:30', activity:'Tushlik', icon:'🍽️', color:'bg-orange-100' },
  { time:'12:30–15:00', activity:'Kunduzgi uyqu', icon:'😴', color:'bg-indigo-100' },
  { time:'15:00–16:00', activity:'O\'yin mashg\'ulotlari', icon:'🎮', color:'bg-purple-100' },
  { time:'16:00–16:30', activity:'Kechki ovqat', icon:'🍵', color:'bg-red-100' },
  { time:'16:30–18:00', activity:'Ketish vaqti', icon:'👋', color:'bg-gray-100' },
];

type LiveEvent = { id: string; name: string; group: string; event: 'ARRIVED'|'DEPARTED'; time: string };

export default function KinderPage() {
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tab, setTab] = useState<'dashboard'|'groups'|'schedule'>('dashboard');

  const arrived = CHILDREN.filter(c=>c.status==='PRESENT'||c.status==='DEPARTED').length;
  const absent = CHILDREN.filter(c=>c.status==='ABSENT').length;
  const departed = CHILDREN.filter(c=>c.status==='DEPARTED').length;
  const total = CHILDREN.length;

  useEffect(() => {
    const names = ['Murod A.','Barno T.','Sardor Y.','Hulkar K.','Zafar M.'];
    const groups = ['Quyosh','Oy','Yulduz','Kamalak'];
    const timer = setInterval(() => {
      const now = new Date();
      const time = now.toLocaleTimeString('uz-UZ',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
      const name = names[Math.floor(Math.random()*names.length)];
      const group = groups[Math.floor(Math.random()*groups.length)];
      const event = Math.random()>0.25?'ARRIVED':'DEPARTED';
      setLiveEvents(p=>[{id:Date.now().toString(),name,group,event,time},...p.slice(0,7)]);
    }, 4500);
    return ()=>clearInterval(timer);
  }, []);

  const refresh = async () => {
    setIsRefreshing(true);
    await new Promise(r=>setTimeout(r,800));
    setIsRefreshing(false);
    toast.success("Ma'lumotlar yangilandi");
  };

  return (
    <div className="space-y-5">
      {/* Header — Orange theme */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Baby className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Bog&#39;cha Boshqaruvi</h1>
              <p className="text-orange-100 text-sm">Kindergarten Cloud • IDTrust</p>
            </div>
          </div>
          <button onClick={refresh} className={`bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all ${isRefreshing?'animate-spin':''}`}>
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { l:"Jami bola", v:total, icon:Users },
            { l:'Keldi', v:arrived, icon:CheckCircle2 },
            { l:'Ketdi', v:departed, icon:Clock },
            { l:'Kelmadi', v:absent, icon:XCircle },
          ].map((s)=>(
            <div key={s.l} className="bg-white/15 rounded-xl p-3 text-center">
              <p className="text-3xl font-bold">{s.v}</p>
              <p className="text-orange-100 text-xs mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Attendance bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-orange-100 mb-1">
            <span>Bugungi davomat</span>
            <span className="font-bold text-white">{Math.round((arrived/total)*100)}%</span>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{width:`${Math.round((arrived/total)*100)}%`}} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1">
        {([['dashboard','Asosiy'],['groups','Guruhlar'],['schedule','Jadval']] as const).map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab===k?'bg-orange-500 text-white shadow':'text-gray-500 hover:text-gray-700'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {tab==='dashboard' && (
        <div className="grid grid-cols-2 gap-5">
          {/* Live Feed */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-gray-800">LIVE — Kirish/Chiqish</span>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {liveEvents.length===0&&<p className="text-sm text-gray-400 text-center py-8">Kutilmoqda...</p>}
              {liveEvents.map(ev=>(
                <div key={ev.id} className={`flex items-center gap-3 p-2.5 rounded-xl text-sm ${ev.event==='ARRIVED'?'bg-green-50 border border-green-100':'bg-blue-50 border border-blue-100'}`}>
                  <span className="text-xl">{ev.event==='ARRIVED'?'✅':'🏠'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{ev.name}</p>
                    <p className="text-xs text-gray-400">{ev.group}</p>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{ev.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Absent alert */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold text-gray-800">Kelmagan bolalar</span>
              <span className="text-xs bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-full">{absent}</span>
            </div>
            <div className="space-y-2">
              {CHILDREN.filter(c=>c.status==='ABSENT').map(c=>(
                <div key={c.id} className="p-3 bg-red-50 border border-red-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center text-xs font-bold text-red-800">{c.avatar}</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.group} • {c.parent}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>toast.success(`${c.parent}ga SMS yuborildi`)}
                      className="flex-1 py-1.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-lg hover:bg-orange-200 flex items-center justify-center gap-1">
                      📱 SMS
                    </button>
                    {c.telegram&&(
                      <button onClick={()=>toast.success(`${c.parent}ga Telegram yuborildi`)}
                        className="flex-1 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-200 flex items-center justify-center gap-1">
                        <Send className="w-3 h-3" /> Telegram
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pickup alert */}
          <div className="col-span-2 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-red-800">⚠️ Ruxsatsiz qabul urinishi aniqlandi</p>
                <p className="text-xs text-red-600 mt-0.5">Noma&#39;lum shaxs Hasan Karimovni olib ketmoqchi (14:25). Ota-onaga xabar yuborildi.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700">Chaqiruv</button>
                <button onClick={()=>toast.success('Xabar yuborildi')} className="px-3 py-1.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-xl hover:bg-orange-200">Bildirishnoma</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Groups Tab */}
      {tab==='groups' && (
        <div className="grid grid-cols-2 gap-4">
          {GROUPS.map(g=>(
            <div key={g.id} className="bg-white rounded-xl border border-gray-100 hover:border-orange-200 transition-all p-4">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-4xl">{g.emoji}</span>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{g.name} guruhi</p>
                  <p className="text-sm text-gray-500">{g.age} • Xona {g.room}</p>
                  <p className="text-xs text-gray-400 mt-0.5">O&#39;qituvchi: {g.teacher}</p>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Bugungi davomat</span>
                  <span className="font-bold text-orange-600">{g.present}/{g.enrolled}</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full" style={{width:`${Math.round((g.present/g.enrolled)*100)}%`}} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="font-bold text-gray-700">{g.enrolled}</p>
                  <p className="text-gray-400">Jami</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <p className="font-bold text-green-700">{g.present}</p>
                  <p className="text-green-500">Keldi</p>
                </div>
                <div className="bg-red-50 rounded-lg p-2">
                  <p className="font-bold text-red-600">{g.enrolled-g.present}</p>
                  <p className="text-red-400">Kelmadi</p>
                </div>
              </div>
              <button onClick={()=>toast.success(`${g.name} guruhi tafsilotlari`)}
                className="mt-3 w-full py-2 bg-orange-50 text-orange-700 text-sm font-semibold rounded-xl hover:bg-orange-100 transition-colors">
                Guruhni ko&#39;rish
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Tab */}
      {tab==='schedule' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm font-bold text-gray-700 mb-4">Bugungi kun tartibi</p>
          <div className="space-y-2">
            {SCHEDULE.map((s,i)=>{
              const now = new Date();
              const [startH] = s.time.split('–')[0].split(':').map(Number);
              const isNow = now.getHours()===startH;
              return (
                <div key={i} className={`flex items-center gap-4 p-3.5 rounded-xl transition-all ${isNow?'border-2 border-orange-300 bg-orange-50 shadow-sm':s.color}`}>
                  <span className="text-2xl">{s.icon}</span>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${isNow?'text-orange-800':'text-gray-800'}`}>{s.activity}</p>
                    <p className="text-xs text-gray-400 font-mono">{s.time}</p>
                  </div>
                  {isNow&&<span className="text-xs bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full">HOZIR</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
