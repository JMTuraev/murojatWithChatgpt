'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function BiriktirishPage() {
  const { id } = useParams();
  const [murojaat, setMurojaat] = useState(null);
  const [tashkilotlar, setTashkilotlar] = useState([]);
  const [tashkilotId, setTashkilotId] = useState('');
  const [muddatValue, setMuddatValue] = useState('');
  const [muddatType, setMuddatType] = useState('d'); // 'd', 'h', 'm'
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res1 = await fetch(`http://localhost:3001/murojaatlar/${id}`);
      const data1 = await res1.json();
      setMurojaat(data1);

      const res2 = await fetch(`http://localhost:3001/tashkilotlar`);
      const data2 = await res2.json();
      setTashkilotlar(data2);
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:3001/murojaatlar/${id}/biriktirish`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'biriktirildi',
        tashkilotId: Number(tashkilotId),
        muddat: `${muddatValue}${muddatType}`,
      }),
    });

    const result = await response.json();
    if (result?.status === 'biriktirildi') {
      setStatus('✅ Muvaffaqiyatli biriktirildi');
    } else {
      setStatus('❌ Xatolik yuz berdi');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-xl font-bold mb-4">Murojaatni Biriktirish</h1>

      {murojaat && (
        <div className="mb-4">
          <p>
            <strong>F.I.Sh:</strong> {murojaat.fio}
          </p>
          <p>
            <strong>Muammo:</strong> {murojaat.muammo}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Tashkilot tanlang:</label>
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
          <label className="block mb-1">Ijro muddati:</label>
          <div className="flex space-x-2">
            <input
              type="number"
              min="1"
              className="w-2/3 border px-3 py-2 rounded"
              placeholder="Muddat"
              value={muddatValue}
              onChange={(e) => setMuddatValue(e.target.value)}
              required
            />
            <select
              className="w-1/3 border px-3 py-2 rounded"
              value={muddatType}
              onChange={(e) => setMuddatType(e.target.value)}
            >
              <option value="d">Kun</option>
              <option value="h">Soat</option>
              <option value="m">Daqiqa</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Biriktirish
        </button>
      </form>

      {status && <p className="mt-4 font-semibold">{status}</p>}
    </div>
  );
}
