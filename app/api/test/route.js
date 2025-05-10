// app/api/test/route.js
import { cookies } from 'next/headers';
import supabaseAdmin from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('sb-token')?.value;

  console.log('🔐 Token:', token);

  if (!token) {
    return NextResponse.json({ error: '❗ sb-token topilmadi!' });
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    console.log('❌ Auth xatosi:', error);
    return NextResponse.json({ error: '❌ Foydalanuvchi aniqlanmadi', user });
  }

  return NextResponse.json({ user });
}
