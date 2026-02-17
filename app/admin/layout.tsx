'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import AdminTabBar from '@/components/layout/AdminTabBar';
import { SpinLoading } from 'antd-mobile';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinLoading color="primary" style={{ '--size': '48px' }} />
      </div>
    );
  }

  return (
    <div className="app-layout">
      <div className="app-content page-with-tabbar">
        {children}
      </div>
      <AdminTabBar />
    </div>
  );
}
