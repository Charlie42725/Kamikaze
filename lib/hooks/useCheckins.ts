'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import type { Checkin } from '@/lib/types/database';

export function useCheckins() {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCheckins = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .eq('staff_id', user.id)
      .order('checked_at', { ascending: false });

    if (!error && data) {
      setCheckins(data as unknown as Checkin[]);
    }
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    if (user) fetchCheckins();
  }, [user, fetchCheckins]);

  const createCheckin = async (imageUrl: string, notes?: string) => {
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('checkins')
      .insert({
        staff_id: user.id,
        image_url: imageUrl,
        notes,
      } as never)
      .select()
      .single();
    if (error) throw error;
    await fetchCheckins();
    return data as unknown as Checkin;
  };

  return { checkins, loading, fetchCheckins, createCheckin };
}
