'use client';

import { mutate } from 'swr';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { Settlement, SettlementInsert, SettlementUpdate } from '@/lib/types/database';

const invalidateSettlementCaches = () =>
  mutate((key) => {
    const k = Array.isArray(key) ? key[0] : key;
    return typeof k === 'string' && ['staff-settlements', 'admin-settlements'].includes(k);
  });

export function useSettlements() {
  const supabase = useSupabase();

  const createSettlement = async (settlement: SettlementInsert) => {
    const { data, error } = await supabase.from('settlements').insert(settlement as never).select().single();
    if (error) throw error;
    await invalidateSettlementCaches();
    return data as unknown as Settlement;
  };

  const updateSettlement = async (id: string, updates: SettlementUpdate) => {
    const { data, error } = await supabase.from('settlements').update(updates as never).eq('id', id).select().single();
    if (error) throw error;
    await invalidateSettlementCaches();
    return data as unknown as Settlement;
  };

  return { createSettlement, updateSettlement };
}
