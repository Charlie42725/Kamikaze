'use client';

import { useRouter } from 'next/navigation';
import { NavBar } from 'antd-mobile';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  right?: ReactNode;
}

export function PageHeader({ title, showBack = true, right }: PageHeaderProps) {
  const router = useRouter();

  return (
    <NavBar
      onBack={showBack ? () => router.back() : undefined}
      backIcon={showBack ? undefined : false}
      right={right}
    >
      {title}
    </NavBar>
  );
}
