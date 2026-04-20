'use client';
import useSWR from 'swr';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { Kol } from '@/lib/types/database';

export type KolWithProducts = Kol & { productNames: string[] };

export function useStaffPrData(userId: string | null) {
  const supabase = useSupabase();
  return useSWR(
    userId ? ['staff-pr', userId] : null,
    async () => {
      const { data, error } = await supabase
        .from('kols')
        .select('*, kol_products(product:products(name))')
        .eq('staff_id', userId!)
        .eq('has_pr_products', true)
        .in('status', ['potential', 'active'])
        .order('created_at', { ascending: false });
      if (error) throw error;
      return ((data ?? []) as unknown as (Kol & { kol_products?: { product: { name: string } | null }[] })[]).map((k) => ({
        ...k,
        productNames: (k.kol_products ?? []).map((kp) => kp.product?.name).filter(Boolean) as string[],
      }));
    },
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
}
