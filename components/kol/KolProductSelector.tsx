'use client';

import { Checkbox, List, SpinLoading } from 'antd-mobile';
import { useProducts } from '@/lib/hooks/useProducts';

interface KolProductSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function KolProductSelector({ selectedIds, onChange }: KolProductSelectorProps) {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <SpinLoading />
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="text-center text-gray-400 py-4">尚無商品</div>;
  }

  return (
    <Checkbox.Group
      value={selectedIds}
      onChange={(val) => onChange(val as string[])}
    >
      <List>
        {products.map((product) => (
          <List.Item
            key={product.id}
            prefix={<Checkbox value={product.id} />}
            description={product.price ? `NT$ ${product.price}` : undefined}
          >
            {product.name}
          </List.Item>
        ))}
      </List>
    </Checkbox.Group>
  );
}
