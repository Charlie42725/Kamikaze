'use client';

import { useMemo, useState } from 'react';
import { Tabs, Empty, Collapse, Card, Tag, Skeleton } from 'antd-mobile';
import { useRouter } from 'next/navigation';
import { SettlementCard } from '@/components/settlement/SettlementCard';
import { useSettlements } from '@/lib/hooks/useSettlements';
import { ROUTES } from '@/lib/constants';
import dayjs from 'dayjs';

export default function SettlementsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'settled'>('pending');
  const { settlements, pendingKols, loading } = useSettlements({
    settled: activeTab === 'settled',
  });

  // Group pending KOLs by staff
  const groupedPending = useMemo(() => {
    const groups: Record<string, { staffName: string; items: typeof pendingKols }> = {};

    for (const kol of pendingKols) {
      const staffName = kol.staff?.display_name || '未指派';
      const key = kol.staff_id || '_unassigned';
      if (!groups[key]) {
        groups[key] = { staffName, items: [] };
      }
      groups[key].items.push(kol);
    }

    return Object.entries(groups).sort((a, b) =>
      a[1].staffName.localeCompare(b[1].staffName)
    );
  }, [pendingKols]);

  // Group settled settlements by staff
  const groupedSettled = useMemo(() => {
    const groups: Record<string, { staffName: string; items: typeof settlements }> = {};

    for (const s of settlements) {
      const staffName = s.kol?.staff?.display_name || '未指派';
      const key = s.kol?.staff_id || '_unassigned';
      if (!groups[key]) {
        groups[key] = { staffName, items: [] };
      }
      groups[key].items.push(s);
    }

    return Object.entries(groups).sort((a, b) =>
      a[1].staffName.localeCompare(b[1].staffName)
    );
  }, [settlements]);

  return (
    <div>
      <div className="px-4 pt-4">
        <h2 className="text-xl font-bold mb-4">結算管理</h2>
      </div>

      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as 'pending' | 'settled')}>
        <Tabs.Tab title="待結算" key="pending" />
        <Tabs.Tab title="已結算" key="settled" />
      </Tabs>

      <div className="p-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton.Paragraph lineCount={3} animated />
            <Skeleton.Paragraph lineCount={3} animated />
            <Skeleton.Paragraph lineCount={3} animated />
          </div>
        ) : activeTab === 'pending' ? (
          pendingKols.length === 0 ? (
            <Empty description="沒有待結算項目" />
          ) : (
            <Collapse defaultActiveKey={groupedPending.map(([key]) => key)}>
              {groupedPending.map(([key, { staffName, items }]) => (
                <Collapse.Panel key={key} title={`${staffName}（${items.length}）`}>
                  {items.map((kol) => (
                    <Card
                      key={kol.id}
                      onClick={() => router.push(ROUTES.ADMIN.SETTLEMENT_DETAIL(kol.id))}
                      style={{ marginBottom: 12, cursor: 'pointer' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">@{kol.ig_handle}</span>
                        <Tag color="warning" fill="outline">待結算</Tag>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        開團結束：{dayjs(kol.group_buy_end_date).format('YYYY/MM/DD')}
                      </div>
                    </Card>
                  ))}
                </Collapse.Panel>
              ))}
            </Collapse>
          )
        ) : settlements.length === 0 ? (
          <Empty description="沒有已結算項目" />
        ) : (
          <Collapse defaultActiveKey={groupedSettled.map(([key]) => key)}>
            {groupedSettled.map(([key, { staffName, items }]) => (
              <Collapse.Panel key={key} title={`${staffName}（${items.length}）`}>
                {items.map((settlement) => (
                  <SettlementCard key={settlement.id} settlement={settlement} />
                ))}
              </Collapse.Panel>
            ))}
          </Collapse>
        )}
      </div>
    </div>
  );
}
