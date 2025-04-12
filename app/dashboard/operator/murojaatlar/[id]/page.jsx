'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function EditMurojaatPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fio: '',
    telefon: '',
    muammo: '',
    manzil: '',
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchMurojaat() {
      try {
        const res = await fetch(`http://localhost:3001/murojaatlar/${id}`);
        const data = await res.json();
        setFormData({
          fio: data.fio || '',
          telefon: data.telefon || '',
          muammo: data.muammo || '',
          manzil: data.manzil || '',
        });
        setLoading(false);
      } catch (error) {
        console.error('Xatolik:', error);
      }
    }

    fetchMurojaat();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/murojaatlar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Yuborishda xatolik:', error);
    }
  };

  if (loading) return <div className="text-center text-lg">Yuklanmoqda...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded">
      <h1 className="text-2xl font-bold mb-6">Murojaatni tahrirlash</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fio"
          placeholder="Ism"
          value={formData.fio}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          name="telefon"
          placeholder="Telefon"
          value={formData.telefon}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          name="muammo"
          placeholder="Muammo matni"
          value={formData.muammo}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          name="manzil"
          placeholder="Manzil"
          value={formData.manzil}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Saqlash
        </button>
        {success && (
          <div className="text-green-600 mt-2">✅ Muvaffaqiyatli yangilandi</div>
        )}
      </form>
    </div>
  );
}
