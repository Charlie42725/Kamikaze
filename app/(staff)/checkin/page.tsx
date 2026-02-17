'use client';

import { Tabs } from 'antd-mobile';
import { CheckinUploader } from '@/components/checkin/CheckinUploader';
import { CheckinHistory } from '@/components/checkin/CheckinHistory';

export default function CheckinPage() {
  return (
    <div>
      <div className="px-4 pt-4">
        <h2 className="text-xl font-bold mb-4">打卡</h2>
      </div>

      <Tabs>
        <Tabs.Tab title="打卡上傳" key="upload">
          <CheckinUploader />
        </Tabs.Tab>
        <Tabs.Tab title="歷史紀錄" key="history">
          <CheckinHistory />
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}
