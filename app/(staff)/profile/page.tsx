'use client';

import { List, Button, Avatar, Dialog, Card, Switch } from 'antd-mobile';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    const confirmed = await Dialog.confirm({
      content: '確定要登出嗎？',
    });
    if (confirmed) {
      await signOut();
      router.push('/login');
    }
  };

  return (
    <div className="p-4">
      <Card style={{ marginBottom: 16 }}>
        <div className="flex items-center gap-4">
          <Avatar
            src={profile?.avatar_url || ''}
            style={{ '--size': '64px', '--border-radius': '50%' }}
          />
          <div>
            <div className="font-bold text-lg">{profile?.display_name}</div>
            <div className="text-sm text-gray-500">{profile?.email}</div>
            <div className="text-xs text-gray-400 mt-1">
              {profile?.role === 'admin' ? '管理員' : '行銷人員'}
            </div>
          </div>
        </div>
      </Card>

      <List>
        <List.Item
          extra={
            <Switch
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
          }
        >
          深色模式
        </List.Item>
        <List.Item onClick={() => {}}>帳號設定</List.Item>
        <List.Item onClick={() => {}}>通知設定</List.Item>
      </List>

      <div className="mt-8 px-4">
        <Button block color="danger" onClick={handleLogout} size="large">
          登出
        </Button>
      </div>
    </div>
  );
}
