import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminSettlementsClient } from './AdminSettlementsClient';
import type { Settlement } from '@/lib/types/database';

interface PendingKol {
  id: string;
  ig_handle: string;
  group_buy_start_date: string | null;
  group_buy_end_date: string;
  staff_id: string | null;
  staff?: { display_name: string } | null;
}

type SettlementWithKol = Settlement & {
  kol?: { ig_handle: string; staff_id: string | null; staff?: { display_name: string } | null } | null;
};

export default async function AdminSettlementsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const [endedKolsRes, settledIdsRes, settlementsRes] = await Promise.all([
    supabase
      .from('kols')
      .select('id, ig_handle, group_buy_start_date, group_buy_end_date, staff_id, staff:profiles(display_name)')
      .eq('status', 'ended')
      .not('group_buy_end_date', 'is', null)
      .order('group_buy_end_date', { ascending: true }),
    supabase.from('settlements').select('kol_id').eq('is_settled', true),
    supabase
      .from('settlements')
      .select('*, kol:kols(ig_handle, staff_id, group_buy_start_date, group_buy_end_date, staff:profiles(display_name))')
      .eq('is_settled', true)
      .order('settled_at', { ascending: false }),
  ]);

  const settledKolIds = new Set((settledIdsRes.data ?? []).map((s: { kol_id: string }) => s.kol_id));
  const pendingKols = ((endedKolsRes.data ?? []) as unknown as PendingKol[]).filter((k) => !settledKolIds.has(k.id));
  const settlements = (settlementsRes.data as unknown as SettlementWithKol[]) ?? [];

  return <AdminSettlementsClient pendingKols={pendingKols} settlements={settlements} />;
}
