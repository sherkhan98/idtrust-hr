'use client';

import { useState, useRef, useEffect } from 'react';
import { Hash, Send, Paperclip, Smile, Search, Plus, Circle, Bell, Settings, ChevronDown, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const CHANNELS = [
  { id:'c1', name:'Umumiy', unread:3, lastMsg:"Yangi qoidalar haqida...", lastTime:'14:32', pinned:true },
  { id:'c2', name:"IT Bo'limi", unread:0, lastMsg:'Deploy 18:00 da', lastTime:'13:15', pinned:false },
  { id:'c3', name:'HR Yangiliklari', unread:1, lastMsg:'Oylik maosh haqida...', lastTime:'11:00', pinned:true },
  { id:'c4', name:'Marketing', unread:0, lastMsg:'Kampaniya natijasi', lastTime:'Kecha', pinned:false },
  { id:'c5', name:'Savdo', unread:5, lastMsg:'Yangi lead bor!', lastTime:'10:20', pinned:false },
];

const DIRECT = [
  { id:'d1', name:'Alisher Karimov', role:'CEO', unread:1, lastMsg:'Hisobotni ko\'rdim, yaxshi!', lastTime:'15:01', online:true, avatar:'AK' },
  { id:'d2', name:'Malika Yusupova', role:'HR', unread:0, lastMsg:'Rahmat!', lastTime:'12:30', online:true, avatar:'MY' },
  { id:'d3', name:'Sardor Toshmatov', role:'Dev', unread:2, lastMsg:'Bug topildi', lastTime:'10:45', online:false, avatar:'ST' },
  { id:'d4', name:'Bobur Rakhimov', role:'Moliya', unread:0, lastMsg:'OK', lastTime:'Kecha', online:false, avatar:'BR' },
];

const INIT_MESSAGES = [
  { id:'m1', sender:'Alisher Karimov', avatar:'AK', text:'Hammaga salom! Bu hafta juda yaxshi ishlayapmiz 💪', time:'14:30', isMine:false, reactions:['👍','👍','❤️'] },
  { id:'m2', sender:'Sardor Toshmatov', avatar:'ST', text:'Ha, yangi feature ham tayyor! Deploy kechga tayyor', time:'14:31', isMine:false, reactions:[] },
  { id:'m3', sender:'Men', avatar:'SN', text:'Ajoyib! Dashboard demo ishlayaptimi?', time:'14:32', isMine:true, reactions:[] },
  { id:'m4', sender:'Alisher Karimov', avatar:'AK', text:'Ha, barcha test o\'tdi ✅ Rahmat hammaga!', time:'14:33', isMine:false, reactions:['🎉','🎉'] },
  { id:'m5', sender:'Men', avatar:'SN', text:'Zo\'r, ertaga deploy qilamiz', time:'14:34', isMine:true, reactions:[] },
  { id:'m6', sender:'Malika Yusupova', avatar:'MY', text:'Yangi xodimlar uchun onboarding jadvalini qo\'shdim, ko\'rib chiqinglar 📋', time:'14:35', isMine:false, reactions:['👍'] },
];

const MEMBERS = [
  { name:'Alisher Karimov', role:'CEO', online:true, avatar:'AK' },
  { name:'Malika Yusupova', role:'HR Manager', online:true, avatar:'MY' },
  { name:'Sardor Toshmatov', role:'Senior Dev', online:false, avatar:'ST' },
  { name:'Dilnoza Karimova', role:'Designer', online:true, avatar:'DK' },
  { name:'Bobur Rakhimov', role:'Accountant', online:false, avatar:'BR' },
  { name:'Jasur Mirzayev', role:'Sales Lead', online:true, avatar:'JM' },
];

type Message = typeof INIT_MESSAGES[0];

const COLORS = ['bg-blue-500','bg-green-500','bg-purple-500','bg-orange-500','bg-pink-500','bg-teal-500'];
const getColor = (name: string) => COLORS[name.charCodeAt(0) % COLORS.length];

export default function MessagesPage() {
  const [activeId, setActiveId] = useState('c1');
  const [activeType, setActiveType] = useState<'channel'|'dm'>('channel');
  const [messages, setMessages] = useState<Message[]>(INIT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [channels, setChannels] = useState(CHANNELS);
  const [directs, setDirects] = useState(DIRECT);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeCh = channels.find(c=>c.id===activeId);
  const activeDm = directs.find(d=>d.id===activeId);
  const activeName = activeType==='channel' ? `#${activeCh?.name}` : activeDm?.name || '';

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:'smooth'}); }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: 'm'+Date.now(), sender:'Men', avatar:'SN',
      text: inputText.trim(), time: new Date().toLocaleTimeString('uz-UZ',{hour:'2-digit',minute:'2-digit'}),
      isMine: true, reactions: [],
    };
    setMessages(p=>[...p,newMsg]);
    setInputText('');
    // Simulate reply
    setTyping(true);
    setTimeout(()=>{
      const replies = ['Tushunarli 👍','Rahmat!','OK, ko\'rib chiqaman','Zo\'r fikr!','Ha, to\'g\'ri','✅'];
      const senders = MEMBERS.filter(m=>!m.name.includes('Men'));
      const s = senders[Math.floor(Math.random()*senders.length)];
      setMessages(p=>[...p,{
        id:'m'+Date.now()+'r', sender:s.name, avatar:s.avatar,
        text:replies[Math.floor(Math.random()*replies.length)],
        time:new Date().toLocaleTimeString('uz-UZ',{hour:'2-digit',minute:'2-digit'}),
        isMine:false, reactions:[],
      }]);
      setTyping(false);
    }, 1500+Math.random()*1000);
  };

  const switchChannel = (id: string, type: 'channel'|'dm') => {
    setActiveId(id);
    setActiveType(type);
    if(type==='channel') setChannels(p=>p.map(c=>c.id===id?{...c,unread:0}:c));
    if(type==='dm') setDirects(p=>p.map(d=>d.id===id?{...d,unread:0}:d));
    setMessages(INIT_MESSAGES.slice(Math.floor(Math.random()*3)));
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-60 flex-shrink-0 bg-gray-900 text-white flex flex-col">
        {/* Workspace header */}
        <div className="px-4 py-3.5 border-b border-gray-700 flex items-center justify-between">
          <div>
            <p className="font-bold text-sm">Nexus Group</p>
            <p className="text-xs text-gray-400">IDTrust Chat</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          {/* Search */}
          <div className="px-3 mb-3">
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-1.5">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <input placeholder="Qidirish..." className="bg-transparent text-xs text-gray-200 outline-none flex-1 placeholder-gray-500" />
            </div>
          </div>

          {/* Channels */}
          <div className="mb-4">
            <div className="flex items-center justify-between px-3 mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Kanallar</span>
              <button onClick={()=>toast.success("Yangi kanal yaratildi")} className="text-gray-400 hover:text-white">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {channels.map(c=>(
              <button key={c.id} onClick={()=>switchChannel(c.id,'channel')}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-800 transition-colors ${activeId===c.id&&activeType==='channel'?'bg-blue-600 hover:bg-blue-600':''}`}>
                <Hash className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className={`flex-1 text-left truncate ${c.unread>0?'font-semibold text-white':'text-gray-300'}`}>{c.name}</span>
                {c.unread>0&&<span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{c.unread}</span>}
              </button>
            ))}
          </div>

          {/* Direct Messages */}
          <div>
            <div className="flex items-center justify-between px-3 mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">To&#39;g&#39;ridan-to&#39;g&#39;ri</span>
              <button onClick={()=>toast.success('Yangi xabar')} className="text-gray-400 hover:text-white">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {directs.map(d=>(
              <button key={d.id} onClick={()=>switchChannel(d.id,'dm')}
                className={`w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-800 transition-colors ${activeId===d.id&&activeType==='dm'?'bg-blue-600 hover:bg-blue-600':''}`}>
                <div className="relative flex-shrink-0">
                  <div className={`w-6 h-6 ${getColor(d.avatar)} rounded-md flex items-center justify-center text-[10px] font-bold text-white`}>{d.avatar}</div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-gray-900 ${d.online?'bg-green-400':'bg-gray-500'}`} />
                </div>
                <span className={`flex-1 text-sm text-left truncate ${d.unread>0?'font-semibold text-white':'text-gray-300'}`}>{d.name}</span>
                {d.unread>0&&<span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{d.unread}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* User footer */}
        <div className="px-3 py-2.5 border-t border-gray-700 flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">SN</div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-gray-900" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Sherzod Nazarov</p>
            <p className="text-[10px] text-gray-400">Faol</p>
          </div>
          <Settings className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            {activeType==='channel'?<Hash className="w-4 h-4 text-gray-400" />:<div className="w-2 h-2 bg-green-400 rounded-full" />}
            <span className="font-bold text-gray-900">{activeName}</span>
            {activeType==='channel'&&<span className="text-xs text-gray-400">{MEMBERS.length} a&#39;zo</span>}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Search className="w-4 h-4 text-gray-400" /></button>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Bell className="w-4 h-4 text-gray-400" /></button>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Users className="w-4 h-4 text-gray-400" /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map(msg=>(
            <div key={msg.id} className={`flex items-start gap-3 ${msg.isMine?'flex-row-reverse':''}`}>
              {!msg.isMine && (
                <div className={`w-8 h-8 ${getColor(msg.avatar)} rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5`}>{msg.avatar}</div>
              )}
              <div className={`max-w-[70%] ${msg.isMine?'items-end':'items-start'} flex flex-col gap-1`}>
                {!msg.isMine&&<span className="text-xs font-semibold text-gray-600">{msg.sender}</span>}
                <div className={`px-3.5 py-2.5 rounded-2xl text-sm ${msg.isMine?'bg-blue-600 text-white rounded-tr-sm':'bg-gray-100 text-gray-800 rounded-tl-sm'}`}>
                  {msg.text}
                </div>
                {msg.reactions.length>0&&(
                  <div className="flex gap-1">
                    {Array.from(new Set(msg.reactions)).map((r,i)=>(
                      <span key={i} className="text-xs bg-white border border-gray-200 rounded-full px-1.5 py-0.5 cursor-pointer hover:bg-gray-50">
                        {r} {msg.reactions.filter(x=>x===r).length}
                      </span>
                    ))}
                  </div>
                )}
                <span className="text-[10px] text-gray-400">{msg.time}</span>
              </div>
            </div>
          ))}
          {typing&&(
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center text-xs font-bold">...</div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5">
                <div className="flex gap-1">
                  {[0,1,2].map(i=><div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 px-4 py-2.5">
            <button onClick={()=>{setInputText(p=>p+'😊');inputRef.current?.focus();}} className="text-gray-400 hover:text-gray-600">
              <Smile className="w-5 h-5" />
            </button>
            <input
              ref={inputRef}
              value={inputText}
              onChange={e=>setInputText(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}}}
              placeholder={`${activeName} kanaliga yozing...`}
              className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
            />
            <button onClick={()=>{toast.success('Fayl yuborildi 📎')}} className="text-gray-400 hover:text-gray-600">
              <Paperclip className="w-5 h-5" />
            </button>
            <button onClick={sendMessage}
              className={`p-1.5 rounded-lg transition-all ${inputText.trim()?'bg-blue-600 text-white hover:bg-blue-700':'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Members Panel */}
      <div className="w-48 flex-shrink-0 border-l border-gray-100 bg-gray-50 overflow-y-auto">
        <div className="p-3 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">A&#39;zolar ({MEMBERS.length})</p>
        </div>
        <div className="p-2 space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase px-2 mb-1">Faol — {MEMBERS.filter(m=>m.online).length}</p>
          {MEMBERS.filter(m=>m.online).map(m=>(
            <div key={m.name} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white cursor-pointer">
              <div className="relative flex-shrink-0">
                <div className={`w-7 h-7 ${getColor(m.avatar)} rounded-lg flex items-center justify-center text-[10px] font-bold text-white`}>{m.avatar}</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-gray-50" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{m.name.split(' ')[0]}</p>
                <p className="text-[10px] text-gray-400 truncate">{m.role}</p>
              </div>
            </div>
          ))}
          <p className="text-[10px] font-bold text-gray-400 uppercase px-2 mt-2 mb-1">Oflayn — {MEMBERS.filter(m=>!m.online).length}</p>
          {MEMBERS.filter(m=>!m.online).map(m=>(
            <div key={m.name} className="flex items-center gap-2 px-2 py-1.5 rounded-lg opacity-50">
              <div className={`w-7 h-7 ${getColor(m.avatar)} rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>{m.avatar}</div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">{m.name.split(' ')[0]}</p>
                <p className="text-[10px] text-gray-400 truncate">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
