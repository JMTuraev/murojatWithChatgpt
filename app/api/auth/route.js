import supabaseAdmin from '@/lib/supabaseAdmin';

export async function POST(req) {
  try {
    const { login, parol } = await req.json();
    console.log(login, parol);
    if (!login || !parol) {
      return Response.json(
        { error: '❗ Login va parol kiritilishi shart' },
        { status: 400 }
      );
    }

    const email = `${login}@tjm47.uz`; // 📧 Login'ni email sifatida ishlatamiz

    // 🔐 Supabase Auth orqali loginni tekshiramiz
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signInWithPassword({
        email,
        password: parol,
      });

    // ❌ Noto‘g‘ri login yoki parol
    if (authError || !authData?.user) {
      return Response.json(
        { error: '❌ Login yoki parol noto‘g‘ri' },
        { status: 401 }
      );
    }

    const authId = authData.user.id;

    // 🔎 users jadvalidan auth_id orqali ma’lumotlarni olamiz
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, ism, familiya, login, rol')
      .eq('auth_id', authId)
      .single();

    if (userError || !user) {
      return Response.json(
        { error: '❌ User maʼlumotlari topilmadi' },
        { status: 404 }
      );
    }

    // ✅ Muvaffaqiyatli login
    return Response.json({
      ok: true,
      user,
    });
  } catch (e) {
    return Response.json(
      { error: '❌ Server xatosi: ' + e.message },
      { status: 500 }
    );
  }
}
