'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, Empty, SearchBar, Collapse, Tag, Button, Skeleton } from 'antd-mobile';
import { KolCard } from '@/components/kol/KolCard';
import { getKolDisplayStatus, ROUTES } from '@/lib/constants';
import { useAdminKolsData } from '@/lib/hooks/data/useAdminKolsData';

type TabKey = 'all' | 'active' | 'upcoming' | 'potential' | 'ended';

export function AdminKolsClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAdminKolsData();

  const kols = data?.kols ?? [];
  const staffMap = data?.staffMap ?? {};

  const filteredKols = useMemo(() => {
    let list = kols;
    if (activeTab !== 'all') list = list.filter((k) => getKolDisplayStatus(k) === activeTab);
    if (search) list = list.filter((k) => k.ig_handle.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [kols, activeTab, search]);

  const staffGroups = useMemo(() => {
    const groups: Record<string, typeof kols> = {};
    for (const kol of filteredKols) {
      const key = kol.staff_id || '_unassigned';
      if (!groups[key]) groups[key] = [];
      groups[key].push(kol);
    }
    return Object.entries(groups)
      .map(([key, items]) => ({
        key,
        staffName: key === '_unassigned' ? '未指派' : (staffMap[key] || '未知'),
        items,
      }))
      .sort((a, b) => a.staffName.localeCompare(b.staffName));
  }, [filteredKols, staffMap]);

  return (
    <div>
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">全部網紅</h2>
          <div className="flex gap-2">
            <Button size="small" color="primary" fill="outline" onClick={() => router.push(ROUTES.ADMIN.KOL_ADD_POTENTIAL)}>+ 潛在</Button>
            <Button size="small" color="primary" onClick={() => router.push(ROUTES.ADMIN.KOL_ADD)}>+ SOP</Button>
          </div>
        </div>
        <SearchBar placeholder="搜尋 IG 帳號" value={search} onChange={setSearch} style={{ marginBottom: 12 }} />
      </div>

      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as TabKey)}>
        <Tabs.Tab title="全部" key="all" />
        <Tabs.Tab title="進行中" key="active" />
        <Tabs.Tab title="待開團" key="upcoming" />
        <Tabs.Tab title="潛在" key="potential" />
        <Tabs.Tab title="已結束" key="ended" />
      </Tabs>

      <div className="p-4">
        {isLoading && !data ? (
          <Skeleton.Paragraph lineCount={5} animated />
        ) : filteredKols.length === 0 ? (
          <Empty description="尚無網紅資料" />
        ) : (
          <Collapse>
            {staffGroups.map((group) => (
              <Collapse.Panel
                key={group.key}
                title={
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{group.staffName}</span>
                    <Tag color="primary" fill="outline" style={{ fontSize: 10 }}>{group.items.length} 位</Tag>
                  </div>
                }
              >
                {group.items.map((kol) => <KolCard key={kol.id} kol={kol} basePath="/admin/kols" />)}
              </Collapse.Panel>
            ))}
          </Collapse>
        )}
      </div>
    </div>
  );
}
