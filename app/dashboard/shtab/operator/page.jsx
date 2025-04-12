'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OperatorlarPage() {
  const router = useRouter();
  const [operatorlar, setOperatorlar] = useState([]);
  const [xato, setXato] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOperatorlar = async () => {
      try {
        const res = await fetch('http://localhost:3001/operatorlar');
        if (!res.ok) throw new Error('Server javobi noto‘g‘ri');
        const data = await res.json();
        setOperatorlar(data);
      } catch (err) {
        setXato('❌ Xatolik: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOperatorlar();
  }, []);

  const handleDelete = async (id) => {
    const isConfirm = confirm('Haqiqatan ham o‘chirmoqchimisiz?');
    if (!isConfirm) return;

    try {
      await fetch(`http://localhost:3001/operatorlar/${id}`, {
        method: 'DELETE',
      });
      setOperatorlar(prev => prev.filter(op => op.id !== id));
    } catch (err) {
      alert('🛑 O‘chirishda xatolik yuz berdi.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👥 Operatorlar ro‘yxati</h1>
        <button
          onClick={() => router.push('/dashboard/shtab/operator/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Yangi xodim
        </button>
      </div>

      {loading && <p>⏳ Yuklanmoqda...</p>}
      {xato && <p className="text-red-500">{xato}</p>}

      {!loading && operatorlar.length === 0 && (
        <p>Hech qanday operator topilmadi.</p>
      )}

      {!loading && operatorlar.length > 0 && (
        <table className="w-full table-auto border">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">F.I.Sh</th>
              <th className="p-2 border">Telefon</th>
              <th className="p-2 border">Login</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {operatorlar.map((op, index) => (
              <tr key={op.id} className="text-center">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{op.fio}</td>
                <td className="p-2 border">{op.telefon}</td>
                <td className="p-2 border">{op.login}</td>
                <td className="p-2 border capitalize">{op.role}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => router.push(`/dashboard/shtab/operator/${op.id}/edit`)}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(op.id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
