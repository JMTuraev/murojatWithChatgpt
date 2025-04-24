import { NextResponse } from 'next/server';
import supabase from '@/lib/supabaseAdmin'; // ✅ to‘g‘ri import

export async function PUT(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID yo‘q' }, { status: 404 });
  }

  const body = await req.json();
  const { status_id } = body;

  if (!status_id) {
    return NextResponse.json({ error: 'status_id yo‘q' }, { status: 400 });
  }

  const { error } = await supabase
    .from('murojaatlar')
    .update({ status_id })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: 'Status yangilandi' });
}
