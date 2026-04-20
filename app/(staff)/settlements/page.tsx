import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SettlementsClient } from './SettlementsClient';

export default async function StaffSettlementsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');
  return <SettlementsClient userId={session.user.id} />;
}
