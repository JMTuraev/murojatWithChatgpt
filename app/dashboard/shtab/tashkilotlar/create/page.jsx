'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTashkilotPage() {
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

  const [xabar, setXabar] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setXabar('');
    setLoading(true);

    if (form.parol !== form.parolTasdiq) {
      setXabar('❌ Parollar mos emas!');
      setLoading(false);
      return;
    }

    const yangiTashkilot = {
      toliqNomi: form.toliqNomi,
      qisqaNomi: form.qisqaNomi,
      ism: form.ism,
      familiya: form.familiya,
      login: form.login,
      parol: form.parol,
      rol: 'tashkilot',
    };

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(yangiTashkilot),
      });

      if (!res.ok) throw new Error('Tashkilotni qo‘shishda xatolik yuz berdi.');

      router.push('/dashboard/shtab/tashkilotlar');
    } catch (err) {
      setXabar('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-xl font-bold mb-4">🏢 Yangi Tashkilot Qo‘shish</h1>

      {xabar && (
        <p className={`mb-4 ${xabar.startsWith('❌') ? 'text-red-500' : 'text-green-600'}`}>
          {xabar}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Tashkilot to‘liq nomi</label>
          <input
            type="text"
            name="toliqNomi"
            value={form.toliqNomi}
            onChange={handleChange}
            required
            className="w-full mt-1 border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Qisqa nomi</label>
          <input
            type="text"
            name="qisqaNomi"
            value={form.qisqaNomi}
            onChange={handleChange}
            required
            className="w-full mt-1 border px-3 py-2 rounded"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Mas’ul ismi</label>
            <input
              type="text"
              name="ism"
              value={form.ism}
              onChange={handleChange}
              required
              className="w-full mt-1 border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Familiyasi</label>
            <input
              type="text"
              name="familiya"
              value={form.familiya}
              onChange={handleChange}
              required
              className="w-full mt-1 border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Login</label>
          <input
            type="text"
            name="login"
            value={form.login}
            onChange={handleChange}
            required
            className="w-full mt-1 border px-3 py-2 rounded"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Parol</label>
            <input
              type="password"
              name="parol"
              value={form.parol}
              onChange={handleChange}
              required
              className="w-full mt-1 border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Parolni tasdiqlang</label>
            <input
              type="password"
              name="parolTasdiq"
              value={form.parolTasdiq}
              onChange={handleChange}
              required
              className="w-full mt-1 border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? '⏳ Yuborilmoqda...' : 'Qo‘shish'}
          </button>
        </div>
      </form>
    </div>
  );
}
