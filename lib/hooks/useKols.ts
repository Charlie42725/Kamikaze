'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import type { Kol, KolInsert, KolUpdate, KolStatus } from '@/lib/types/database';

export function useKols(statusFilter?: KolStatus | 'all') {
  const supabase = useSupabase();
  const { profile, loading: authLoading } = useAuth();
  const [kols, setKols] = useState<Kol[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKols = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from('kols').select('*').order('created_at', { ascending: false });

      if (profile?.role === 'staff') {
        query = query.eq('staff_id', profile.id);
      }

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data } = await query;
      setKols((data as unknown as Kol[]) ?? []);
    } catch (e) {
      console.error('fetchKols error:', e);
      setKols([]);
    } finally {
      setLoading(false);
    }
  }, [supabase, profile, statusFilter]);

  useEffect(() => {
    if (!authLoading) {
      fetchKols();
    }
  }, [authLoading, fetchKols]);

  const createKol = async (kol: KolInsert) => {
    const { data, error } = await supabase.from('kols').insert(kol as never).select().single();
    if (error) throw error;
    await fetchKols();
    return data as unknown as Kol;
  };

  const updateKol = async (id: string, updates: KolUpdate) => {
    const { data, error } = await supabase
      .from('kols')
      .update(updates as never)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    await fetchKols();
    return data as unknown as Kol;
  };

  const getKol = async (id: string) => {
    const { data, error } = await supabase.from('kols').select('*').eq('id', id).single();
    if (error) throw error;
    return data as unknown as Kol;
  };

  return { kols, loading: loading || authLoading, fetchKols, createKol, updateKol, getKol };
}
