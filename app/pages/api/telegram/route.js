// app/api/telegram/route.js

export async function POST(req) {
    const body = await req.json();
    console.log('Telegram xabari:', body);
  
    // Javobni tekshirish uchun Telegramga qaytarmaymiz, faqat log qilamiz
    return Response.json({ ok: true });
  }
  