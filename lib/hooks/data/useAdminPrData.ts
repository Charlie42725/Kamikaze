'use client';
import useSWR from 'swr';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { Kol, Profile } from '@/lib/types/database';

export type KolWithStaff = Kol & { staffName?: string; productNames: string[] };

export function useAdminPrData() {
  const supabase = useSupabase();
  return useSWR(
    'admin-pr',
    async () => {
      const { data, error } = await supabase
        .from('kols')
        .select('*, kol_products(product:products(name))')
        .eq('has_pr_products', true)
        .in('status', ['potential', 'active'])
        .order('created_at', { ascending: false });
      if (error) throw error;
      const kolList = (data ?? []) as unknown as (Kol & { kol_products?: { product: { name: string } | null }[] })[];
      const staffIds = [...new Set(kolList.map((k) => k.staff_id).filter(Boolean))] as string[];
      let staffMap: Record<string, string> = {};
      if (staffIds.length > 0) {
        const { data: staffData } = await supabase.from('profiles').select('id, display_name').in('id', staffIds);
        staffMap = Object.fromEntries((staffData as unknown as Pick<Profile, 'id' | 'display_name'>[]).map((s) => [s.id, s.display_name]));
      }
      return kolList.map((k) => ({
        ...k,
        staffName: k.staff_id ? staffMap[k.staff_id] : undefined,
        productNames: (k.kol_products ?? []).map((kp) => kp.product?.name).filter(Boolean) as string[],
      })) as KolWithStaff[];
    },
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
}
