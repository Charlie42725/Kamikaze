'use client';

import { useEffect, useRef, useMemo } from 'react';
import { Card, NoticeBar } from 'antd-mobile';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { ReminderList } from '@/components/reminder/ReminderList';
import { getKolDisplayStatus } from '@/lib/constants';
import type { Profile, Kol } from '@/lib/types/database';
import type { RemindersData } from '@/lib/hooks/useReminders';

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

interface Props {
  profile: Profile | null;
  kols: Kol[];
  upcomingEndings: GroupBuyEnding[];
  pendingPr: PendingPrProduct[];
  pendingSettlements: PendingSettlement[];
}

export function DashboardClient({ profile, kols, upcomingEndings, pendingPr, pendingSettlements }: Props) {
  const supabase = useSupabase();
  const router = useRouter();
  const autoEndedRef = useRef(false);

  useEffect(() => {
    if (autoEndedRef.current) return;
    autoEndedRef.current = true;
    supabase.rpc('auto_end_expired_kols').then(({ data }) => {
      if (data && data > 0) router.refresh();
    });
  }, [supabase, router]);

  const { activeKols, upcomingKols, potentialKols } = useMemo(() => {
    const active: Kol[] = [];
    const upcoming: Kol[] = [];
    const potential: Kol[] = [];
    for (const k of kols) {
      if (k.status === 'potential') {
        potential.push(k);
      } else {
        const s = getKolDisplayStatus(k);
        if (s === 'active') active.push(k);
        else if (s === 'upcoming') upcoming.push(k);
      }
    }
    return { activeKols: active, upcomingKols: upcoming, potentialKols: potential };
  }, [kols]);

  const bannerMessages: string[] = [];
  if (upcomingEndings.length > 0) bannerMessages.push(`${upcomingEndings.length} 個開團即將到期`);
  if (pendingPr.length > 0) bannerMessages.push(`${pendingPr.length} 位網紅尚未收到公關品`);

  const remindersData: RemindersData = {
    upcomingEndings,
    pendingPr,
    pendingSettlements,
    totalReminders: upcomingEndings.length + pendingPr.length + pendingSettlements.length,
    loading: false,
    fetchReminders: async () => { router.refresh(); },
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        你好，{profile?.display_name || ''}
      </h2>

      {bannerMessages.length > 0 && (
        <NoticeBar
          content={bannerMessages.join('；')}
          color="alert"
          closeable
          style={{ marginBottom: 12 }}
        />
      )}

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card style={{ textAlign: 'center' }}>
          <div className="text-2xl font-bold text-blue-500">{kols.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">全部網紅</div>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <div className="text-2xl font-bold text-green-500">{activeKols.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">進行中</div>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <div className="text-2xl font-bold text-blue-500">{upcomingKols.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">待開團</div>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <div className="text-2xl font-bold text-yellow-500">{potentialKols.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">潛在</div>
        </Card>
      </div>

      <h3 className="text-base font-semibold mb-3">待處理提醒</h3>
      <ReminderList data={remindersData} />
    </div>
  );
}
