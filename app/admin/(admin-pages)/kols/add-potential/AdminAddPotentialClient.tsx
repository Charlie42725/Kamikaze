'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Picker, Form, Toast } from 'antd-mobile';
import { PageHeader } from '@/components/layout/PageHeader';
import { KolPotentialForm } from '@/components/kol/KolPotentialForm';
import { useKols } from '@/lib/hooks/useKols';
import type { KolInsert, Profile } from '@/lib/types/database';
import { ROUTES } from '@/lib/constants';

export function AdminAddPotentialClient({ staffList }: { staffList: Pick<Profile, 'id' | 'display_name'>[] }) {
  const router = useRouter();
  const { createKol } = useKols();
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  const staffOptions = [[
    { label: '（未指派）', value: '' },
    ...staffList.map((s) => ({ label: s.display_name, value: s.id })),
  ]];

  const selectedStaffName = staffList.find((s) => s.id === selectedStaffId)?.display_name;

  const handleSubmit = async (data: KolInsert) => {
    if (!selectedStaffId) {
      Toast.show({ content: '請先選擇行銷人員', icon: 'fail' });
      throw new Error('請先選擇行銷人員');
    }
    await createKol(data);
    router.push(ROUTES.ADMIN.KOLS);
  };

  return (
    <div>
      <PageHeader title="新增潛在對象" />

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
        onConfirm={(val) => { setSelectedStaffId((val[0] as string) || null); setPickerVisible(false); }}
        onClose={() => setPickerVisible(false)}
      />

      <KolPotentialForm overrideStaffId={selectedStaffId} onSubmit={handleSubmit} />
    </div>
  );
}
