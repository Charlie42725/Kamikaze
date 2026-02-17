'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  List,
  Button,
  Skeleton,
  Tag,
  Space,
  Dialog,
  Toast,
} from 'antd-mobile';
import { PageHeader } from '@/components/layout/PageHeader';
import { KolStatusBadge } from '@/components/kol/KolStatusBadge';
import { useKols } from '@/lib/hooks/useKols';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { ROUTES } from '@/lib/constants';
import type { Kol, Product } from '@/lib/types/database';
import dayjs from 'dayjs';

export default function KolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getKol } = useKols();
  const supabase = useSupabase();
  const [kol, setKol] = useState<Kol | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kolData = await getKol(id);
        setKol(kolData);

        // Fetch linked products
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
      } catch {
        Toast.show({ content: '載入失敗', icon: 'fail' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading || !kol) {
    return (
      <div>
        <PageHeader title="載入中..." />
        <div className="p-4">
          <Skeleton.Paragraph lineCount={5} animated />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`@${kol.ig_handle}`}
        right={
          <Button
            size="small"
            color="primary"
            fill="none"
            onClick={() => router.push(ROUTES.STAFF.KOL_EDIT(kol.id))}
          >
            編輯
          </Button>
        }
      />

      <div className="p-4">
        <Card style={{ marginBottom: 16 }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-lg">@{kol.ig_handle}</span>
            <KolStatusBadge status={kol.status} />
          </div>
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

        {kol.notes && (
          <List header="備註">
            <List.Item>{kol.notes}</List.Item>
          </List>
        )}
      </div>
    </div>
  );
}
