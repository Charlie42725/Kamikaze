'use client';
import useSWR from 'swr';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { Settlement } from '@/lib/types/database';

export interface PendingKol {
  id: string;
  ig_handle: string;
  group_buy_start_date: string | null;
  group_buy_end_date: string;
  staff_id: string | null;
}

export type SettlementWithKol = Settlement & {
  kol?: { ig_handle: string; staff_id: string | null; group_buy_start_date: string | null; group_buy_end_date: string | null } | null;
};

export function useStaffSettlementsData(userId: string | null) {
  const supabase = useSupabase();
  return useSWR(
    userId ? ['staff-settlements', userId] : null,
    async () => {
      const [endedKolsRes, settledIdsRes, settlementsRes] = await Promise.all([
        supabase
          .from('kols')
          .select('id, ig_handle, group_buy_start_date, group_buy_end_date, staff_id')
          .eq('status', 'ended')
          .eq('staff_id', userId!)
          .not('group_buy_end_date', 'is', null)
          .order('group_buy_end_date', { ascending: true }),
        supabase.from('settlements').select('kol_id').eq('is_settled', true),
        supabase
          .from('settlements')
          .select('*, kol:kols(ig_handle, staff_id, group_buy_start_date, group_buy_end_date)')
          .eq('is_settled', true)
          .order('settled_at', { ascending: false }),
      ]);
      const settledKolIds = new Set((settledIdsRes.data ?? []).map((s: { kol_id: string }) => s.kol_id));
      const pendingKols = ((endedKolsRes.data ?? []) as unknown as PendingKol[]).filter((k) => !settledKolIds.has(k.id));
      const allSettlements = (settlementsRes.data as unknown as SettlementWithKol[]) ?? [];
      const settlements = allSettlements.filter((s) => s.kol?.staff_id === userId);
      return { pendingKols, settlements };
    },
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
}
