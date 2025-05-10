'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function MurojaatTafsilotPage() {
  const { id } = useParams();
  const [murojaat, setMurojaat] = useState(null);
  const [xato, setXato] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3001/murojaatlar/${id}`);
        if (!res.ok) throw new Error('Ma’lumot topilmadi');
        const data = await res.json();
        setMurojaat(data);
      } catch (err) {
        setXato(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="p-4">Yuklanmoqda...</p>;
  if (xato) return <p className="p-4 text-red-500">Xatolik: {xato}</p>;
  if (!murojaat) return null;

  const berilganSana = new Date(murojaat.muddat);
  const bajarilganSana = new Date(murojaat.bajarilganVaqt);
  const kechikdi = bajarilganSana > berilganSana;
  const kechikish = Math.ceil((bajarilganSana - berilganSana) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow space-y-4">
      <h1 className="text-xl font-bold">{murojaat.fio}</h1>
      <p className="text-gray-700">{murojaat.masalasi}</p>

      <div className="text-sm text-gray-600 space-y-1">
        <div className="flex items-center gap-1">
          <MapPinIcon className="h-4 w-4" />
          {murojaat.manzil}
        </div>
        <div className="flex items-center gap-1">
          <PhoneIcon className="h-4 w-4" />
          {murojaat.tel}
        </div>
      </div>

      <div className="border-t pt-4">
        <p><strong>Tashkilot:</strong> {murojaat.tashkilotNomi}</p>
        <p><strong>Izoh:</strong> {murojaat.izoh || 'Izoh mavjud emas'}</p>

        {murojaat.rasmlar && murojaat.rasmlar.length > 0 && (
          <div className="flex gap-3 mt-2 flex-wrap">
            {murojaat.rasmlar.map((url, idx) => (
              <Image
                key={idx}
                src={url}
                alt={`Rasm ${idx + 1}`}
                width={120}
                height={120}
                className="rounded object-cover border"
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-4 space-y-1 text-sm">
        <p><strong>Berilgan muddat:</strong> {murojaat.muddat}</p>
        <p><strong>Bajarilgan sana:</strong> {murojaat.bajarilganVaqt}</p>
        {kechikdi ? (
          <p className="text-red-600 font-semibold">
            ⚠️ {kechikish} kun kechikilgan
          </p>
        ) : (
          <p className="text-green-600 font-medium">✅ O‘z vaqtida bajarilgan</p>
        )}
      </div>
    </div>
  );
}
