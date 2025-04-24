import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('sb-token')?.value;

    if (!token) {
      return NextResponse.json({ error: '❗ Token topilmadi' }, { status: 401 });
    }

    // 🔐 Auth foydalanuvchini aniqlaymiz
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      console.log('❌ Auth xato:', authError);
      return NextResponse.json({ error: '❌ Foydalanuvchi aniqlanmadi' }, { status: 401 });
    }

    const auth_id = user.id;

    // 📄 Users jadvalidan foydalanuvchi profilini topamiz
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('id, ism, familiya, login, rol')
      .eq('auth_id', auth_id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: '❌ Profil topilmadi' }, { status: 404 });
    }

    // 📦 Faqat ushbu operator tomonidan arxiv qilingan murojaatlar (status_id = 7)
    const { data: murojaatlar, error: murojaatError } = await supabaseAdmin
      .from('murojaatlar')
      .select('*')
      .eq('status_id', 7)
      .eq('operator_id', auth_id); // ✅ faqat shu operator

    if (murojaatError) {
      return NextResponse.json({ error: murojaatError.message }, { status: 500 });
    }

    return NextResponse.json(murojaatlar);
  } catch (e) {
    return NextResponse.json(
      { error: '❌ Server xatosi: ' + e.message },
      { status: 500 }
    );
  }
}
  