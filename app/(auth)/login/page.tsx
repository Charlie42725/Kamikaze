'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Toast } from 'antd-mobile';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { ROUTES } from '@/lib/constants';

export default function LoginPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        Toast.show({
          icon: 'fail',
          content: error.message === 'Invalid login credentials'
            ? '電子信箱或密碼錯誤'
            : `登入失敗：${error.message}`,
        });
        return;
      }

      // Fetch the user's profile to determine role-based redirect
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Toast.show({ icon: 'fail', content: '無法取得使用者資料' });
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const p = profile as unknown as { role: string } | null;
      if (p?.role === 'admin') {
        router.replace(ROUTES.ADMIN.DASHBOARD);
      } else {
        router.replace(ROUTES.STAFF.DASHBOARD);
      }
    } catch {
      Toast.show({ icon: 'fail', content: '發生未預期的錯誤，請稍後再試' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 400,
        background: 'var(--bg-card)',
        borderRadius: 16,
        padding: '40px 24px 32px',
        boxShadow: '0 8px 32px var(--shadow-color)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: 2,
          }}
        >
          神風系統
        </h1>
        <p
          style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            marginTop: 8,
          }}
        >
          KOL 網紅管理系統
        </p>
      </div>

      <Form
        layout="vertical"
        onFinish={onFinish}
        footer={
          <Button
            block
            type="submit"
            color="primary"
            size="large"
            loading={loading}
            style={{ borderRadius: 8, fontWeight: 600 }}
          >
            登入
          </Button>
        }
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: '請輸入電子信箱' },
            { type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '請輸入有效的電子信箱' },
          ]}
        >
          <Input
            placeholder="請輸入電子信箱"
            type="email"
            autoComplete="email"
            clearable
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="密碼"
          rules={[{ required: true, message: '請輸入密碼' }]}
        >
          <Input
            placeholder="請輸入密碼"
            type="password"
            autoComplete="current-password"
            clearable
          />
        </Form.Item>
      </Form>
    </div>
  );
}
