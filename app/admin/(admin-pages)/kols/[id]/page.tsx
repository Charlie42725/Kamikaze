'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  List,
  Button,
  Dialog,
  SpinLoading,
  Toast,
} from 'antd-mobile';
import { PageHeader } from '@/components/layout/PageHeader';
import { KolStatusBadge } from '@/components/kol/KolStatusBadge';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { ROUTES } from '@/lib/constants';
import type { Kol, Product, Settlement, Profile } from '@/lib/types/database';
import dayjs from 'dayjs';

export default function AdminKolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const supabase = useSupabase();
  const [kol, setKol] = useState<Kol | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [staff, setStaff] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: kolData } = await supabase
          .from('kols')
          .select('*')
          .eq('id', id)
          .single();
        setKol(kolData as unknown as Kol);

        const kd = kolData as unknown as Kol | null;
        if (kd?.staff_id) {
          const { data: staffData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', kd.staff_id)
            .single();
          setStaff(staffData as unknown as Profile);
        }

        const { data: kolProducts } = await supabase
          .from('kol_products')
          .select('product_id, product:products(*)')
          .eq('kol_id', id);

        if (kolProducts) {
          const items = kolProducts as unknown as Array<{ product_id: string; product: Product | Product[] | null }>;
          setProducts(
            items
              .map((kp) => {
                if (Array.isArray(kp.product)) return kp.product[0];
                return kp.product;
              })
              .filter(Boolean) as Product[]
          );
        }

        const { data: settlementData } = await supabase
          .from('settlements')
          .select('*')
          .eq('kol_id', id)
          .order('created_at', { ascending: false });

        if (settlementData) {
          setSettlements(settlementData as unknown as Settlement[]);
        }
      } catch {
        Toast.show({ content: '載入失敗', icon: 'fail' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, supabase]);

  if (loading || !kol) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <SpinLoading />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={`@${kol.ig_handle}`} />

      <div className="p-4">
        <Card style={{ marginBottom: 16 }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-lg">@{kol.ig_handle}</span>
            <KolStatusBadge status={kol.status} />
          </div>
          {staff && (
            <div className="text-sm text-gray-500">
              負責人：{staff.display_name}
            </div>
          )}
        </Card>

        <List header="開團資訊">
          <List.Item extra={kol.group_buy_start_date ? dayjs(kol.group_buy_start_date).format('YYYY/MM/DD') : '-'}>
            開團開始
          </List.Item>
          <List.Item extra={kol.group_buy_end_date ? dayjs(kol.group_buy_end_date).format('YYYY/MM/DD') : '-'}>
            開團結束
          </List.Item>
          <List.Item extra={kol.has_exclusive_store ? '是' : '否'}>
            專屬賣場
          </List.Item>
        </List>

        <List header="公關品">
          <List.Item extra={kol.has_pr_products ? '是' : '否'}>
            需要公關品
          </List.Item>
          {kol.has_pr_products && (
            <>
              <List.Item extra={kol.pr_ship_mode === 'after_3_sales' ? '銷售 3 件後寄出' : '直接寄出'}>
                寄送方式
              </List.Item>
              <List.Item extra={kol.pr_ship_reminded ? '已提醒' : '未提醒'}>
                提醒寄出
              </List.Item>
              <List.Item extra={kol.pr_shipped ? '已寄出' : '未寄出'}>
                寄出狀態
              </List.Item>
            </>
          )}
          <List.Item extra={kol.pr_products_received ? '已收到' : '未收到'}>
            收到狀態
          </List.Item>
        </List>

        <List header="分潤設定">
          <List.Item extra={kol.revenue_share_pct != null ? `${kol.revenue_share_pct}%` : '-'}>
            分潤比例
          </List.Item>
          <List.Item extra={kol.revenue_share_start_unit != null ? `${kol.revenue_share_start_unit} 件起` : '-'}>
            起算件數
          </List.Item>
        </List>

        {products.length > 0 && (
          <List header="合作商品">
            {products.map((p) => (
              <List.Item key={p.id} description={p.price ? `NT$ ${p.price}` : undefined}>
                {p.name}
              </List.Item>
            ))}
          </List>
        )}

        {settlements.length > 0 && (
          <List header="結算紀錄">
            {settlements.map((s) => (
              <List.Item
                key={s.id}
                extra={
                  [
                    s.kol_amount != null ? `網紅 NT$${s.kol_amount}` : null,
                    s.marketing_amount != null ? `行銷 NT$${s.marketing_amount}` : null,
                  ].filter(Boolean).join(' / ') || '-'
                }
                description={`${s.is_settled ? '已結算' : '待結算'} ${s.sales_rating ? `| 評級: ${'★'.repeat(s.sales_rating)}` : ''}`}
              >
                {s.period_start && s.period_end
                  ? `${dayjs(s.period_start).format('MM/DD')} - ${dayjs(s.period_end).format('MM/DD')}`
                  : dayjs(s.created_at).format('YYYY/MM/DD')}
              </List.Item>
            ))}
          </List>
        )}

        {kol.notes && (
          <List header="備註">
            <List.Item>{kol.notes}</List.Item>
          </List>
        )}

        <div style={{ padding: '24px 0' }}>
          <Button
            block
            color="danger"
            fill="outline"
            onClick={() => {
              Dialog.confirm({
                content: `確定要刪除 @${kol.ig_handle} 嗎？此操作無法復原。`,
                confirmText: '刪除',
                cancelText: '取消',
                onConfirm: async () => {
                  try {
                    const { error } = await supabase.from('kols').delete().eq('id', kol.id);
                    if (error) throw error;
                    Toast.show({ content: '已刪除', icon: 'success' });
                    router.replace(ROUTES.ADMIN.KOLS);
                  } catch {
                    Toast.show({ content: '刪除失敗', icon: 'fail' });
                  }
                },
              });
            }}
          >
            刪除此網紅
          </Button>
        </div>
      </div>
    </div>
  );
}
