import { writeFile, readFile } from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'murojaatlar.json');

// POST: Python dan kelgan xabarlarni saqlaydi
export async function POST(req) {
  try {
    const body = await req.json();
    console.log('📩 Keldi:', body);

    let existing = [];
    try {
      const content = await readFile(filePath, 'utf-8');
      existing = JSON.parse(content);
    } catch (e) {
      existing = [];
    }

    existing.push(body);
    await writeFile(filePath, JSON.stringify(existing, null, 2));

    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ ok: false }, { status: 500 });
  }
}

// GET: murojaatlarni qaytaradi
export async function GET() {
  try {
    const content = await readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    return Response.json(data);
  } catch (e) {
    console.error("❌ O'qishda xato:", e);
    return Response.json([], { status: 200 });
  }
}
