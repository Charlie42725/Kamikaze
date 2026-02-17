'use client';

import { Tag } from 'antd-mobile';
import type { KolStatus } from '@/lib/types/database';
import { KOL_STATUS_LABELS, KOL_STATUS_COLORS } from '@/lib/constants';

interface KolStatusBadgeProps {
  status: KolStatus;
}

export function KolStatusBadge({ status }: KolStatusBadgeProps) {
  const color = KOL_STATUS_COLORS[status] || '#d9d9d9';
  const label = KOL_STATUS_LABELS[status] || status;

  return (
    <Tag color={color} fill="outline" style={{ '--border-color': color, '--text-color': color }}>
      {label}
    </Tag>
  );
}
