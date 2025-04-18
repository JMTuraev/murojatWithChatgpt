'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditMurojaatPage() {
  const [murojaat, setMurojaat] = useState(null);
  const [tashkilotlar, setTashkilotlar] = useState([]);
  const [tashkilotId, setTashkilotId] = useState('');
  const [muddatValue, setMuddatValue] = useState('1');
  const [muddatType, setMuddatType] = useState('kun');
  const [xato, setXato] = useState('');
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [murojaatRes, tashkilotRes] = await Promise.all([
          fetch(`http://localhost:3001/murojaatlar/${params.id}`),
          fetch(`http://localhost:3001/tashkilotlar`)
        ]);
        if (!murojaatRes.ok || !tashkilotRes.ok) throw new Error('Ma’lumotlar yuklanmadi');

        const murojaatData = await murojaatRes.json();
        const tashkilotData = await tashkilotRes.json();

        setMurojaat(murojaatData);
        setTashkilotlar(tashkilotData);
        setTashkilotId(murojaatData.tashkilotId || '');
      } catch (err) {
        setXato('Xatolik: ' + err.message);
      }
    };
    fetchData();
  }, [params.id]);

  const hisoblaMuddat = () => {
    const now = new Date();
    if (muddatType === 'kun') {
      now.setDate(now.getDate() + Number(muddatValue));
    } else if (muddatType === 'oy') {
      now.setMonth(now.getMonth() + Number(muddatValue));
    }
    return now.toISOString().split('T')[0];
  };

  const formatPhone = (raw) => {
    if (!raw) return '';
    const onlyDigits = raw.replace(/\D/g, '');
    const last9 = onlyDigits.slice(-9);
    if (last9.length !== 9) return raw;
    return `${last9.slice(0, 2)}-${last9.slice(2, 5)}-${last9.slice(5, 7)}-${last9.slice(7)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tashkilotId || !muddatValue) {
      setXato('Barcha maydonlarni to‘ldiring.');
      return;
    }

    const muddat = hisoblaMuddat();

    try {
      await fetch(`http://localhost:3001/murojaatlar/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tashkilotId,
          muddat,
          status: 'biriktirilgan',
          izoh: ''
        })
      });

      router.push('/dashboard/operator/biriktirilgan');
    } catch (err) {
      setXato('Serverga yozib bo‘lmadi.');
    }
  };

  if (!murojaat) return <p>⏳ Ma’lumotlar yuklanmoqda...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4">Murojaatni qayta biriktirish</h1>
      {xato && <p className="text-red-600 mb-2">{xato}</p>}

      {/* Murojaat tafsilotlari */}
      <div className="bg-white rounded shadow p-4 mb-5 space-y-2 text-sm text-gray-800">
        <p><span className="font-semibold">F.I.O:</span> {murojaat.fio}</p>
        <p><span className="font-semibold">Shikoyat:</span> {murojaat.muammo}</p>
        <p><span className="font-semibold">Manzil:</span> {murojaat.manzil}</p>
        <p><span className="font-semibold">Telefon:</span> {formatPhone(murojaat.telefon)}</p>
      </div>

      {/* Qayta biriktirish formasi */}
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4 bg-white p-4 shadow rounded">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tashkilotni tanlang</label>
          <select
            value={tashkilotId}
            onChange={(e) => setTashkilotId(e.target.value)}
            className="border rounded px-3 py-2 min-w-[180px]"
          >
            <option value="">-- Tanlang --</option>
            {tashkilotlar.map(t => (
              <option key={t.id} value={t.id}>{t.nom}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Muddat</label>
          <input
            type="number"
            min="1"
            value={muddatValue}
            onChange={(e) => setMuddatValue(e.target.value)}
            className="border rounded px-3 py-2 w-24"
            placeholder="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
          <select
            value={muddatType}
            onChange={(e) => setMuddatType(e.target.value)}
            className="border rounded px-3 py-2 w-24 mt-1"
          >
            <option value="kun">kun</option>
            <option value="oy">oy</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Biriktirish
        </button>
      </form>
    </div>
  );
}
