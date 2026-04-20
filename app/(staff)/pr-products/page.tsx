import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PrProductsClient } from './PrProductsClient';

export default async function StaffPrProductsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');
  return <PrProductsClient userId={session.user.id} />;
}
