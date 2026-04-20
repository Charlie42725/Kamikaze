'use client';

import { useState, useMemo } from 'react';
import { List, Switch, Tag, Empty, Toast, Collapse, Tabs, Dialog, Button } from 'antd-mobile';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { KolWithStaff } from './page';

function groupByStaff(kols: KolWithStaff[]) {
  const groups: Record<string, KolWithStaff[]> = {};
  for (const kol of kols) {
    const key = kol.staff_id || '_unassigned';
    if (!groups[key]) groups[key] = [];
    groups[key].push(kol);
  }
  return Object.entries(groups)
    .map(([key, items]) => ({ key, staffName: key === '_unassigned' ? '未指派' : (items[0]?.staffName || '未知'), items }))
    .sort((a, b) => a.staffName.localeCompare(b.staffName));
}

export function AdminPrProductsClient({ initialKols }: { initialKols: KolWithStaff[] }) {
  const supabase = useSupabase();
  const [kols, setKols] = useState(initialKols);
  const [activeTab, setActiveTab] = useState('direct');

  const handleSkipShipping = async (kol: KolWithStaff) => {
    const confirmed = await Dialog.confirm({
      title: '確認不必寄出',
      content: `確定 @${kol.ig_handle} 不需要寄出公關品嗎？`,
      confirmText: '確認',
      cancelText: '取消',
    });
    if (!confirmed) return;
    setKols((prev) => prev.filter((k) => k.id !== kol.id));
    try {
      const { error } = await supabase.from('kols').update({ has_pr_products: false } as never).eq('id', kol.id);
      if (error) throw error;
      Toast.show({ content: '已標記為不必寄出', icon: 'success' });
    } catch {
      setKols((prev) => [...prev, kol]);
      Toast.show({ content: '更新失敗', icon: 'fail' });
    }
  };

  const handleToggle = async (kolId: string, field: 'pr_shipped' | 'pr_ship_reminded', value: boolean) => {
    setKols((prev) => prev.map((k) => (k.id === kolId ? { ...k, [field]: value } : k)));
    try {
      const { error } = await supabase.from('kols').update({ [field]: value } as never).eq('id', kolId);
      if (error) throw error;
      Toast.show({ content: '更新成功', icon: 'success' });
    } catch {
      setKols((prev) => prev.map((k) => (k.id === kolId ? { ...k, [field]: !value } : k)));
      Toast.show({ content: '更新失敗', icon: 'fail' });
    }
  };

  const directKols = useMemo(() => kols.filter((k) => k.pr_ship_mode !== 'after_3_sales'), [kols]);
  const conditionalKols = useMemo(() => kols.filter((k) => k.pr_ship_mode === 'after_3_sales'), [kols]);
  const directGroups = useMemo(() => groupByStaff(directKols), [directKols]);
  const conditionalGroups = useMemo(() => groupByStaff(conditionalKols), [conditionalKols]);

  const renderKolList = (groups: ReturnType<typeof groupByStaff>, showShipToggle: boolean, showSkipOption = false) => {
    if (groups.length === 0) return <Empty description="沒有資料" style={{ padding: '32px 0' }} />;
    return (
      <Collapse>
        {groups.map((group) => (
          <Collapse.Panel
            key={group.key}
            title={
              <div className="flex items-center gap-2">
                <span className="font-semibold">{group.staffName}</span>
                <Tag color="primary" fill="outline" style={{ fontSize: 10 }}>{group.items.length} 筆</Tag>
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
                          <Switch checked={kol.pr_shipped} onChange={(v) => handleToggle(kol.id, 'pr_shipped', v)} />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm">通知到貨</span>
                        <Switch checked={kol.pr_ship_reminded} onChange={(v) => handleToggle(kol.id, 'pr_ship_reminded', v)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">已收到</span>
                        <Tag color={kol.pr_products_received ? 'success' : 'default'}>{kol.pr_products_received ? '已收到' : '未收到'}</Tag>
                      </div>
                      {showSkipOption && (
                        <Button size="small" color="danger" fill="outline" onClick={() => handleSkipShipping(kol)}>不必寄出</Button>
                      )}
                    </div>
                  }
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">@{kol.ig_handle}</span>
                  </div>
                  {kol.productNames.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {kol.productNames.map((name) => (
                        <Tag key={name} color="primary" fill="outline" style={{ fontSize: 10 }}>{name}</Tag>
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
        {activeTab === 'direct' ? renderKolList(directGroups, true) : renderKolList(conditionalGroups, true, true)}
      </div>
    </div>
  );
}
