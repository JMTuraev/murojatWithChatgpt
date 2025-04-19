import { supabase } from '@/lib/supabaseClient';

export async function GET(req, { params }) {
  const { id } = params;

  const { data, error } = await supabase
    .from('users')
    .select('id, ism, familiya, login, parol') // ← kerakli ustunlar
    .eq('id', parseInt(id))
    .single();

  if (error) {
    return Response.json({ error: 'Olishda xato: ' + error.message }, { status: 500 });
  }

  if (!data) {
    return Response.json({ error: 'Maʼlumot topilmadi' }, { status: 404 });
  }

  // `fio` qilib birlashtirib jo‘natamiz:
  const user = {
    id: data.id,
    ism: data.ism ,
    familiya: data.familiya ,
    login: data.login,
    parol: data.parol,
  };

  return Response.json(user);
}

export async function PUT(req, { params }) {
    try {
      const id = params.id;
      const body = await req.json();
      const { ism, familiya, login, parol } = body;
  
      if (!ism || !login || !parol) {
        return Response.json({ error: 'Barcha maydonlar to‘ldirilishi shart' }, { status: 400 });
      }
  
      const encoder = new TextEncoder();
      const hash = await crypto.subtle.digest('SHA-256', encoder.encode(parol));
      const hashHex = Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
  
      const { error } = await supabase
        .from('users')
        .update({
          ism,
          familiya,
          login,
          parol: hashHex,
        })
        .eq('id', id);
  
      if (error) throw new Error(error.message);
  
      return Response.json({ ok: true, message: '✅ Yangilandi' });
    } catch (e) {
      return Response.json({ error: '❌ Server xatolik: ' + e.message }, { status: 500 });
    }
  }