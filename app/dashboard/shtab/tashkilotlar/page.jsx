'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

export default function TashkilotlarPage() {
  const [tashkilotlar, setTashkilotlar] = useState([]);
  const [xato, setXato] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/tashkilotlar');
        if (!res.ok) throw new Error('Serverdan noto‘g‘ri javob');
        const data = await res.json();
        setTashkilotlar(data);
      } catch (err) {
        setXato('Xatolik: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🏢 Tashkilotlar ro‘yxati</h1>
        <button
          onClick={() => router.push('/dashboard/shtab/tashkilotlar/create')}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          ➕ Yangi tashkilot
        </button>
      </div>

      {loading && <p>⏳ Yuklanmoqda...</p>}
      {xato && <p className="text-red-500">{xato}</p>}
      {!loading && tashkilotlar.length === 0 && (
        <p>❗ Hech qanday tashkilot topilmadi.</p>
      )}

      {!loading && tashkilotlar.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tashkilotlar.map((t) => (
            <div
              key={t.id}
              className="bg-white border rounded-lg p-4 shadow relative"
            >
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => router.push(`/dashboard/shtab/tashkilotlar/${t.id}/edit`)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-lg font-semibold mb-1 truncate overflow-hidden text-ellipsis">                {t.toliqNomi}</h2>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Qisqa nom:</strong> {t.qisqaNomi}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Mas'ul:</strong> {t.masulFIO}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Login:</strong> {t.login}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Parol:</strong> {t.parol}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                ⏱ Yaratilgan: {new Date(t.yaratilganSana).toLocaleDateString()}
              </p>
                {/* ID pastki o‘ng burchakda */}
  <div className="absolute bottom-2 right-3 text-xs font-mono text-gray-400">
    #{t.id}
  </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
