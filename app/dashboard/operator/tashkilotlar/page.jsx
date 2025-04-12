'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TashkilotlarPage() {
  const [data, setData] = useState([]);
  const [xato, setXato] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('http://localhost:3001/tashkilotlar');
        const result = await res.json();
        setData(result);
      } catch (err) {
        setXato('Maʼlumot yuklanmadi');
      }
    }

    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">🏢 Tashkilotlar ro‘yxati</h2>
        <button
          onClick={() => router.push('/dashboard/operator/tashkilotlar/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Yangi tashkilot
        </button>
      </div>

      {xato && <p className="text-red-500">{xato}</p>}

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="p-4 border rounded shadow flex justify-between items-center">
            <div>
              <p className="font-semibold">{item.nomi}</p>
              <p className="text-sm text-gray-600">{item.hudud}</p>
            </div>
            <button
              onClick={() => router.push(`/dashboard/operator/tashkilotlar/${item.id}`)}
              className="text-blue-600 hover:underline"
            >
              ✏️ Tahrirlash
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
