'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, NoticeBar, Skeleton, Collapse, Tag } from 'antd-mobile';
import { useRouter } from 'next/navigation';
import { useKols } from '@/lib/hooks/useKols';
import { useSettlements } from '@/lib/hooks/useSettlements';
import { useReminders } from '@/lib/hooks/useReminders';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { ReminderList } from '@/components/reminder/ReminderList';
import { ROUTES } from '@/lib/constants';
import type { Profile, Kol } from '@/lib/types/database';

interface StaffGroup {
  staffName: string;
  total: number;
  active: number;
  ended: number;
  potential: number;
  pendingSettlements: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = useSupabase();
  const { kols, loading: kolsLoading, fetchKols } = useKols();
  const { settlements: pendingSettlements, loading: settlementsLoading } = useSettlements({ settled: false });
  const reminders = useReminders();
  const autoEndedRef = useRef(false);
  const [staffMap, setStaffMap] = useState<Record<string, string>>({});
  const [staffLoading, setStaffLoading] = useState(true);

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

  // Fetch all staff profiles for name mapping
  useEffect(() => {
    const fetchStaff = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, display_name')
        .eq('role', 'staff');
      const map: Record<string, string> = {};
      if (data) {
        for (const p of data as unknown as Pick<Profile, 'id' | 'display_name'>[]) {
          map[p.id] = p.display_name;
        }
      }
      setStaffMap(map);
      setStaffLoading(false);
    };
    fetchStaff();
  }, [supabase]);

  const activeKols = kols.filter((k) => k.status === 'active');
  const endedKols = kols.filter((k) => k.status === 'ended');

  // Build pending settlement count per KOL
  const pendingByKolId = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of pendingSettlements) {
      map[s.kol_id] = (map[s.kol_id] || 0) + 1;
    }
    return map;
  }, [pendingSettlements]);

  // Group KOLs by staff
  const staffGroups = useMemo(() => {
    const groups: Record<string, StaffGroup> = {};

    for (const k of kols) {
      const key = k.staff_id || '_unassigned';
      const staffName = k.staff_id ? (staffMap[k.staff_id] || '未知') : '未指派';

      if (!groups[key]) {
        groups[key] = { staffName, total: 0, active: 0, ended: 0, potential: 0, pendingSettlements: 0 };
      }

      groups[key].total++;
      if (k.status === 'active') groups[key].active++;
      else if (k.status === 'ended') groups[key].ended++;
      else if (k.status === 'potential') groups[key].potential++;

      if (pendingByKolId[k.id]) {
        groups[key].pendingSettlements += pendingByKolId[k.id];
      }
    }

    return Object.entries(groups).sort((a, b) =>
      a[1].staffName.localeCompare(b[1].staffName)
    );
  }, [kols, staffMap, pendingByKolId]);

  const bannerMessages: string[] = [];
  if (reminders.upcomingEndings.length > 0) {
    bannerMessages.push(`${reminders.upcomingEndings.length} 個開團即將到期`);
  }
  if (reminders.pendingPr.length > 0) {
    bannerMessages.push(`${reminders.pendingPr.length} 位網紅尚未收到公關品`);
  }

  const groupsLoading = kolsLoading || staffLoading || settlementsLoading;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">管理總覽</h2>

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
              <div className="text-2xl font-bold text-gray-500">{endedKols.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">已結束</div>
            </>
          )}
        </Card>
        <Card style={{ textAlign: 'center' }}>
          {reminders.loading ? (
            <Skeleton.Paragraph lineCount={1} animated />
          ) : (
            <>
              <div className="text-2xl font-bold text-orange-500">{reminders.pendingSettlements.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">待結算</div>
            </>
          )}
        </Card>
        <Card
          style={{ textAlign: 'center', cursor: 'pointer' }}
          onClick={() => router.push(ROUTES.ADMIN.PR_PRODUCTS)}
        >
          {reminders.loading ? (
            <Skeleton.Paragraph lineCount={1} animated />
          ) : (
            <>
              <div className="text-2xl font-bold text-purple-500">{reminders.pendingPr.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">待寄公關品</div>
            </>
          )}
        </Card>
      </div>

      <h3 className="text-base font-semibold mb-3">按銷售人員分組</h3>
      {groupsLoading ? (
        <Skeleton.Paragraph lineCount={3} animated />
      ) : staffGroups.length === 0 ? (
        <div className="text-sm text-gray-400">尚無資料</div>
      ) : (
        <Collapse defaultActiveKey={staffGroups.map(([key]) => key)}>
          {staffGroups.map(([key, group]) => (
            <Collapse.Panel
              key={key}
              title={
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{group.staffName}</span>
                  <Tag color="primary" fill="outline" style={{ fontSize: 10 }}>
                    {group.total} 位網紅
                  </Tag>
                  {group.pendingSettlements > 0 && (
                    <Tag color="warning" fill="outline" style={{ fontSize: 10 }}>
                      {group.pendingSettlements} 待結算
                    </Tag>
                  )}
                </div>
              }
            >
              <div className="grid grid-cols-3 gap-2 py-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-500">{group.active}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">進行中</div>
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
      <ReminderList basePath="/admin/kols" data={reminders} />
    </div>
  );
}
