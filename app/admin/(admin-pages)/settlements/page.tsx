'use client';

import { useState } from 'react';
import { Tabs, SpinLoading, Empty } from 'antd-mobile';
import { SettlementCard } from '@/components/settlement/SettlementCard';
import { useSettlements } from '@/lib/hooks/useSettlements';

export default function SettlementsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'settled'>('pending');
  const { settlements, loading } = useSettlements({ settled: activeTab === 'settled' });

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
          settlements.map((settlement) => (
            <SettlementCard key={settlement.id} settlement={settlement} />
          ))
        )}
      </div>
    </div>
  );
}
