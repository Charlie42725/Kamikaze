import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AddPotentialClient } from './AddPotentialClient';

export default async function AddPotentialKolPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  return <AddPotentialClient userId={session.user.id} />;
}
