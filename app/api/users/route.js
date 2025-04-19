// app/api/users/route.js
import { supabase } from '@/lib/supabaseClient';

export async function POST(req) {
  try {
    const body = await req.json();
    const { ism, familiya, login, parol } = body;
    if (!ism || !familiya || !login || !parol ) {
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
        rol: 'operator',
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
    .select('id, ism, familiya')
    .eq('rol', rol);

  if (error) {
    return Response.json({ error: '❌ Olishda xato: ' + error.message }, { status: 500 });
  }

  // front uchun kerakli formatga tayyorlash
  const tayyor = data.map((u) => ({
    id: u.id,
    familiya: u.familiya,
    ism: u.ism,
    
  }));

  return Response.json(tayyor);
}

