'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RejectedList() {
  const [data, setData] = useState([]);
  const [xato, setXato] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/murojaatlar');
        if (!res.ok) throw new Error('Xatolik yuz berdi');
        const result = await res.json();
        const rejected = result.filter(m => m.status === 'rad etildi');
        setData(rejected);
      } catch (err) {
        setXato(err.message);
      }
    };
    fetchData();
  }, []);

  const formatPhone = (raw) => {
    if (!raw) return '';
    const onlyDigits = raw.replace(/\D/g, '');
    const last9 = onlyDigits.slice(-9);
    if (last9.length !== 9) return raw;
    return `${last9.slice(0, 2)}-${last9.slice(2, 5)}-${last9.slice(5, 7)}-${last9.slice(7)}`;
  };

  const qabulQilish = (id) => {
    router.push(`/dashboard/operator/murojaat/${id}/edit`);
  };

  const radQilish = async (id) => {
    await fetch(`http://localhost:3001/murojaatlar/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'bekor qilindi' }) // yoki "rad tugallandi"
    });
    setData(data.filter(d => d.id !== id));
  };

  return (
    <div className="bg-white shadow rounded p-4 mb-6">
      <h2 className="text-lg font-bold mb-4 text-red-700">Tashkilotlar rad etgan murojaatlar</h2>
      {xato && <p className="text-red-500">{xato}</p>}
      {data.length === 0 ? (
        <p className="text-gray-500 text-sm">Rad etilgan murojaatlar mavjud emas.</p>
      ) : (
        <ul className="space-y-4">
          {data.map((item) => (
            <li key={item.id} className="border rounded p-3">
              <p className="font-semibold">{item.fio}</p>
              <p className="text-sm text-gray-600">{item.muammo}</p>
              <p className="text-xs text-gray-500">📍 {item.manzil} | 📞 {formatPhone(item.telefon)}</p>
              <p className="text-xs mt-1 text-red-600"><b>Izoh:</b> {item.izoh}</p>

              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => qabulQilish(item.id)}
                  className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                >
                  Qabul qilish
                </button>
                <button
                  onClick={() => radQilish(item.id)}
                  className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded hover:bg-gray-300"
                >
                  Qabul qilinmasin
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
