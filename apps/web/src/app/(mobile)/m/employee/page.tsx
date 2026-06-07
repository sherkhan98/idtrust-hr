'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin, Camera, Clock, CheckCircle2, XCircle, LogIn, LogOut,
  ChevronRight, AlertCircle, Wifi, Battery, Signal, Bell,
  Calendar, TrendingUp, User,
} from 'lucide-react';
import toast from 'react-hot-toast';

type CheckStatus = 'idle' | 'checking' | 'checked-in' | 'checked-out';
type Tab = 'home' | 'history' | 'profile';

interface AttendanceRecord {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'late' | 'absent' | 'half';
  hours: number;
}

const MOCK_HISTORY: AttendanceRecord[] = [
  { date: '2024-01-22', checkIn: '08:52', checkOut: '18:05', status: 'present', hours: 9.2 },
  { date: '2024-01-21', checkIn: '09:15', checkOut: '18:30', status: 'late', hours: 9.25 },
  { date: '2024-01-20', checkIn: null, checkOut: null, status: 'absent', hours: 0 },
  { date: '2024-01-19', checkIn: '08:45', checkOut: '18:00', status: 'present', hours: 9.25 },
  { date: '2024-01-18', checkIn: '08:58', checkOut: '14:00', status: 'half', hours: 5 },
  { date: '2024-01-17', checkIn: '08:50', checkOut: '18:10', status: 'present', hours: 9.33 },
  { date: '2024-01-16', checkIn: '08:40', checkOut: '18:00', status: 'present', hours: 9.33 },
];

function StatusBadge({ status }: { status: AttendanceRecord['status'] }) {
  const map = {
    present: 'bg-green-100 text-green-700',
    late: 'bg-yellow-100 text-yellow-700',
    absent: 'bg-red-100 text-red-700',
    half: 'bg-blue-100 text-blue-700',
  };
  const labels = { present: 'Keldi', late: 'Kech', absent: 'Kelmadi', half: 'Yarim kun' };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function EmployeeMobilePage() {
  const [status, setStatus] = useState<CheckStatus>('idle');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [checkInTimestamp, setCheckInTimestamp] = useState<number | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [selfieData, setSelfieData] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [currentTime, setCurrentTime] = useState(new Date());
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!checkInTimestamp) return;
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - checkInTimestamp) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [checkInTimestamp]);

  const formatElapsed = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getLocation = useCallback((): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('GPS qo\'llab-quvvatlanmaydi'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(new Error(err.message)),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    });
  }, []);

  const openCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      toast.error('Kamera ochilmadi');
      setShowCamera(false);
    }
  };

  const takeSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    const data = canvasRef.current.toDataURL('image/jpeg', 0.8);
    setSelfieData(data);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setShowCamera(false);
  };

  const handleCheckIn = async () => {
    setStatus('checking');
    setIsGettingLocation(true);
    try {
      const loc = await getLocation();
      setLocation(loc);
      setLocationError(null);
      setIsGettingLocation(false);

      if (!selfieData) {
        await openCamera();
        setStatus('idle');
        return;
      }

      await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: loc.lat, lng: loc.lng, selfie: selfieData }),
      });

      const now = new Date();
      setCheckInTime(now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }));
      setCheckInTimestamp(Date.now());
      setStatus('checked-in');
      toast.success('Kelish muvaffaqiyatli belgilandi!');
    } catch (err: any) {
      setLocationError(err.message);
      setIsGettingLocation(false);
      setStatus('idle');
      toast.error('GPS aniqlanmadi: ' + err.message);
    }
  };

  const handleCheckOut = async () => {
    setStatus('checking');
    setIsGettingLocation(true);
    try {
      const loc = await getLocation();
      setIsGettingLocation(false);

      await fetch('/api/attendance/check-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: loc.lat, lng: loc.lng }),
      });

      const now = new Date();
      setCheckOutTime(now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }));
      setStatus('checked-out');
      toast.success('Ketish muvaffaqiyatli belgilandi!');
    } catch (err: any) {
      setIsGettingLocation(false);
      setStatus('checked-in');
      toast.error('Xato: ' + err.message);
    }
  };

  const today = currentTime.toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = currentTime.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Status Bar */}
      <div className="bg-blue-600 text-white px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-blue-200">Salom,</p>
              <p className="text-sm font-bold">Sardor Toshmatov</p>
            </div>
          </div>
          <button className="relative">
            <Bell className="w-5 h-5 text-blue-200" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] flex items-center justify-center font-bold">2</span>
          </button>
        </div>

        <div className="text-center">
          <p className="text-blue-200 text-xs mb-1">{today}</p>
          <p className="text-4xl font-bold font-mono tracking-wider">{timeStr}</p>
        </div>

        {status === 'checked-in' && (
          <div className="mt-4 bg-white/15 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-blue-100">Ish vaqti</span>
            </div>
            <span className="text-xl font-bold font-mono">{formatElapsed(elapsed)}</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      {activeTab === 'home' && (
        <div className="flex-1 px-4 py-6 space-y-4">
          {/* GPS Status */}
          <div className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
            locationError ? 'bg-red-50 border border-red-200' : location ? 'bg-green-50 border border-green-200' : 'bg-gray-100'
          }`}>
            <MapPin className={`w-4 h-4 flex-shrink-0 ${locationError ? 'text-red-500' : location ? 'text-green-600' : 'text-gray-400'}`} />
            {isGettingLocation ? (
              <span className="text-gray-600">GPS aniqlanmoqda...</span>
            ) : locationError ? (
              <span className="text-red-600">{locationError}</span>
            ) : location ? (
              <span className="text-green-700 font-medium">GPS aniqlandi ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})</span>
            ) : (
              <span className="text-gray-500">GPS tayyor — kelish/ketishda aniqlanadi</span>
            )}
          </div>

          {/* Selfie */}
          {selfieData && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <img src={selfieData} alt="Selfie" className="w-10 h-10 rounded-lg object-cover border-2 border-blue-300" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-800">Selfie olingan</p>
                <p className="text-xs text-blue-600">Kelish uchun tayyor</p>
              </div>
              <button onClick={() => setSelfieData(null)} className="text-blue-400 hover:text-blue-600">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Check In / Out Button */}
          <div className="flex flex-col items-center py-6">
            {status === 'idle' || status === 'checking' ? (
              <div className="space-y-4 w-full">
                {!selfieData && (
                  <button
                    onClick={openCamera}
                    className="w-full py-3.5 flex items-center justify-center gap-2 bg-white border-2 border-blue-300 text-blue-700 rounded-2xl font-semibold text-sm hover:bg-blue-50 transition-all"
                  >
                    <Camera className="w-5 h-5" />
                    Selfie olish (kelish uchun)
                  </button>
                )}
                <button
                  onClick={handleCheckIn}
                  disabled={status === 'checking'}
                  className="w-full py-5 flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-200 active:scale-95 transition-all disabled:opacity-70"
                >
                  <LogIn className="w-6 h-6" />
                  {status === 'checking' ? 'Tekshirilmoqda...' : 'KELISH BELGILASH'}
                </button>
              </div>
            ) : status === 'checked-in' ? (
              <div className="space-y-3 w-full">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-bold text-green-800">Kelish belgilandi</p>
                  <p className="text-2xl font-mono font-bold text-green-700 mt-1">{checkInTime}</p>
                </div>
                <button
                  onClick={handleCheckOut}
                  className="w-full py-5 flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 active:scale-95 transition-all"
                >
                  <LogOut className="w-6 h-6" />
                  KETISH BELGILASH
                </button>
              </div>
            ) : (
              <div className="space-y-3 w-full">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Kelish</p>
                      <div className="flex items-center justify-center gap-1.5">
                        <LogIn className="w-4 h-4 text-green-500" />
                        <span className="font-bold text-lg text-gray-800">{checkInTime}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Ketish</p>
                      <div className="flex items-center justify-center gap-1.5">
                        <LogOut className="w-4 h-4 text-orange-500" />
                        <span className="font-bold text-lg text-gray-800">{checkOutTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-100 text-center">
                    <p className="text-xs text-gray-500">Ish vaqti</p>
                    <p className="font-bold text-blue-700 text-xl font-mono">{formatElapsed(elapsed)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-semibold text-green-700">Bugungi davomat to&#39;liq</span>
                </div>
              </div>
            )}
          </div>

          {/* This month stats */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Bu oy statistikasi</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Keldi', value: '18', color: 'text-green-600 bg-green-50' },
                { label: 'Kech', value: '2', color: 'text-yellow-600 bg-yellow-50' },
                { label: 'Kelmadi', value: '1', color: 'text-red-600 bg-red-50' },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl p-3 text-center ${s.color.split(' ')[1]}`}>
                  <p className={`text-2xl font-bold ${s.color.split(' ')[0]}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="flex-1 px-4 py-6">
          <p className="text-sm font-bold text-gray-700 mb-4">So&#39;nggi davomatlar</p>
          <div className="space-y-2">
            {MOCK_HISTORY.map((rec) => (
              <div key={rec.date} className="bg-white rounded-xl p-3.5 border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-gray-700">{new Date(rec.date).getDate()}</span>
                  <span className="text-[9px] text-gray-400 uppercase">{new Date(rec.date).toLocaleDateString('uz-UZ', { month: 'short' })}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={rec.status} />
                    {rec.status !== 'absent' && (
                      <span className="text-xs text-gray-400">{rec.hours.toFixed(1)}h</span>
                    )}
                  </div>
                  {rec.checkIn && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {rec.checkIn} — {rec.checkOut || '?'}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="flex-1 px-4 py-6 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-10 h-10 text-blue-500" />
            </div>
            <p className="font-bold text-gray-900 text-lg">Sardor Toshmatov</p>
            <p className="text-sm text-gray-500">Senior Dasturchi • IT Bo&#39;limi</p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-xs text-green-600 font-medium">Faol</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {[
              { label: 'Email', value: 'sardor@nexusgroup.uz' },
              { label: 'Telefon', value: '+998 90 123 45 67' },
              { label: 'Telegram', value: '@sardor_dev' },
              { label: 'Ishga kirgan', value: '15 yanvar 2022' },
              { label: 'Ish joyi', value: 'Toshkent, Chilonzor' },
            ].map((item, i, arr) => (
              <div key={item.label} className={`flex items-center justify-between p-4 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-sm font-medium text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>

          <button className="w-full py-3 text-sm font-semibold text-red-500 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-colors">
            Chiqish
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-100 px-4 py-2 flex items-center justify-around safe-area-inset-bottom">
        {([
          { id: 'home', icon: Clock, label: 'Davomat' },
          { id: 'history', icon: Calendar, label: 'Tarix' },
          { id: 'profile', icon: User, label: 'Profil' },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
              activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
            <span className="text-[10px] font-semibold">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 pt-12">
            <button onClick={() => { streamRef.current?.getTracks().forEach((t) => t.stop()); setShowCamera(false); }}
              className="text-white">
              <XCircle className="w-7 h-7" />
            </button>
            <p className="text-white font-semibold">Selfie olish</p>
            <div className="w-7" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <video ref={videoRef} className="w-full max-h-[60vh] object-cover" playsInline muted />
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="p-8 flex justify-center">
            <button
              onClick={takeSelfie}
              className="w-20 h-20 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
            >
              <Camera className="w-8 h-8 text-blue-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
