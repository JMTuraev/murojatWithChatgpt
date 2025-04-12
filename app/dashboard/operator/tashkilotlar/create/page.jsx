'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTashkilotPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nomi: '',
    hudud: '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/tashkilotlar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/operator/tashkilotlar');
      }, 1000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">➕ Tashkilot qo‘shish</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nomi"
          value={form.nomi}
          onChange={handleChange}
          placeholder="Tashkilot nomi"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="hudud"
          value={form.hudud}
          onChange={handleChange}
          placeholder="Hudud (masalan, Buxoro shahri)"
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Saqlash
        </button>
        {success && <p className="text-green-600">✅ Tashkilot qo‘shildi</p>}
      </form>
    </div>
  );
}
