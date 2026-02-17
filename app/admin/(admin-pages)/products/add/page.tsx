'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductForm } from '@/components/product/ProductForm';
import { useProducts } from '@/lib/hooks/useProducts';
import type { ProductInsert } from '@/lib/types/database';
import { ROUTES } from '@/lib/constants';

export default function AddProductPage() {
  const router = useRouter();
  const { createProduct } = useProducts();

  const handleSubmit = async (data: ProductInsert) => {
    await createProduct(data);
    router.push(ROUTES.ADMIN.PRODUCTS);
  };

  return (
    <div>
      <PageHeader title="新增商品" />
      <ProductForm onSubmit={handleSubmit} submitText="新增" />
    </div>
  );
}
