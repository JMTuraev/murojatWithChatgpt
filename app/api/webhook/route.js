export async function POST(req) {
    try {
      const body = await req.json(); // JSON ma’lumotni olish
      console.log("📩 Webhook orqali keldi:", body);
  
      // Keyinchalik: ma'lumotlar DB'ga yoziladi yoki qayta ishlanadi
  
      return Response.json({ ok: true, message: "Webhook qabul qilindi" });
    } catch (error) {
      console.error("❌ Webhook xatolik:", error);
      return Response.json({ ok: false, message: "Xatolik yuz berdi" }, { status: 500 });
    }
  }
  