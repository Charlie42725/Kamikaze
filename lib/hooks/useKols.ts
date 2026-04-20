'use client';

import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { Kol, KolInsert, KolUpdate } from '@/lib/types/database';

export function useKols() {
  const supabase = useSupabase();
  const router = useRouter();

  const createKol = async (kol: KolInsert) => {
    const { data, error } = await supabase.from('kols').insert(kol as never).select().single();
    if (error) throw error;
    router.refresh();
    return data as unknown as Kol;
  };

  const updateKol = async (id: string, updates: KolUpdate) => {
    const { data, error } = await supabase.from('kols').update(updates as never).eq('id', id).select().single();
    if (error) throw error;
    router.refresh();
    return data as unknown as Kol;
  };

  const deleteKol = async (id: string) => {
    const { error } = await supabase.from('kols').delete().eq('id', id);
    if (error) throw error;
    router.refresh();
  };

  return { createKol, updateKol, deleteKol };
}
