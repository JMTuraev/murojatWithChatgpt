'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MurojaatlarPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState('barchasi');
  const [search, setSearch] = useState('');
  const [xato, setXato] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(filtered.length / pageSize);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/murojaatlar');
        if (!res.ok) throw new Error('Serverdan xatolik');
        const result = await res.json();
        setData(result);
        setFiltered(result);
      } catch (err) {
        setXato(err.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...data];

    if (filter !== 'barchasi') {
      result = result.filter((item) => item.status === filter);
    }

    if (search.trim() !== '') {
      const keyword = search.toLowerCase();
      result = result.filter((item) =>
        item.fio.toLowerCase().includes(keyword) || item.telefon.includes(keyword)
      );
    }

    setFiltered(result);
    setCurrentPage(1);
  }, [filter, search, data]);

  const paginatedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const badgeColor = (status) => {
    switch (status) {
      case 'yangi': return 'bg-gray-300 text-gray-700';
      case 'biriktirildi': return 'bg-yellow-200 text-yellow-800';
      case 'tushuntirildi': return 'bg-blue-200 text-blue-800';
      case 'bajarildi': return 'bg-green-200 text-green-800';
      case 'rad etildi': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">📄 Murojaatlar ro‘yxati</h2>

      {/* Filter va qidiruv */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="barchasi">Barchasi</option>
          <option value="yangi">Yangi</option>
          <option value="biriktirildi">Biriktirildi</option>
          <option value="tushuntirildi">Tushuntirildi</option>
          <option value="bajarildi">Bajarildi</option>
          <option value="rad etildi">Rad etildi</option>
        </select>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Qidiruv: ism yoki telefon"
          className="border px-3 py-2 rounded w-full md:w-1/2"
        />
      </div>

      {xato && <p className="text-red-500">❌ {xato}</p>}

      {paginatedData.length === 0 && !xato && (
        <p className="text-gray-500">Hech qanday murojaat topilmadi.</p>
      )}

      {paginatedData.map((item) => (
        <div key={item.id} className="border rounded p-4 mb-3 shadow flex justify-between items-start">
          <div>
            <p><strong>👤 {item.fio}</strong></p>
            <p>📞 {item.telefon}</p>
            <p>📍 {item.manzil}</p>
            <p>📝 {item.muammo}</p>
            <span className={`inline-block px-2 py-1 mt-2 rounded text-sm font-medium ${badgeColor(item.status)}`}>
              {item.status}
            </span>
            {item.muddat && (
              <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">⏳ Ijro muddati: {item.muddat}</p>
            )}

            {/* Tugmalar pastda */}
            <div className="mt-4 flex flex-col gap-2 items-start">
              <button
                onClick={() => router.push(`/dashboard/operator/murojaatlar/${item.id}`)}
                className="text-blue-600 hover:underline text-sm"
              >
                ✏️ Tahrirlash
              </button>
              <button
                onClick={() => router.push(`/dashboard/operator/murojaatlar/${item.id}/biriktirish`)}
                className="text-green-600 hover:underline text-sm"
              >
                📌 Biriktirish
              </button>
            </div>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={currentPage === 1}
          >
            ⬅️
          </button>
          <span>Sahifa {currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={currentPage === totalPages}
          >
            ➡️
          </button>
        </div>
      )}
    </div>
  );
}
