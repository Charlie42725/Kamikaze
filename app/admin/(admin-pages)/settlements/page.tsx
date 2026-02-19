'use client';

import { useMemo, useState } from 'react';
import { Tabs, SpinLoading, Empty, Collapse } from 'antd-mobile';
import { SettlementCard } from '@/components/settlement/SettlementCard';
import { useSettlements } from '@/lib/hooks/useSettlements';

export default function SettlementsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'settled'>('pending');
  const { settlements, loading } = useSettlements({ settled: activeTab === 'settled' });

  // Group settlements by staff display_name
  const groupedByStaff = useMemo(() => {
    const groups: Record<string, { staffName: string; items: typeof settlements }> = {};

    for (const s of settlements) {
      const staffName = s.kol?.staff?.display_name || '未指派';
      const key = s.kol?.staff_id || '_unassigned';
      if (!groups[key]) {
        groups[key] = { staffName, items: [] };
      }
      groups[key].items.push(s);
    }

    // Sort groups by staff name
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
          <div className="flex justify-center py-8">
            <SpinLoading />
          </div>
        ) : settlements.length === 0 ? (
          <Empty description={activeTab === 'pending' ? '沒有待結算項目' : '沒有已結算項目'} />
        ) : (
          <Collapse defaultActiveKey={groupedByStaff.map(([key]) => key)}>
            {groupedByStaff.map(([key, { staffName, items }]) => (
              <Collapse.Panel
                key={key}
                title={`${staffName}（${items.length}）`}
              >
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
