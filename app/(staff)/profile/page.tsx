import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileClient } from './ProfileClient';
import type { Profile } from '@/lib/types/database';

export default async function StaffProfilePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();

  return <ProfileClient profile={profile as unknown as Profile} />;
}
