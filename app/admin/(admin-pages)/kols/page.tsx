import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminKolsClient } from './AdminKolsClient';
import type { Kol, Profile } from '@/lib/types/database';

export type KolWithProducts = Kol & { productNames: string[] };

export default async function AdminKolsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const [kolsRes, staffRes] = await Promise.all([
    supabase.from('kols').select('*, kol_products(product:products(name))').order('group_buy_start_date', { ascending: false, nullsFirst: false }),
    supabase.from('profiles').select('id, display_name').eq('role', 'staff'),
  ]);

  const kols: KolWithProducts[] = ((kolsRes.data ?? []) as unknown as (Kol & { kol_products?: { product: { name: string } | null }[] })[])
    .map((k) => ({
      ...k,
      productNames: (k.kol_products ?? []).map((kp) => kp.product?.name).filter(Boolean) as string[],
    }));

  const staffMap: Record<string, string> = {};
  for (const s of (staffRes.data ?? []) as unknown as Pick<Profile, 'id' | 'display_name'>[]) {
    staffMap[s.id] = s.display_name;
  }

  return <AdminKolsClient kols={kols} staffMap={staffMap} />;
}
