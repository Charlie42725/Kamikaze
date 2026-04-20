import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { AdminKolEditClient } from './AdminKolEditClient';
import type { Kol } from '@/lib/types/database';

export default async function AdminEditKolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const [kolRes, kolProductsRes] = await Promise.all([
    supabase.from('kols').select('*').eq('id', id).single(),
    supabase.from('kol_products').select('product_id').eq('kol_id', id),
  ]);

  if (!kolRes.data) notFound();

  const kol = kolRes.data as unknown as Kol;
  const productIds = ((kolProductsRes.data ?? []) as { product_id: string }[]).map((kp) => kp.product_id);

  return <AdminKolEditClient kol={kol} initialProductIds={productIds} />;
}
