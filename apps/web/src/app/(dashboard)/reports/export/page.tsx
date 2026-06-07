'use client';

import { useState } from 'react';
import { Download, CheckSquare, Square, FileSpreadsheet, FileText, File, Archive, Check, X, ChevronDown, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

type ReportFormat = 'Excel' | 'PDF' | 'XML' | 'ZIP';

interface Report {
  id: string;
  name: string;
  desc: string;
  format: ReportFormat;
  size: string;
  lastGen: string;
  category: string;
  sensitive?: boolean;
}

const REPORTS: Report[] = [
  // Xodimlar
  { id:'r1', name:"Umumiy xodimlar ro'yxati", desc:'Barcha aktiv xodimlar ma\'lumotlari', format:'Excel', size:'~85 KB', lastGen:'28 May 2024', category:'Xodimlar' },
  { id:'r2', name:"Mehnat shartnomalar ro'yxati", desc:'Barcha shartnomalar va muddatlar', format:'PDF', size:'~210 KB', lastGen:'25 May 2024', category:'Xodimlar' },
  { id:'r3', name:'PINFL va pasport ma\'lumotlar', desc:'Maxfiy — shaxsiy hujjatlar', format:'Excel', size:'~60 KB', lastGen:'28 May 2024', category:'Xodimlar', sensitive:true },
  { id:'r4', name:"Ishdan bo'shatilganlar tarixi", desc:"2024 yil bo'yicha", format:'Excel', size:'~45 KB', lastGen:'28 May 2024', category:'Xodimlar' },
  // Maosh va soliq
  { id:'r5', name:'Oylik maosh hisobi', desc:'DXH formatida, soliq hisobiylari bilan', format:'Excel', size:'~120 KB', lastGen:'28 May 2024', category:'Maosh' },
  { id:'r6', name:'JSHIR to\'lovlari hisoboti', desc:"Yanvar - May 2024", format:'PDF', size:'~95 KB', lastGen:'28 May 2024', category:'Maosh' },
  { id:'r7', name:'INPS to\'lovlari hisoboti', desc:'Pensiya ajratmalari', format:'PDF', size:'~78 KB', lastGen:'28 May 2024', category:'Maosh' },
  { id:'r8', name:'Soliq deklaratsiyasi', desc:'DXH uchun XML formatida', format:'XML', size:'~35 KB', lastGen:'28 May 2024', category:'Maosh' },
  // Davomat
  { id:'r9', name:'Oylik davomat jadvali', desc:'Barcha xodimlar, May 2024', format:'Excel', size:'~150 KB', lastGen:'28 May 2024', category:'Davomat' },
  { id:'r10', name:'Kech kelish protokoli', desc:'May 2024, sanalar va daqiqalar', format:'PDF', size:'~65 KB', lastGen:'28 May 2024', category:'Davomat' },
  { id:'r11', name:"Qo'shimcha ish vaqti", desc:'Ortiqcha soatlar hisoboti', format:'Excel', size:'~55 KB', lastGen:'27 May 2024', category:'Davomat' },
  { id:'r12', name:"Kasallik va ta'til", desc:"Ta'til turlari va kunlar", format:'Excel', size:'~80 KB', lastGen:'28 May 2024', category:'Davomat' },
  // Mehnat inspeksiyasi
  { id:'r13', name:'Mehnat daftarchalari to\'plami', desc:'To\'liq mehnat tarixi', format:'PDF', size:'~420 KB', lastGen:'25 May 2024', category:'Inspeksiya' },
  { id:'r14', name:'Xavfsizlik briefing tasdiqlari', desc:'Barcha imzolangan xavfsizlik hujjatlari', format:'PDF', size:'~180 KB', lastGen:'28 May 2024', category:'Inspeksiya' },
  { id:'r15', name:'Malaka oshirish sertifikatlari', desc:'2023-2024 yillar', format:'PDF', size:'~95 KB', lastGen:'20 May 2024', category:'Inspeksiya' },
  // Davlat statistikasi
  { id:'r16', name:'1-MEHNAT choraklik shakl', desc:'Statistika qo\'mitasi uchun', format:'XML', size:'~28 KB', lastGen:'28 May 2024', category:'Statistika' },
  { id:'r17', name:'Mehnat bozori ma\'lumotlari', desc:'Ish haqi va bandlik statistikasi', format:'XML', size:'~22 KB', lastGen:'28 May 2024', category:'Statistika' },
];

const CATEGORIES = ['Barchasi', 'Xodimlar', 'Maosh', 'Davomat', 'Inspeksiya', 'Statistika'];
const FORMAT_ICONS: Record<ReportFormat, { icon: any; color: string; bg: string }> = {
  Excel: { icon: FileSpreadsheet, color: 'text-green-700', bg: 'bg-green-100' },
  PDF: { icon: FileText, color: 'text-red-700', bg: 'bg-red-100' },
  XML: { icon: File, color: 'text-blue-700', bg: 'bg-blue-100' },
  ZIP: { icon: Archive, color: 'text-gray-700', bg: 'bg-gray-100' },
};

export default function ExportPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [period, setPeriod] = useState('Bu oy');

  const filtered = REPORTS.filter(r => activeCategory === 'Barchasi' || r.category === activeCategory);
  const grouped = CATEGORIES.slice(1).reduce((acc, cat) => {
    const items = filtered.filter(r => r.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {} as Record<string, Report[]>);

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleCategory = (cat: string) => {
    const ids = REPORTS.filter(r => r.category === cat).map(r => r.id);
    const allSelected = ids.every(id => selected.has(id));
    setSelected(prev => {
      const next = new Set(prev);
      ids.forEach(id => allSelected ? next.delete(id) : next.add(id));
      return next;
    });
  };

  const simulateDownload = (id: string, name: string) => {
    setDownloading(id);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setDownloading(null);
          toast.success(`"${name}" yuklab olindi!`);
          return 0;
        }
        return p + 8;
      });
    }, 80);
  };

  const downloadSelected = () => {
    if (!selected.size) { toast.error('Hujjat tanlanmadi'); return; }
    toast.success(`${selected.size} ta hujjat ZIP arxivga yuklanmoqda...`);
    setTimeout(() => toast.success('Arxiv tayyor! archive_2024.zip'), 2000);
    setSelected(new Set());
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-navy-600 bg-gray-800 rounded-xl flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Eksport va Hisobotlar</h1>
            <p className="text-xs text-gray-500">Davlat tekshiruvi uchun tayyor format — bir tugma</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select value={period} onChange={e=>setPeriod(e.target.value)} className="input-field w-40 text-sm">
            {['Bu oy','Bu chorak','Bu yil','2023 yil'].map(p=><option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {CATEGORIES.map(cat=>(
          <button key={cat} onClick={()=>setActiveCategory(cat)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${activeCategory===cat?'bg-gray-900 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {cat}
            {cat!=='Barchasi'&&<span className="ml-1.5 text-xs opacity-60">{REPORTS.filter(r=>r.category===cat).length}</span>}
          </button>
        ))}
      </div>

      {/* Alert */}
      <div className="flex items-center gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-sm">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <p className="text-amber-800">
          <strong>Maxfiy hujjatlar</strong> 🔒 — PINFL va pasport ma&#39;lumotlarni yuklab olish audit logga yoziladi.
          Faqat vakolatli xodimlarga ko&#39;rsating.
        </p>
      </div>

      {/* Reports by category */}
      {Object.entries(grouped).map(([cat, reports]) => {
        const allSel = reports.every(r => selected.has(r.id));
        return (
          <div key={cat} className="bg-white rounded-xl border border-gray-100">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleCategory(cat)} className="flex items-center gap-2">
                  {allSel
                    ? <CheckSquare className="w-4 h-4 text-blue-600" />
                    : <Square className="w-4 h-4 text-gray-400" />}
                  <span className="font-bold text-gray-800">{cat}</span>
                </button>
                <span className="text-xs text-gray-400">{reports.length} ta hujjat</span>
              </div>
              <button onClick={() => toggleCategory(cat)} className="text-xs text-blue-600 font-semibold">
                {allSel ? 'Barchasini olib tashlash' : 'Barchasini tanlash'}
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {reports.map(r => {
                const fmt = FORMAT_ICONS[r.format];
                const isSel = selected.has(r.id);
                const isDl = downloading === r.id;
                return (
                  <div key={r.id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors ${isSel ? 'bg-blue-50/50' : ''}`}>
                    <button onClick={() => toggle(r.id)} className="flex-shrink-0">
                      {isSel
                        ? <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                        : <div className="w-5 h-5 border-2 border-gray-300 rounded" />}
                    </button>
                    <div className={`w-9 h-9 ${fmt.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <fmt.icon className={`w-4.5 h-4.5 ${fmt.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 text-sm">{r.name}</p>
                        {r.sensitive && <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">🔒 MAXFIY</span>}
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${fmt.bg} ${fmt.color}`}>{r.format}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{r.desc} • {r.size} • Yaratilgan: {r.lastGen}</p>
                    </div>
                    {isDl ? (
                      <div className="w-28 flex-shrink-0">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-[10px] text-blue-600 mt-0.5 text-center">{progress}%</p>
                      </div>
                    ) : (
                      <button onClick={() => simulateDownload(r.id, r.name)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg flex-shrink-0 flex items-center gap-1 transition-colors">
                        <Download className="w-3.5 h-3.5" /> Yuklab olish
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Gov integrations */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-sm font-bold text-gray-800 mb-4">🏛️ Davlat organlariga avtomatik yuborish</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { name:'DXH (Soliq idorasi)', desc:'Maosh va soliq hisobotlari', status:'connected', color:'text-green-700 bg-green-100' },
            { name:'Mehnat inspeksiyasi', desc:'Mehnat daftarchalari va hisobotlar', status:'pending', color:'text-yellow-700 bg-yellow-100' },
            { name:"Statistika qo'mitasi", desc:'1-MEHNAT shakli va boshqalar', status:'pending', color:'text-yellow-700 bg-yellow-100' },
          ].map(org => (
            <div key={org.name} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-gray-900 text-sm">{org.name}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${org.color}`}>
                  {org.status==='connected'?'✓ Ulangan':'⚠ Sozlanmagan'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3">{org.desc}</p>
              {org.status==='connected'
                ? <button onClick={()=>toast.success('Hisobot yuborildi!')} className="w-full py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-100">Hisobot yuborish</button>
                : <button onClick={()=>toast('Sozlamalar sahifasiga o\'tish', {icon:'⚙️'})} className="w-full py-1.5 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-lg hover:bg-yellow-100">Sozlash</button>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Fixed bottom bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded-2xl shadow-2xl px-6 py-3.5 flex items-center gap-4 z-50">
          <span className="text-sm font-semibold">{selected.size} ta hujjat tanlandi</span>
          <button onClick={() => setSelected(new Set())} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
          <button onClick={downloadSelected}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
            <Archive className="w-4 h-4" /> ZIP yuklab olish
          </button>
        </div>
      )}
    </div>
  );
}
