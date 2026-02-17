'use client';

import { Card, SpinLoading } from 'antd-mobile';
import { useAuth } from '@/components/providers/AuthProvider';
import { useKols } from '@/lib/hooks/useKols';
import { ReminderBanner } from '@/components/reminder/ReminderBanner';
import { ReminderList } from '@/components/reminder/ReminderList';

export default function StaffDashboard() {
  const { profile } = useAuth();
  const { kols, loading } = useKols();

  const activeKols = kols.filter((k) => k.status === 'active');
  const potentialKols = kols.filter((k) => k.status === 'potential');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <SpinLoading />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        你好，{profile?.display_name}
      </h2>

      <ReminderBanner />

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card style={{ textAlign: 'center' }}>
          <div className="text-2xl font-bold text-blue-500">{kols.length}</div>
          <div className="text-xs text-gray-500">全部網紅</div>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <div className="text-2xl font-bold text-green-500">{activeKols.length}</div>
          <div className="text-xs text-gray-500">進行中</div>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <div className="text-2xl font-bold text-yellow-500">{potentialKols.length}</div>
          <div className="text-xs text-gray-500">潛在</div>
        </Card>
      </div>

      <h3 className="text-base font-semibold mb-3">待處理提醒</h3>
      <ReminderList />
    </div>
  );
}
