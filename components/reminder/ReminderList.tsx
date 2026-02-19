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

function groupByStaff<T extends { staff_id: string | null }>(
  items: T[],
  staffMap: Record<string, string>
): { staffName: string; items: T[] }[] {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    const key = item.staff_id || '_unassigned';
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return Object.entries(groups)
    .map(([key, items]) => ({
      staffName: key === '_unassigned' ? '未指派' : (staffMap[key] || '未知'),
      items,
    }))
    .sort((a, b) => a.staffName.localeCompare(b.staffName));
}

export function ReminderList({ basePath, data, staffMap }: ReminderListProps) {
  const fetched = useReminders({ skip: !!data });
  const { upcomingEndings, pendingPr, pendingSettlements, loading } = data ?? fetched;
  const router = useRouter();
  const grouped = !!staffMap;

  if (loading) {
    return <Skeleton.Paragraph lineCount={3} animated />;
  }

  const hasReminders = upcomingEndings.length + pendingPr.length + pendingSettlements.length > 0;

  if (!hasReminders) {
    return <Empty description="目前沒有待處理提醒" style={{ padding: '64px 0' }} />;
  }

  const endingGroups = grouped ? groupByStaff(upcomingEndings, staffMap) : null;
  const prGroups = grouped ? groupByStaff(pendingPr, staffMap) : null;
  const settlementGroups = grouped ? groupByStaff(pendingSettlements, staffMap) : null;

  return (
    <div>
      {upcomingEndings.length > 0 && (
        grouped ? (
          endingGroups!.map((group) => (
            <List key={group.staffName} header={`即將到期開團 — ${group.staffName}`}>
              {group.items.map((item) => (
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
                  description={`結束日期：${item.group_buy_end_date}`}
                >
                  @{item.ig_handle}
                </List.Item>
              ))}
            </List>
          ))
        ) : (
          <List header="即將到期開團">
            {upcomingEndings.map((item) => (
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
                description={`結束日期：${item.group_buy_end_date}`}
              >
                @{item.ig_handle}
              </List.Item>
            ))}
          </List>
        )
      )}

      {pendingPr.length > 0 && (
        grouped ? (
          prGroups!.map((group) => (
            <List key={group.staffName} header={`公關品未收到 — ${group.staffName}`}>
              {group.items.map((item) => (
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
                >
                  @{item.ig_handle}
                </List.Item>
              ))}
            </List>
          ))
        ) : (
          <List header="公關品未收到">
            {pendingPr.map((item) => (
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
              >
                @{item.ig_handle}
              </List.Item>
            ))}
          </List>
        )
      )}

      {pendingSettlements.length > 0 && (
        grouped ? (
          settlementGroups!.map((group) => (
            <List key={group.staffName} header={`待結算 — ${group.staffName}`}>
              {group.items.map((item) => (
                <List.Item
                  key={item.id}
                  onClick={() => router.push(ROUTES.ADMIN.SETTLEMENT_DETAIL(item.id))}
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
          ))
        ) : (
          <List header="待結算">
            {pendingSettlements.map((item) => (
              <List.Item
                key={item.id}
                onClick={() => router.push(ROUTES.ADMIN.SETTLEMENT_DETAIL(item.id))}
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
        )
      )}
    </div>
  );
}
