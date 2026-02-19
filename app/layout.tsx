import type { Metadata, Viewport } from 'next';
import { SupabaseProvider } from '@/components/providers/SupabaseProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
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
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-prefers-color-scheme','dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="antialiased">
        <SupabaseProvider>
          <AuthProvider>
            <ThemeProvider>
              <AntdProvider>{children}</AntdProvider>
            </ThemeProvider>
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
