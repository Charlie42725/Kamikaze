import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { KolsPageClient } from './KolsPageClient';
import type { Kol } from '@/lib/types/database';

export type KolWithProducts = Kol & { productNames: string[] };

export default async function KolsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data } = await supabase
    .from('kols')
    .select('*, kol_products(product:products(name))')
    .eq('staff_id', session.user.id)
    .order('group_buy_start_date', { ascending: false, nullsFirst: false });

  const kols: KolWithProducts[] = ((data ?? []) as unknown as (Kol & { kol_products?: { product: { name: string } | null }[] })[])
    .map((k) => ({
      ...k,
      productNames: (k.kol_products ?? []).map((kp) => kp.product?.name).filter(Boolean) as string[],
    }));

  return <KolsPageClient kols={kols} />;
}
