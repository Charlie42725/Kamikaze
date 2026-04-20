import StaffTabBar from '@/components/layout/StaffTabBar';

export const dynamic = 'force-dynamic';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <div className="app-content page-with-tabbar">
        {children}
      </div>
      <StaffTabBar />
    </div>
  );
}
