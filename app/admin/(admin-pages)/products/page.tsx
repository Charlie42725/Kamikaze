import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProductsClient } from './ProductsClient';
import type { Product } from '@/lib/types/database';

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data } = await supabase.from('products').select('*').eq('is_active', true).order('name', { ascending: true });

  return <ProductsClient products={(data ?? []) as unknown as Product[]} />;
}
