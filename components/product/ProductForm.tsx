'use client';

import { useState } from 'react';
import { Form, Input, Button, TextArea, Toast } from 'antd-mobile';
import type { ProductInsert, ProductUpdate, Product } from '@/lib/types/database';

interface ProductFormProps {
  initialData?: Product;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => Promise<void>;
  submitText?: string;
}

export function ProductForm({ initialData, onSubmit, submitText = '儲存' }: ProductFormProps) {
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: Record<string, string>) => {
    setLoading(true);
    try {
      await onSubmit({
        name: values.name,
        description: values.description || null,
        price: values.price ? parseFloat(values.price) : null,
        image_url: values.image_url || null,
      });
      Toast.show({ content: '儲存成功', icon: 'success' });
    } catch {
      Toast.show({ content: '儲存失敗', icon: 'fail' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      initialValues={initialData ? {
        name: initialData.name,
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        image_url: initialData.image_url || '',
      } : {}}
      onFinish={handleFinish}
      footer={
        <Button block type="submit" color="primary" loading={loading} size="large">
          {submitText}
        </Button>
      }
    >
      <Form.Header>商品資訊</Form.Header>
      <Form.Item name="name" label="商品名稱" rules={[{ required: true, message: '請輸入商品名稱' }]}>
        <Input placeholder="請輸入商品名稱" />
      </Form.Item>
      <Form.Item name="price" label="價格 (NT$)">
        <Input type="number" placeholder="請輸入價格" />
      </Form.Item>
      <Form.Item name="description" label="描述">
        <TextArea placeholder="商品描述..." rows={3} />
      </Form.Item>
      <Form.Item name="image_url" label="圖片網址">
        <Input placeholder="https://..." />
      </Form.Item>
    </Form>
  );
}
