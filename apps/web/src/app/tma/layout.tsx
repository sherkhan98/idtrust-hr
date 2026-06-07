import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'IDTrust — Xodim Portali',
  description: 'Davomat, ta\'til, maosh — Telegram orqali',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function TMALayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        {/* Telegram WebApp SDK */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-[var(--tg-theme-bg-color,#ffffff)] text-[var(--tg-theme-text-color,#000000)] min-h-screen">
        {children}
      </body>
    </html>
  );
}
