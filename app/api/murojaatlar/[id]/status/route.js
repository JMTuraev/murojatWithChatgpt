// app/api/murojaatlar/[id]/status/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import supabaseAdmin from '@/lib/supabaseAdmin';

export async function PUT(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID yo‘q' }, { status: 404 });
  }

  const cookieStore = cookies();
  const token = cookieStore.get('sb-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '❗ Token topilmadi' }, { status: 401 });
  }

  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: '🔐 Foydalanuvchi aniqlanmadi' }, { status: 401 });
  }

  const body = await req.json();
  const { status_id } = body;

  if (!status_id) {
    return NextResponse.json({ error: 'status_id yo‘q' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('murojaatlar')
    .update({
      status_id,
      operator_id: user.id, // 👈 aynan shu yer muhim!
    })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: 'Status va operator_id yangilandi' });
}
