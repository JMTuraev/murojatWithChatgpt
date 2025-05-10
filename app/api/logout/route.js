// app/api/logout/route.js
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();

    // 🔍 Tokenni olish
    const token = cookieStore.get('sb-token')?.value;

    if (!token) {
      return Response.json({ error: '❗ Token topilmadi' }, { status: 400 });
    }

    // 🧹 Cookie’ni o‘chiramiz (Supabase token)
    cookieStore.delete('sb-token');

    return Response.json({ ok: true, message: '✅ Logout bo‘ldi. Cookie tozalandi.' });
  } catch (e) {
    return Response.json(
      { error: '❌ Logout xatolik: ' + e.message },
      { status: 500 }
    );
  }
}
