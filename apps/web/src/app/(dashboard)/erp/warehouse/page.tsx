'use client';

import { useState } from 'react';
import {
  Package, Search, Plus, ArrowUpCircle, ArrowDownCircle,
  AlertTriangle, Warehouse, TrendingUp, BarChart2,
  X, Eye, ChevronDown, Filter, MapPin, Truck,
  ShoppingCart, Calendar, User, Hash,
} from 'lucide-react';

// ─── Demo Data ────────────────────────────────────────────────
const PRODUCTS = [
  { id: 'p1', sku: 'COMP-001', name: 'MacBook Pro 14"', category: 'Kompyuterlar', qty: 12, minQty: 3, price: 18500000, location: 'A-01-01', supplier: 'Apple Uzbekistan', lastIn: '2024-01-20' },
  { id: 'p2', sku: 'COMP-002', name: 'Dell Monitor 27"', category: 'Monitorlar', qty: 2, minQty: 5, price: 4200000, location: 'A-01-02', supplier: 'Dell Uzbekistan', lastIn: '2024-01-15' },
  { id: 'p3', sku: 'FURN-001', name: "Ish stoli (L-shakl)", category: "Mebel", qty: 8, minQty: 2, price: 2800000, location: 'B-02-01', supplier: 'IKEA Tashkent', lastIn: '2024-01-10' },
  { id: 'p4', sku: 'ELEC-001', name: 'Printer HP LaserJet', category: 'Printerlar', qty: 0, minQty: 2, price: 3500000, location: 'A-02-01', supplier: 'HP Uzbekistan', lastIn: '2023-12-01' },
  { id: 'p5', sku: 'STAT-001', name: "Qog'oz A4 (quti)", category: 'Ofis mollari', qty: 45, minQty: 10, price: 95000, location: 'C-01-01', supplier: 'Kanselyar Plus', lastIn: '2024-01-22' },
  { id: 'p6', sku: 'TECH-001', name: 'iPhone 15 Pro', category: 'Telefonlar', qty: 5, minQty: 2, price: 14000000, location: 'A-01-03', supplier: 'Apple Uzbekistan', lastIn: '2024-01-18' },
];

const MOVEMENTS = [
  { id: 'm1', date: '2024-01-28', type: 'IN', product: 'MacBook Pro 14"', qty: 3, from: 'Apple Uzbekistan', to: 'Ombor A-01', doc: 'PO-2024-015', by: 'Sardor T.' },
  { id: 'm2', date: '2024-01-27', type: 'OUT', product: 'Dell Monitor 27"', qty: 1, from: 'Ombor A-01', to: "IT Bo'limi", doc: 'RQ-2024-022', by: 'Malika Y.' },
  { id: 'm3', date: '2024-01-26', type: 'OUT', product: 'iPhone 15 Pro', qty: 2, from: 'Ombor A-01', to: "Savdo bo'lim", doc: 'RQ-2024-021', by: 'Bobur R.' },
  { id: 'm4', date: '2024-01-25', type: 'IN', product: "Qog'oz A4", qty: 20, from: 'Kanselyar Plus', to: 'Ombor C-01', doc: 'PO-2024-014', by: 'Sardor T.' },
];

// ─── Helpers ──────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}
function fmtFull(n: number) { return new Intl.NumberFormat('uz-UZ').format(n) + " so'm"; }

function qtyColor(qty: number, minQty: number) {
  if (qty === 0) return 'text-red-700 bg-red-50';
  if (qty < minQty) return 'text-red-600 bg-red-50';
  if (qty < minQty * 2) return 'text-amber-700 bg-amber-50';
  return 'text-emerald-700 bg-emerald-50';
}

type Product = typeof PRODUCTS[number];

// ─── Product Detail Modal ─────────────────────────────────────
interface ProductModalProps { product: Product; onClose: () => void }
function ProductModal({ product, onClose }: ProductModalProps) {
  const relatedMoves = MOVEMENTS.filter(m => m.product === product.name);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Package size={20} className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">{product.name}</h3>
              <p className="text-sm text-slate-500">{product.sku}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Mavjud miqdor', value: `${product.qty} dona`, color: qtyColor(product.qty, product.minQty) },
              { label: 'Minimal miqdor', value: `${product.minQty} dona`, color: 'text-slate-700 bg-slate-50' },
              { label: 'Narx', value: fmtFull(product.price), color: 'text-amber-700 bg-amber-50' },
            ].map(s => (
              <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
                <p className="text-xs font-medium opacity-70">{s.label}</p>
                <p className="text-lg font-bold mt-1">{s.value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
              <MapPin size={15} className="text-slate-400" />
              <div><p className="text-xs text-slate-400">Joylashuv</p><p className="font-semibold text-slate-700">{product.location}</p></div>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
              <Truck size={15} className="text-slate-400" />
              <div><p className="text-xs text-slate-400">Yetkazuvchi</p><p className="font-semibold text-slate-700">{product.supplier}</p></div>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
              <Package size={15} className="text-slate-400" />
              <div><p className="text-xs text-slate-400">Kategoriya</p><p className="font-semibold text-slate-700">{product.category}</p></div>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
              <Calendar size={15} className="text-slate-400" />
              <div><p className="text-xs text-slate-400">Oxirgi kirim</p><p className="font-semibold text-slate-700">{product.lastIn}</p></div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Harakat tarixi</h4>
            {relatedMoves.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">Hech qanday harakat yo'q</p>
            ) : (
              <div className="space-y-2">
                {relatedMoves.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {m.type === 'IN'
                        ? <ArrowUpCircle size={16} className="text-emerald-600" />
                        : <ArrowDownCircle size={16} className="text-red-500" />}
                      <div>
                        <p className="text-sm font-medium text-slate-700">{m.type === 'IN' ? 'Kirim' : 'Chiqim'}: {m.qty} dona</p>
                        <p className="text-xs text-slate-400">{m.from} → {m.to} · {m.date}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-500">{m.doc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="w-full bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 flex items-center justify-center gap-2">
            <ShoppingCart size={16} /> Buyurtma berish
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Product Modal ────────────────────────────────────────
interface AddModalProps { onClose: () => void }
function AddProductModal({ onClose }: AddModalProps) {
  const [form, setForm] = useState({ sku: '', name: '', category: '', qty: '', minQty: '', price: '', location: '', supplier: '' });
  const cats = ['Kompyuterlar', 'Monitorlar', 'Mebel', 'Printerlar', 'Ofis mollari', 'Telefonlar'];
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Yangi mahsulot qo'shish</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'SKU', key: 'sku', placeholder: 'COMP-003' },
              { label: 'Kategoriya', key: 'category', placeholder: 'select' },
              { label: 'Mahsulot nomi', key: 'name', placeholder: 'MacBook Air 13"' },
              { label: 'Narx (so\'m)', key: 'price', placeholder: '15000000' },
              { label: 'Mavjud miqdor', key: 'qty', placeholder: '0' },
              { label: 'Minimal miqdor', key: 'minQty', placeholder: '2' },
              { label: 'Joylashuv', key: 'location', placeholder: 'A-01-04' },
              { label: 'Yetkazuvchi', key: 'supplier', placeholder: 'Apple Uzbekistan' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
                {f.placeholder === 'select' ? (
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                    <option value="">Tanlang...</option>
                    {cats.map(c => <option key={c}>{c}</option>)}
                  </select>
                ) : (
                  <input placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">Bekor qilish</button>
          <button className="flex-1 bg-amber-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-600">Saqlash</button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Movement Modal ───────────────────────────────────────
interface MovementModalProps { type: 'IN' | 'OUT'; onClose: () => void }
function MovementModal({ type, onClose }: MovementModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {type === 'IN'
              ? <ArrowUpCircle size={20} className="text-emerald-600" />
              : <ArrowDownCircle size={20} className="text-red-500" />}
            <h3 className="text-lg font-semibold text-slate-800">{type === 'IN' ? 'Kirim' : 'Chiqim'} qayd etish</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Mahsulot</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option value="">Tanlang...</option>
              {PRODUCTS.map(p => <option key={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Miqdor</label>
              <input type="number" placeholder="1" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Sana</label>
              <input type="date" defaultValue="2024-01-28" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">{type === 'IN' ? 'Yetkazuvchi' : 'Qayerga'}</label>
            <input placeholder={type === 'IN' ? 'Yetkazuvchi nomi...' : "Bo'lim nomi..."} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Hujjat raqami</label>
            <input placeholder={type === 'IN' ? 'PO-2024-016' : 'RQ-2024-023'} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">Bekor qilish</button>
          <button className={`flex-1 py-2 rounded-lg text-sm font-medium text-white ${type === 'IN' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-500 hover:bg-red-600'}`}>Saqlash</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function WarehousePage() {
  const [tab, setTab] = useState<'products' | 'movements'>('products');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [mvTypeFilter, setMvTypeFilter] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showMovModal, setShowMovModal] = useState<'IN' | 'OUT' | null>(null);

  const categories = ['ALL', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
  const lowStockItems = PRODUCTS.filter(p => p.qty < p.minQty);
  const totalValue = PRODUCTS.reduce((s, p) => s + p.qty * p.price, 0);
  const todayMovements = MOVEMENTS.filter(m => m.date === '2024-01-28').length;

  const filteredProducts = PRODUCTS.filter(p => {
    const ms = search === '' || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const mc = catFilter === 'ALL' || p.category === catFilter;
    return ms && mc;
  });

  const filteredMovements = MOVEMENTS.filter(m =>
    mvTypeFilter === 'ALL' || m.type === mvTypeFilter
  );

  return (
    <div className="min-h-screen bg-amber-50/30">
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      {showAddProduct && <AddProductModal onClose={() => setShowAddProduct(false)} />}
      {showMovModal && <MovementModal type={showMovModal} onClose={() => setShowMovModal(null)} />}

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                <Warehouse size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Omborxona</h1>
                <p className="text-sm text-slate-500">Inventarizatsiya va harakatlar — IDTrust ERP</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowMovModal('IN')} className="flex items-center gap-2 border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-100">
                <ArrowUpCircle size={15} /> Kirim
              </button>
              <button onClick={() => setShowMovModal('OUT')} className="flex items-center gap-2 border border-red-200 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100">
                <ArrowDownCircle size={15} /> Chiqim
              </button>
              <button onClick={() => setShowAddProduct(true)} className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600">
                <Plus size={15} /> Mahsulot qo'shish
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-5">
            {[
              { label: 'Jami mahsulot', value: `${PRODUCTS.length} xil`, icon: Package, bg: 'bg-amber-500', sub: 'Omborda mavjud' },
              { label: 'Kam qolgan', value: `${lowStockItems.length} ta`, icon: AlertTriangle, bg: 'bg-red-500', sub: 'Buyurtma kerak', alert: lowStockItems.length > 0 },
              { label: 'Jami qiymat', value: fmt(totalValue) + " so'm", icon: TrendingUp, bg: 'bg-emerald-500', sub: 'Bozor narxida' },
              { label: "Bugungi harakat", value: `${todayMovements} ta`, icon: BarChart2, bg: 'bg-blue-500', sub: '28 yanvar 2024' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center`}>
                    <s.icon size={16} className="text-white" />
                  </div>
                  {s.alert && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full animate-pulse">
                      ALERT
                    </span>
                  )}
                </div>
                <p className="text-lg font-bold text-slate-800">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {[
              { id: 'products', label: 'Mahsulotlar', icon: Package },
              { id: 'movements', label: 'Harakatlar', icon: ArrowUpCircle },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id as 'products' | 'movements')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-amber-50'}`}>
                <t.icon size={15} />{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Low stock alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">{lowStockItems.length} ta mahsulot tugab qolmoqda</p>
              <p className="text-sm text-red-600 mt-0.5">
                {lowStockItems.map(p => p.name).join(', ')} — zudlik bilan buyurtma bering
              </p>
            </div>
            <button className="ml-auto text-red-600 hover:text-red-800 text-xs font-medium border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 whitespace-nowrap">
              Buyurtma berish
            </button>
          </div>
        )}

        {/* Products Tab */}
        {tab === 'products' && (
          <div className="bg-white rounded-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input placeholder="Mahsulot qidirish..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                {categories.map(c => <option key={c} value={c}>{c === 'ALL' ? "Barcha kategoriya" : c}</option>)}
              </select>
              <button onClick={() => setShowAddProduct(true)} className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 ml-auto">
                <Plus size={15} /> Qo'shish
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">SKU</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mahsulot</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategoriya</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mavjud</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Min</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Narx</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joylashuv</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredProducts.map(p => (
                    <tr key={p.id} onClick={() => setSelectedProduct(p)} className="hover:bg-amber-50/40 cursor-pointer transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-mono font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded">{p.sku}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package size={14} className="text-slate-500" />
                          </div>
                          <span className="text-sm font-medium text-slate-800">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{p.category}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full ${qtyColor(p.qty, p.minQty)}`}>
                          {p.qty}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center text-sm text-slate-500">{p.minQty}</td>
                      <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-700">{fmt(p.price)} so'm</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin size={12} />{p.location}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <button onClick={e => { e.stopPropagation(); setSelectedProduct(p); }} className="flex items-center gap-1 text-amber-600 hover:text-amber-800 text-xs font-medium">
                          <Eye size={13} /> Ko'rish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 text-sm text-slate-500">
              {filteredProducts.length} ta mahsulot · Jami qiymat: <strong className="text-slate-800">{fmt(filteredProducts.reduce((s, p) => s + p.qty * p.price, 0))} so'm</strong>
            </div>
          </div>
        )}

        {/* Movements Tab */}
        {tab === 'movements' && (
          <div className="bg-white rounded-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
              <select value={mvTypeFilter} onChange={e => setMvTypeFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                <option value="ALL">Barcha tur</option>
                <option value="IN">Kirim</option>
                <option value="OUT">Chiqim</option>
              </select>
              <input type="date" defaultValue="2024-01-25"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              <input type="date" defaultValue="2024-01-28"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              <div className="ml-auto flex gap-2">
                <button onClick={() => setShowMovModal('IN')} className="flex items-center gap-2 border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-100">
                  <ArrowUpCircle size={15} /> Kirim
                </button>
                <button onClick={() => setShowMovModal('OUT')} className="flex items-center gap-2 border border-red-200 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100">
                  <ArrowDownCircle size={15} /> Chiqim
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sana</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tur</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mahsulot</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Miqdor</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Qaerdan</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Qayerga</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hujjat</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kim</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredMovements.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 text-sm text-slate-600">{m.date}</td>
                      <td className="px-5 py-3.5">
                        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full ${m.type === 'IN' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                          {m.type === 'IN' ? <ArrowUpCircle size={13} /> : <ArrowDownCircle size={13} />}
                          {m.type === 'IN' ? 'Kirim' : 'Chiqim'}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{m.product}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`text-sm font-bold ${m.type === 'IN' ? 'text-emerald-700' : 'text-red-600'}`}>
                          {m.type === 'IN' ? '+' : '-'}{m.qty}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{m.from}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{m.to}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-mono font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded">{m.doc}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-amber-700">{m.by.charAt(0)}</span>
                          </div>
                          <span className="text-sm text-slate-600">{m.by}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
