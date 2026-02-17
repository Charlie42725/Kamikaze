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
    if (authLoading || !profile) return;
    setLoading(true);

    const staffFilter = profile.role === 'staff' ? { staff_id: profile.id } : {};

    // All 3 queries run in parallel
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

    if (endingsRes.data) setUpcomingEndings(endingsRes.data as GroupBuyEnding[]);
    if (prRes.data) setPendingPr(prRes.data as PendingPrProduct[]);
    if (settlementsRes.data) setPendingSettlements(settlementsRes.data as PendingSettlement[]);

    setLoading(false);
  }, [supabase, profile, authLoading]);

  useEffect(() => {
    if (!authLoading && profile) fetchReminders();
  }, [authLoading, profile, fetchReminders]);

  const totalReminders = upcomingEndings.length + pendingPr.length + pendingSettlements.length;

  return {
    upcomingEndings,
    pendingPr,
    pendingSettlements,
    totalReminders,
    loading,
    fetchReminders,
  };
}
