import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AddKolClient } from './AddKolClient';

export default async function AddKolPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  return <AddKolClient userId={session.user.id} />;
}
