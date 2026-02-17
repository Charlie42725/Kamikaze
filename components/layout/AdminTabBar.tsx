'use client';

import { usePathname, useRouter } from 'next/navigation';
import { TabBar } from 'antd-mobile';
import {
  PieOutline,
  TeamOutline,
  ShopbagOutline,
  BillOutline,
} from 'antd-mobile-icons';

const tabs = [
  { key: '/admin/dashboard', title: '總覽', icon: <PieOutline /> },
  { key: '/admin/kols', title: '網紅', icon: <TeamOutline /> },
  { key: '/admin/products', title: '商品', icon: <ShopbagOutline /> },
  { key: '/admin/settlements', title: '結算', icon: <BillOutline /> },
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
