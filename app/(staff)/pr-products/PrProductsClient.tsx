'use client';

import { useState, useMemo } from 'react';
import { List, Switch, Tag, Empty, Toast, Tabs, Dialog, Skeleton, Button } from 'antd-mobile';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useStaffPrData } from '@/lib/hooks/data/useStaffPrData';
import { mutate } from 'swr';
import type { KolWithProducts } from '@/lib/hooks/data/useStaffPrData';

export function PrProductsClient({ userId }: { userId: string }) {
  const supabase = useSupabase();
  const { data: kols, isLoading } = useStaffPrData(userId);
  const [localKols, setLocalKols] = useState<KolWithProducts[] | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('direct');

  const displayKols = localKols ?? kols ?? [];

  const handleCancelPr = async (kol: KolWithProducts) => {
    const confirmed = await Dialog.confirm({
      title: '已消失案件',
      content: `確定取消與 @${kol.ig_handle} 的公關品合作嗎？`,
      confirmText: '確定取消',
      cancelText: '返回',
    });
    if (!confirmed) return;
    setLocalKols((prev) => (prev ?? kols ?? []).filter((k) => k.id !== kol.id));
    try {
      const { error } = await supabase.from('kols').update({ has_pr_products: false } as never).eq('id', kol.id);
      if (error) throw error;
      await mutate(['staff-pr', userId]);
      setLocalKols(undefined);
      Toast.show({ content: '已取消公關品合作', icon: 'success' });
    } catch {
      setLocalKols((prev) => [...(prev ?? kols ?? []), kol]);
      Toast.show({ content: '操作失敗', icon: 'fail' });
    }
  };

  const handleToggle = async (kolId: string, field: 'pr_ship_reminded' | 'pr_products_received', value: boolean) => {
    if (field === 'pr_products_received' && value) {
      const confirmed = await Dialog.confirm({
        title: '確認已收到公關品',
        content: '確定網紅已收到公關品嗎？確認後將標記為完成。',
        confirmText: '確認',
        cancelText: '取消',
      });
      if (!confirmed) return;
    }
    setLocalKols((prev) => (prev ?? kols ?? []).map((k) => (k.id === kolId ? { ...k, [field]: value } : k)));
    try {
      const { error } = await supabase.from('kols').update({ [field]: value } as never).eq('id', kolId);
      if (error) throw error;
      await mutate(['staff-pr', userId]);
      setLocalKols(undefined);
      Toast.show({ content: '更新成功', icon: 'success' });
    } catch {
      setLocalKols((prev) => (prev ?? kols ?? []).map((k) => (k.id === kolId ? { ...k, [field]: !value } : k)));
      Toast.show({ content: '更新失敗', icon: 'fail' });
    }
  };

  const pendingKols = useMemo(() => displayKols.filter((k) => !k.pr_products_received), [displayKols]);
  const directKols = useMemo(() => pendingKols.filter((k) => k.pr_ship_mode !== 'after_3_sales'), [pendingKols]);
  const conditionalKols = useMemo(() => pendingKols.filter((k) => k.pr_ship_mode === 'after_3_sales'), [pendingKols]);
  const completedKols = useMemo(() => displayKols.filter((k) => k.pr_products_received), [displayKols]);

  const renderKolList = (items: KolWithProducts[]) => {
    if (items.length === 0) return <Empty description="沒有資料" style={{ padding: '32px 0' }} />;
    return (
      <List>
        {items.map((kol) => (
          <List.Item
            key={kol.id}
            extra={
              <Button
                size="mini"
                color="danger"
                fill="outline"
                onClick={(e) => { e.stopPropagation(); handleCancelPr(kol); }}
              >
                已消失案件
              </Button>
            }
            description={
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">已寄出</span>
                  <Tag color={kol.pr_shipped ? 'success' : 'default'}>{kol.pr_shipped ? '已寄出' : '未寄出'}</Tag>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">已提醒</span>
                  <Switch checked={kol.pr_ship_reminded} onChange={(v) => handleToggle(kol.id, 'pr_ship_reminded', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">已收到</span>
                  <Switch checked={kol.pr_products_received} onChange={(v) => handleToggle(kol.id, 'pr_products_received', v)} />
                </div>
              </div>
            }
          >
            <span className="font-medium">@{kol.ig_handle}</span>
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
        {isLoading && !kols ? (
          <Skeleton.Paragraph lineCount={5} animated />
        ) : (
          <>
            {activeTab === 'direct' && renderKolList(directKols)}
            {activeTab === 'conditional' && renderKolList(conditionalKols)}
            {activeTab === 'completed' && (
              completedKols.length === 0 ? (
                <Empty description="沒有已完成項目" style={{ padding: '32px 0' }} />
              ) : (
                <List>
                  {completedKols.map((kol) => (
                    <List.Item key={kol.id} extra={<Tag color="success" fill="outline">已收到</Tag>}>
                      <span>@{kol.ig_handle}</span>
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
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
