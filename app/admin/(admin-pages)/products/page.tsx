'use client';

import { SpinLoading, Empty, FloatingBubble } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { useProducts } from '@/lib/hooks/useProducts';
import { ROUTES } from '@/lib/constants';

export default function ProductsPage() {
  const router = useRouter();
  const { products, loading } = useProducts();

  return (
    <div>
      <div className="px-4 pt-4">
        <h2 className="text-xl font-bold mb-4">商品管理</h2>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <SpinLoading />
          </div>
        ) : products.length === 0 ? (
          <Empty description="尚無商品" />
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      <FloatingBubble
        style={{
          '--initial-position-bottom': '80px',
          '--initial-position-right': '24px',
          '--edge-distance': '24px',
        }}
        onClick={() => router.push(ROUTES.ADMIN.PRODUCT_ADD)}
      >
        <AddOutline fontSize={24} />
      </FloatingBubble>
    </div>
  );
}
