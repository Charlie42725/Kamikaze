'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { KolSopForm } from '@/components/kol/KolSopForm';
import { useKols } from '@/lib/hooks/useKols';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { KolInsert } from '@/lib/types/database';
import { ROUTES } from '@/lib/constants';

export function AddKolClient({ userId }: { userId: string }) {
  const router = useRouter();
  const { createKol } = useKols();
  const supabase = useSupabase();

  const handleSubmit = async (data: KolInsert, productIds: string[]) => {
    const kol = await createKol(data);
    if (productIds.length > 0) {
      await supabase.from('kol_products').insert(
        productIds.map((productId) => ({ kol_id: kol.id, product_id: productId })) as never
      );
    }
    router.push(ROUTES.STAFF.KOLS);
  };

  return (
    <div>
      <PageHeader title="新增網紅 (SOP)" />
      <KolSopForm overrideStaffId={userId} onSubmit={handleSubmit} submitText="新增" />
    </div>
  );
}
