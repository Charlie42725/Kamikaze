'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { List, Switch, Tag, Empty, Skeleton, Toast, Tabs } from 'antd-mobile';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import type { Kol } from '@/lib/types/database';

interface KolWithProducts extends Kol {
  productNames?: string[];
}

export default function StaffPrProductsPage() {
  const supabase = useSupabase();
  const { profile, loading: authLoading } = useAuth();
  const [kols, setKols] = useState<KolWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('direct');

  const fetchPrKols = useCallback(async () => {
    if (!profile?.id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kols')
        .select('*, kol_products(product:products(name))')
        .eq('staff_id', profile.id)
        .eq('has_pr_products', true)
        .in('status', ['potential', 'active'])
        .order('created_at', { ascending: false });

      if (error) console.error('fetchPrKols error:', error);
      const kolList = (data as unknown as Kol[]) ?? [];
      setKols(
        kolList.map((k) => {
          const raw = k as unknown as Kol & { kol_products?: { product: { name: string } | null }[] };
          const productNames = (raw.kol_products ?? [])
            .map((kp) => kp.product?.name)
            .filter(Boolean) as string[];
          return { ...k, productNames };
        })
      );
    } catch (e) {
      console.error('fetchPrKols error:', e);
    } finally {
      setLoading(false);
    }
  }, [supabase, profile?.id]);

  useEffect(() => {
    if (!authLoading && profile?.id) {
      fetchPrKols();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading, profile?.id, fetchPrKols]);

  const handleToggle = async (kolId: string, field: 'pr_ship_reminded' | 'pr_products_received', value: boolean) => {
    setKols(prev => prev.map(k => k.id === kolId ? { ...k, [field]: value } : k));
    try {
      const { error } = await supabase
        .from('kols')
        .update({ [field]: value } as never)
        .eq('id', kolId);

      if (error) throw error;
      Toast.show({ content: '更新成功', icon: 'success' });
    } catch {
      setKols(prev => prev.map(k => k.id === kolId ? { ...k, [field]: !value } : k));
      Toast.show({ content: '更新失敗', icon: 'fail' });
    }
  };

  // Split by ship mode — exclude already received
  const pendingKols = useMemo(() => kols.filter((k) => !k.pr_products_received), [kols]);
  const directKols = useMemo(() => pendingKols.filter((k) => k.pr_ship_mode !== 'after_3_sales'), [pendingKols]);
  const conditionalKols = useMemo(() => pendingKols.filter((k) => k.pr_ship_mode === 'after_3_sales'), [pendingKols]);
  const completedKols = useMemo(() => kols.filter((k) => k.pr_products_received), [kols]);

  const renderKolList = (items: KolWithProducts[]) => {
    if (items.length === 0) {
      return <Empty description="沒有資料" style={{ padding: '32px 0' }} />;
    }

    return (
      <List>
        {items.map((kol) => (
          <List.Item
            key={kol.id}
            description={
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">已寄出</span>
                  <Tag color={kol.pr_shipped ? 'success' : 'default'}>
                    {kol.pr_shipped ? '已寄出' : '未寄出'}
                  </Tag>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">已提醒</span>
                  <Switch
                    checked={kol.pr_ship_reminded}
                    onChange={(checked) => handleToggle(kol.id, 'pr_ship_reminded', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">已收到</span>
                  <Switch
                    checked={kol.pr_products_received}
                    onChange={(checked) => handleToggle(kol.id, 'pr_products_received', checked)}
                  />
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
    );
  };

  if (loading || authLoading) {
    return (
      <div>
        <div className="px-4 pt-4">
          <h2 className="text-xl font-bold mb-2">公關品管理</h2>
        </div>
        <div className="p-4">
          <Skeleton.Paragraph lineCount={5} animated />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="px-4 pt-4">
        <h2 className="text-xl font-bold mb-2">公關品管理</h2>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.Tab title={`直接寄出 (${directKols.length})`} key="direct" />
        <Tabs.Tab title={`銷售3件後 (${conditionalKols.length})`} key="conditional" />
        {completedKols.length > 0 && (
          <Tabs.Tab title={`已完成 (${completedKols.length})`} key="completed" />
        )}
      </Tabs>

      <div className="p-4">
        {activeTab === 'direct' && renderKolList(directKols)}
        {activeTab === 'conditional' && renderKolList(conditionalKols)}
        {activeTab === 'completed' && (
          completedKols.length === 0 ? (
            <Empty description="沒有已完成項目" style={{ padding: '32px 0' }} />
          ) : (
            <List>
              {completedKols.map((kol) => (
                <List.Item
                  key={kol.id}
                  extra={<Tag color="success" fill="outline">已收到</Tag>}
                >
                  <span>@{kol.ig_handle}</span>
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
          )
        )}
      </div>
    </div>
  );
}
