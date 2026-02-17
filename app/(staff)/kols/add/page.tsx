'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { KolSopForm } from '@/components/kol/KolSopForm';
import { useKols } from '@/lib/hooks/useKols';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { KolInsert } from '@/lib/types/database';
import { ROUTES } from '@/lib/constants';

export default function AddKolPage() {
  const router = useRouter();
  const { createKol } = useKols();
  const supabase = useSupabase();

  const handleSubmit = async (data: KolInsert, productIds: string[]) => {
    const kol = await createKol(data);

    // Link products
    if (productIds.length > 0) {
      const kolProducts = productIds.map((productId) => ({
        kol_id: kol.id,
        product_id: productId,
      }));
      await supabase.from('kol_products').insert(kolProducts as never);
    }

    router.push(ROUTES.STAFF.KOLS);
  };

  return (
    <div>
      <PageHeader title="新增網紅 (SOP)" />
      <KolSopForm onSubmit={handleSubmit} submitText="新增" />
    </div>
  );
}
