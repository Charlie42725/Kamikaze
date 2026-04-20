'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductForm } from '@/components/product/ProductForm';
import { useProducts } from '@/lib/hooks/useProducts';
import type { Product, ProductUpdate } from '@/lib/types/database';
import { ROUTES } from '@/lib/constants';

export function EditProductClient({ product }: { product: Product }) {
  const router = useRouter();
  const { updateProduct } = useProducts();

  const handleSubmit = async (data: ProductUpdate) => {
    await updateProduct(product.id, data);
    router.push(ROUTES.ADMIN.PRODUCTS);
  };

  return (
    <div>
      <PageHeader title="編輯商品" />
      <ProductForm initialData={product} onSubmit={handleSubmit} submitText="更新" />
    </div>
  );
}
