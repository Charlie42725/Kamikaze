'use client';

import { Card, Tag } from 'antd-mobile';
import { useRouter } from 'next/navigation';
import { StarRating } from './StarRating';
import { ROUTES } from '@/lib/constants';
import type { Settlement } from '@/lib/types/database';
import dayjs from 'dayjs';

interface SettlementCardProps {
  settlement: Settlement & { kol?: { ig_handle: string } };
}

export function SettlementCard({ settlement }: SettlementCardProps) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(ROUTES.ADMIN.SETTLEMENT_DETAIL(settlement.id))}
      style={{ marginBottom: 12, cursor: 'pointer' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">
          @{settlement.kol?.ig_handle || '未知'}
        </span>
        <Tag color={settlement.is_settled ? 'success' : 'warning'} fill="outline">
          {settlement.is_settled ? '已結算' : '待結算'}
        </Tag>
      </div>
      {settlement.sales_rating && (
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
  );
}
