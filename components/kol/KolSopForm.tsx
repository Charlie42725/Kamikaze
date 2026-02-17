'use client';

import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Switch,
  DatePicker,
  Stepper,
  TextArea,
  Toast,
  Picker,
  Radio,
  Space,
} from 'antd-mobile';
import { KolProductSelector } from './KolProductSelector';
import { useAuth } from '@/components/providers/AuthProvider';
import type { KolInsert, Kol } from '@/lib/types/database';
import dayjs from 'dayjs';

interface KolSopFormProps {
  initialData?: Kol;
  initialProductIds?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any, productIds: string[]) => Promise<void>;
  submitText?: string;
}

const statusOptions = [
  [
    { label: '潛在', value: 'potential' },
    { label: '進行中', value: 'active' },
    { label: '已結束', value: 'ended' },
  ],
];

export function KolSopForm({
  initialData,
  initialProductIds = [],
  onSubmit,
  submitText = '儲存',
}: KolSopFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(initialProductIds);
  const [hasPr, setHasPr] = useState(initialData?.has_pr_products ?? false);
  const [form] = Form.useForm();

  const handleStartDateConfirm = (val: Date) => {
    form.setFieldsValue({ group_buy_start_date: val });
    // Auto-set end date to start + 1 month if not already set
    const currentEnd = form.getFieldValue('group_buy_end_date');
    if (!currentEnd) {
      const endDate = dayjs(val).add(1, 'month').toDate();
      form.setFieldsValue({ group_buy_end_date: endDate });
    }
  };

  const handleSubmit = async () => {
    const values = form.getFieldsValue(true);
    setLoading(true);

    try {
      const data: KolInsert = {
        ig_handle: values.ig_handle,
        status: values.status?.[0] || 'active',
        group_buy_start_date: values.group_buy_start_date
          ? dayjs(values.group_buy_start_date).format('YYYY-MM-DD')
          : null,
        group_buy_end_date: values.group_buy_end_date
          ? dayjs(values.group_buy_end_date).format('YYYY-MM-DD')
          : null,
        has_pr_products: values.has_pr_products || false,
        pr_ship_mode: values.has_pr_products ? (values.pr_ship_mode || null) : null,
        pr_ship_reminded: values.has_pr_products ? (values.pr_ship_reminded || false) : false,
        pr_shipped: values.has_pr_products ? (values.pr_shipped || false) : false,
        pr_products_received: values.has_pr_products ? (values.pr_products_received || false) : false,
        revenue_share_pct: values.revenue_share_pct ?? null,
        revenue_share_start_unit: values.revenue_share_start_unit ?? null,
        has_exclusive_store: values.has_exclusive_store || false,
        notes: values.notes || null,
        staff_id: user?.id || null,
      };

      await onSubmit(data, selectedProductIds);
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
              ...initialData,
              status: [initialData.status],
              group_buy_start_date: initialData.group_buy_start_date
                ? new Date(initialData.group_buy_start_date)
                : undefined,
              group_buy_end_date: initialData.group_buy_end_date
                ? new Date(initialData.group_buy_end_date)
                : undefined,
              revenue_share_pct: initialData.revenue_share_pct ?? 20,
              revenue_share_start_unit: initialData.revenue_share_start_unit ?? 1,
              pr_ship_mode: initialData.pr_ship_mode || 'direct',
            }
          : {
              status: ['active'],
              has_pr_products: false,
              pr_ship_reminded: false,
              pr_shipped: false,
              pr_products_received: false,
              has_exclusive_store: false,
              revenue_share_pct: 20,
              revenue_share_start_unit: 1,
              pr_ship_mode: 'direct',
            }
      }
      onValuesChange={(changedValues) => {
        if ('has_pr_products' in changedValues) {
          setHasPr(changedValues.has_pr_products);
        }
      }}
      onFinish={handleSubmit}
      footer={
        <Button block type="submit" color="primary" loading={loading} size="large">
          {submitText}
        </Button>
      }
    >
      <Form.Header>基本資訊</Form.Header>
      <Form.Item name="ig_handle" label="IG 帳號" rules={[{ required: true, message: '請輸入 IG 帳號' }]}>
        <Input placeholder="請輸入 IG 帳號" />
      </Form.Item>
      <Form.Item name="status" label="狀態" trigger="onConfirm" onClick={(_, pickerRef) => pickerRef.current?.open()}>
        <Picker columns={statusOptions}>
          {(value) => value?.[0]?.label || '請選擇'}
        </Picker>
      </Form.Item>

      <Form.Header>開團資訊</Form.Header>
      <Form.Item name="group_buy_start_date" label="開團開始" trigger="onConfirm" onClick={(_, datePickerRef) => datePickerRef.current?.open()}>
        <DatePicker onConfirm={handleStartDateConfirm}>
          {(value) => (value ? dayjs(value).format('YYYY/MM/DD') : '請選擇日期')}
        </DatePicker>
      </Form.Item>
      <Form.Item name="group_buy_end_date" label="開團結束" trigger="onConfirm" onClick={(_, datePickerRef) => datePickerRef.current?.open()}>
        <DatePicker>
          {(value) => (value ? dayjs(value).format('YYYY/MM/DD') : '請選擇日期')}
        </DatePicker>
      </Form.Item>

      <Form.Header>公關品</Form.Header>
      <Form.Item
        name="has_pr_products"
        label="需要公關品"
        valuePropName="checked"
        childElementPosition="right"
      >
        <Switch />
      </Form.Item>
      {hasPr && (
        <>
          <Form.Item name="pr_ship_mode" label="寄送方式">
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="direct">直接寄出</Radio>
                <Radio value="after_3_sales">銷售 3 件後寄出</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="pr_ship_reminded" label="已提醒寄出" valuePropName="checked" childElementPosition="right">
            <Switch />
          </Form.Item>
          <Form.Item name="pr_shipped" label="已寄出" valuePropName="checked" childElementPosition="right">
            <Switch />
          </Form.Item>
          <Form.Item name="pr_products_received" label="已收到公關品" valuePropName="checked" childElementPosition="right">
            <Switch />
          </Form.Item>
        </>
      )}

      <Form.Header>分潤設定</Form.Header>
      <Form.Item name="revenue_share_pct" label="分潤比例 (%)">
        <Stepper min={0} max={100} step={0.5} />
      </Form.Item>
      <Form.Item name="revenue_share_start_unit" label="起算件數">
        <Stepper min={0} step={1} />
      </Form.Item>
      <Form.Item name="has_exclusive_store" label="專屬賣場" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Header>商品選擇</Form.Header>
      <KolProductSelector
        selectedIds={selectedProductIds}
        onChange={setSelectedProductIds}
      />

      <Form.Header>備註</Form.Header>
      <Form.Item name="notes">
        <TextArea placeholder="備註..." rows={3} />
      </Form.Item>
    </Form>
  );
}
