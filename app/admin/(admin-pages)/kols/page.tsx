'use client';

import { useState } from 'react';
import { Tabs, Skeleton, Empty, SearchBar } from 'antd-mobile';
import { KolCard } from '@/components/kol/KolCard';
import { useKols } from '@/lib/hooks/useKols';
import type { KolStatus } from '@/lib/types/database';

export default function AdminKolsPage() {
  const [activeTab, setActiveTab] = useState<KolStatus | 'all'>('all');
  const { kols, loading } = useKols(activeTab);
  const [search, setSearch] = useState('');

  const filteredKols = search
    ? kols.filter((k) => k.ig_handle.toLowerCase().includes(search.toLowerCase()))
    : kols;

  return (
    <div>
      <div className="px-4 pt-4">
        <h2 className="text-xl font-bold mb-4">全部網紅</h2>
        <SearchBar
          placeholder="搜尋 IG 帳號"
          value={search}
          onChange={setSearch}
          style={{ marginBottom: 12 }}
        />
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
          <Skeleton.Paragraph lineCount={5} animated />
        ) : filteredKols.length === 0 ? (
          <Empty description="尚無網紅資料" />
        ) : (
          filteredKols.map((kol) => (
            <KolCard key={kol.id} kol={kol} basePath="/admin/kols" />
          ))
        )}
      </div>
    </div>
  );
}
