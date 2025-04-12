'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function BiriktirishPage() {
  const router = useRouter();
  const { id } = useParams();

  const [murojaat, setMurojaat] = useState(null);
  const [tashkilotlar, setTashkilotlar] = useState([]);
  const [tashkilotId, setTashkilotId] = useState('');
  const [muddatValue, setMuddatValue] = useState('');
  const [muddatBirlik, setMuddatBirlik] = useState('h');
  const [xabar, setXabar] = useState('');

  // Murojaat va tashkilotlar malumotlarini olish
  useEffect(() => {
    fetch(`http://localhost:3001/murojaatlar/${id}`)
      .then(res => res.json())
      .then(data => setMurojaat(data));

    fetch('http://localhost:3001/tashkilotlar')
      .then(res => res.json())
      .then(data => setTashkilotlar(data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const muddat = `${muddatValue}${muddatBirlik}`;

    try {
      const res = await fetch(`http://localhost:3001/murojaatlar/${id}/biriktirish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'biriktirildi',
          tashkilotId: Number(tashkilotId),
          muddat
        })
      });

      const result = await res.json();
      setXabar(result.message);
      router.push('/dashboard/operator/murojaatlar');
    } catch (error) {
      setXabar('❌ Xatolik yuz berdi!');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded bg-white dark:bg-black dark:text-white">
      <h2 className="text-xl font-bold mb-4 text-center">📌 Murojaatni Biriktirish</h2>

      {murojaat && (
        <div className="mb-6">
          <p><strong>👤 F.I.Sh:</strong> {murojaat.fio}</p>
          <p><strong>📝 Muammo:</strong> {murojaat.muammo}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">🏢 Tashkilotni tanlang:</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={tashkilotId}
            onChange={(e) => setTashkilotId(e.target.value)}
            required
          >
            <option value="">-- Tanlang --</option>
            {tashkilotlar.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nomi}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">⏳ Ijro muddati:</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={muddatValue}
              onChange={(e) => setMuddatValue(e.target.value)}
              className="w-2/3 border px-3 py-2 rounded"
              placeholder="Masalan: 3"
              required
            />
            <select
              value={muddatBirlik}
              onChange={(e) => setMuddatBirlik(e.target.value)}
              className="w-1/3 border px-2 py-2 rounded"
            >
              <option value="h">soat</option>
              <option value="d">kun</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Biriktirish
        </button>

        {xabar && <p className="text-green-600 mt-2">{xabar}</p>}
      </form>
    </div>
  );
}
