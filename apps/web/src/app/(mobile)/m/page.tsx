'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function MobileIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        const role = session?.user?.role;
        if (role === 'ADMIN' || role === 'HR') {
          router.replace('/m/director');
        } else {
          router.replace('/m/employee');
        }
      } catch {
        router.replace('/m/employee');
      }
    };
    fetchRole();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600">
      <div className="text-center text-white">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 text-white" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <p className="font-bold text-lg">StaffFlow HR</p>
        <div className="flex items-center justify-center gap-2 mt-3 text-blue-100">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Yuklanmoqda...</span>
        </div>
      </div>
    </div>
  );
}
