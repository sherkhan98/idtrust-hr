import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'StaffFlow HR Mobile',
  description: 'StaffFlow HR mobil ilovasi',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'StaffFlow HR',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#2563eb',
};

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative overflow-x-hidden">
      {children}
    </div>
  );
}
