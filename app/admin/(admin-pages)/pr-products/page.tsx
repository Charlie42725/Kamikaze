import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminPrProductsClient } from './AdminPrProductsClient';

export default async function AdminPrProductsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');
  return <AdminPrProductsClient />;
}
