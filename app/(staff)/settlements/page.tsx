'use client';

import { useState } from 'react';
import { Tabs, Card, Tag, SpinLoading, Empty } from 'antd-mobile';
import { PageHeader } from '@/components/layout/PageHeader';
import { StarRating } from '@/components/settlement/StarRating';
import { useSettlements } from '@/lib/hooks/useSettlements';
import dayjs from 'dayjs';

export default function StaffSettlementsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'settled'>('pending');
  const { settlements, loading } = useSettlements({
    settled: activeTab === 'settled',
    staffOnly: true,
  });

  return (
    <div>
      <PageHeader title="我的結算" />

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
            <Card key={settlement.id} style={{ marginBottom: 12 }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">
                  @{settlement.kol?.ig_handle || '未知'}
                </span>
                <Tag color={settlement.is_settled ? 'success' : 'warning'} fill="outline">
                  {settlement.is_settled ? '已結算' : '待結算'}
                </Tag>
              </div>

              {settlement.sales_rating != null && settlement.sales_rating > 0 && (
                <StarRating value={settlement.sales_rating} readonly />
              )}

              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500">
                  {settlement.period_start && settlement.period_end
                    ? `${dayjs(settlement.period_start).format('MM/DD')} - ${dayjs(settlement.period_end).format('MM/DD')}`
                    : dayjs(settlement.created_at).format('YYYY/MM/DD')}
                </span>
                {settlement.marketing_amount != null && (
                  <span className="font-semibold text-green-500">
                    行銷 NT$ {settlement.marketing_amount}
                  </span>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
