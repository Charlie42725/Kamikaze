'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import type { Checkin } from '@/lib/types/database';

export function useCheckins() {
  const supabase = useSupabase();
  const { user, loading: authLoading } = useAuth();
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCheckins = useCallback(async () => {
    if (!user) {
      setCheckins([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data } = await supabase
        .from('checkins')
        .select('*')
        .eq('staff_id', user.id)
        .order('checked_at', { ascending: false });

      setCheckins((data as unknown as Checkin[]) ?? []);
    } catch (e) {
      console.error('fetchCheckins error:', e);
      setCheckins([]);
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  useEffect(() => {
    if (!authLoading) {
      fetchCheckins();
    }
  }, [authLoading, fetchCheckins]);

  const createCheckin = async (imageUrls: string[], notes?: string) => {
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('checkins')
      .insert({
        staff_id: user.id,
        image_url: JSON.stringify(imageUrls),
        notes,
      } as never)
      .select()
      .single();
    if (error) throw error;
    await fetchCheckins();
    return data as unknown as Checkin;
  };

  return { checkins, loading: loading || authLoading, fetchCheckins, createCheckin };
}
