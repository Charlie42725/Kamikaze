'use client';

import { Card } from 'antd-mobile';
import { useRouter } from 'next/navigation';
import { KolStatusBadge } from './KolStatusBadge';
import { ROUTES } from '@/lib/constants';
import type { Kol } from '@/lib/types/database';
import dayjs from 'dayjs';

interface KolCardProps {
  kol: Kol;
  basePath?: string;
}

export function KolCard({ kol, basePath }: KolCardProps) {
  const router = useRouter();
  const detailPath = basePath
    ? `${basePath}/${kol.id}`
    : ROUTES.STAFF.KOL_DETAIL(kol.id);

  return (
    <Card
      onClick={() => router.push(detailPath)}
      style={{ marginBottom: 12, cursor: 'pointer' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-base">@{kol.ig_handle}</span>
            <KolStatusBadge status={kol.status} />
          </div>
          {kol.group_buy_end_date && (
            <div className="text-xs text-gray-500">
              開團結束：{dayjs(kol.group_buy_end_date).format('YYYY/MM/DD')}
            </div>
          )}
          {kol.notes && (
            <div className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">
              {kol.notes}
            </div>
          )}
        </div>
        <div className="text-gray-300 text-lg">›</div>
      </div>
    </Card>
  );
}
