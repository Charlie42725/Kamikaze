'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { Product, ProductInsert, ProductUpdate } from '@/lib/types/database';

export function useProducts() {
  const supabase = useSupabase();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      setProducts((data as unknown as Product[]) ?? []);
    } catch (e) {
      console.error('fetchProducts error:', e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (product: ProductInsert) => {
    const { data, error } = await supabase
      .from('products')
      .insert(product as never)
      .select()
      .single();
    if (error) throw error;
    await fetchProducts();
    return data as unknown as Product;
  };

  const updateProduct = async (id: string, updates: ProductUpdate) => {
    const { data, error } = await supabase
      .from('products')
      .update(updates as never)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    await fetchProducts();
    return data as unknown as Product;
  };

  const getProduct = async (id: string) => {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw error;
    return data as unknown as Product;
  };

  return { products, loading, fetchProducts, createProduct, updateProduct, getProduct };
}
