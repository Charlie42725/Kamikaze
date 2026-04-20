import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { EditProductClient } from './EditProductClient';
import type { Product } from '@/lib/types/database';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data } = await supabase.from('products').select('*').eq('id', id).single();
  if (!data) notFound();

  return <EditProductClient product={data as unknown as Product} />;
}
