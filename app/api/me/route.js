// app/api/me/route.js
import { cookies } from 'next/headers';
import supabaseAdmin from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    const cookieStore = cookies();
    console.log("test")
    console.log(cookieStore);
    const token =  cookieStore.get('sb-token')?.value;

    if (!token) {
      return Response.json(
        { error: '❗ Token topilmadi. Iltimos, qayta login qiling.' },
        { status: 401 }
      );
    }

    // 🔐 Token orqali Supabase foydalanuvchisini olish
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return Response.json(
        { error: '❌ Auth orqali foydalanuvchi topilmadi' },
        { status: 401 }
      );
    }

    // 📄 Users jadvalidan profilni olish (auth_id asosida)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('id, ism, familiya, login, rol')
      .eq('auth_id', user.id)
      .single();

    if (profileError || !profile) {
      return Response.json(
        { error: '❌ Foydalanuvchi profili topilmadi' },
        { status: 404 }
      );
    }

    return Response.json({
      ok: true,
      user: profile,
    });
  } catch (e) {
    return Response.json(
      { error: '❌ Serverda kutilmagan xato: ' + e.message },
      { status: 500 }
    );
  }
}
