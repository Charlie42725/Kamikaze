import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardClient } from './DashboardClient';
import type { Profile, Kol } from '@/lib/types/database';

export default async function StaffDashboard() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const userId = session.user.id;

  const [profileRes, kolsRes, endingsRes, prRes, settlementsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('kols').select('*').eq('staff_id', userId).order('group_buy_start_date', { ascending: false, nullsFirst: false }),
    supabase.from('upcoming_group_buy_endings').select('*').eq('staff_id', userId).order('days_remaining', { ascending: true }),
    supabase.from('pending_pr_products').select('*').eq('staff_id', userId),
    supabase.from('pending_settlements').select('*').eq('staff_id', userId),
  ]);

  return (
    <DashboardClient
      profile={profileRes.data as unknown as Profile}
      kols={(kolsRes.data ?? []) as unknown as Kol[]}
      upcomingEndings={(endingsRes.data ?? []) as unknown as { id: string; ig_handle: string; group_buy_end_date: string; staff_id: string | null; days_remaining: number }[]}
      pendingPr={(prRes.data ?? []) as unknown as { id: string; ig_handle: string; staff_id: string | null; has_pr_products: boolean; pr_ship_reminded: boolean; pr_shipped: boolean; pr_products_received: boolean }[]}
      pendingSettlements={(settlementsRes.data ?? []) as unknown as { id: string; ig_handle: string; group_buy_end_date: string; staff_id: string | null }[]}
    />
  );
}
