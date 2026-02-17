'use client';

import { Skeleton, Empty } from 'antd-mobile';
import { CheckinCard } from './CheckinCard';
import { useCheckins } from '@/lib/hooks/useCheckins';

export function CheckinHistory() {
  const { checkins, loading } = useCheckins();

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton.Paragraph lineCount={4} animated />
      </div>
    );
  }

  if (checkins.length === 0) {
    return <Empty description="尚無打卡紀錄" style={{ padding: '64px 0' }} />;
  }

  return (
    <div className="p-4">
      {checkins.map((checkin) => (
        <CheckinCard key={checkin.id} checkin={checkin} />
      ))}
    </div>
  );
}
