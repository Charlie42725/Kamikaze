import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { KolsPageClient } from './KolsPageClient';

export default async function KolsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');
  return <KolsPageClient userId={session.user.id} />;
}
