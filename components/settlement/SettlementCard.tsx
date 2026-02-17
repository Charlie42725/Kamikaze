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
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm text-gray-500">
          {settlement.period_start && settlement.period_end
            ? `${dayjs(settlement.period_start).format('MM/DD')} - ${dayjs(settlement.period_end).format('MM/DD')}`
            : dayjs(settlement.created_at).format('YYYY/MM/DD')}
        </span>
        {settlement.settlement_amount != null && (
          <span className="font-semibold text-blue-500">
            NT$ {settlement.settlement_amount}
          </span>
        )}
      </div>
    </Card>
  );
}
