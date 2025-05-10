// app/api/users/route.js
import { supabase } from '@/lib/supabaseClient';
import supabaseAdmin from '@/lib/supabaseAdmin';


export async function POST(req) {
  try {
    const body = await req.json();
    const { toliqNomi, qisqaNomi, ism, familiya, login, parol, rol } = body;

    if (!ism || !familiya || !login || !parol || !rol) {
      return Response.json({ error: '❌ Asosiy maydonlar to‘ldirilmagan' }, { status: 400 });
    }

    if (rol === 'tashkilot' && (!toliqNomi || !qisqaNomi)) {
      return Response.json({ error: '❌ Tashkilot nomlari kiritilishi kerak' }, { status: 400 });
    }

    // 📧 Login asosida sun’iy email yasaymiz
    const email = `${login}@tjm47.uz`;

    // 🔐 Supabase Auth’da foydalanuvchi yaratish
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: parol,
      user_metadata: { ism, familiya, rol },
      email_confirm: true,
    });

    if (authError || !authUser?.user?.id) {
      return Response.json({ error: '❌ Auth yaratishda xato: ' + (authError?.message || 'no auth id') }, { status: 500 });
    }

    const authId = authUser.user.id;

    // 📦 Users jadvaliga yozamiz
    const { error: dbError } = await supabaseAdmin.from('users').insert({
      auth_id: authId, // Auth bilan bog‘lanish uchun
      ism,
      familiya,
      login,
      rol,
      toliq_nomi: rol === 'tashkilot' ? toliqNomi : null,
      qisqa_nomi: rol === 'tashkilot' ? qisqaNomi : null,
    });

    if (dbError) {
      return Response.json({ error: '❌ Ma’lumotlar bazasiga yozishda xato: ' + dbError.message }, { status: 500 });
    }

    return Response.json({ ok: true, message: '✅ Foydalanuvchi muvaffaqiyatli yaratildi' });
  } catch (e) {
    return Response.json({ error: '❌ Server xatolik: ' + e.message }, { status: 500 });
  }
}


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const rol = searchParams.get('rol') || 'operator';

  const { data, error } = await supabase
    .from('users')
    .select('id, ism, familiya, login,  toliq_nomi, qisqa_nomi')
    .eq('rol', rol);

  if (error) {
    return Response.json({ error: '❌ Olishda xato: ' + error.message }, { status: 500 });
  }

  let tayyor = [];

  if (rol === 'operator') {
    tayyor = data.map((u) => ({
      id: u.id,
      ism: u.ism,
      familiya: u.familiya,
    }));
  } else if (rol === 'tashkilot') {
    tayyor = data.map((u) => ({
      id: u.id,
      toliqNomi: u.toliq_nomi,
      qisqaNomi: u.qisqa_nomi,
      ism: u.ism,
      familiya: u.familiya,
      login: u.login,
      parol: u.parol,
    }));
  }

  return Response.json(tayyor);
}
