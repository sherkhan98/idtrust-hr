import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ServiceWorkerRegistrar } from '@/components/ServiceWorkerRegistrar';

export const metadata: Metadata = {
  title: {
    default: 'IDTrust — HR, Attendance & School Management',
    template: '%s | IDTrust',
  },
  description: 'O\'zbekistonda HR, Maktab va Bog\'cha boshqaruvining eng ishonchli tizimi',
  keywords: ['HR', 'Maktab', 'Bog\'cha', 'IDTrust', 'O\'zbekiston'],
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico', apple: '/icon-192.png' },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'IDTrust' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="theme-color" content="#2563EB" />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
        <OfflineIndicator />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
