'use client';

import { useEffect, useMemo, useState } from 'react';
import { Tabs, Skeleton, Empty, SearchBar, Collapse, Tag } from 'antd-mobile';
import { KolCard } from '@/components/kol/KolCard';
import { useKols } from '@/lib/hooks/useKols';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { getKolDisplayStatus } from '@/lib/constants';
import type { Profile } from '@/lib/types/database';

type TabKey = 'all' | 'active' | 'upcoming' | 'potential' | 'ended';

export default function AdminKolsPage() {
  const supabase = useSupabase();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const { kols, loading } = useKols();
  const [search, setSearch] = useState('');
  const [staffMap, setStaffMap] = useState<Record<string, string>>({});
  const [staffLoading, setStaffLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, display_name')
        .eq('role', 'staff');
      const map: Record<string, string> = {};
      if (data) {
        for (const p of data as unknown as Pick<Profile, 'id' | 'display_name'>[]) {
          map[p.id] = p.display_name;
        }
      }
      setStaffMap(map);
      setStaffLoading(false);
    };
    fetchStaff();
  }, [supabase]);

  const filteredKols = useMemo(() => {
    let list = kols;
    if (activeTab !== 'all') {
      list = list.filter((k) => getKolDisplayStatus(k) === activeTab);
    }
    if (search) {
      list = list.filter((k) => k.ig_handle.toLowerCase().includes(search.toLowerCase()));
    }
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
  }, [filteredKols, staffMap, kols]);

  const isLoading = loading || staffLoading;

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
          <Collapse defaultActiveKey={staffGroups.map((g) => g.key)}>
            {staffGroups.map((group) => (
              <Collapse.Panel
                key={group.key}
                title={
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{group.staffName}</span>
                    <Tag color="primary" fill="outline" style={{ fontSize: 10 }}>
                      {group.items.length} 位
                    </Tag>
                  </div>
                }
              >
                {group.items.map((kol) => (
                  <KolCard key={kol.id} kol={kol} basePath="/admin/kols" />
                ))}
              </Collapse.Panel>
            ))}
          </Collapse>
        )}
      </div>
    </div>
  );
}
