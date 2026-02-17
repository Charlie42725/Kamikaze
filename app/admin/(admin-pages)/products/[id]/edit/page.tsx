'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SpinLoading, Toast } from 'antd-mobile';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductForm } from '@/components/product/ProductForm';
import { useProducts } from '@/lib/hooks/useProducts';
import type { Product, ProductUpdate } from '@/lib/types/database';
import { ROUTES } from '@/lib/constants';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getProduct, updateProduct } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data as Product);
      } catch {
        Toast.show({ content: '載入失敗', icon: 'fail' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (data: ProductUpdate) => {
    await updateProduct(id, data);
    router.push(ROUTES.ADMIN.PRODUCTS);
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <SpinLoading />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="編輯商品" />
      <ProductForm initialData={product} onSubmit={handleSubmit} submitText="更新" />
    </div>
  );
}
