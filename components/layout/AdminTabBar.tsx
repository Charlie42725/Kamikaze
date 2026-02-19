'use client';

import { usePathname, useRouter } from 'next/navigation';
import { TabBar } from 'antd-mobile';
import {
  PieOutline,
  TeamOutline,
  GiftOutline,
  BillOutline,
  UserOutline,
} from 'antd-mobile-icons';

const tabs = [
  { key: '/admin/dashboard', title: '總覽', icon: <PieOutline /> },
  { key: '/admin/kols', title: '網紅', icon: <TeamOutline /> },
  { key: '/admin/pr-products', title: '公關品', icon: <GiftOutline /> },
  { key: '/admin/settlements', title: '結算', icon: <BillOutline /> },
  { key: '/admin/profile', title: '我的', icon: <UserOutline /> },
];

export default function AdminTabBar() {
  const pathname = usePathname();
  const router = useRouter();

  const activeKey = tabs.find((tab) => pathname.startsWith(tab.key))?.key ?? '/admin/dashboard';

  return (
    <div className="tab-bar-wrapper">
      <TabBar
        activeKey={activeKey}
        onChange={(key) => router.push(key)}
      >
        {tabs.map((tab) => (
          <TabBar.Item key={tab.key} icon={tab.icon} title={tab.title} />
        ))}
      </TabBar>
    </div>
  );
}
