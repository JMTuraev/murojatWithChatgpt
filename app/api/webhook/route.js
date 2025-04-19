import { supabase } from '@/lib/supabaseClient';

export async function POST(req) {
  try {
    const body = await req.json();

    // Har ehtimolga qarshi tekshiruv
    if (!body.user_id || !body.text) {
      return Response.json({ ok: false, message: "Majburiy maydonlar yo‘q" }, { status: 400 });
    }

    console.log(body);

    const { error } = await supabase
      .from('murojaatlar')
      .insert([{
        user_id: body.user_id,
        username: body.username || null,
        phone: body.phone || null,
        text: body.text,
        timestamp: body.timestamp || new Date().toISOString()
      }]);

    if (error) {
      console.error("❌ Supabase xato:", error.message);
      return Response.json({ ok: false }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (e) {
    console.error("❌ JSON parse xatolik:", e.message);
    return Response.json({ ok: false }, { status: 400 });
  }
}


export async function GET() {
  const { data, error } = await supabase
    .from('murojaatlar')
    .select('*')
    .eq('status_id', 1); // faqat yangi holatda

  if (error) {
    return Response.json({ error: '❌ Olishda xato: ' + error.message }, { status: 500 });
  }

  return Response.json(data);
}