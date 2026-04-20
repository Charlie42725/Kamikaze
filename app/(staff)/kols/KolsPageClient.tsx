'use client';

import { useMemo, useState } from 'react';
import { Tabs, Empty, Skeleton } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
import { useRouter } from 'next/navigation';
import { KolCard } from '@/components/kol/KolCard';
import { getKolDisplayStatus, ROUTES } from '@/lib/constants';
import { useStaffKolsData } from '@/lib/hooks/data/useStaffKolsData';

type TabKey = 'all' | 'active' | 'upcoming' | 'potential' | 'ended';

export function KolsPageClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const { data: kols, isLoading } = useStaffKolsData(userId);

  const filteredKols = useMemo(() => {
    if (!kols) return [];
    if (activeTab === 'all') return kols;
    return kols.filter((k) => getKolDisplayStatus(k) === activeTab);
  }, [kols, activeTab]);

  return (
    <div>
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">我的網紅</h2>
        </div>
      </div>

      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as TabKey)}>
        <Tabs.Tab title="全部" key="all" />
        <Tabs.Tab title="進行中" key="active" />
        <Tabs.Tab title="待開團" key="upcoming" />
        <Tabs.Tab title="潛在" key="potential" />
        <Tabs.Tab title="已結束" key="ended" />
      </Tabs>

      <div className="p-4">
        {isLoading ? (
          <Skeleton.Paragraph lineCount={5} animated />
        ) : filteredKols.length === 0 ? (
          <Empty description="尚無網紅資料" />
        ) : (
          filteredKols.map((kol) => <KolCard key={kol.id} kol={kol} />)
        )}
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: 'calc(80px + env(safe-area-inset-bottom))',
          right: 24,
          zIndex: 999,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'var(--adm-color-primary, #1677ff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          cursor: 'pointer',
        }}
        onClick={() => router.push(ROUTES.STAFF.KOL_ADD)}
      >
        <AddOutline fontSize={24} />
      </div>
    </div>
  );
}
