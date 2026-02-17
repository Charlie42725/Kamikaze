'use client';

import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  TextArea,
  Toast,
  Switch,
} from 'antd-mobile';
import { StarRating } from './StarRating';
import type { SettlementInsert, SettlementUpdate, Settlement } from '@/lib/types/database';
import dayjs from 'dayjs';

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
        kol_amount: values.kol_amount
          ? parseFloat(values.kol_amount)
          : null,
        marketing_amount: values.marketing_amount
          ? parseFloat(values.marketing_amount)
          : null,
        is_settled: values.is_settled || false,
        settled_at: values.is_settled ? new Date().toISOString() : null,
        period_start: values.period_start
          ? dayjs(values.period_start).format('YYYY-MM-DD')
          : null,
        period_end: values.period_end
          ? dayjs(values.period_end).format('YYYY-MM-DD')
          : null,
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
              kol_amount: initialData.kol_amount?.toString() || '',
              marketing_amount: initialData.marketing_amount?.toString() || '',
              is_settled: initialData.is_settled,
              period_start: initialData.period_start
                ? new Date(initialData.period_start)
                : undefined,
              period_end: initialData.period_end
                ? new Date(initialData.period_end)
                : undefined,
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

      <Form.Item name="kol_amount" label="網紅金額 (NT$)">
        <Input type="number" placeholder="請輸入網紅金額" />
      </Form.Item>

      <Form.Item name="marketing_amount" label="行銷金額 (NT$)">
        <Input type="number" placeholder="請輸入行銷金額" />
      </Form.Item>

      <Form.Item
        name="period_start"
        label="結算起始"
        trigger="onConfirm"
        onClick={(_, datePickerRef) => datePickerRef.current?.open()}
      >
        <DatePicker>
          {(value) => (value ? dayjs(value).format('YYYY/MM/DD') : '請選擇日期')}
        </DatePicker>
      </Form.Item>

      <Form.Item
        name="period_end"
        label="結算結束"
        trigger="onConfirm"
        onClick={(_, datePickerRef) => datePickerRef.current?.open()}
      >
        <DatePicker>
          {(value) => (value ? dayjs(value).format('YYYY/MM/DD') : '請選擇日期')}
        </DatePicker>
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
