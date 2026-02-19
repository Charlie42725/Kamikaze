'use client';

import { Tag } from 'antd-mobile';
import type { Kol } from '@/lib/types/database';
import { KOL_STATUS_LABELS, KOL_STATUS_COLORS, getKolDisplayStatus } from '@/lib/constants';

interface KolStatusBadgeProps {
  status: string;
  groupBuyStartDate?: string | null;
}

export function KolStatusBadge({ status, groupBuyStartDate }: KolStatusBadgeProps) {
  const displayStatus = getKolDisplayStatus({ status, group_buy_start_date: groupBuyStartDate ?? null });
  const color = KOL_STATUS_COLORS[displayStatus] || '#d9d9d9';
  const label = KOL_STATUS_LABELS[displayStatus] || status;

  return (
    <Tag color={color} fill="outline" style={{ '--border-color': color, '--text-color': color }}>
      {label}
    </Tag>
  );
}
