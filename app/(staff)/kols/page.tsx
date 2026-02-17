'use client';

import { useState } from 'react';
import { Tabs, SpinLoading, Empty, FloatingBubble, Skeleton } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
import { useRouter } from 'next/navigation';
import { KolCard } from '@/components/kol/KolCard';
import { useKols } from '@/lib/hooks/useKols';
import { ROUTES } from '@/lib/constants';
import type { KolStatus } from '@/lib/types/database';

export default function KolsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<KolStatus | 'all'>('all');
  const { kols, loading } = useKols(activeTab);

  return (
    <div>
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">我的網紅</h2>
        </div>
      </div>

      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as KolStatus | 'all')}>
        <Tabs.Tab title="全部" key="all" />
        <Tabs.Tab title="進行中" key="active" />
        <Tabs.Tab title="潛在" key="potential" />
        <Tabs.Tab title="暫停" key="paused" />
        <Tabs.Tab title="已結束" key="ended" />
      </Tabs>

      <div className="p-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton.Paragraph lineCount={3} animated />
            <Skeleton.Paragraph lineCount={3} animated />
          </div>
        ) : kols.length === 0 ? (
          <Empty description="尚無網紅資料" />
        ) : (
          kols.map((kol) => <KolCard key={kol.id} kol={kol} />)
        )}
      </div>

      <FloatingBubble
        style={{
          '--initial-position-bottom': '80px',
          '--initial-position-right': '24px',
          '--edge-distance': '24px',
        }}
        onClick={() => router.push(ROUTES.STAFF.KOL_ADD)}
      >
        <AddOutline fontSize={24} />
      </FloatingBubble>
    </div>
  );
}
