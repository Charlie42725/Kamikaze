import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminDashboardClient } from './AdminDashboardClient';
import type { Kol, Profile } from '@/lib/types/database';

interface PendingKol {
  id: string;
  ig_handle: string;
  group_buy_start_date: string | null;
  group_buy_end_date: string;
  staff_id: string | null;
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const [kolsRes, staffRes, endingsRes, prRes, settlementsRemRes, endedKolsRes, settledIdsRes] = await Promise.all([
    supabase.from('kols').select('*').order('group_buy_start_date', { ascending: false, nullsFirst: false }),
    supabase.from('profiles').select('id, display_name').eq('role', 'staff'),
    supabase.from('upcoming_group_buy_endings').select('*').order('days_remaining', { ascending: true }),
    supabase.from('pending_pr_products').select('*'),
    supabase.from('pending_settlements').select('*'),
    supabase.from('kols').select('id, ig_handle, group_buy_start_date, group_buy_end_date, staff_id').eq('status', 'ended').not('group_buy_end_date', 'is', null).order('group_buy_end_date', { ascending: true }),
    supabase.from('settlements').select('kol_id').eq('is_settled', true),
  ]);

  const settledKolIds = new Set((settledIdsRes.data ?? []).map((s: { kol_id: string }) => s.kol_id));
  const pendingKols = ((endedKolsRes.data ?? []) as unknown as PendingKol[]).filter((k) => !settledKolIds.has(k.id));

  const staffMap: Record<string, string> = {};
  for (const s of (staffRes.data ?? []) as unknown as Pick<Profile, 'id' | 'display_name'>[]) {
    staffMap[s.id] = s.display_name;
  }

  return (
    <AdminDashboardClient
      kols={(kolsRes.data ?? []) as unknown as Kol[]}
      staffMap={staffMap}
      pendingKols={pendingKols}
      upcomingEndings={(endingsRes.data ?? []) as unknown as { id: string; ig_handle: string; group_buy_end_date: string; staff_id: string | null; days_remaining: number }[]}
      pendingPr={(prRes.data ?? []) as unknown as { id: string; ig_handle: string; staff_id: string | null; has_pr_products: boolean; pr_ship_reminded: boolean; pr_shipped: boolean; pr_products_received: boolean }[]}
      pendingSettlements={(settlementsRemRes.data ?? []) as unknown as { id: string; ig_handle: string; group_buy_end_date: string; staff_id: string | null }[]}
    />
  );
}
