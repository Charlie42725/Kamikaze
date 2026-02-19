'use client';

import { useEffect, useState, useCallback } from 'react';
import { List, Switch, Tag, Empty, Skeleton, Toast } from 'antd-mobile';
import { PageHeader } from '@/components/layout/PageHeader';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import type { Kol } from '@/lib/types/database';

export default function StaffPrProductsPage() {
  const supabase = useSupabase();
  const { profile, loading: authLoading } = useAuth();
  const [kols, setKols] = useState<Kol[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrKols = useCallback(async () => {
    if (!profile?.id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kols')
        .select('*')
        .eq('staff_id', profile.id)
        .eq('has_pr_products', true)
        .in('status', ['potential', 'active'])
        .order('created_at', { ascending: false });

      if (error) console.error('fetchPrKols error:', error);
      setKols((data as unknown as Kol[]) ?? []);
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
    try {
      const { error } = await supabase
        .from('kols')
        .update({ [field]: value } as never)
        .eq('id', kolId);

      if (error) throw error;
      Toast.show({ content: '更新成功', icon: 'success' });
      await fetchPrKols();
    } catch {
      Toast.show({ content: '更新失敗', icon: 'fail' });
    }
  };

  const shipModeLabel = (mode: string | null) => {
    if (mode === 'after_3_sales') return '銷售3件後';
    return '直接寄出';
  };

  if (loading || authLoading) {
    return (
      <div>
        <PageHeader title="公關品管理" showBack={false} />
        <div className="p-4">
          <Skeleton.Paragraph lineCount={5} animated />
        </div>
      </div>
    );
  }

  const pendingKols = kols.filter((k) => !k.pr_products_received);
  const completedKols = kols.filter((k) => k.pr_products_received);

  return (
    <div>
      <PageHeader title="公關品管理" showBack={false} />

      {pendingKols.length === 0 && completedKols.length === 0 && (
        <Empty description="目前沒有需要公關品的網紅" style={{ padding: '64px 0' }} />
      )}

      {pendingKols.length > 0 && (
        <List header="待處理">
          {pendingKols.map((kol) => (
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
                    <span className="text-sm">已提醒寄出</span>
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
              <div className="flex items-center gap-2">
                <span className="font-medium">@{kol.ig_handle}</span>
                <Tag color="primary" fill="outline" style={{ fontSize: 10 }}>
                  {shipModeLabel(kol.pr_ship_mode)}
                </Tag>
              </div>
            </List.Item>
          ))}
        </List>
      )}

      {completedKols.length > 0 && (
        <List header="已完成">
          {completedKols.map((kol) => (
            <List.Item
              key={kol.id}
              extra={
                <Tag color="success" fill="outline">
                  已收到
                </Tag>
              }
            >
              @{kol.ig_handle}
            </List.Item>
          ))}
        </List>
      )}
    </div>
  );
}
