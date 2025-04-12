'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function MurojaatDetailPage() {
  const { id } = useParams();
  const [murojaat, setMurojaat] = useState(null);
  const [xato, setXato] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3001/murojaatlar/${id}`)
      .then(res => res.json())
      .then(setMurojaat)
      .catch(err => setXato('Xatolik: ' + err.message));
  }, [id]);

  if (xato) return <p className="text-red-500">{xato}</p>;
  if (!murojaat) return <p>Yuklanmoqda...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{murojaat.fio}</h1>
      <p className="mb-4">{murojaat.muammo}</p>
      <p><strong>Manzil:</strong> {murojaat.manzil}</p>
      <p><strong>Telefon:</strong> {murojaat.telefon}</p>
      <p><strong>Status:</strong> {murojaat.status}</p>
      <p><strong>Muddat:</strong> {murojaat.muddat}</p>
    </div>
  );
}
