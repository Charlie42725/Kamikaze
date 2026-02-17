'use client';

import AdminTabBar from '@/components/layout/AdminTabBar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <div className="app-content page-with-tabbar">
        {children}
      </div>
      <AdminTabBar />
    </div>
  );
}
