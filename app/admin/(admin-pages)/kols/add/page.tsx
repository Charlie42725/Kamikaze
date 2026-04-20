import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminAddKolClient } from './AdminAddKolClient';
import type { Profile } from '@/lib/types/database';

export default async function AdminAddKolPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data } = await supabase.from('profiles').select('id, display_name').eq('role', 'staff').eq('is_active', true).order('display_name');

  return <AdminAddKolClient staffList={(data ?? []) as unknown as Pick<Profile, 'id' | 'display_name'>[]} />;
}
