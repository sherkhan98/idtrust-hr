'use client';

import { useState } from 'react';
import { Search, Plus, Star, Phone, Send, Calendar, BookOpen, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';

const TEACHERS = [
  { id:'t1',name:'Gulnora Nazarova',subject:'Matematika',classes:['5A','6A','7B'],phone:'+998901234567',telegram:'@gulnora_n',experience:8,rating:4.8,status:'ACTIVE',salary:4500000,avatar:'GN',color:'bg-blue-500' },
  { id:'t2',name:'Sardor Toshmatov',subject:'Fizika',classes:['8A','9B','10A'],phone:'+998907654321',telegram:'@sardor_t',experience:12,rating:4.9,status:'ACTIVE',salary:5200000,avatar:'ST',color:'bg-purple-500' },
  { id:'t3',name:'Malika Yusupova',subject:'Ingliz tili',classes:['5A','5B','6A','6B'],phone:'+998905555555',telegram:'@malika_y',experience:5,rating:4.7,status:'ACTIVE',salary:4200000,avatar:'MY',color:'bg-pink-500' },
  { id:'t4',name:'Bobur Rakhimov',subject:'Tarix',classes:['7A','8B','9A'],phone:'+998901111111',telegram:null,experience:15,rating:4.6,status:'ACTIVE',salary:4800000,avatar:'BR',color:'bg-orange-500' },
  { id:'t5',name:'Dilnoza Karimova',subject:'Biologiya',classes:['6A','7B'],phone:'+998902222222',telegram:'@dilnoza_k',experience:3,rating:4.5,status:'ON_LEAVE',salary:3900000,avatar:'DK',color:'bg-green-500' },
  { id:'t6',name:'Jasur Mirzayev',subject:'Kimyo',classes:['9A','10A','11B'],phone:'+998903333333',telegram:'@jasur_m',experience:7,rating:4.7,status:'ACTIVE',salary:4600000,avatar:'JM',color:'bg-teal-500' },
  { id:'t7',name:'Nilufar Ergasheva',subject:'Rus tili',classes:['5B','6B','7A'],phone:'+998904444444',telegram:'@nilufar_e',experience:10,rating:4.8,status:'ACTIVE',salary:4400000,avatar:'NE',color:'bg-indigo-500' },
  { id:'t8',name:'Kamol Nazarov',subject:'Jismoniy tarbiya',classes:['All'],phone:'+998906666666',telegram:null,experience:6,rating:4.3,status:'ACTIVE',salary:3700000,avatar:'KN',color:'bg-red-500' },
];

const SUBJECT_COLORS: Record<string,string> = {
  'Matematika':'bg-blue-100 text-blue-700','Fizika':'bg-purple-100 text-purple-700',
  'Ingliz tili':'bg-pink-100 text-pink-700','Tarix':'bg-orange-100 text-orange-700',
  'Biologiya':'bg-green-100 text-green-700','Kimyo':'bg-teal-100 text-teal-700',
  'Rus tili':'bg-indigo-100 text-indigo-700','Jismoniy tarbiya':'bg-red-100 text-red-700',
};

type Teacher = typeof TEACHERS[0];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className={`w-3 h-3 ${i<=Math.floor(rating)?'fill-yellow-400 text-yellow-400':'text-gray-200'}`} />
      ))}
      <span className="text-xs font-semibold text-gray-600 ml-0.5">{rating}</span>
    </div>
  );
}

export default function TeachersPage() {
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [selected, setSelected] = useState<Teacher|null>(null);

  const filtered = TEACHERS.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubj = !subjectFilter || t.subject === subjectFilter;
    return matchSearch && matchSubj;
  });

  const fmt = (n: number) => n.toLocaleString('uz-UZ') + ' so\'m';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">O&#39;qituvchilar</h1>
            <p className="text-xs text-gray-500">School Cloud • {TEACHERS.length} ta o&#39;qituvchi</p>
          </div>
        </div>
        <button onClick={() => toast.success("O'qituvchi qo'shish oynasi")} className="btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> O&#39;qituvchi qo&#39;shish
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { l:"Jami o'qituvchi", v: TEACHERS.length, c:'bg-green-50 text-green-700' },
          { l:'Aktiv', v: TEACHERS.filter(t=>t.status==='ACTIVE').length, c:'bg-blue-50 text-blue-700' },
          { l:"Ta'tilda", v: TEACHERS.filter(t=>t.status==='ON_LEAVE').length, c:'bg-yellow-50 text-yellow-700' },
          { l:"O'rt. reyting", v: (TEACHERS.reduce((a,t)=>a+t.rating,0)/TEACHERS.length).toFixed(1)+'⭐', c:'bg-orange-50 text-orange-700' },
        ].map((s) => (
          <div key={s.l} className={`${s.c.split(' ')[0]} rounded-xl p-4`}>
            <p className="text-xs text-gray-500">{s.l}</p>
            <p className={`text-2xl font-bold ${s.c.split(' ')[1]} mt-1`}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" placeholder="O'qituvchi qidirish..." />
        </div>
        <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="input-field w-44">
          <option value="">Barcha fanlar</option>
          {Array.from(new Set(TEACHERS.map(t=>t.subject))).map(s=><option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${t.color} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SUBJECT_COLORS[t.subject]||'bg-gray-100 text-gray-600'}`}>{t.subject}</span>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.status==='ACTIVE'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>
                  {t.status==='ACTIVE'?'Aktiv':"Ta'tilda"}
                </span>
              </div>

              <StarRating rating={t.rating} />

              <div className="mt-3 flex flex-wrap gap-1">
                {t.classes.slice(0,4).map(c=>(
                  <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{c}</span>
                ))}
                {t.classes.length>4&&<span className="text-xs text-gray-400">+{t.classes.length-4}</span>}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">{t.experience} yil tajriba</p>
                  <p className="text-sm font-bold text-gray-800">{fmt(t.salary)}</p>
                </div>
                <div className="flex gap-1">
                  {t.telegram && (
                    <a href={`https://t.me/${t.telegram.slice(1)}`} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100">
                      <Send className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button onClick={() => setSelected(t)}
                    className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-100 transition-colors">
                    Ko&#39;rish
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className={`${selected.color} p-5 rounded-t-2xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg">{selected.avatar}</div>
                  <div>
                    <p className="text-white font-bold text-lg">{selected.name}</p>
                    <p className="text-white/80 text-sm">{selected.subject}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { l:'Tajriba', v:`${selected.experience} yil` },
                  { l:'Reyting', v:`⭐ ${selected.rating}` },
                  { l:'Maosh', v:fmt(selected.salary) },
                  { l:'Holat', v:selected.status==='ACTIVE'?'Aktiv':"Ta'tilda" },
                ].map((item) => (
                  <div key={item.l} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">{item.l}</p>
                    <p className="font-semibold text-gray-800 mt-0.5">{item.v}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Sinflar</p>
                <div className="flex flex-wrap gap-2">
                  {selected.classes.map(c=>(
                    <span key={c} className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">{c}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Bog&#39;lanish</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{selected.phone}</span>
                  </div>
                  {selected.telegram && (
                    <div className="flex items-center gap-2 p-2.5 bg-blue-50 rounded-xl">
                      <Send className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-700">{selected.telegram}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Bu hafta dars jadvali</p>
                <div className="space-y-1">
                  {['Du','Se','Ch','Pa','Ju'].map((day,i) => (
                    <div key={day} className="flex items-center gap-2 text-sm">
                      <span className="w-8 font-medium text-gray-500">{day}</span>
                      {i<3 ? (
                        <div className="flex gap-1">
                          {[2,3,4].slice(0,i+1).map((p) => (
                            <span key={p} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                              {p}-dars ({selected.classes[p%selected.classes.length]})
                            </span>
                          ))}
                        </div>
                      ) : <span className="text-gray-300 text-xs">Dars yo&#39;q</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => { toast.success('Telegram xabar yuborildi'); setSelected(null); }}
                  className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-1.5">
                  <Send className="w-4 h-4" /> Telegram
                </button>
                <button onClick={() => toast.success('Dars jadvali ko\'rilmoqda')}
                  className="flex-1 py-2.5 bg-green-50 text-green-700 text-sm font-semibold rounded-xl hover:bg-green-100 flex items-center justify-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Jadval
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
