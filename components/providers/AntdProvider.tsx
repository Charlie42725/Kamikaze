'use client';

import { ConfigProvider } from 'antd-mobile';
import { unstableSetRender } from 'antd-mobile/es/utils/unstable-render';
import zhTW from 'antd-mobile/es/locales/zh-TW';
import { createRoot } from 'react-dom/client';

// Patch for React 19 compatibility
unstableSetRender((node, container) => {
  const root = (container as any)._reactRoot || createRoot(container);
  (container as any)._reactRoot = root;
  root.render(node);
  return async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    root.unmount();
  };
});

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return <ConfigProvider locale={zhTW}>{children}</ConfigProvider>;
}
