import { supabase } from '@/lib/supabaseClient';

export async function GET(req, { params }) {
  const { id } = params;

  const { data, error } = await supabase
    .from('users')
    .select('id, ism, familiya, login, parol, toliq_nomi, qisqa_nomi') // ← kerakli ustunlar
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
    toliqNomi:data.toliq_nomi,
    qisqaNomi:data.qisqa_nomi
  };

  return Response.json(user);
}

export async function PUT(req, { params }) {
    const id = params.id;
  
    try {
      const body = await req.json();
      const { ism, familiya, fio, toliqNomi, qisqaNomi, login, parol, rol } = body;
  
      if (!id || !login || !parol || !rol) {
        return Response.json({ error: '❌ Majburiy maydonlar yetarli emas.' }, { status: 400 });
      }
  
      // 🔐 Parolni hash qilish (SHA-256)
      const encoder = new TextEncoder();
      const data = encoder.encode(parol);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashedParol = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
      let updateData = {
        login,
        parol: hashedParol,
      };
  
      if (rol === 'operator') {
        if (!ism || !familiya) {
          return Response.json({ error: '❌ Ism va familiya talab qilinadi.' }, { status: 400 });
        }
        updateData = { ...updateData, ism, familiya };
      }
  
      if (rol === 'tashkilot') {
        if (!toliqNomi || !qisqaNomi || !ism || !familiya) {
          return Response.json({ error: '❌ Tashkilot uchun barcha maydonlar kerak.' }, { status: 400 });
        }
        updateData = { ...updateData, ism, familiya, toliq_nomi: toliqNomi, qisqa_nomi: qisqaNomi, rol };
      }
  
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .eq('rol', rol);
  
      if (error) {
        return Response.json({ error: '❌ Yangilashda xato: ' + error.message }, { status: 500 });
      }
  
      return Response.json({ success: true, message: '✅ Ma’lumotlar yangilandi.' });
    } catch (err) {
      return Response.json({ error: '❌ Server xatolik: ' + err.message }, { status: 500 });
    }
  }