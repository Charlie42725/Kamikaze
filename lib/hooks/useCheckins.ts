'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import type { Checkin } from '@/lib/types/database';

export function useCheckins() {
  const supabase = useSupabase();
  const { user, loading: authLoading } = useAuth();
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  const fetchCheckins = useCallback(async () => {
    if (!userId) {
      setCheckins([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('checkins')
        .select('*')
        .eq('staff_id', userId)
        .order('checked_at', { ascending: false });

      if (error) console.error('fetchCheckins query error:', error);
      setCheckins((data as unknown as Checkin[]) ?? []);
    } catch (e) {
      console.error('fetchCheckins error:', e);
      setCheckins([]);
    } finally {
      setLoading(false);
    }
  }, [supabase, userId]);

  useEffect(() => {
    if (authLoading) return;
    fetchCheckins();
  }, [authLoading, fetchCheckins]);

  const createCheckin = async (imageUrls: string[], notes?: string) => {
    if (!userId) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('checkins')
      .insert({
        staff_id: userId,
        image_url: JSON.stringify(imageUrls),
        notes,
      } as never)
      .select()
      .single();
    if (error) throw error;
    await fetchCheckins();
    return data as unknown as Checkin;
  };

  return { checkins, loading: authLoading ? true : loading, fetchCheckins, createCheckin };
}
