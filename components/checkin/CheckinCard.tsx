'use client';

import { Card, Image } from 'antd-mobile';
import type { Checkin } from '@/lib/types/database';
import dayjs from 'dayjs';

interface CheckinCardProps {
  checkin: Checkin;
}

export function CheckinCard({ checkin }: CheckinCardProps) {
  return (
    <Card style={{ marginBottom: 12 }}>
      <div className="flex gap-3">
        <Image
          src={checkin.image_url}
          width={80}
          height={80}
          fit="cover"
          style={{ borderRadius: 8 }}
        />
        <div className="flex-1">
          <div className="text-sm text-gray-500">
            {dayjs(checkin.checked_at).format('YYYY/MM/DD HH:mm')}
          </div>
          {checkin.notes && (
            <div className="text-sm mt-1">{checkin.notes}</div>
          )}
        </div>
      </div>
    </Card>
  );
}
