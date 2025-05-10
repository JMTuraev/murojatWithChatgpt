import { supabase } from '@/lib/supabaseClient';
import supabaseAdmin from '@/lib/supabaseAdmin';

export async function GET(req, { params }) {
  const { id } = params;

  const { data, error } = await supabase
    .from('users')
    .select('id, ism, familiya, login, toliq_nomi, qisqa_nomi, rol')
    .eq('id', parseInt(id))
    .single();

  if (error) {
    return Response.json({ error: 'Olishda xato: ' + error.message }, { status: 500 });
  }

  if (!data) {
    return Response.json({ error: 'Maʼlumot topilmadi' }, { status: 404 });
  }

  const user = {
    id: data.id,
    ism: data.ism,
    familiya: data.familiya,
    login: data.login,
    rol: data.rol,
    toliqNomi: data.toliq_nomi,
    qisqaNomi: data.qisqa_nomi
  };

  return Response.json(user);
}

export async function PUT(req, { params }) {
  const { id } = params;

  try {
    const body = await req.json();
    const { ism, familiya, toliqNomi, qisqaNomi, login, parol, rol } = body;

    if (!id || !login || !rol) {
      return Response.json({ error: '❌ Majburiy maydonlar kiritilmagan.' }, { status: 400 });
    }

    // 🔍 auth_id olish
    const { data: userData, error: findError } = await supabaseAdmin
      .from('users')
      .select('auth_id')
      .eq('id', id)
      .single();

    if (findError || !userData?.auth_id) {
      return Response.json({ error: '❌ auth_id topilmadi' }, { status: 404 });
    }

    const auth_id = userData.auth_id;

    // 🔐 Parol o‘zgarsa – Auth userni yangilaymiz
    if (parol) {
      const { error: authErr } = await supabaseAdmin.auth.admin.updateUserById(auth_id, {
        password: parol
      });

      if (authErr) {
        return Response.json({ error: '❌ Parolni yangilashda xato: ' + authErr.message }, { status: 500 });
      }
    }

    // 🛠 User jadvalidagi ma’lumotlarni tayyorlash
    let updateData = { login };

    if (rol === 'operator') {
      if (!ism || !familiya) {
        return Response.json({ error: '❌ Ism va familiya kerak.' }, { status: 400 });
      }
      updateData = { ...updateData, ism, familiya };
    }

    if (rol === 'tashkilot') {
      if (!ism || !familiya || !toliqNomi || !qisqaNomi) {
        return Response.json({ error: '❌ Tashkilot uchun barcha maydonlar kerak.' }, { status: 400 });
      }
      updateData = {
        ...updateData,
        ism,
        familiya,
        toliq_nomi: toliqNomi,
        qisqa_nomi: qisqaNomi
      };
    }

    const { error: dbErr } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', id);

    if (dbErr) {
      return Response.json({ error: '❌ Ma’lumotlar yangilashda xato: ' + dbErr.message }, { status: 500 });
    }

    return Response.json({ success: true, message: '✅ Yangilandi.' });
  } catch (err) {
    return Response.json({ error: '❌ Server xatolik: ' + err.message }, { status: 500 });
  }
}
