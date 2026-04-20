import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminSettlementsClient } from './AdminSettlementsClient';

export default async function AdminSettlementsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');
  return <AdminSettlementsClient />;
}
