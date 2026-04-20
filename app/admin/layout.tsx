import AdminTabBar from '@/components/layout/AdminTabBar';

export const dynamic = 'force-dynamic';

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
