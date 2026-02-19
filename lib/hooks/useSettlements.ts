'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import type { Settlement, SettlementInsert, SettlementUpdate } from '@/lib/types/database';

type SettlementWithKol = Settlement & {
  kol?: {
    ig_handle: string;
    staff_id: string | null;
    group_buy_start_date: string | null;
    group_buy_end_date: string | null;
    staff?: { display_name: string } | null;
  };
};

export interface PendingSettlementKol {
  id: string;
  ig_handle: string;
  group_buy_end_date: string;
  staff_id: string | null;
  staff?: { display_name: string } | null;
}

interface UseSettlementsOptions {
  settled?: boolean;
  staffOnly?: boolean;
}

export function useSettlements(options: UseSettlementsOptions = {}) {
  const { settled, staffOnly } = options;
  const supabase = useSupabase();
  const { user, profile, loading: authLoading } = useAuth();
  const [settlements, setSettlements] = useState<SettlementWithKol[]>([]);
  const [pendingKols, setPendingKols] = useState<PendingSettlementKol[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const userId = user?.id;
  const profileRole = profile?.role;

  const fetchSettlements = useCallback(async () => {
    try {
      setLoading(true);

      if (settled === false) {
        // "待結算" — query pending_settlements view (KOLs needing settlement)
        let query = supabase
          .from('pending_settlements')
          .select('*')
          .order('group_buy_end_date', { ascending: true });

        if (staffOnly && userId) {
          query = query.eq('staff_id', userId);
        }

        const { data, error } = await query;
        if (error) console.error('fetchPendingSettlements error:', error);

        const results = (data ?? []) as unknown as PendingSettlementKol[];

        // Fetch staff names for admin view
        if (!staffOnly && results.length > 0) {
          const staffIds = [...new Set(results.map((r) => r.staff_id).filter(Boolean))] as string[];
          if (staffIds.length > 0) {
            const { data: profiles } = await supabase
              .from('profiles')
              .select('id, display_name')
              .in('id', staffIds);
            const profileMap = new Map((profiles ?? []).map((p: { id: string; display_name: string }) => [p.id, p.display_name]));
            for (const r of results) {
              if (r.staff_id && profileMap.has(r.staff_id)) {
                r.staff = { display_name: profileMap.get(r.staff_id)! };
              }
            }
          }
        }

        setPendingKols(results);
        setSettlements([]);
      } else {
        // "已結算" — query settlements table
        let query = supabase
          .from('settlements')
          .select('*, kol:kols(ig_handle, staff_id, group_buy_start_date, group_buy_end_date, staff:profiles(display_name))')
          .eq('is_settled', true)
          .order('settled_at', { ascending: false });

        const { data, error } = await query;
        if (error) console.error('fetchSettlements error:', error);

        let results = (data as unknown as SettlementWithKol[]) ?? [];

        if (staffOnly && userId) {
          results = results.filter((s) => s.kol?.staff_id === userId);
        }

        setSettlements(results);
        setPendingKols([]);
      }
    } catch (e) {
      console.error('fetchSettlements error:', e);
      setSettlements([]);
      setPendingKols([]);
    } finally {
      setLoading(false);
      fetchedRef.current = true;
    }
  }, [supabase, settled, staffOnly, userId]);

  useEffect(() => {
    if (authLoading) return;
    if (userId) {
      fetchSettlements();
    } else {
      setSettlements([]);
      setPendingKols([]);
      setLoading(false);
      fetchedRef.current = true;
    }
  }, [authLoading, userId, fetchSettlements]);

  // Safety timeout
  useEffect(() => {
    if (!authLoading && !fetchedRef.current) {
      const t = setTimeout(() => {
        if (!fetchedRef.current) {
          setLoading(false);
          fetchedRef.current = true;
        }
      }, 100);
      return () => clearTimeout(t);
    }
  }, [authLoading]);

  const createSettlement = async (settlement: SettlementInsert) => {
    const { data, error } = await supabase
      .from('settlements')
      .insert({ ...settlement, created_by: userId } as never)
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
      .select('*, kol:kols(ig_handle, staff_id, group_buy_start_date, group_buy_end_date, staff:profiles(display_name))')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as unknown as SettlementWithKol;
  };

  return {
    settlements,
    pendingKols,
    loading: authLoading ? true : loading,
    fetchSettlements,
    createSettlement,
    updateSettlement,
    getSettlement,
  };
}
