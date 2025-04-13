'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditOperatorPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    fio: '',
    telefon: '',
    login: '',
    parol: '',
    parolTasdiq: '',
    role: 'operator',
  });

  const [loading, setLoading] = useState(true);
  const [xato, setXato] = useState('');
  const [parolError, setParolError] = useState('');

  useEffect(() => {
    const fetchOperator = async () => {
      try {
        const res = await fetch(`http://localhost:3001/operatorlar/${id}`);
        if (!res.ok) throw new Error('Ma’lumot topilmadi');
        const data = await res.json();
        setForm({ ...data, parolTasdiq: data.parol });
      } catch (err) {
        setXato(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOperator();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Parolni tekshiramiz
    if (form.parol !== form.parolTasdiq) {
      setParolError('Parollar mos emas');
      return;
    }
    setParolError('');

    try {
      const res = await fetch(`http://localhost:3001/operatorlar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Yuborishda xatolik');
      router.push('/dashboard/shtab/operatorlar');
    } catch (err) {
      setXato(err.message);
    }
  };

  if (loading) return <p className="p-4">⏳ Yuklanmoqda...</p>;
  if (xato) return <p className="p-4 text-red-500">{xato}</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">✏️ Operatorni tahrirlash</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">F.I.O</label>
          <input
            type="text"
            name="fio"
            value={form.fio}
            onChange={handleChange}
            className="w-full mt-1 border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Telefon</label>
          <input
            type="text"
            name="telefon"
            value={form.telefon}
            onChange={handleChange}
            className="w-full mt-1 border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Login</label>
          <input
            type="text"
            name="login"
            value={form.login}
            onChange={handleChange}
            className="w-full mt-1 border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Parol</label>
          <input
            type="password"
            name="parol"
            value={form.parol}
            onChange={handleChange}
            className="w-full mt-1 border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Parolni tasdiqlang</label>
          <input
            type="password"
            name="parolTasdiq"
            value={form.parolTasdiq}
            onChange={handleChange}
            className={`w-full mt-1 border px-3 py-2 rounded ${
              parolError ? 'border-red-500' : ''
            }`}
            required
          />
          {parolError && <p className="text-red-500 text-sm mt-1">{parolError}</p>}
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          💾 Saqlash
        </button>
      </form>
    </div>
  );
}
