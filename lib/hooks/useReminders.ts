'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useAuth } from '@/components/providers/AuthProvider';

interface GroupBuyEnding {
  id: string;
  ig_handle: string;
  group_buy_end_date: string;
  staff_id: string | null;
  days_remaining: number;
}

interface PendingPrProduct {
  id: string;
  ig_handle: string;
  staff_id: string | null;
  has_pr_products: boolean;
  pr_products_received: boolean;
}

interface PendingSettlement {
  id: string;
  ig_handle: string;
  group_buy_end_date: string;
  staff_id: string | null;
}

export function useReminders() {
  const supabase = useSupabase();
  const { profile, loading: authLoading } = useAuth();
  const [upcomingEndings, setUpcomingEndings] = useState<GroupBuyEnding[]>([]);
  const [pendingPr, setPendingPr] = useState<PendingPrProduct[]>([]);
  const [pendingSettlements, setPendingSettlements] = useState<PendingSettlement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReminders = useCallback(async () => {
    try {
      setLoading(true);
      const staffFilter = profile?.role === 'staff' ? { staff_id: profile.id } : {};

      const [endingsRes, prRes, settlementsRes] = await Promise.all([
        supabase
          .from('upcoming_group_buy_endings')
          .select('*')
          .match(staffFilter)
          .order('days_remaining', { ascending: true }),
        supabase
          .from('pending_pr_products')
          .select('*')
          .match(staffFilter),
        supabase
          .from('pending_settlements')
          .select('*')
          .match(staffFilter),
      ]);

      setUpcomingEndings((endingsRes.data as GroupBuyEnding[]) ?? []);
      setPendingPr((prRes.data as PendingPrProduct[]) ?? []);
      setPendingSettlements((settlementsRes.data as PendingSettlement[]) ?? []);
    } catch (e) {
      console.error('fetchReminders error:', e);
    } finally {
      setLoading(false);
    }
  }, [supabase, profile]);

  useEffect(() => {
    if (!authLoading) {
      fetchReminders();
    }
  }, [authLoading, fetchReminders]);

  const totalReminders = upcomingEndings.length + pendingPr.length + pendingSettlements.length;

  return {
    upcomingEndings,
    pendingPr,
    pendingSettlements,
    totalReminders,
    loading: loading || authLoading,
    fetchReminders,
  };
}
