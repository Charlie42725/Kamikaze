'use client';

import { useState } from 'react';
import { Form, Input, Button, TextArea, Toast } from 'antd-mobile';
import { useAuth } from '@/components/providers/AuthProvider';
import type { KolInsert } from '@/lib/types/database';

interface KolPotentialFormProps {
  overrideStaffId?: string | null;
  onSubmit: (data: KolInsert) => Promise<void>;
}

export function KolPotentialForm({ overrideStaffId, onSubmit }: KolPotentialFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: { ig_handle: string; notes?: string }) => {
    setLoading(true);
    try {
      await onSubmit({
        ig_handle: values.ig_handle,
        status: 'potential',
        notes: values.notes || null,
        staff_id: overrideStaffId !== undefined ? overrideStaffId : (user?.id || null),
      });
      Toast.show({ content: '新增成功', icon: 'success' });
    } catch {
      Toast.show({ content: '新增失敗', icon: 'fail' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      onFinish={handleFinish}
      footer={
        <Button block type="submit" color="primary" loading={loading} size="large">
          新增潛在對象
        </Button>
      }
    >
      <Form.Header>潛在合作對象</Form.Header>
      <Form.Item name="ig_handle" label="IG 帳號" rules={[{ required: true, message: '請輸入 IG 帳號' }]}>
        <Input placeholder="請輸入 IG 帳號" />
      </Form.Item>
      <Form.Item name="notes" label="備註">
        <TextArea placeholder="備註..." rows={3} />
      </Form.Item>
    </Form>
  );
}
