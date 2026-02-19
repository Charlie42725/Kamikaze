'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { List, Switch, Tag, Empty, Skeleton, Toast, Collapse, Tabs } from 'antd-mobile';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { Kol, Profile } from '@/lib/types/database';

interface KolWithStaff extends Kol {
  staffName?: string;
  productNames?: string[];
}

function groupByStaff(kols: KolWithStaff[]) {
  const groups: Record<string, KolWithStaff[]> = {};
  for (const kol of kols) {
    const key = kol.staff_id || '_unassigned';
    if (!groups[key]) groups[key] = [];
    groups[key].push(kol);
  }
  return Object.entries(groups)
    .map(([key, items]) => ({
      key,
      staffName: key === '_unassigned' ? '未指派' : (items[0]?.staffName || '未知'),
      items,
    }))
    .sort((a, b) => a.staffName.localeCompare(b.staffName));
}

export default function AdminPrProductsPage() {
  const supabase = useSupabase();
  const [kols, setKols] = useState<KolWithStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('direct');

  const fetchPrKols = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kols')
        .select('*, kol_products(product:products(name))')
        .eq('has_pr_products', true)
        .eq('pr_products_received', false)
        .in('status', ['potential', 'active'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('fetchPrKols error:', error);
        return;
      }

      const kolList = (data as unknown as Kol[]) ?? [];

      const staffIds = [...new Set(kolList.map((k) => k.staff_id).filter(Boolean))] as string[];
      let staffMap: Record<string, string> = {};
      if (staffIds.length > 0) {
        const { data: staffData } = await supabase
          .from('profiles')
          .select('id, display_name')
          .in('id', staffIds);
        if (staffData) {
          staffMap = Object.fromEntries(
            (staffData as unknown as Profile[]).map((s) => [s.id, s.display_name])
          );
        }
      }

      setKols(
        kolList.map((k) => {
          const raw = k as unknown as Kol & { kol_products?: { product: { name: string } | null }[] };
          const productNames = (raw.kol_products ?? [])
            .map((kp) => kp.product?.name)
            .filter(Boolean) as string[];
          return {
            ...k,
            staffName: k.staff_id ? staffMap[k.staff_id] : undefined,
            productNames,
          };
        })
      );
    } catch (e) {
      console.error('fetchPrKols error:', e);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchPrKols();
  }, [fetchPrKols]);

  const handleToggleShipped = async (kolId: string, value: boolean) => {
    try {
      const { error } = await supabase
        .from('kols')
        .update({ pr_shipped: value } as never)
        .eq('id', kolId);

      if (error) throw error;
      Toast.show({ content: '更新成功', icon: 'success' });
      await fetchPrKols();
    } catch {
      Toast.show({ content: '更新失敗', icon: 'fail' });
    }
  };

  // Split by ship mode
  const directKols = useMemo(() => kols.filter((k) => k.pr_ship_mode !== 'after_3_sales'), [kols]);
  const conditionalKols = useMemo(() => kols.filter((k) => k.pr_ship_mode === 'after_3_sales'), [kols]);

  const directGroups = useMemo(() => groupByStaff(directKols), [directKols]);
  const conditionalGroups = useMemo(() => groupByStaff(conditionalKols), [conditionalKols]);

  const renderKolList = (groups: ReturnType<typeof groupByStaff>, showShipToggle: boolean) => {
    if (groups.length === 0) {
      return <Empty description="沒有資料" style={{ padding: '32px 0' }} />;
    }

    return (
      <Collapse>
        {groups.map((group) => (
          <Collapse.Panel
            key={group.key}
            title={
              <div className="flex items-center gap-2">
                <span className="font-semibold">{group.staffName}</span>
                <Tag color="primary" fill="outline" style={{ fontSize: 10 }}>
                  {group.items.length} 筆
                </Tag>
              </div>
            }
          >
            <List>
              {group.items.map((kol) => (
                <List.Item
                  key={kol.id}
                  description={
                    <div className="flex flex-col gap-2 mt-2">
                      {showShipToggle && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">已寄出</span>
                          <Switch
                            checked={kol.pr_shipped}
                            onChange={(checked) => handleToggleShipped(kol.id, checked)}
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm">已提醒</span>
                        <Tag color={kol.pr_ship_reminded ? 'success' : 'default'}>
                          {kol.pr_ship_reminded ? '已提醒' : '未提醒'}
                        </Tag>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">已收到</span>
                        <Tag color={kol.pr_products_received ? 'success' : 'default'}>
                          {kol.pr_products_received ? '已收到' : '未收到'}
                        </Tag>
                      </div>
                    </div>
                  }
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">@{kol.ig_handle}</span>
                  </div>
                  {kol.productNames && kol.productNames.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {kol.productNames.map((name) => (
                        <Tag key={name} color="default" fill="outline" style={{ fontSize: 10 }}>
                          {name}
                        </Tag>
                      ))}
                    </div>
                  )}
                </List.Item>
              ))}
            </List>
          </Collapse.Panel>
        ))}
      </Collapse>
    );
  };

  return (
    <div>
      <div className="px-4 pt-4">
        <h2 className="text-xl font-bold mb-2">公關品管理</h2>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.Tab title={`直接寄出 (${directKols.length})`} key="direct" />
        <Tabs.Tab title={`銷售3件後 (${conditionalKols.length})`} key="conditional" />
      </Tabs>

      <div className="p-4">
        {loading ? (
          <Skeleton.Paragraph lineCount={5} animated />
        ) : activeTab === 'direct' ? (
          renderKolList(directGroups, true)
        ) : (
          renderKolList(conditionalGroups, true)
        )}
      </div>
    </div>
  );
}
