'use client';

import { useState } from 'react';
import { Tabs, Card, Tag, Empty, Skeleton } from 'antd-mobile';
import { PageHeader } from '@/components/layout/PageHeader';
import { StarRating } from '@/components/settlement/StarRating';
import { useSettlements } from '@/lib/hooks/useSettlements';
import dayjs from 'dayjs';

export default function StaffSettlementsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'settled'>('pending');
  const { settlements, pendingKols, loading } = useSettlements({
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
          <div className="space-y-3">
            <Skeleton.Paragraph lineCount={3} animated />
            <Skeleton.Paragraph lineCount={3} animated />
          </div>
        ) : activeTab === 'pending' ? (
          pendingKols.length === 0 ? (
            <Empty description="沒有待結算項目" />
          ) : (
            pendingKols.map((kol) => (
              <Card key={kol.id} style={{ marginBottom: 12 }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">@{kol.ig_handle}</span>
                  <Tag color="warning" fill="outline">待結算</Tag>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  開團結束：{dayjs(kol.group_buy_end_date).format('YYYY/MM/DD')}
                </div>
              </Card>
            ))
          )
        ) : settlements.length === 0 ? (
          <Empty description="沒有已結算項目" />
        ) : (
          settlements.map((settlement) => (
            <Card key={settlement.id} style={{ marginBottom: 12 }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">
                  @{settlement.kol?.ig_handle || '未知'}
                </span>
                <Tag color="success" fill="outline">已結算</Tag>
              </div>

              {settlement.sales_rating != null && settlement.sales_rating > 0 && (
                <StarRating value={settlement.sales_rating} readonly />
              )}

              {settlement.sales_amount != null && (
                <div className="text-sm mt-1">
                  <span className="text-gray-500 dark:text-gray-400">銷售金額</span>{' '}
                  <span className="font-semibold">NT$ {settlement.sales_amount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {dayjs(settlement.created_at).format('YYYY/MM/DD')}
                </span>
                <span className="font-semibold text-sm">
                  {settlement.kol_amount != null && (
                    <span className="text-blue-500">網紅 NT$ {settlement.kol_amount.toLocaleString()}</span>
                  )}
                  {settlement.kol_amount != null && settlement.marketing_amount != null && ' / '}
                  {settlement.marketing_amount != null && (
                    <span className="text-green-500">行銷 NT$ {settlement.marketing_amount.toLocaleString()}</span>
                  )}
                </span>
              </div>
              {settlement.notes && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 truncate">
                  {settlement.notes}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
