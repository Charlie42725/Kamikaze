'use client';

import { memo } from 'react';
import { Card, Image } from 'antd-mobile';
import type { Checkin } from '@/lib/types/database';
import dayjs from 'dayjs';

interface CheckinCardProps {
  checkin: Checkin;
}

function parseImageUrls(imageUrl: string): string[] {
  try {
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // old format: single URL string
  }
  return [imageUrl];
}

export const CheckinCard = memo(function CheckinCard({ checkin }: CheckinCardProps) {
  const imageUrls = parseImageUrls(checkin.image_url);

  return (
    <Card style={{ marginBottom: 12 }}>
      <div className="flex gap-3">
        <div className="flex gap-2 flex-wrap">
          {imageUrls.map((url) => (
            <Image
              key={url}
              src={url}
              width={80}
              height={80}
              fit="cover"
              style={{ borderRadius: 8 }}
            />
          ))}
        </div>
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
});
