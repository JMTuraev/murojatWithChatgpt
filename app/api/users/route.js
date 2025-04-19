import { supabase } from '@/lib/supabaseClient';

export async function POST(req) {
  try {
    const body = await req.json();
    const { login, parol, ism, familiya, rol } = body;

    if (!login || !parol || !rol) {
      return Response.json({ error: 'Majburiy maydonlar to‘ldirilmagan' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ login, parol, ism, familiya, rol }])
      .select();

    if (error) {
      // 🎯 Duplicate login uchun maxsus xabar
      if (error.message.includes('duplicate key value')) {
        return Response.json({ error: 'Bu login allaqachon mavjud!' }, { status: 409 });
      }

      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, user: data[0] }, { status: 201 });

  } catch (err) {
    return Response.json({ error: 'Xatolik: ' + err.message }, { status: 500 });
  }
}
