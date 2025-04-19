// app/api/users/route.js
import { supabase } from '@/lib/supabaseClient';

export async function POST(req) {
  try {
    const body = await req.json();
    const { toliqNomi, qisqaNomi, ism, familiya, login, parol, rol } = body;
    if (!ism || !familiya || !login || !parol || !qisqaNomi || !toliqNomi ) {
      return Response.json({ error: '❌ Barcha maydonlar to‘ldirilishi shart' }, { status: 400 });
    }


    // 🔐 Parolni crypto.subtle yordamida hash qilish
    const encoder = new TextEncoder();
    const data = encoder.encode(parol);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedParol = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // 📦 Supabase-ga yuborish
    const { error } = await supabase.from('users').insert([
      {
        ism,
        familiya,
        login,
        parol: hashedParol,
        rol,
        toliq_nomi: rol === 'tashkilot' ? toliqNomi : null,
        qisqa_nomi: rol === 'tashkilot' ? qisqaNomi : null,
      }
    ]);

    if (error) {
      return Response.json({ error: '❌ Server xatosi: ' + error.message }, { status: 500 });
    }

    return Response.json({ ok: true, message: '✅ Operator yaratildi!' });
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

