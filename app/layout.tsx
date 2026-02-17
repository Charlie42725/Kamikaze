import type { Metadata, Viewport } from 'next';
import { SupabaseProvider } from '@/components/providers/SupabaseProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { AntdProvider } from '@/components/providers/AntdProvider';
import './globals.css';

export const metadata: Metadata = {
  title: '神風系統 - KOL 管理',
  description: 'KOL 網紅管理系統',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '神風系統',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1677ff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        <SupabaseProvider>
          <AuthProvider>
            <AntdProvider>{children}</AntdProvider>
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
