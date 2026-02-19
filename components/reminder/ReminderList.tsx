'use client';

import { List, Tag, Empty, Skeleton } from 'antd-mobile';
import { useReminders, type RemindersData } from '@/lib/hooks/useReminders';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

interface ReminderListProps {
  basePath?: string;
  data?: RemindersData;
  staffMap?: Record<string, string>;
}

export function ReminderList({ basePath, data, staffMap }: ReminderListProps) {
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

  const getStaffName = (staffId: string | null) => {
    if (!staffMap || !staffId) return undefined;
    return staffMap[staffId] || '未知';
  };

  return (
    <div>
      {upcomingEndings.length > 0 && (
        <List header="即將到期開團">
          {upcomingEndings.map((item) => {
            const staff = getStaffName(item.staff_id);
            return (
              <List.Item
                key={item.id}
                onClick={() =>
                  router.push(
                    basePath ? `${basePath}/${item.id}` : ROUTES.STAFF.KOL_DETAIL(item.id)
                  )
                }
                extra={
                  <Tag color="danger" fill="outline">
                    {item.days_remaining} 天
                  </Tag>
                }
                description={
                  <span>
                    結束日期：{item.group_buy_end_date}
                    {staff && <span className="ml-2 text-gray-400">· {staff}</span>}
                  </span>
                }
              >
                @{item.ig_handle}
              </List.Item>
            );
          })}
        </List>
      )}

      {pendingPr.length > 0 && (
        <List header="公關品未收到">
          {pendingPr.map((item) => {
            const staff = getStaffName(item.staff_id);
            return (
              <List.Item
                key={item.id}
                onClick={() =>
                  router.push(
                    basePath ? `${basePath}/${item.id}` : ROUTES.STAFF.KOL_DETAIL(item.id)
                  )
                }
                extra={
                  <Tag color="warning" fill="outline">
                    待收
                  </Tag>
                }
                description={staff && <span className="text-gray-400">{staff}</span>}
              >
                @{item.ig_handle}
              </List.Item>
            );
          })}
        </List>
      )}

      {pendingSettlements.length > 0 && (
        <List header="待結算">
          {pendingSettlements.map((item) => {
            const staff = getStaffName(item.staff_id);
            return (
              <List.Item
                key={item.id}
                onClick={() => router.push(ROUTES.ADMIN.SETTLEMENT_DETAIL(item.id))}
                extra={
                  <Tag color="primary" fill="outline">
                    待結算
                  </Tag>
                }
                description={
                  <span>
                    開團結束：{item.group_buy_end_date}
                    {staff && <span className="ml-2 text-gray-400">· {staff}</span>}
                  </span>
                }
              >
                @{item.ig_handle}
              </List.Item>
            );
          })}
        </List>
      )}
    </div>
  );
}
