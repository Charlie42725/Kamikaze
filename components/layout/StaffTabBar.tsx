'use client';

import { usePathname, useRouter } from 'next/navigation';
import { TabBar } from 'antd-mobile';
import {
  AppOutline,
  TeamOutline,
  GiftOutline,
  BillOutline,
  UserOutline,
} from 'antd-mobile-icons';

const tabs = [
  { key: '/dashboard', title: '首頁', icon: <AppOutline /> },
  { key: '/kols', title: '網紅', icon: <TeamOutline /> },
  { key: '/pr-products', title: '公關品', icon: <GiftOutline /> },
  { key: '/settlements', title: '結算', icon: <BillOutline /> },
  { key: '/profile', title: '我的', icon: <UserOutline /> },
];

export default function StaffTabBar() {
  const pathname = usePathname();
  const router = useRouter();

  const activeKey = tabs.find((tab) => pathname.startsWith(tab.key))?.key ?? '/dashboard';

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
