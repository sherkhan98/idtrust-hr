'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Download, Plus, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const CLASSES = ['5A','5B','6A','6B','7A','7B','8A','8B','9A'];
const SUBJECTS = ['Matematika','Fizika','Ingliz tili','Tarix','Biologiya','Kimyo','Ona tili','Rus tili','Informatika'];

const STUDENTS_5A = [
  'Zafar Toshmatov','Malika Nazarova','Bobur Karimov','Gulnora Rashidova',
  'Jasur Xolmatov','Sabohat Mirzaeva','Otabek Yusupov','Nozima Ergasheva',
];

const WORKING_DAYS = [1,3,5,7,8,10,12,14,15,17,19,21,22,24,26,28,29,31];

type Grade = 5|4|3|2|'N'|'/'|null;

const GRADE_STYLES: Record<string, string> = {
  '5':'bg-green-500 text-white font-bold',
  '4':'bg-green-200 text-green-800 font-bold',
  '3':'bg-yellow-200 text-yellow-800 font-bold',
  '2':'bg-orange-300 text-orange-900 font-bold',
  'N':'bg-red-400 text-white font-bold',
  '/':'bg-gray-200 text-gray-500',
};

function initGrades(): Record<string,Record<number,Grade>> {
  const mock: Record<string,Record<number,Grade>> = {};
  STUDENTS_5A.forEach((s,si) => {
    mock[s] = {};
    WORKING_DAYS.forEach((d) => {
      const r = Math.random();
      if (r < 0.05) mock[s][d] = 'N';
      else if (r < 0.1) mock[s][d] = '/';
      else if (r < 0.15) mock[s][d] = null;
      else {
        const g = [5,5,5,4,4,4,4,3,3,2][Math.floor(Math.random()*10)] as Grade;
        mock[s][d] = g;
      }
    });
  });
  return mock;
}

export default function JournalPage() {
  const [selectedClass, setSelectedClass] = useState('5A');
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  const [month, setMonth] = useState(1);
  const [year] = useState(2024);
  const [grades, setGrades] = useState<Record<string,Record<number,Grade>>>(initGrades);
  const [semGrades, setSemGrades] = useState<Record<string,Grade>>({});
  const [popover, setPopover] = useState<{student:string;day:number}|null>(null);
  const [tab, setTab] = useState<'grades'|'attendance'|'summary'>('grades');

  const MONTHS = ['','Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr'];

  const setGrade = (student: string, day: number, val: Grade) => {
    setGrades((prev) => ({ ...prev, [student]: { ...prev[student], [day]: val } }));
    setPopover(null);
    toast.success('Baho saqlandi');
  };

  const avgGrade = (student: string) => {
    const nums = WORKING_DAYS.map((d) => grades[student]?.[d]).filter((g) => typeof g === 'number') as number[];
    if (!nums.length) return null;
    return (nums.reduce((a,b) => a+b, 0) / nums.length).toFixed(1);
  };

  const absentCount = (student: string) =>
    WORKING_DAYS.filter((d) => grades[student]?.[d] === 'N').length;

  const classAvg = () => {
    const all = STUDENTS_5A.flatMap((s) => WORKING_DAYS.map((d) => grades[s]?.[d]).filter((g) => typeof g === 'number') as number[]);
    if (!all.length) return '—';
    return (all.reduce((a,b) => a+b, 0) / all.length).toFixed(2);
  };

  const GRADE_OPTIONS: Grade[] = [5,4,3,2,'N','/',null];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Elektron Jurnal</h1>
            <p className="text-xs text-gray-500">School Cloud • IDTrust</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast.success('Excel yuklab olindi')} className="btn-secondary flex items-center gap-1.5 text-sm">
            <Download className="w-4 h-4" /> Excel
          </button>
          <button onClick={() => toast.success('Jurnal saqlandi')} className="btn-primary flex items-center gap-1.5 text-sm">
            <Save className="w-4 h-4" /> Saqlash
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Sinf</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="input-field w-24 text-sm">
              {CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Fan</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="input-field w-44 text-sm">
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Oy</label>
            <div className="flex items-center gap-2">
              <button onClick={() => setMonth((m) => Math.max(1,m-1))} className="p-1.5 rounded-lg hover:bg-gray-100 border border-gray-200">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold w-24 text-center">{MONTHS[month]} {year}</span>
              <button onClick={() => setMonth((m) => Math.min(12,m+1))} className="p-1.5 rounded-lg hover:bg-gray-100 border border-gray-200">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-gray-400">O&#39;qituvchi</p>
            <p className="text-sm font-semibold text-gray-800">Gulnora Nazarova</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-4">
        {([['grades','Baholar'],['attendance','Davomat'],['summary','Umumiy']] as const).map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all ${tab===k?'border-green-600 text-green-600':'border-transparent text-gray-500'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Journal Grid */}
      {tab === 'grades' && (
        <div className="bg-white rounded-b-xl border border-gray-100 overflow-x-auto" onClick={() => setPopover(null)}>
          <table className="text-xs border-collapse" style={{ minWidth: '900px' }}>
            <thead>
              <tr className="bg-gray-50">
                <th className="sticky left-0 bg-gray-50 z-10 text-left px-3 py-2.5 font-semibold text-gray-700 border-r border-gray-200 min-w-[160px]">
                  O&#39;quvchi
                </th>
                {WORKING_DAYS.map((d) => (
                  <th key={d} className="px-1 py-2 text-center font-semibold text-gray-500 border-r border-gray-100 w-8">{d}</th>
                ))}
                <th className="px-2 py-2 text-center font-semibold text-gray-600 border-l-2 border-gray-300 bg-blue-50 w-14">O&#39;rt</th>
                <th className="px-2 py-2 text-center font-semibold text-gray-600 border-r border-gray-200 bg-red-50 w-8">N</th>
                <th className="px-2 py-2 text-center font-semibold text-gray-600 bg-yellow-50 w-10">Sem</th>
              </tr>
            </thead>
            <tbody>
              {STUDENTS_5A.map((student, si) => {
                const avg = avgGrade(student);
                const avgNum = avg ? parseFloat(avg) : 0;
                return (
                  <tr key={student} className={`border-b border-gray-50 hover:bg-gray-50 ${si%2===1?'bg-gray-50/30':''}`}>
                    <td className="sticky left-0 bg-white z-10 px-3 py-1.5 font-medium text-gray-800 border-r border-gray-200 truncate max-w-[160px]">
                      {si+1}. {student}
                    </td>
                    {WORKING_DAYS.map((d) => {
                      const g = grades[student]?.[d];
                      const gStr = g === null || g === undefined ? '' : String(g);
                      const isOpen = popover?.student===student && popover?.day===d;
                      return (
                        <td key={d} className="px-0.5 py-0.5 border-r border-gray-100 relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); setPopover(isOpen?null:{student,day:d}); }}
                            className={`w-7 h-7 rounded text-xs flex items-center justify-center transition-all hover:opacity-80 ${gStr ? GRADE_STYLES[gStr] : 'hover:bg-gray-100 text-gray-300'}`}
                          >
                            {gStr || '·'}
                          </button>
                          {isOpen && (
                            <div className="absolute z-30 top-8 left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-1.5 flex gap-1" onClick={(e) => e.stopPropagation()}>
                              {GRADE_OPTIONS.map((opt) => (
                                <button key={String(opt)} onClick={() => setGrade(student,d,opt)}
                                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all hover:scale-110 ${opt===null?'bg-gray-100 text-gray-400 text-[10px]':GRADE_STYLES[String(opt)]}`}>
                                  {opt===null?'∅':opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className={`px-2 py-1.5 text-center font-bold border-l-2 border-gray-300 ${avgNum>=4.5?'text-green-600 bg-green-50':avgNum>=3.5?'text-yellow-600 bg-yellow-50':avgNum>0?'text-red-600 bg-red-50':'text-gray-300 bg-blue-50'}`}>
                      {avg || '—'}
                    </td>
                    <td className="px-2 py-1.5 text-center font-bold text-red-600 bg-red-50 border-r border-gray-200">
                      {absentCount(student)||''}
                    </td>
                    <td className="px-1 py-1">
                      <select value={String(semGrades[student]||'')}
                        onChange={(e) => setSemGrades((p) => ({...p,[student]:e.target.value as Grade}))}
                        className="w-10 text-xs border border-gray-200 rounded px-1 py-0.5 bg-yellow-50 font-bold text-center">
                        <option value="">—</option>
                        {[5,4,3,2].map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-blue-50 border-t-2 border-blue-200">
                <td className="sticky left-0 bg-blue-50 px-3 py-2 font-bold text-blue-800 text-xs border-r border-gray-200">
                  Sinf o&#39;rtacha: {classAvg()}
                </td>
                {WORKING_DAYS.map((d) => {
                  const grades_ = STUDENTS_5A.map((s) => grades[s]?.[d]).filter((g) => typeof g==='number') as number[];
                  const avg = grades_.length ? (grades_.reduce((a,b)=>a+b,0)/grades_.length).toFixed(1) : '';
                  return (
                    <td key={d} className="px-0.5 py-2 text-center text-[10px] font-semibold text-blue-600 border-r border-gray-100">
                      {avg}
                    </td>
                  );
                })}
                <td colSpan={3} />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Attendance Tab */}
      {tab === 'attendance' && (
        <div className="bg-white rounded-b-xl border border-gray-100 p-5">
          <div className="grid grid-cols-4 gap-4 mb-5">
            {[{l:'Jami dars',v:WORKING_DAYS.length},{l:'O\'rtacha davomat',v:'94%'},{l:'Eng ko\'p yo\'qlama',v:'Bobur K. (3 kun)'},{l:'Sinf o\'rtacha baho',v:classAvg()}].map((s)=>(
              <div key={s.l} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400">{s.l}</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{s.v}</p>
              </div>
            ))}
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["O'quvchi","Kelgan","N (yo'q)","/ (dars yo'q)","Davomat %"].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {STUDENTS_5A.map((s,i) => {
                const n = absentCount(s);
                const skip = WORKING_DAYS.filter((d)=>grades[s]?.[d]=='/').length;
                const present = WORKING_DAYS.length-n-skip;
                const pct = Math.round((present/WORKING_DAYS.length)*100);
                return (
                  <tr key={s} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-medium">{i+1}. {s}</td>
                    <td className="py-2.5 px-3 text-green-600 font-semibold">{present}</td>
                    <td className="py-2.5 px-3 text-red-600 font-semibold">{n||'—'}</td>
                    <td className="py-2.5 px-3 text-gray-400">{skip||'—'}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct>=90?'bg-green-500':pct>=75?'bg-yellow-500':'bg-red-500'}`} style={{width:`${pct}%`}} />
                        </div>
                        <span className={`text-xs font-bold ${pct>=90?'text-green-600':pct>=75?'text-yellow-600':'text-red-600'}`}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Tab */}
      {tab === 'summary' && (
        <div className="bg-white rounded-b-xl border border-gray-100 p-5 space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {['5','4','3','2'].map((g) => {
              const count = STUDENTS_5A.filter((s) => {
                const avg = avgGrade(s);
                if (!avg) return false;
                const n = parseFloat(avg);
                if (g==='5') return n>=4.5;
                if (g==='4') return n>=3.5 && n<4.5;
                if (g==='3') return n>=2.5 && n<3.5;
                return n<2.5;
              }).length;
              return (
                <div key={g} className={`rounded-xl p-4 text-center ${GRADE_STYLES[g]}`}>
                  <p className="text-3xl font-bold">{count}</p>
                  <p className="text-sm opacity-80">Baho: {g}</p>
                </div>
              );
            })}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3">O&#39;quvchilar reytingi</p>
            {STUDENTS_5A
              .map((s) => ({ name: s, avg: avgGrade(s) ? parseFloat(avgGrade(s)!) : 0 }))
              .sort((a,b) => b.avg-a.avg)
              .map((item,i) => (
                <div key={item.name} className="flex items-center gap-3 py-2 border-b border-gray-50">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i===0?'bg-yellow-400 text-yellow-900':i===1?'bg-gray-300 text-gray-700':i===2?'bg-orange-300 text-orange-900':'bg-gray-100 text-gray-500'}`}>{i+1}</span>
                  <span className="flex-1 text-sm font-medium text-gray-800">{item.name}</span>
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.avg>=4.5?'bg-green-500':item.avg>=3.5?'bg-blue-500':item.avg>=2.5?'bg-yellow-500':'bg-red-500'}`} style={{width:`${(item.avg/5)*100}%`}} />
                  </div>
                  <span className={`text-sm font-bold w-8 text-right ${item.avg>=4.5?'text-green-600':item.avg>=3.5?'text-blue-600':item.avg>=2.5?'text-yellow-600':'text-red-600'}`}>{item.avg.toFixed(1)}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Grade legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500 bg-white rounded-xl border border-gray-100 p-3">
        <span className="font-semibold">Belgilar:</span>
        {[['5',"A'lo"],['4','Yaxshi'],['3','Qoniqarli'],['2','Qoniqarsiz'],['N',"Yo'q"],['/',"Dars yo'q"]].map(([g,l]) => (
          <span key={g} className="flex items-center gap-1">
            <span className={`w-5 h-5 rounded text-[10px] flex items-center justify-center ${GRADE_STYLES[g]}`}>{g}</span>
            <span>{l}</span>
          </span>
        ))}
        <span className="ml-auto text-gray-400">Katak bosib baho qo&#39;ying</span>
      </div>
    </div>
  );
}
