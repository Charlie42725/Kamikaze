'use client';

import { useRouter } from 'next/navigation';
import { Toast } from 'antd-mobile';
import { PageHeader } from '@/components/layout/PageHeader';
import { KolSopForm } from '@/components/kol/KolSopForm';
import { useKols } from '@/lib/hooks/useKols';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { ROUTES } from '@/lib/constants';
import type { Kol, KolUpdate } from '@/lib/types/database';

export function AdminKolEditClient({ kol, initialProductIds }: { kol: Kol; initialProductIds: string[] }) {
  const router = useRouter();
  const { updateKol } = useKols();
  const supabase = useSupabase();

  const handleSubmit = async (data: KolUpdate, newProductIds: string[]) => {
    try {
      await updateKol(kol.id, data);
      await supabase.from('kol_products').delete().eq('kol_id', kol.id);
      if (newProductIds.length > 0) {
        await supabase.from('kol_products').insert(
          newProductIds.map((productId) => ({ kol_id: kol.id, product_id: productId })) as never
        );
      }
      router.push(ROUTES.ADMIN.KOL_DETAIL(kol.id));
    } catch {
      Toast.show({ content: '更新失敗', icon: 'fail' });
    }
  };

  return (
    <div>
      <PageHeader title="編輯網紅" />
      <KolSopForm initialData={kol} initialProductIds={initialProductIds} onSubmit={handleSubmit} submitText="更新" />
    </div>
  );
}
