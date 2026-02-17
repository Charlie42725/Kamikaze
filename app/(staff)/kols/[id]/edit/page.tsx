'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SpinLoading, Toast } from 'antd-mobile';
import { PageHeader } from '@/components/layout/PageHeader';
import { KolSopForm } from '@/components/kol/KolSopForm';
import { useKols } from '@/lib/hooks/useKols';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { ROUTES } from '@/lib/constants';
import type { Kol, KolUpdate } from '@/lib/types/database';

export default function EditKolPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getKol, updateKol } = useKols();
  const supabase = useSupabase();
  const [kol, setKol] = useState<Kol | null>(null);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kolData = await getKol(id);
        setKol(kolData);

        const { data: kolProducts } = await supabase
          .from('kol_products')
          .select('product_id')
          .eq('kol_id', id);

        if (kolProducts) {
          const items = kolProducts as unknown as Array<{ product_id: string }>;
          setProductIds(items.map((kp) => kp.product_id));
        }
      } catch {
        Toast.show({ content: '載入失敗', icon: 'fail' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (data: KolUpdate, newProductIds: string[]) => {
    await updateKol(id, data);

    // Update product links: delete old, insert new
    await supabase.from('kol_products').delete().eq('kol_id', id);
    if (newProductIds.length > 0) {
      const kolProducts = newProductIds.map((productId) => ({
        kol_id: id,
        product_id: productId,
      }));
      await supabase.from('kol_products').insert(kolProducts as never);
    }

    router.push(ROUTES.STAFF.KOL_DETAIL(id));
  };

  if (loading || !kol) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <SpinLoading />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="編輯網紅" />
      <KolSopForm
        initialData={kol}
        initialProductIds={productIds}
        onSubmit={handleSubmit}
        submitText="更新"
      />
    </div>
  );
}
