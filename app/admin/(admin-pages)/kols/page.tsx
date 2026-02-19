'use client';

import { useEffect, useMemo, useState } from 'react';
import { Tabs, Skeleton, Empty, SearchBar } from 'antd-mobile';
import { KolCard } from '@/components/kol/KolCard';
import { useKols } from '@/lib/hooks/useKols';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { KolStatus, Profile } from '@/lib/types/database';

export default function AdminKolsPage() {
  const supabase = useSupabase();
  const [activeTab, setActiveTab] = useState<KolStatus | 'all'>('all');
  const { kols, loading } = useKols(activeTab);
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

  const filteredKols = search
    ? kols.filter((k) => k.ig_handle.toLowerCase().includes(search.toLowerCase()))
    : kols;

  const staffGroups = useMemo(() => {
    const groups: Record<string, typeof filteredKols> = {};
    for (const kol of filteredKols) {
      const key = kol.staff_id || '_unassigned';
      if (!groups[key]) groups[key] = [];
      groups[key].push(kol);
    }
    return Object.entries(groups)
      .map(([key, items]) => ({
        staffName: key === '_unassigned' ? '未指派' : (staffMap[key] || '未知'),
        items,
      }))
      .sort((a, b) => a.staffName.localeCompare(b.staffName));
  }, [filteredKols, staffMap]);

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

      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as KolStatus | 'all')}>
        <Tabs.Tab title="全部" key="all" />
        <Tabs.Tab title="進行中" key="active" />
        <Tabs.Tab title="潛在" key="potential" />
        <Tabs.Tab title="已結束" key="ended" />
      </Tabs>

      <div className="p-4">
        {isLoading ? (
          <Skeleton.Paragraph lineCount={5} animated />
        ) : filteredKols.length === 0 ? (
          <Empty description="尚無網紅資料" />
        ) : (
          staffGroups.map((group) => (
            <div key={group.staffName}>
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-4 mb-2">
                {group.staffName} ({group.items.length})
              </div>
              {group.items.map((kol) => (
                <KolCard key={kol.id} kol={kol} basePath="/admin/kols" />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
