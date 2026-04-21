'use client';

import { useState, useMemo } from 'react';
import { List, Switch, Tag, Empty, Toast, Collapse, Tabs, Dialog, Button, Skeleton } from 'antd-mobile';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useAdminPrData } from '@/lib/hooks/data/useAdminPrData';
import { mutate } from 'swr';
import type { KolWithStaff } from '@/lib/hooks/data/useAdminPrData';

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

export function AdminPrProductsClient() {
  const supabase = useSupabase();
  const { data: fetchedKols, isLoading } = useAdminPrData();
  const [localKols, setLocalKols] = useState<KolWithStaff[] | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('direct');

  const kols = localKols ?? fetchedKols ?? [];

  const handleCancelPr = async (kol: KolWithStaff) => {
    const confirmed = await Dialog.confirm({
      title: '取消公關品合作',
      content: `確定取消與 @${kol.ig_handle} 的公關品合作並轉為潛在網紅嗎？`,
      confirmText: '確定',
      cancelText: '返回',
    });
    if (!confirmed) return;
    setLocalKols((prev) => (prev ?? fetchedKols ?? []).filter((k) => k.id !== kol.id));
    try {
      const { error } = await supabase
        .from('kols')
        .update({ has_pr_products: false, status: 'potential' } as never)
        .eq('id', kol.id);
      if (error) throw error;
      await mutate('admin-pr');
      setLocalKols(undefined);
      Toast.show({ content: '已轉為潛在網紅', icon: 'success' });
    } catch {
      setLocalKols((prev) => [...(prev ?? fetchedKols ?? []), kol]);
      Toast.show({ content: '操作失敗', icon: 'fail' });
    }
  };

  const handleToggle = async (kolId: string, field: 'pr_shipped' | 'pr_ship_reminded' | 'pr_products_received', value: boolean) => {
    if (field === 'pr_products_received' && value) {
      const confirmed = await Dialog.confirm({
        title: '確認已收到公關品',
        content: '確定網紅已收到公關品嗎？',
        confirmText: '確認',
        cancelText: '取消',
      });
      if (!confirmed) return;
    }
    setLocalKols((prev) => (prev ?? fetchedKols ?? []).map((k) => (k.id === kolId ? { ...k, [field]: value } : k)));
    try {
      const { error } = await supabase.from('kols').update({ [field]: value } as never).eq('id', kolId);
      if (error) throw error;
      await mutate('admin-pr');
      setLocalKols(undefined);
      Toast.show({ content: '更新成功', icon: 'success' });
    } catch {
      setLocalKols((prev) => (prev ?? fetchedKols ?? []).map((k) => (k.id === kolId ? { ...k, [field]: !value } : k)));
      Toast.show({ content: '更新失敗', icon: 'fail' });
    }
  };

  const pendingKols = useMemo(() => kols.filter((k) => !k.pr_products_received), [kols]);
  const completedKols = useMemo(() => kols.filter((k) => k.pr_products_received), [kols]);
  const directKols = useMemo(() => pendingKols.filter((k) => k.pr_ship_mode !== 'after_3_sales'), [pendingKols]);
  const conditionalKols = useMemo(() => pendingKols.filter((k) => k.pr_ship_mode === 'after_3_sales'), [pendingKols]);
  const directGroups = useMemo(() => groupByStaff(directKols), [directKols]);
  const conditionalGroups = useMemo(() => groupByStaff(conditionalKols), [conditionalKols]);
  const completedGroups = useMemo(() => groupByStaff(completedKols), [completedKols]);

  const renderKolList = (groups: ReturnType<typeof groupByStaff>, showShipToggle: boolean) => {
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
                        <Switch checked={kol.pr_products_received} onChange={(v) => handleToggle(kol.id, 'pr_products_received', v)} />
                      </div>
                    </div>
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="font-medium">@{kol.ig_handle}</span>
                      {kol.productNames.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {kol.productNames.map((name) => (
                            <Tag key={name} color="primary" fill="outline" style={{ fontSize: 10 }}>{name}</Tag>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      size="mini"
                      color="danger"
                      fill="none"
                      style={{ flexShrink: 0 }}
                      onClick={(e) => { e.stopPropagation(); handleCancelPr(kol); }}
                    >
                      取消
                    </Button>
                  </div>
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
        {completedKols.length > 0 && <Tabs.Tab title={`已完成 (${completedKols.length})`} key="completed" />}
      </Tabs>

      <div className="p-4">
        {isLoading && !fetchedKols ? (
          <Skeleton.Paragraph lineCount={5} animated />
        ) : (
          <>
            {activeTab === 'direct' && renderKolList(directGroups, true)}
            {activeTab === 'conditional' && renderKolList(conditionalGroups, true)}
            {activeTab === 'completed' && renderKolList(completedGroups, false)}
          </>
        )}
      </div>
    </div>
  );
}
