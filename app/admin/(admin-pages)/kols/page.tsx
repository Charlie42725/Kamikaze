import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminKolsClient } from './AdminKolsClient';

export default async function AdminKolsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');
  return <AdminKolsClient />;
}
