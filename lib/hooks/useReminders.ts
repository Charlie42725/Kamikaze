'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
  pr_ship_reminded: boolean;
  pr_shipped: boolean;
  pr_products_received: boolean;
}

interface PendingSettlement {
  id: string;
  ig_handle: string;
  group_buy_end_date: string;
  staff_id: string | null;
}

export interface RemindersData {
  upcomingEndings: GroupBuyEnding[];
  pendingPr: PendingPrProduct[];
  pendingSettlements: PendingSettlement[];
  totalReminders: number;
  loading: boolean;
  fetchReminders: () => Promise<void>;
}

export function useReminders(options?: { skip?: boolean }): RemindersData {
  const skip = options?.skip ?? false;
  const supabase = useSupabase();
  const { profile, loading: authLoading } = useAuth();
  const [upcomingEndings, setUpcomingEndings] = useState<GroupBuyEnding[]>([]);
  const [pendingPr, setPendingPr] = useState<PendingPrProduct[]>([]);
  const [pendingSettlements, setPendingSettlements] = useState<PendingSettlement[]>([]);
  const [loading, setLoading] = useState(!skip);
  const fetchedRef = useRef(skip);

  const profileId = profile?.id;
  const profileRole = profile?.role;

  const fetchReminders = useCallback(async () => {
    if (skip) return;
    try {
      setLoading(true);
      const staffFilter = profileRole === 'staff' && profileId ? { staff_id: profileId } : {};

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

      if (endingsRes.error) console.error('reminders endings error:', endingsRes.error);
      if (prRes.error) console.error('reminders pr error:', prRes.error);
      if (settlementsRes.error) console.error('reminders settlements error:', settlementsRes.error);

      setUpcomingEndings((endingsRes.data as GroupBuyEnding[]) ?? []);
      setPendingPr((prRes.data as PendingPrProduct[]) ?? []);
      setPendingSettlements((settlementsRes.data as PendingSettlement[]) ?? []);
    } catch (e) {
      console.error('fetchReminders error:', e);
    } finally {
      setLoading(false);
      fetchedRef.current = true;
    }
  }, [supabase, profileId, profileRole, skip]);

  useEffect(() => {
    if (skip || authLoading) return;

    if (profileId) {
      fetchReminders();
    } else {
      setLoading(false);
      fetchedRef.current = true;
    }
  }, [skip, authLoading, profileId, fetchReminders]);

  const totalReminders = upcomingEndings.length + pendingPr.length + pendingSettlements.length;

  return {
    upcomingEndings,
    pendingPr,
    pendingSettlements,
    totalReminders,
    loading: skip ? false : authLoading ? true : loading,
    fetchReminders,
  };
}
