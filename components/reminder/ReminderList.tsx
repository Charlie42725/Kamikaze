'use client';

import { List, Tag, Empty, Skeleton } from 'antd-mobile';
import { useReminders, type RemindersData } from '@/lib/hooks/useReminders';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

interface ReminderListProps {
  basePath?: string;
  data?: RemindersData;
}

export function ReminderList({ basePath, data }: ReminderListProps) {
  const fetched = useReminders({ skip: !!data });
  const { upcomingEndings, pendingPr, pendingSettlements, loading } = data ?? fetched;
  const router = useRouter();

  if (loading) {
    return <Skeleton.Paragraph lineCount={3} animated />;
  }

  const hasReminders = upcomingEndings.length + pendingPr.length + pendingSettlements.length > 0;

  if (!hasReminders) {
    return <Empty description="目前沒有待處理提醒" style={{ padding: '64px 0' }} />;
  }

  return (
    <div>
      {upcomingEndings.length > 0 && (
        <List header="即將到期開團">
          {upcomingEndings.map((item) => (
            <List.Item
              key={item.id}
              onClick={() =>
                router.push(
                  basePath
                    ? `${basePath}/${item.id}`
                    : ROUTES.STAFF.KOL_DETAIL(item.id)
                )
              }
              extra={
                <Tag color="danger" fill="outline">
                  {item.days_remaining} 天
                </Tag>
              }
              description={`結束日期：${item.group_buy_end_date}`}
            >
              @{item.ig_handle}
            </List.Item>
          ))}
        </List>
      )}

      {pendingPr.length > 0 && (
        <List header="公關品未收到">
          {pendingPr.map((item) => (
            <List.Item
              key={item.id}
              onClick={() =>
                router.push(
                  basePath
                    ? `${basePath}/${item.id}`
                    : ROUTES.STAFF.KOL_DETAIL(item.id)
                )
              }
              extra={
                <Tag color="warning" fill="outline">
                  待收
                </Tag>
              }
            >
              @{item.ig_handle}
            </List.Item>
          ))}
        </List>
      )}

      {pendingSettlements.length > 0 && (
        <List header="待結算">
          {pendingSettlements.map((item) => (
            <List.Item
              key={item.id}
              onClick={() =>
                router.push(ROUTES.ADMIN.SETTLEMENT_DETAIL(item.id))
              }
              extra={
                <Tag color="primary" fill="outline">
                  待結算
                </Tag>
              }
              description={`開團結束：${item.group_buy_end_date}`}
            >
              @{item.ig_handle}
            </List.Item>
          ))}
        </List>
      )}
    </div>
  );
}
