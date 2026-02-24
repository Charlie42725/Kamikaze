'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Picker, Form, Toast } from 'antd-mobile';
import { PageHeader } from '@/components/layout/PageHeader';
import { KolSopForm } from '@/components/kol/KolSopForm';
import { useKols } from '@/lib/hooks/useKols';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { KolInsert, Profile } from '@/lib/types/database';
import { ROUTES } from '@/lib/constants';

export default function AdminAddKolPage() {
  const router = useRouter();
  const { createKol } = useKols();
  const supabase = useSupabase();
  const [staffList, setStaffList] = useState<Pick<Profile, 'id' | 'display_name'>[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, display_name')
        .eq('role', 'staff')
        .eq('is_active', true)
        .order('display_name');
      if (data) setStaffList(data as unknown as Pick<Profile, 'id' | 'display_name'>[]);
    };
    fetchStaff();
  }, [supabase]);

  const staffOptions = [[
    { label: '（未指派）', value: '' },
    ...staffList.map((s) => ({ label: s.display_name, value: s.id })),
  ]];

  const selectedStaffName = staffList.find((s) => s.id === selectedStaffId)?.display_name;

  const handleSubmit = async (data: KolInsert, productIds: string[]) => {
    if (!selectedStaffId) {
      Toast.show({ content: '請先選擇行銷人員', icon: 'fail' });
      throw new Error('請先選擇行銷人員');
    }
    const kol = await createKol(data);
    if (productIds.length > 0) {
      const kolProducts = productIds.map((productId) => ({
        kol_id: kol.id,
        product_id: productId,
      }));
      await supabase.from('kol_products').insert(kolProducts as never);
    }
    router.push(ROUTES.ADMIN.KOLS);
  };

  return (
    <div>
      <PageHeader title="新增網紅 (SOP)" />

      <Form>
        <Form.Header>指定行銷人員</Form.Header>
        <Form.Item label="行銷人員" onClick={() => setPickerVisible(true)}>
          <span style={{ color: selectedStaffId ? undefined : '#ccc' }}>
            {selectedStaffId ? selectedStaffName : '請選擇行銷人員'}
          </span>
        </Form.Item>
      </Form>

      <Picker
        columns={staffOptions}
        visible={pickerVisible}
        onConfirm={(val) => {
          setSelectedStaffId((val[0] as string) || null);
          setPickerVisible(false);
        }}
        onClose={() => setPickerVisible(false)}
      />

      <KolSopForm
        overrideStaffId={selectedStaffId}
        onSubmit={handleSubmit}
        submitText="新增"
      />
    </div>
  );
}
