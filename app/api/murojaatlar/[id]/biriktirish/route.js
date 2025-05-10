// app/api/murojaatlar/[id]/biriktirish/route.js
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseAdmin';

export async function PUT(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID yo‘q' }, { status: 400 });
  }

  const cookieStore = cookies();
  const token = cookieStore.get('sb-token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Token topilmadi' }, { status: 401 });
  }

  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: 'Auth foydalanuvchi aniqlanmadi' }, { status: 401 });
  }

  const body = await req.json();
  const { tashkilotId, muddat } = body;

  if (!tashkilotId || !muddat) {
    return NextResponse.json({ error: 'Tashkilot yoki muddat kiritilmagan' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('murojaatlar')
    .update({
      status_id: 2, // biriktirildi
      tashkilot_id: tashkilotId,
      muddat,
      operator_id: user.id, // 👈 aynan shu joy muhim!
    })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: 'Biriktirildi' });
}
