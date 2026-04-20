import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { AdminKolDetailClient } from './AdminKolDetailClient';
import type { Kol, Product, Settlement, Profile } from '@/lib/types/database';

export default async function AdminKolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const [kolRes, kolProductsRes, settlementsRes] = await Promise.all([
    supabase.from('kols').select('*').eq('id', id).single(),
    supabase.from('kol_products').select('product_id, product:products(*)').eq('kol_id', id),
    supabase.from('settlements').select('*').eq('kol_id', id).order('created_at', { ascending: false }),
  ]);

  if (!kolRes.data) notFound();

  const kol = kolRes.data as unknown as Kol;
  const products = ((kolProductsRes.data ?? []) as unknown as { product: Product | Product[] | null }[])
    .map((kp) => (Array.isArray(kp.product) ? kp.product[0] : kp.product))
    .filter(Boolean) as Product[];
  const settlements = (settlementsRes.data ?? []) as unknown as Settlement[];

  let staff: Profile | null = null;
  if (kol.staff_id) {
    const { data } = await supabase.from('profiles').select('*').eq('id', kol.staff_id).single();
    staff = data as unknown as Profile;
  }

  return <AdminKolDetailClient kol={kol} products={products} settlements={settlements} staff={staff} />;
}
