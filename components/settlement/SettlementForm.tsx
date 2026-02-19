'use client';

import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  TextArea,
  Toast,
  Switch,
} from 'antd-mobile';
import { StarRating } from './StarRating';
import type { SettlementInsert, SettlementUpdate, Settlement } from '@/lib/types/database';

interface SettlementFormProps {
  initialData?: Settlement;
  kolId: string;
  onSubmit: (data: SettlementInsert | SettlementUpdate) => Promise<void>;
  submitText?: string;
}

export function SettlementForm({
  initialData,
  kolId,
  onSubmit,
  submitText = '儲存',
}: SettlementFormProps) {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(initialData?.sales_rating || 0);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    const values = form.getFieldsValue(true);
    setLoading(true);

    try {
      const data: SettlementInsert = {
        kol_id: kolId,
        sales_rating: rating || null,
        sales_amount: values.sales_amount
          ? parseFloat(values.sales_amount)
          : null,
        kol_amount: values.kol_amount
          ? parseFloat(values.kol_amount)
          : null,
        marketing_amount: values.marketing_amount
          ? parseFloat(values.marketing_amount)
          : null,
        is_settled: values.is_settled || false,
        settled_at: values.is_settled ? new Date().toISOString() : null,
        notes: values.notes || null,
      };

      await onSubmit(data);
      Toast.show({ content: '儲存成功', icon: 'success' });
    } catch {
      Toast.show({ content: '儲存失敗', icon: 'fail' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      initialValues={
        initialData
          ? {
              sales_amount: initialData.sales_amount?.toString() || '',
              kol_amount: initialData.kol_amount?.toString() || '',
              marketing_amount: initialData.marketing_amount?.toString() || '',
              is_settled: initialData.is_settled,
              notes: initialData.notes || '',
            }
          : { is_settled: false }
      }
      onFinish={handleSubmit}
      footer={
        <Button block type="submit" color="primary" loading={loading} size="large">
          {submitText}
        </Button>
      }
    >
      <Form.Header>結算資訊</Form.Header>

      <Form.Item label="銷售評級">
        <StarRating value={rating} onChange={setRating} />
      </Form.Item>

      <Form.Item name="sales_amount" label="銷售金額 (NT$)">
        <Input type="number" placeholder="請輸入銷售金額" />
      </Form.Item>

      <Form.Item name="kol_amount" label="網紅分潤 (NT$)">
        <Input type="number" placeholder="請輸入網紅分潤" />
      </Form.Item>

      <Form.Item name="marketing_amount" label="行銷分潤 (NT$)">
        <Input type="number" placeholder="請輸入行銷分潤" />
      </Form.Item>

      <Form.Item name="is_settled" label="已結算" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Header>備註</Form.Header>
      <Form.Item name="notes">
        <TextArea placeholder="備註..." rows={3} />
      </Form.Item>
    </Form>
  );
}
