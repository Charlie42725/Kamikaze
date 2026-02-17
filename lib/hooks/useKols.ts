'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import type { Kol, KolInsert, KolUpdate, KolStatus } from '@/lib/types/database';

export function useKols(statusFilter?: KolStatus | 'all') {
  const supabase = useSupabase();
  const { profile, loading: authLoading } = useAuth();
  const [kols, setKols] = useState<Kol[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const profileId = profile?.id;
  const profileRole = profile?.role;

  const fetchKols = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from('kols').select('*').order('created_at', { ascending: false });

      if (profileRole === 'staff' && profileId) {
        query = query.eq('staff_id', profileId);
      }

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) console.error('fetchKols query error:', error);
      setKols((data as unknown as Kol[]) ?? []);
    } catch (e) {
      console.error('fetchKols error:', e);
      setKols([]);
    } finally {
      setLoading(false);
      fetchedRef.current = true;
    }
  }, [supabase, profileId, profileRole, statusFilter]);

  useEffect(() => {
    if (authLoading) return;

    // Auth done — fetch or show empty
    if (profileId) {
      fetchKols();
    } else {
      // No profile = no data, stop loading immediately
      setKols([]);
      setLoading(false);
      fetchedRef.current = true;
    }
  }, [authLoading, profileId, fetchKols]);

  // Safety: if auth is done and we still haven't fetched after 1 tick, force stop
  useEffect(() => {
    if (!authLoading && !fetchedRef.current) {
      const t = setTimeout(() => {
        if (!fetchedRef.current) {
          setLoading(false);
          fetchedRef.current = true;
        }
      }, 100);
      return () => clearTimeout(t);
    }
  }, [authLoading]);

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

  return { kols, loading: authLoading ? true : loading, fetchKols, createKol, updateKol, getKol };
}
