'use client';

import { useEffect, useRef, useMemo } from 'react';
import { Card, NoticeBar, Collapse, Tag } from 'antd-mobile';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { ReminderList } from '@/components/reminder/ReminderList';
import { ROUTES, getKolDisplayStatus } from '@/lib/constants';
import type { Kol } from '@/lib/types/database';
import type { RemindersData } from '@/lib/hooks/useReminders';

interface PendingKol { id: string; ig_handle: string; group_buy_start_date: string | null; group_buy_end_date: string; staff_id: string | null }
interface GroupBuyEnding { id: string; ig_handle: string; group_buy_end_date: string; staff_id: string | null; days_remaining: number }
interface PendingPr { id: string; ig_handle: string; staff_id: string | null; has_pr_products: boolean; pr_ship_reminded: boolean; pr_shipped: boolean; pr_products_received: boolean }
interface PendingSettlement { id: string; ig_handle: string; group_buy_end_date: string; staff_id: string | null }

interface StaffGroup { staffName: string; total: number; active: number; upcoming: number; ended: number; potential: number; pendingSettlements: number }

interface Props {
  kols: Kol[];
  staffMap: Record<string, string>;
  pendingKols: PendingKol[];
  upcomingEndings: GroupBuyEnding[];
  pendingPr: PendingPr[];
  pendingSettlements: PendingSettlement[];
}

export function AdminDashboardClient({ kols, staffMap, pendingKols, upcomingEndings, pendingPr, pendingSettlements }: Props) {
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

  const activeKols = kols.filter((k) => getKolDisplayStatus(k) === 'active');
  const upcomingKols = kols.filter((k) => getKolDisplayStatus(k) === 'upcoming');
  const pendingShipPr = pendingPr.filter((k) => !k.pr_shipped);
  const pendingReceivePr = pendingPr.filter((k) => k.pr_shipped);

  const pendingKolIds = useMemo(() => new Set(pendingKols.map((k) => k.id)), [pendingKols]);

  const staffGroups = useMemo(() => {
    const groups: Record<string, StaffGroup> = {};
    for (const k of kols) {
      const key = k.staff_id || '_unassigned';
      const staffName = k.staff_id ? (staffMap[k.staff_id] || '未知') : '未指派';
      if (!groups[key]) groups[key] = { staffName, total: 0, active: 0, upcoming: 0, ended: 0, potential: 0, pendingSettlements: 0 };
      groups[key].total++;
      const ds = getKolDisplayStatus(k);
      if (ds === 'active') groups[key].active++;
      else if (ds === 'upcoming') groups[key].upcoming++;
      else if (ds === 'ended') groups[key].ended++;
      else if (ds === 'potential') groups[key].potential++;
      if (pendingKolIds.has(k.id)) groups[key].pendingSettlements++;
    }
    return Object.entries(groups).sort((a, b) => a[1].staffName.localeCompare(b[1].staffName));
  }, [kols, staffMap, pendingKolIds]);

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
      <h2 className="text-xl font-bold mb-4">管理總覽</h2>

      {bannerMessages.length > 0 && (
        <NoticeBar content={bannerMessages.join('；')} color="alert" closeable style={{ marginBottom: 12 }} />
      )}

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card style={{ textAlign: 'center' }}>
          <div className="text-2xl font-bold text-blue-500">{kols.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">全部網紅</div>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <div className="text-2xl font-bold text-green-500">{activeKols.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">開團中</div>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <div className="text-2xl font-bold text-blue-400">{upcomingKols.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">待開團</div>
        </Card>
        <Card style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => router.push(ROUTES.ADMIN.SETTLEMENTS)}>
          <div className="text-2xl font-bold text-orange-500">{pendingKols.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">待結算</div>
        </Card>
        <Card style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => router.push(ROUTES.ADMIN.PR_PRODUCTS)}>
          <div className="text-2xl font-bold text-purple-500">{pendingShipPr.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">待寄公關品</div>
        </Card>
        <Card style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => router.push(ROUTES.ADMIN.PR_PRODUCTS)}>
          <div className="text-2xl font-bold text-teal-500">{pendingReceivePr.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">待收公關品</div>
        </Card>
      </div>

      <h3 className="text-base font-semibold mb-3">按銷售人員分組</h3>
      {staffGroups.length === 0 ? (
        <div className="text-sm text-gray-400">尚無資料</div>
      ) : (
        <Collapse>
          {staffGroups.map(([key, group]) => (
            <Collapse.Panel
              key={key}
              title={
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{group.staffName}</span>
                  <Tag color="primary" fill="outline" style={{ fontSize: 10 }}>{group.total} 位網紅</Tag>
                  {group.pendingSettlements > 0 && (
                    <Tag color="warning" fill="outline" style={{ fontSize: 10 }}>{group.pendingSettlements} 待結算</Tag>
                  )}
                </div>
              }
            >
              <div className="grid grid-cols-4 gap-2 py-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-500">{group.active}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">開團中</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">{group.upcoming}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">待開團</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-500">{group.potential}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">潛在</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-400">{group.ended}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">已結束</div>
                </div>
              </div>
            </Collapse.Panel>
          ))}
        </Collapse>
      )}

      <h3 className="text-base font-semibold mb-3 mt-6">待處理提醒</h3>
      <ReminderList basePath="/admin/kols" data={remindersData} staffMap={staffMap} />
    </div>
  );
}
