import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sb-token')?.value;
  const pathname = req.nextUrl.pathname;

  // 1. Token bo‘lmasa → login sahifasiga yo‘naltirish
  if (!token) {
    if (pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  // 2. Tokenni verifikatsiya qilish — bu uchun RPC ishlatamiz
  const jwt = token;

  // ⚠️ Bu yerda getUserFromJWT RPC'ni o‘zingiz yaratishingiz mumkin, ammo endi user IDni bazadagi token orqali tekshiramiz
  const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);

  if (authError || !user) {
    const res = NextResponse.redirect(new URL('/login', req.url));
    res.cookies.delete('sb-token'); // noto‘g‘ri tokenni tozalash
    return res;
  }

  const auth_id = user.id;

  // 3. Foydalanuvchini `users` jadvalidan olish
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('rol')
    .eq('auth_id', auth_id)
    .single();

  if (profileError || !profile) {
    const res = NextResponse.redirect(new URL('/login', req.url));
    res.cookies.delete('sb-token');
    return res;
  }

  const rol = profile.rol;
  const allowedPath = `/dashboard/${rol}`;

  // 4. Noto‘g‘ri dashboard sahifasiga kirish holatini nazorat qilish
  if (
    pathname.startsWith('/dashboard') &&
    !pathname.startsWith(allowedPath)
  ) {
    return NextResponse.redirect(new URL(allowedPath, req.url));
  }

  // 5. Agar foydalanuvchi token bilan `/login` sahifasiga o‘tsa → redirect
  if (pathname === '/login') {
    return NextResponse.redirect(new URL(allowedPath, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
