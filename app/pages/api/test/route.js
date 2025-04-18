// pages/api/test.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    console.log('✅ GET so‘rovi qabul qilindi');
    res.status(200).json({ message: 'Salom dunyo!' });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
