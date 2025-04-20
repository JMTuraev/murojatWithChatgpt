// app/api/auth/route.js
import { supabase } from '@/lib/supabaseClient';

export async function POST(req) {
  try {
    const { login, parol } = await req.json(); // ⚠️ parol bu yerda oldindan hash qilingan bo‘ladi

    if (!login || !parol) {
      return Response.json(
        { error: '❗ Login va parol kiritilishi shart' },
        { status: 400 }
      );
    }

    // ❌ Bu qism kerak emas, chunki frontendda hash qilindi
    // const hashedParol = ...

    // 🔍 Supabase'dan foydalanuvchini topamiz
    const { data: user, error } = await supabase
      .from('users')
      .select('id, ism, familiya, login, rol')
      .eq('login', login)
      .eq('parol', parol)  // ✅ frontenddan kelgan hashed parol
      .single();

    if (error || !user) {
      return Response.json(
        { error: '❌ Login yoki parol noto‘g‘ri' },
        { status: 401 }
      );
    }

    // ✅ Muvaffaqiyatli login
    return Response.json({
      ok: true,
      user: {
        id: user.id,
        ism: user.ism,
        familiya: user.familiya,
        login: user.login,
        rol: user.rol
      }
    });

  } catch (e) {
    return Response.json(
      { error: '❌ Server xatosi: ' + e.message },
      { status: 500 }
    );
  }
}
