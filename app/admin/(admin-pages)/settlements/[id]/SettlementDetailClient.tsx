'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { SettlementForm } from '@/components/settlement/SettlementForm';
import { useSettlements } from '@/lib/hooks/useSettlements';
import type { Settlement, SettlementInsert, SettlementUpdate } from '@/lib/types/database';
import { ROUTES } from '@/lib/constants';

type SettlementWithKol = Settlement & { kol?: { ig_handle: string } };

interface Props {
  id: string;
  isNew: boolean;
  initialSettlement?: SettlementWithKol;
  kolHandle?: string;
}

export function SettlementDetailClient({ id, isNew, initialSettlement, kolHandle }: Props) {
  const router = useRouter();
  const { createSettlement, updateSettlement } = useSettlements();

  const handleSubmit = async (data: SettlementInsert | SettlementUpdate) => {
    if (isNew) {
      await createSettlement(data as SettlementInsert);
    } else {
      await updateSettlement(id, data as SettlementUpdate);
    }
    router.push(ROUTES.ADMIN.SETTLEMENTS);
  };

  const displayHandle = isNew ? kolHandle : initialSettlement?.kol?.ig_handle;

  return (
    <div>
      <PageHeader title={`結算 - @${displayHandle || '未知'}`} />
      <SettlementForm
        initialData={isNew ? undefined : initialSettlement}
        kolId={isNew ? id : initialSettlement!.kol_id}
        onSubmit={handleSubmit}
        submitText={isNew ? '建立結算' : '更新'}
      />
    </div>
  );
}
