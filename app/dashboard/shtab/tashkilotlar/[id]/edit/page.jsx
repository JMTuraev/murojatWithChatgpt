'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BuildingOfficeIcon, KeyIcon } from '@heroicons/react/24/solid';

export default function EditTashkilotPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    toliqNomi: '',
    qisqaNomi: '',
    ism: '',
    familiya: '',
    login: '',
    parol: '',
    parolTasdiq: '',
  });

  const [loading, setLoading] = useState(true);
  const [xato, setXato] = useState('');
  const [parolError, setParolError] = useState('');

  useEffect(() => {
    const fetchTashkilot = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error('Ma’lumot topilmadi');
        const data = await res.json();
        setForm({
          toliqNomi: data.toliqNomi  || '',
          qisqaNomi: data.qisqaNomi || '',
          ism: data.ism || '',
          familiya: data.familiya || '',
          login: data.login || '',
          parol: '',
          parolTasdiq: '',
        });
      } catch (err) {
        setXato(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTashkilot();
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

    if (form.parol !== form.parolTasdiq) {
      setParolError('Parollar mos emas');
      return;
    }
    setParolError('');

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toliqNomi: form.toliqNomi,
          qisqaNomi: form.qisqaNomi,
          ism: form.ism,
          familiya: form.familiya,
          login: form.login,
          parol: form.parol,
          rol: 'tashkilot',
        }),
      });
      if (!res.ok) throw new Error('Yuborishda xatolik');
      router.push('/dashboard/shtab/tashkilotlar');
    } catch (err) {
      setXato(err.message);
    }
  };

  if (loading) return <p className="p-4">⏳ Yuklanmoqda...</p>;
  if (xato) return <p className="p-4 text-red-500">{xato}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold flex items-center gap-2 mb-4">
        <BuildingOfficeIcon className="w-6 h-6 text-blue-500" />
        Tashkilotni tahrirlash
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Tashkilot to‘liq nomi</label>
          <input
            name="toliqNomi"
            value={form.toliqNomi}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Qisqa nomi</label>
          <input
            name="qisqaNomi"
            value={form.qisqaNomi}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Mas’ul ismi</label>
            <input
              name="ism"
              value={form.ism}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mas’ul familiyasi</label>
            <input
              name="familiya"
              value={form.familiya}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Login</label>
          <input
            name="login"
            value={form.login}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Parol</label>
            <input
              type="password"
              name="parol"
              value={form.parol}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
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
              className={`w-full border px-3 py-2 rounded ${
                parolError ? 'border-red-500' : ''
              }`}
              required
            />
            {parolError && <p className="text-sm text-red-500 mt-1">{parolError}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-indigo-700"
        >
          <KeyIcon className="w-5 h-5" />
          Saqlash
        </button>
      </form>
    </div>
  );
}
