'use client';

import { useState } from 'react';

export default function YangiMurojaatPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    content: '',
    address: '',
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      const res = await fetch('http://localhost:3001/murojaatlar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Xatolik yuz berdi!');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Noma’lum xatolik');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4">Yangi murojaat qo‘shish</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Ismingiz"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefon raqamingiz"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="content"
          placeholder="Muammoni kiriting"
          value={formData.content}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Manzilingiz"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
        >
          Yuborish
        </button>
      </form>

      {error && (
        <p className="text-red-600 mt-4">❌ {error}</p>
      )}

      {result && (
        <div className="mt-4 text-green-700">
          <p>✅ {result.message}</p>
          <p><strong>ID:</strong> {result.id}</p>
          <p><strong>Status:</strong> {result.status}</p>
        </div>
      )}
    </div>
  );
}
