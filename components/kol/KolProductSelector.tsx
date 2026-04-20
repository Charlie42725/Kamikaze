'use client';

import { useEffect, useState } from 'react';
import { Checkbox, List, SpinLoading } from 'antd-mobile';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { Product } from '@/lib/types/database';

interface KolProductSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function KolProductSelector({ selectedIds, onChange }: KolProductSelectorProps) {
  const supabase = useSupabase();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })
      .then(({ data }) => {
        setProducts((data as unknown as Product[]) ?? []);
        setLoading(false);
      });
  }, [supabase]);

  if (loading) {
    return <div className="flex justify-center py-4"><SpinLoading /></div>;
  }

  if (products.length === 0) {
    return <div className="text-center text-gray-400 py-4">尚無商品</div>;
  }

  return (
    <Checkbox.Group value={selectedIds} onChange={(val) => onChange(val as string[])}>
      <List>
        {products.map((product) => (
          <List.Item key={product.id} prefix={<Checkbox value={product.id} />} description={product.price ? `NT$ ${product.price}` : undefined}>
            {product.name}
          </List.Item>
        ))}
      </List>
    </Checkbox.Group>
  );
}
