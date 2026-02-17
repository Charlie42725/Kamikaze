'use client';

import { Card, Image } from 'antd-mobile';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/types/database';
import { ROUTES } from '@/lib/constants';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(ROUTES.ADMIN.PRODUCT_EDIT(product.id))}
      style={{ marginBottom: 12, cursor: 'pointer' }}
    >
      <div className="flex items-center gap-3">
        {product.image_url && (
          <Image
            src={product.image_url}
            width={60}
            height={60}
            fit="cover"
            style={{ borderRadius: 8 }}
          />
        )}
        <div className="flex-1">
          <div className="font-semibold">{product.name}</div>
          {product.price != null && (
            <div className="text-sm text-gray-500">NT$ {product.price}</div>
          )}
          {product.description && (
            <div className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">
              {product.description}
            </div>
          )}
        </div>
        <div className="text-gray-300 text-lg">›</div>
      </div>
    </Card>
  );
}
