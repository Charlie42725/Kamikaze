'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SpinLoading, Toast } from 'antd-mobile';
import { PageHeader } from '@/components/layout/PageHeader';
import { SettlementForm } from '@/components/settlement/SettlementForm';
import { useSettlements } from '@/lib/hooks/useSettlements';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { Settlement, SettlementInsert, SettlementUpdate } from '@/lib/types/database';
import { ROUTES } from '@/lib/constants';

export default function SettlementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const supabase = useSupabase();
  const { createSettlement, updateSettlement, getSettlement } = useSettlements();
  const [settlement, setSettlement] = useState<(Settlement & { kol?: { ig_handle: string } }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Check if this is a KOL ID (create new settlement) or settlement ID (edit)
      const { data: existingSettlement } = await supabase
        .from('settlements')
        .select('*, kol:kols(ig_handle)')
        .eq('id', id)
        .single();

      if (existingSettlement) {
        setSettlement(existingSettlement as unknown as typeof settlement);
        setIsNew(false);
      } else {
        // ID is a KOL ID - create new settlement
        const { data: kol } = await supabase
          .from('kols')
          .select('ig_handle')
          .eq('id', id)
          .single();

        const kolData = kol as unknown as { ig_handle: string } | null;
        if (kolData) {
          setSettlement({
            id: '',
            kol_id: id,
            sales_rating: null,
            kol_amount: null,
            marketing_amount: null,
            is_settled: false,
            settled_at: null,
            period_start: null,
            period_end: null,
            notes: null,
            created_by: null,
            created_at: '',
            updated_at: '',
            kol: { ig_handle: kolData.ig_handle },
          });
          setIsNew(true);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [id, supabase]);

  const handleSubmit = async (data: SettlementInsert | SettlementUpdate) => {
    if (isNew) {
      await createSettlement(data as SettlementInsert);
    } else {
      await updateSettlement(id, data as SettlementUpdate);
    }
    router.push(ROUTES.ADMIN.SETTLEMENTS);
  };

  if (loading || !settlement) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <SpinLoading />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`結算 - @${settlement.kol?.ig_handle || '未知'}`}
      />
      <SettlementForm
        initialData={isNew ? undefined : settlement}
        kolId={isNew ? id : settlement.kol_id}
        onSubmit={handleSubmit}
        submitText={isNew ? '建立結算' : '更新'}
      />
    </div>
  );
}
