'use client';

import { useState } from 'react';
import { Search, Plus, Phone, Send, Eye, ChevronDown, TrendingUp, X } from 'lucide-react';
import toast from 'react-hot-toast';

const STUDENTS = [
  { id:'s1', name:"Zafar Toshmatov", class:'5A', code:'STU001', parentName:'Akbar Toshmatov', parentTelegram:'@akbar_t', born:'2013-05-12', gender:'MALE', status:'ACTIVE', gpa:4.5, attendance:95, avatar:'ZT' },
  { id:'s2', name:'Malika Nazarova', class:'5A', code:'STU002', parentName:'Doniyor Nazarov', parentTelegram:'@doniyor_n', born:'2013-08-23', gender:'FEMALE', status:'ACTIVE', gpa:4.8, attendance:98, avatar:'MN' },
  { id:'s3', name:'Bobur Karimov', class:'5B', code:'STU003', parentName:'Alisher Karimov', parentTelegram:null, born:'2013-02-14', gender:'MALE', status:'ACTIVE', gpa:3.9, attendance:87, avatar:'BK' },
  { id:'s4', name:'Gulnora Rashidova', class:'5B', code:'STU004', parentName:'Sarvar Rashidov', parentTelegram:'@sarvar_r', born:'2013-11-30', gender:'FEMALE', status:'ACTIVE', gpa:4.2, attendance:92, avatar:'GR' },
  { id:'s5', name:'Jasur Xolmatov', class:'6A', code:'STU005', parentName:'Nodir Xolmatov', parentTelegram:'@nodir_x', born:'2012-07-08', gender:'MALE', status:'ACTIVE', gpa:4.6, attendance:96, avatar:'JX' },
  { id:'s6', name:'Sabohat Mirzaeva', class:'6A', code:'STU006', parentName:'Hamid Mirzayev', parentTelegram:'@hamid_m', born:'2012-03-19', gender:'FEMALE', status:'ACTIVE', gpa:4.9, attendance:99, avatar:'SM' },
  { id:'s7', name:'Otabek Yusupov', class:'6B', code:'STU007', parentName:'Laziz Yusupov', parentTelegram:null, born:'2012-09-25', gender:'MALE', status:'ACTIVE', gpa:3.7, attendance:82, avatar:'OY' },
  { id:'s8', name:'Nozima Ergasheva', class:'7A', code:'STU008', parentName:'Sherzod Ergashev', parentTelegram:'@sherzod_e', born:'2011-12-10', gender:'FEMALE', status:'ACTIVE', gpa:4.4, attendance:94, avatar:'NE' },
  { id:'s9', name:'Dilshod Sobirov', class:'7A', code:'STU009', parentName:'Mansur Sobirov', parentTelegram:'@mansur_s', born:'2011-06-17', gender:'MALE', status:'ACTIVE', gpa:4.1, attendance:89, avatar:'DS' },
  { id:'s10', name:'Barno Tursunova', class:'7B', code:'STU010', parentName:'Zafar Tursunov', parentTelegram:'@zafar_tu', born:'2011-04-03', gender:'FEMALE', status:'ACTIVE', gpa:4.7, attendance:97, avatar:'BT' },
];

const CLASSES = ['Barchasi','5A','5B','6A','6B','7A','7B','8A','8B'];
const COLORS = ['bg-blue-500','bg-green-500','bg-purple-500','bg-orange-500','bg-pink-500','bg-teal-500'];
const getColor = (s: string) => COLORS[s.charCodeAt(0) % COLORS.length];

function GpaColor(gpa: number) {
  if (gpa >= 4.5) return 'text-green-600 bg-green-50';
  if (gpa >= 3.5) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
}

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('Barchasi');
  const [sortBy, setSortBy] = useState<'name'|'gpa'|'attendance'>('name');
  const [selected, setSelected] = useState<typeof STUDENTS[0]|null>(null);

  const filtered = STUDENTS
    .filter(s => (classFilter === 'Barchasi' || s.class === classFilter)
      && (s.name.toLowerCase().includes(search.toLowerCase()) || s.code.includes(search)))
    .sort((a,b) => sortBy === 'gpa' ? b.gpa - a.gpa : sortBy === 'attendance' ? b.attendance - a.attendance : a.name.localeCompare(b.name));

  const avgGpa = (STUDENTS.reduce((s,st) => s+st.gpa, 0) / STUDENTS.length).toFixed(2);
  const avgAtt = Math.round(STUDENTS.reduce((s,st) => s+st.attendance, 0) / STUDENTS.length);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">O&#39;quvchilar</h1>
            <p className="text-xs text-gray-500">School Cloud • {STUDENTS.length} ta o&#39;quvchi</p>
          </div>
        </div>
        <button onClick={() => toast.success("O'quvchi qo'shish")} className="btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> O&#39;quvchi qo&#39;shish
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { l:"Jami", v:STUDENTS.length, c:'bg-green-50 text-green-700' },
          { l:'Aktiv', v:STUDENTS.filter(s=>s.status==='ACTIVE').length, c:'bg-blue-50 text-blue-700' },
          { l:"O'rt. GPA", v:avgGpa+'⭐', c:'bg-yellow-50 text-yellow-700' },
          { l:"O'rt. davomat", v:avgAtt+'%', c:'bg-purple-50 text-purple-700' },
        ].map(s => (
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
          <input value={search} onChange={e=>setSearch(e.target.value)} className="input-field pl-9" placeholder="O'quvchi qidirish..." />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {CLASSES.map(c => (
            <button key={c} onClick={() => setClassFilter(c)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${classFilter===c?'bg-green-600 text-white':'bg-white border border-gray-200 text-gray-600'}`}>
              {c}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value as any)} className="input-field w-40 text-sm">
          <option value="name">Ism bo&#39;yicha</option>
          <option value="gpa">GPA bo&#39;yicha</option>
          <option value="attendance">Davomat bo&#39;yicha</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["O'quvchi", 'Sinf', 'Ota-ona', 'GPA', 'Davomat', 'Amal'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(st => (
              <tr key={st.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(st)}>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 ${getColor(st.avatar)} rounded-lg text-white text-xs font-bold flex items-center justify-center`}>{st.avatar}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{st.name}</p>
                      <p className="text-xs text-gray-400">{st.code}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4"><span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">{st.class}</span></td>
                <td className="py-3 px-4">
                  <p className="text-sm text-gray-700">{st.parentName}</p>
                  {st.parentTelegram && <p className="text-xs text-blue-500">{st.parentTelegram}</p>}
                </td>
                <td className="py-3 px-4">
                  <span className={`text-sm font-bold px-2 py-0.5 rounded-lg ${GpaColor(st.gpa)}`}>{st.gpa}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${st.attendance>=90?'bg-green-500':st.attendance>=75?'bg-yellow-500':'bg-red-500'}`} style={{width:`${st.attendance}%`}} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">{st.attendance}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1" onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>setSelected(st)} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><Eye className="w-3.5 h-3.5" /></button>
                    {st.parentTelegram && <button onClick={()=>toast.success(`${st.parentName}ga xabar yuborildi`)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Send className="w-3.5 h-3.5" /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-5 rounded-t-2xl text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getColor(selected.avatar)} rounded-xl flex items-center justify-center font-bold text-white`}>{selected.avatar}</div>
                  <div>
                    <p className="font-bold text-lg">{selected.name}</p>
                    <p className="text-white/70 text-sm">{selected.class} sinf • {selected.code}</p>
                  </div>
                </div>
                <button onClick={()=>setSelected(null)}><X className="w-5 h-5 text-white/70" /></button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  {l:'GPA',v:selected.gpa+'⭐'},
                  {l:'Davomat',v:selected.attendance+'%'},
                  {l:"Tug'ilgan sana",v:selected.born},
                  {l:'Jins',v:selected.gender==='MALE'?"O'g'il":"Qiz"},
                ].map(i=>(
                  <div key={i.l} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">{i.l}</p>
                    <p className="font-semibold text-gray-800 mt-0.5">{i.v}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="text-xs font-semibold text-blue-700 mb-1">Ota-ona</p>
                <p className="font-semibold text-gray-900">{selected.parentName}</p>
                {selected.parentTelegram && <p className="text-xs text-blue-600 mt-0.5">{selected.parentTelegram}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={()=>toast.success("Ota-onaga Telegram xabar yuborildi")}
                  className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-1.5">
                  <Send className="w-4 h-4" /> Telegram
                </button>
                <button onClick={()=>toast.success("Qo'ng'iroq qilinmoqda")}
                  className="flex-1 py-2.5 bg-green-50 text-green-700 text-sm font-semibold rounded-xl hover:bg-green-100 flex items-center justify-center gap-1.5">
                  <Phone className="w-4 h-4" /> Qo&#39;ng&#39;iroq
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
