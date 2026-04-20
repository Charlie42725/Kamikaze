'use client';

import { mutate } from 'swr';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { Kol, KolInsert, KolUpdate } from '@/lib/types/database';

const invalidateKolCaches = () =>
  mutate((key) => {
    const k = Array.isArray(key) ? key[0] : key;
    return typeof k === 'string' && ['staff-kols', 'staff-pr', 'staff-settlements', 'admin-kols', 'admin-pr', 'admin-settlements'].includes(k);
  });

export function useKols() {
  const supabase = useSupabase();

  const createKol = async (kol: KolInsert) => {
    const { data, error } = await supabase.from('kols').insert(kol as never).select().single();
    if (error) throw error;
    await invalidateKolCaches();
    return data as unknown as Kol;
  };

  const updateKol = async (id: string, updates: KolUpdate) => {
    const { data, error } = await supabase.from('kols').update(updates as never).eq('id', id).select().single();
    if (error) throw error;
    await invalidateKolCaches();
    return data as unknown as Kol;
  };

  const deleteKol = async (id: string) => {
    const { error } = await supabase.from('kols').delete().eq('id', id);
    if (error) throw error;
    await invalidateKolCaches();
  };

  return { createKol, updateKol, deleteKol };
}
