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

    // 🔐 Auth user ID olish
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      console.log('❌ Auth xato:', authError);
      return NextResponse.json({ error: '❌ Foydalanuvchi aniqlanmadi' }, { status: 401 });
    }

    // 📄 Users jadvalidan profil topamiz
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('id, ism, familiya, login, rol')
      .eq('auth_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: '❌ Profil topilmadi' }, { status: 404 });
    }

    // ✅ Faqat status_id = 1 bo'lgan (yangi) murojaatlar olinadi
    const { data: murojaatlar, error: murojaatError } = await supabaseAdmin
      .from('murojaatlar')
      .select('*')
      .eq('status_id', 1);

    if (murojaatError) {
      return NextResponse.json({ error: murojaatError.message }, { status: 500 });
    }

    return NextResponse.json({
      data: murojaatlar,
      count: murojaatlar.length,
    });
  } catch (e) {
    return NextResponse.json(
      { error: '❌ Server xatosi: ' + e.message },
      { status: 500 }
    );
  }
}
