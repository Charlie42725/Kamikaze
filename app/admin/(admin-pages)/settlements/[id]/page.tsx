import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { SettlementDetailClient } from './SettlementDetailClient';
import type { Settlement } from '@/lib/types/database';

export default async function SettlementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: existingSettlement } = await supabase
    .from('settlements')
    .select('*, kol:kols(ig_handle)')
    .eq('id', id)
    .single();

  if (existingSettlement) {
    return (
      <SettlementDetailClient
        id={id}
        initialSettlement={existingSettlement as unknown as Settlement & { kol?: { ig_handle: string } }}
        isNew={false}
      />
    );
  }

  const { data: kol } = await supabase.from('kols').select('ig_handle').eq('id', id).single();
  if (!kol) notFound();

  return (
    <SettlementDetailClient
      id={id}
      kolHandle={(kol as unknown as { ig_handle: string }).ig_handle}
      isNew={true}
    />
  );
}
