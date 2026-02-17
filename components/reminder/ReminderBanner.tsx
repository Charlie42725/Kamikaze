'use client';

import { NoticeBar } from 'antd-mobile';
import { useReminders } from '@/lib/hooks/useReminders';

export function ReminderBanner() {
  const { upcomingEndings, pendingPr, totalReminders } = useReminders();

  if (totalReminders === 0) return null;

  const messages: string[] = [];

  if (upcomingEndings.length > 0) {
    messages.push(
      `${upcomingEndings.length} 個開團即將到期`
    );
  }

  if (pendingPr.length > 0) {
    messages.push(
      `${pendingPr.length} 位網紅尚未收到公關品`
    );
  }

  return (
    <NoticeBar
      content={messages.join('；')}
      color="alert"
      closeable
      style={{ marginBottom: 12 }}
    />
  );
}
