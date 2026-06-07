'use client';

import { useState, useEffect } from 'react';
import { WifiOff, Wifi, Clock } from 'lucide-react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [queueCount, setQueueCount] = useState(0);
  const [showOnlineBanner, setShowOnlineBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineBanner(true);
      setTimeout(() => setShowOnlineBanner(false), 3000);
      // Trigger background sync
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(reg => {
          (reg as any).sync?.register('attendance-sync').catch(() => {});
        });
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Offline banner */}
      {!isOnline && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold">
          <WifiOff className="w-4 h-4 text-red-400" />
          <span>Oflayn rejim — ma&#39;lumotlar saqlanmoqda</span>
          {queueCount > 0 && (
            <span className="flex items-center gap-1 bg-orange-500 px-2 py-0.5 rounded-full text-xs">
              <Clock className="w-3 h-3" />
              {queueCount} navbatda
            </span>
          )}
        </div>
      )}

      {/* Back online notification */}
      {showOnlineBanner && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold animate-in slide-in-from-bottom-4">
          <Wifi className="w-4 h-4" />
          <span>Internet tiklandi — ma&#39;lumotlar sinxronlanmoqda</span>
        </div>
      )}
    </>
  );
}
