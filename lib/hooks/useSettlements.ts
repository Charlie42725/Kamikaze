'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import type { Settlement, SettlementInsert, SettlementUpdate } from '@/lib/types/database';

type SettlementWithKol = Settlement & { kol?: { ig_handle: string } };

export function useSettlements(settled?: boolean) {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [settlements, setSettlements] = useState<SettlementWithKol[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSettlements = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('settlements')
      .select('*, kol:kols(ig_handle)')
      .order('created_at', { ascending: false });

    if (settled !== undefined) {
      query = query.eq('is_settled', settled);
    }

    const { data, error } = await query;
    if (!error && data) {
      setSettlements(data as unknown as SettlementWithKol[]);
    }
    setLoading(false);
  }, [supabase, settled]);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  const createSettlement = async (settlement: SettlementInsert) => {
    const { data, error } = await supabase
      .from('settlements')
      .insert({ ...settlement, created_by: user?.id } as never)
      .select()
      .single();
    if (error) throw error;
    await fetchSettlements();
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
    await fetchSettlements();
    return data as unknown as Settlement;
  };

  const getSettlement = async (id: string) => {
    const { data, error } = await supabase
      .from('settlements')
      .select('*, kol:kols(ig_handle)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as unknown as SettlementWithKol;
  };

  return { settlements, loading, fetchSettlements, createSettlement, updateSettlement, getSettlement };
}
