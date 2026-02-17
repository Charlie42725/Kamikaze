'use client';

import { useState, useRef } from 'react';
import { Button, TextArea, Toast, ImageUploader, Space } from 'antd-mobile';
import type { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
import { useCheckins } from '@/lib/hooks/useCheckins';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/constants';

export function CheckinUploader() {
  const { createCheckin } = useCheckins();
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleUpload = async (file: File): Promise<ImageUploadItem> => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      Toast.show({ content: '僅支援 JPG、PNG、WebP 格式', icon: 'fail' });
      throw new Error('Invalid file type');
    }
    if (file.size > MAX_IMAGE_SIZE) {
      Toast.show({ content: '圖片大小不可超過 5MB', icon: 'fail' });
      throw new Error('File too large');
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/checkin/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      Toast.show({ content: '上傳失敗', icon: 'fail' });
      throw new Error('Upload failed');
    }

    const { url } = await res.json();
    return { url };
  };

  const handleSubmit = async () => {
    if (fileList.length === 0) {
      Toast.show({ content: '請先上傳圖片', icon: 'fail' });
      return;
    }

    setSubmitting(true);
    try {
      const imageUrls = fileList.map((f) => f.url!);
      await createCheckin(imageUrls, notes || undefined);
      setFileList([]);
      setNotes('');
      Toast.show({ content: '打卡成功！', icon: 'success' });
    } catch {
      Toast.show({ content: '打卡失敗', icon: 'fail' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <ImageUploader
        value={fileList}
        onChange={setFileList}
        upload={handleUpload}
        maxCount={9}
        multiple
        style={{ '--cell-size': '120px' }}
      />
      <div className="mt-4">
        <TextArea
          placeholder="備註（選填）"
          value={notes}
          onChange={setNotes}
          rows={2}
        />
      </div>
      <div className="mt-4">
        <Button
          block
          color="primary"
          size="large"
          onClick={handleSubmit}
          loading={submitting}
          disabled={fileList.length === 0}
        >
          打卡
        </Button>
      </div>
    </div>
  );
}
