'use client';

import { useEffect, useRef } from 'react';
import { Card, NoticeBar, Skeleton } from 'antd-mobile';
import { useAuth } from '@/components/providers/AuthProvider';
import { useKols } from '@/lib/hooks/useKols';
import { useReminders } from '@/lib/hooks/useReminders';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { ReminderList } from '@/components/reminder/ReminderList';
import { getKolDisplayStatus } from '@/lib/constants';

export default function StaffDashboard() {
  const { profile } = useAuth();
  const supabase = useSupabase();
  const { kols, loading: kolsLoading, fetchKols } = useKols();
  const reminders = useReminders();
  const autoEndedRef = useRef(false);

  useEffect(() => {
    if (autoEndedRef.current) return;
    autoEndedRef.current = true;
    supabase.rpc('auto_end_expired_kols').then(({ data }) => {
      if (data && data > 0) {
        fetchKols();
        reminders.fetchReminders();
      }
    });
  }, [supabase, fetchKols, reminders]);

  const activeKols = kols.filter((k) => getKolDisplayStatus(k) === 'active');
  const upcomingKols = kols.filter((k) => getKolDisplayStatus(k) === 'upcoming');
  const potentialKols = kols.filter((k) => k.status === 'potential');

  const bannerMessages: string[] = [];
  if (reminders.upcomingEndings.length > 0) {
    bannerMessages.push(`${reminders.upcomingEndings.length} 個開團即將到期`);
  }
  if (reminders.pendingPr.length > 0) {
    bannerMessages.push(`${reminders.pendingPr.length} 位網紅尚未收到公關品`);
  }

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
          {kolsLoading ? (
            <Skeleton.Paragraph lineCount={1} animated />
          ) : (
            <>
              <div className="text-2xl font-bold text-blue-500">{kols.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">全部網紅</div>
            </>
          )}
        </Card>
        <Card style={{ textAlign: 'center' }}>
          {kolsLoading ? (
            <Skeleton.Paragraph lineCount={1} animated />
          ) : (
            <>
              <div className="text-2xl font-bold text-green-500">{activeKols.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">進行中</div>
            </>
          )}
        </Card>
        <Card style={{ textAlign: 'center' }}>
          {kolsLoading ? (
            <Skeleton.Paragraph lineCount={1} animated />
          ) : (
            <>
              <div className="text-2xl font-bold text-blue-500">{upcomingKols.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">待開團</div>
            </>
          )}
        </Card>
        <Card style={{ textAlign: 'center' }}>
          {kolsLoading ? (
            <Skeleton.Paragraph lineCount={1} animated />
          ) : (
            <>
              <div className="text-2xl font-bold text-yellow-500">{potentialKols.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">潛在</div>
            </>
          )}
        </Card>
      </div>

      <h3 className="text-base font-semibold mb-3">待處理提醒</h3>
      <ReminderList data={reminders} />
    </div>
  );
}
