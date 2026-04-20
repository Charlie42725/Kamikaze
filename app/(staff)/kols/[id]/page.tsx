import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { KolDetailClient } from './KolDetailClient';
import type { Kol, Product } from '@/lib/types/database';

export default async function KolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const [kolRes, kolProductsRes] = await Promise.all([
    supabase.from('kols').select('*').eq('id', id).single(),
    supabase.from('kol_products').select('product_id, product:products(*)').eq('kol_id', id),
  ]);

  if (!kolRes.data) notFound();

  const kol = kolRes.data as unknown as Kol;
  const products = ((kolProductsRes.data ?? []) as unknown as { product: Product | Product[] | null }[])
    .map((kp) => (Array.isArray(kp.product) ? kp.product[0] : kp.product))
    .filter(Boolean) as Product[];

  return <KolDetailClient kol={kol} products={products} />;
}
