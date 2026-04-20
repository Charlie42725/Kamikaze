'use client';

import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { Settlement, SettlementInsert, SettlementUpdate } from '@/lib/types/database';

export function useSettlements() {
  const supabase = useSupabase();
  const router = useRouter();

  const createSettlement = async (settlement: SettlementInsert) => {
    const { data, error } = await supabase
      .from('settlements')
      .insert(settlement as never)
      .select()
      .single();
    if (error) throw error;
    router.refresh();
    return data as unknown as Settlement;
  };

  const updateSettlement = async (id: string, updates: SettlementUpdate) => {
    const { data, error } = await supabase
      .from('settlements')
      .update(updates as never)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    router.refresh();
    return data as unknown as Settlement;
  };

  return { createSettlement, updateSettlement };
}
