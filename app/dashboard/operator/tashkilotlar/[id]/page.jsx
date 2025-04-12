'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditTashkilotPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    nomi: '',
    hudud: '',
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:3001/tashkilotlar/${params.id}`);
        const data = await res.json();
        setForm({
          nomi: data.nomi || '',
          hudud: data.hudud || '',
        });
        setLoading(false);
      } catch (err) {
        console.error('Xatolik:', err);
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:3001/tashkilotlar/${params.id}`, {
      method: 'PUT',
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

  if (loading) return <p className="text-center mt-10">⏳ Yuklanmoqda...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">✏️ Tashkilotni tahrirlash</h2>

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
          placeholder="Hudud"
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Saqlash
        </button>
        {success && <p className="text-green-600">✅ Muvaffaqiyatli yangilandi</p>}
      </form>
    </div>
  );
}
