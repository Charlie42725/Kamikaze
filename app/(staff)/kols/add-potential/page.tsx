'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { KolPotentialForm } from '@/components/kol/KolPotentialForm';
import { useKols } from '@/lib/hooks/useKols';
import type { KolInsert } from '@/lib/types/database';
import { ROUTES } from '@/lib/constants';

export default function AddPotentialKolPage() {
  const router = useRouter();
  const { createKol } = useKols();

  const handleSubmit = async (data: KolInsert) => {
    await createKol(data);
    router.push(ROUTES.STAFF.KOLS);
  };

  return (
    <div>
      <PageHeader title="新增潛在對象" />
      <KolPotentialForm onSubmit={handleSubmit} />
    </div>
  );
}
