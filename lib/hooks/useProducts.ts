'use client';

import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { Product, ProductInsert, ProductUpdate } from '@/lib/types/database';

export function useProducts() {
  const supabase = useSupabase();
  const router = useRouter();

  const createProduct = async (product: ProductInsert) => {
    const { data, error } = await supabase.from('products').insert(product as never).select().single();
    if (error) throw error;
    router.refresh();
    return data as unknown as Product;
  };

  const updateProduct = async (id: string, updates: ProductUpdate) => {
    const { data, error } = await supabase.from('products').update(updates as never).eq('id', id).select().single();
    if (error) throw error;
    router.refresh();
    return data as unknown as Product;
  };

  return { createProduct, updateProduct };
}
