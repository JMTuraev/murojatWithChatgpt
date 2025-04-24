import { NextResponse } from 'next/server';
import supabase from '@/lib/supabaseAdmin';

export async function PUT(req, { params }) {
  const id = params.id;
  const body = await req.json();
  const { tashkilotId, muddat } = body;

  if (!tashkilotId || !muddat) {
    return NextResponse.json({ error: 'Tashkilot va muddat majburiy' }, { status: 400 });
  }

  const { error } = await supabase
    .from('murojaatlar')
    .update({
      status_id: 2,
      tashkilot_id: tashkilotId,
      muddat,
    })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
