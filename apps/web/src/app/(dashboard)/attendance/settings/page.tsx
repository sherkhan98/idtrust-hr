'use client';

import { useState } from 'react';
import {
  Settings, Camera, Fingerprint, CreditCard, QrCode, Smartphone,
  MapPin, Wifi, Globe, Shield, Save, ChevronRight, CheckCircle,
  AlertCircle, Plus, Trash2, Edit, ZapIcon, Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type AttendanceMethod =
  | 'FACE_ID'
  | 'FINGERPRINT'
  | 'NFC_CARD'
  | 'QR_CODE'
  | 'MOBILE'
  | 'GPS'
  | 'IP_RESTRICTION'
  | 'WIFI_RESTRICTION';

interface MethodConfig {
  enabled: boolean;
  requirePhoto?: boolean;
  livenessCheck?: boolean;
  antiSpoofing?: boolean;
  gpsVerify?: boolean;
  timeLimit?: number;
}

interface GeoFence {
  id: string;
  name: string;
  type: 'circle' | 'polygon';
  lat: number;
  lng: number;
  radius: number;
  branch: string;
}

interface BiometricDevice {
  id: string;
  name: string;
  brand: 'ZKTECO' | 'ANVIZ' | 'SUPREMA';
  ip: string;
  port: number;
  location: string;
  status: 'ONLINE' | 'OFFLINE';
}

interface NfcCard {
  id: string;
  cardNumber: string;
  employeeName: string;
  assignedAt: string;
  status: 'ACTIVE' | 'LOST' | 'DEACTIVATED';
}

const METHODS: { key: AttendanceMethod; label: string; labelUz: string; icon: any; color: string; bg: string; desc: string }[] = [
  { key: 'FACE_ID', label: 'Face ID', labelUz: 'Yuz tanish', icon: Camera, color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Yuz tanish orqali davomat' },
  { key: 'FINGERPRINT', label: 'Fingerprint', labelUz: 'Barmoq izi', icon: Fingerprint, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Barmoq izi qurilmalari (ZKTeco, Anviz, Suprema)' },
  { key: 'NFC_CARD', label: 'NFC Card', labelUz: 'NFC Karta', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50', desc: 'NFC kartalar orqali davomat' },
  { key: 'QR_CODE', label: 'QR Code', labelUz: 'QR Kod', icon: QrCode, color: 'text-orange-600', bg: 'bg-orange-50', desc: 'QR kod skanerlash orqali davomat' },
  { key: 'MOBILE', label: 'Mobile App', labelUz: 'Mobil ilova', icon: Smartphone, color: 'text-teal-600', bg: 'bg-teal-50', desc: 'Mobil ilova orqali check-in/check-out' },
  { key: 'GPS', label: 'GPS Location', labelUz: 'GPS Joylashuv', icon: MapPin, color: 'text-red-600', bg: 'bg-red-50', desc: 'GPS lokatsiya tekshiruvi' },
  { key: 'IP_RESTRICTION', label: 'IP Restriction', labelUz: 'IP Cheklash', icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: "Faqat tasdiqlangan IP manzillardan kirish" },
  { key: 'WIFI_RESTRICTION', label: 'WiFi Restriction', labelUz: 'WiFi Cheklash', icon: Wifi, color: 'text-cyan-600', bg: 'bg-cyan-50', desc: "Faqat ofis WiFi tarmog'idan kirish" },
];

const MOCK_GEOFENCES: GeoFence[] = [
  { id: 'g1', name: 'Bosh ofis', type: 'circle', lat: 41.2995, lng: 69.2401, radius: 150, branch: 'Toshkent' },
  { id: 'g2', name: 'Samarqand filiali', type: 'circle', lat: 39.6542, lng: 66.9597, radius: 200, branch: 'Samarqand' },
];

const MOCK_DEVICES: BiometricDevice[] = [
  { id: 'd1', name: 'ZKTeco K40', brand: 'ZKTECO', ip: '192.168.1.100', port: 4370, location: 'Kirish eshigi', status: 'ONLINE' },
  { id: 'd2', name: 'Anviz EP300', brand: 'ANVIZ', ip: '192.168.1.101', port: 5005, location: '2-qavat', status: 'OFFLINE' },
];

const MOCK_NFC_CARDS: NfcCard[] = [
  { id: 'n1', cardNumber: 'NFC-0001', employeeName: 'Alisher Toshmatov', assignedAt: '2024-01-10', status: 'ACTIVE' },
  { id: 'n2', cardNumber: 'NFC-0002', employeeName: 'Malika Yusupova', assignedAt: '2024-01-10', status: 'ACTIVE' },
  { id: 'n3', cardNumber: 'NFC-0003', employeeName: "Jasur Nazarov", assignedAt: '2024-02-05', status: 'LOST' },
];

const SETTINGS_TABS = [
  { id: 'methods', label: 'Usullar', icon: ZapIcon },
  { id: 'geofence', label: 'Geofence', icon: MapPin },
  { id: 'devices', label: "Qurilmalar", icon: Fingerprint },
  { id: 'nfc', label: 'NFC Kartalar', icon: CreditCard },
  { id: 'rules', label: 'Qoidalar', icon: Clock },
  { id: 'security', label: 'Xavfsizlik', icon: Shield },
];

export default function AttendanceSettingsPage() {
  const [activeTab, setActiveTab] = useState('methods');
  const [methods, setMethods] = useState<Record<AttendanceMethod, MethodConfig>>({
    FACE_ID: { enabled: true, livenessCheck: true, antiSpoofing: true, requirePhoto: true },
    FINGERPRINT: { enabled: true },
    NFC_CARD: { enabled: false },
    QR_CODE: { enabled: true, timeLimit: 30, gpsVerify: true },
    MOBILE: { enabled: true, requirePhoto: true, gpsVerify: true },
    GPS: { enabled: true },
    IP_RESTRICTION: { enabled: false },
    WIFI_RESTRICTION: { enabled: false },
  });
  const [saved, setSaved] = useState(false);

  const toggleMethod = (key: AttendanceMethod) => {
    setMethods((prev) => ({ ...prev, [key]: { ...prev[key], enabled: !prev[key].enabled } }));
  };

  const updateMethodConfig = (key: AttendanceMethod, field: string, value: any) => {
    setMethods((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const enabledCount = Object.values(methods).filter((m) => m.enabled).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/attendance" className="text-gray-400 hover:text-gray-600">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Link>
          <div>
            <h1 className="page-title">Davomat Sozlamalari</h1>
            <p className="page-subtitle">Davomat usullari va xavfsizlik konfiguratsiyasi</p>
          </div>
        </div>
        <button onClick={handleSave} className={cn('btn-primary', saved && 'bg-green-600 hover:bg-green-700')}>
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saqlandi!' : 'Saqlash'}
        </button>
      </div>

      {/* Active methods summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-xs text-gray-500 font-medium">Faol usullar</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{enabledCount}<span className="text-sm text-gray-400">/{METHODS.length}</span></p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-gray-500 font-medium">Geofence zonalar</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{MOCK_GEOFENCES.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-gray-500 font-medium">Biometrik qurilmalar</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{MOCK_DEVICES.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-gray-500 font-medium">NFC Kartalar</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{MOCK_NFC_CARDS.filter(c => c.status === 'ACTIVE').length}</p>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Tab sidebar */}
        <div className="w-44 flex-shrink-0">
          <div className="card p-1.5 space-y-0.5">
            {SETTINGS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50',
                )}
              >
                <tab.icon className={cn('w-4 h-4', activeTab === tab.id ? 'text-blue-600' : 'text-gray-400')} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'methods' && (
            <div className="space-y-3">
              <div className="card p-5">
                <h3 className="font-semibold text-sm text-gray-900 mb-1">Davomat usullari</h3>
                <p className="text-xs text-gray-500 mb-4">Kompaniyangiz uchun istalgan kombinatsiyani tanlang</p>
                <div className="grid grid-cols-1 gap-3">
                  {METHODS.map((method) => {
                    const config = methods[method.key];
                    return (
                      <div
                        key={method.key}
                        className={cn(
                          'p-4 rounded-xl border transition-all',
                          config.enabled ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100',
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', method.bg)}>
                            <method.icon className={cn('w-5 h-5', method.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <div className="text-sm font-semibold text-gray-800">{method.label}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{method.desc}</div>
                              </div>
                              <button
                                onClick={() => toggleMethod(method.key)}
                                className={cn(
                                  'relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0',
                                  config.enabled ? 'bg-blue-600' : 'bg-gray-200',
                                )}
                              >
                                <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', config.enabled ? 'translate-x-4' : 'translate-x-0.5')} />
                              </button>
                            </div>

                            {config.enabled && (
                              <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-blue-100">
                                {method.key === 'FACE_ID' && (
                                  <>
                                    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                                      <input type="checkbox" className="rounded" checked={config.livenessCheck} onChange={(e) => updateMethodConfig(method.key, 'livenessCheck', e.target.checked)} />
                                      Liveness tekshiruv
                                    </label>
                                    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                                      <input type="checkbox" className="rounded" checked={config.antiSpoofing} onChange={(e) => updateMethodConfig(method.key, 'antiSpoofing', e.target.checked)} />
                                      Anti-spoofing
                                    </label>
                                    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                                      <input type="checkbox" className="rounded" checked={config.requirePhoto} onChange={(e) => updateMethodConfig(method.key, 'requirePhoto', e.target.checked)} />
                                      Foto saqlash
                                    </label>
                                  </>
                                )}
                                {method.key === 'QR_CODE' && (
                                  <>
                                    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                                      <input type="checkbox" className="rounded" checked={config.gpsVerify} onChange={(e) => updateMethodConfig(method.key, 'gpsVerify', e.target.checked)} />
                                      GPS tekshiruvi
                                    </label>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                      <span>Muddat:</span>
                                      <input
                                        type="number"
                                        value={config.timeLimit || 30}
                                        onChange={(e) => updateMethodConfig(method.key, 'timeLimit', Number(e.target.value))}
                                        className="w-14 px-2 py-0.5 border border-gray-200 rounded text-xs"
                                      />
                                      <span>soniya</span>
                                    </div>
                                  </>
                                )}
                                {(method.key === 'MOBILE' || method.key === 'GPS') && (
                                  <>
                                    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                                      <input type="checkbox" className="rounded" checked={config.requirePhoto} onChange={(e) => updateMethodConfig(method.key, 'requirePhoto', e.target.checked)} />
                                      Selfie talab qilish
                                    </label>
                                    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                                      <input type="checkbox" className="rounded" checked={config.gpsVerify} onChange={(e) => updateMethodConfig(method.key, 'gpsVerify', e.target.checked)} />
                                      GPS tekshiruvi
                                    </label>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'geofence' && (
            <div className="space-y-4">
              <div className="card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900">Geofence Zonalar</h3>
                    <p className="text-xs text-gray-500 mt-0.5">GPS asosida ruxsat etilgan hududlar</p>
                  </div>
                  <button className="btn-primary text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    Zona qo'shish
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {MOCK_GEOFENCES.map((fence) => (
                    <div key={fence.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800">{fence.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {fence.branch} · {fence.type === 'circle' ? `Radius: ${fence.radius}m` : 'Polygon'} · {fence.lat.toFixed(4)}, {fence.lng.toFixed(4)}
                        </div>
                      </div>
                      <span className="badge-green">{fence.type === 'circle' ? 'Doira' : 'Polygon'}</span>
                      <div className="flex gap-1">
                        <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                          <Edit className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                        <button className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center">
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* IP and WiFi restrictions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-semibold text-sm text-gray-900">IP Manzillar</h3>
                  </div>
                  <div className="space-y-2">
                    {['192.168.1.0/24', '10.0.0.0/8'].map((ip) => (
                      <div key={ip} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                        <span className="text-sm font-mono text-gray-700">{ip}</span>
                        <button className="w-6 h-6 rounded hover:bg-red-50 flex items-center justify-center">
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    ))}
                    <button className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors">
                      + IP qo'shish
                    </button>
                  </div>
                </div>
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Wifi className="w-4 h-4 text-cyan-600" />
                    <h3 className="font-semibold text-sm text-gray-900">WiFi Tarmoqlar (SSID)</h3>
                  </div>
                  <div className="space-y-2">
                    {['Office_Network', 'HQ_WiFi_5G'].map((ssid) => (
                      <div key={ssid} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{ssid}</span>
                        <button className="w-6 h-6 rounded hover:bg-red-50 flex items-center justify-center">
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    ))}
                    <button className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors">
                      + WiFi qo'shish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'devices' && (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">Biometrik Qurilmalar</h3>
                  <p className="text-xs text-gray-500 mt-0.5">ZKTeco, Anviz, Suprema qurilmalarini boshqaring</p>
                </div>
                <button className="btn-primary text-xs">
                  <Plus className="w-3.5 h-3.5" />
                  Qurilma qo'shish
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {MOCK_DEVICES.map((device) => (
                  <div key={device.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', device.status === 'ONLINE' ? 'bg-green-50' : 'bg-gray-50')}>
                      <Fingerprint className={cn('w-5 h-5', device.status === 'ONLINE' ? 'text-green-600' : 'text-gray-400')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">{device.name}</span>
                        <span className={cn(device.status === 'ONLINE' ? 'badge-green' : 'badge-gray')}>{device.status}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {device.brand} · {device.ip}:{device.port} · {device.location}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="px-2.5 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">Sinxronlash</button>
                      <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                        <Edit className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                      <button className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'nfc' && (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">NFC Kartalar</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Xodimlar uchun NFC kartalarni boshqaring</p>
                </div>
                <button className="btn-primary text-xs">
                  <Plus className="w-3.5 h-3.5" />
                  Karta qo'shish
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="table-header">Karta raqami</th>
                      <th className="table-header">Xodim</th>
                      <th className="table-header">Berilgan sana</th>
                      <th className="table-header">Holat</th>
                      <th className="table-header">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {MOCK_NFC_CARDS.map((card) => (
                      <tr key={card.id} className="hover:bg-gray-50/50">
                        <td className="table-cell font-mono text-gray-800">{card.cardNumber}</td>
                        <td className="table-cell font-medium text-gray-800">{card.employeeName}</td>
                        <td className="table-cell text-gray-500">{card.assignedAt}</td>
                        <td className="table-cell">
                          <span className={cn(
                            card.status === 'ACTIVE' ? 'badge-green' :
                            card.status === 'LOST' ? 'badge-red' : 'badge-gray'
                          )}>
                            {card.status === 'ACTIVE' ? 'Faol' : card.status === 'LOST' ? "Yo'qolgan" : 'Bekor'}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="flex gap-1">
                            {card.status === 'ACTIVE' && (
                              <button className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100">
                                Bloklash
                              </button>
                            )}
                            <button className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100">
                              Qayta berish
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="font-semibold text-sm text-gray-900 mb-4">Ish vaqti qoidalari</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {[
                    { label: 'Ish boshlanish vaqti', value: '09:00', type: 'time' },
                    { label: 'Ish tugash vaqti', value: '18:00', type: 'time' },
                    { label: "Kechikish toleransi (daqiqa)", value: '10', type: 'number' },
                    { label: 'Erta ketish toleransi (daqiqa)', value: '15', type: 'number' },
                    { label: 'Minimal ish soati', value: '8', type: 'number' },
                    { label: 'Ish tanaffusi (daqiqa)', value: '60', type: 'number' },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}</label>
                      <input
                        type={field.type}
                        defaultValue={field.value}
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-semibold text-sm text-gray-900 mb-4">Smena sozlamalari</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Kunduzgi smena', start: '09:00', end: '18:00', color: 'bg-blue-500' },
                    { name: 'Kechki smena', start: '18:00', end: '02:00', color: 'bg-purple-500' },
                    { name: 'Tungi smena', start: '22:00', end: '06:00', color: 'bg-indigo-500' },
                  ].map((shift) => (
                    <div key={shift.name} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-blue-100 transition-colors">
                      <div className={cn('w-3 h-8 rounded-full flex-shrink-0', shift.color)} />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-800">{shift.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{shift.start} — {shift.end}</div>
                      </div>
                      <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                        <Edit className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </div>
                  ))}
                  <button className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-xs text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors">
                    + Yangi smena qo'shish
                  </button>
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-semibold text-sm text-gray-900 mb-4">Qo&apos;shimcha ish hisoblash</h3>
                <div className="space-y-3">
                  {[
                    { label: "Qo'shimcha ish koeffitsienti (kunduz)", value: '1.5' },
                    { label: "Qo'shimcha ish koeffitsienti (bayram)", value: '2.0' },
                    { label: "Minimum qo'shimcha ish (daqiqa)", value: '30' },
                  ].map((field) => (
                    <div key={field.label} className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">{field.label}</label>
                      <input
                        type="number"
                        defaultValue={field.value}
                        step="0.1"
                        className="w-24 px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-sm text-gray-900">Audit va xavfsizlik</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Davomat fotosini saqlash", desc: "Har bir davomat uchun selfie saqlanadi", defaultChecked: true },
                    { label: "GPS koordinatalarini saqlash", desc: "Aniq joylashuv ma'lumoti saqlanadi", defaultChecked: true },
                    { label: "Qurilma ma'lumotlarini saqlash", desc: "IP, brauzer, OS ma'lumotlari saqlanadi", defaultChecked: true },
                    { label: "WiFi SSID saqlash", desc: "Ulanilgan tarmoq nomi saqlanadi", defaultChecked: false },
                    { label: "Anomal davomat bildirishnomasi", desc: "Shubhali faoliyat haqida admin xabardor qilinadi", defaultChecked: true },
                    { label: "Ish vaqtidan tashqari kirishni bloklash", desc: "Ish soatlaridan tashqari davomat rad etiladi", defaultChecked: false },
                  ].map((item) => (
                    <label key={item.label} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" defaultChecked={item.defaultChecked} className="mt-0.5 rounded" />
                      <div>
                        <div className="text-sm font-medium text-gray-800">{item.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <h3 className="font-semibold text-sm text-gray-900">Audit log saqlash muddati</h3>
                </div>
                <div className="flex items-center gap-3">
                  <select className="input-field w-40">
                    <option value="30">30 kun</option>
                    <option value="90">90 kun</option>
                    <option value="180">180 kun</option>
                    <option value="365">1 yil</option>
                    <option value="730">2 yil</option>
                  </select>
                  <p className="text-xs text-gray-500">Audit loglar belgilangan muddatdan so'ng avtomatik o'chiriladi</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
