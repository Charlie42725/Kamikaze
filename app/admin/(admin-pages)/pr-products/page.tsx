'use client';

import { useEffect, useState, useCallback } from 'react';
import { List, Switch, Tag, Empty, Skeleton, Toast } from 'antd-mobile';
import { PageHeader } from '@/components/layout/PageHeader';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { Kol, Profile } from '@/lib/types/database';

interface KolWithStaff extends Kol {
  staffName?: string;
}

export default function AdminPrProductsPage() {
  const supabase = useSupabase();
  const [kols, setKols] = useState<KolWithStaff[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrKols = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kols')
        .select('*')
        .eq('has_pr_products', true)
        .eq('pr_products_received', false)
        .in('status', ['potential', 'active'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('fetchPrKols error:', error);
        return;
      }

      const kolList = (data as unknown as Kol[]) ?? [];

      // Fetch staff names
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
        kolList.map((k) => ({
          ...k,
          staffName: k.staff_id ? staffMap[k.staff_id] : undefined,
        }))
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

  const shipModeLabel = (mode: string | null) => {
    if (mode === 'after_3_sales') return '銷售3件後';
    return '直接寄出';
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="公關品管理" />
        <div className="p-4">
          <Skeleton.Paragraph lineCount={5} animated />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="公關品管理" />

      {kols.length === 0 && (
        <Empty description="目前沒有待寄公關品" style={{ padding: '64px 0' }} />
      )}

      {kols.length > 0 && (
        <List header={`待處理 (${kols.length})`}>
          {kols.map((kol) => (
            <List.Item
              key={kol.id}
              description={
                <div className="flex flex-col gap-2 mt-2">
                  {kol.staffName && (
                    <div className="text-xs text-gray-400">負責人：{kol.staffName}</div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm">已提醒寄出</span>
                    <Tag color={kol.pr_ship_reminded ? 'success' : 'default'}>
                      {kol.pr_ship_reminded ? '已提醒' : '未提醒'}
                    </Tag>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">已寄出</span>
                    <Switch
                      checked={kol.pr_shipped}
                      onChange={(checked) => handleToggleShipped(kol.id, checked)}
                    />
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
    </div>
  );
}
