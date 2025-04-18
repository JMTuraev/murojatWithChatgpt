// app/api/test/route.js

export async function GET(request) {
    console.log('✅ GET ishladi!');
    return new Response(JSON.stringify({ message: 'App Router ishlayapti!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  