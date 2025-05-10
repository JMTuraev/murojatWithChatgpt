'use client';

import { useEffect, useState } from 'react';
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function OperatorBajarilganPage() {
  const [murojaatlar, setMurojaatlar] = useState([]);
  const [xato, setXato] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  
  const formatPhone = (number) => {
    if (!number) return '—';
    const cleaned = number.replace(/\D/g, '').slice(-9); // faqat 9 raqam
    return `+998 (${cleaned.slice(0, 2)}) ${cleaned.slice(2, 5)}-${cleaned.slice(5, 7)}-${cleaned.slice(7, 9)}`;
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '—';
    const date = new Date(isoDate);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 0-based
    const year = date.getFullYear();
  
    return `${hours}:${minutes} ${day}.${month}.${year} y.`;
  };
  useEffect(() => {
    const fetchMurojaatlar = async () => {
      try {
        const res = await fetch('http://localhost:3001/murojaatlar');
        if (!res.ok) throw new Error('Ma’lumotlar olinmadi');
        const data = await res.json();

        const filtered = data.filter((item) =>
          ['bajarildi', 'rad etildi', 'tushuntirish berildi', 'jarayonda'].includes(item.status)
        );
        setMurojaatlar(filtered);
      } catch (err) {
        setXato(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMurojaatlar();
  }, []);

  const statusColor = {
    bajarildi: 'bg-green-100 text-green-700',
    'rad etildi': 'bg-red-100 text-red-700',
    'tushuntirish berildi': 'bg-yellow-100 text-yellow-700',
    jarayonda: 'bg-blue-100 text-blue-700',
  };


  if (loading) return <p className="p-4">Yuklanmoqda...</p>;
  if (xato) return <p className="p-4 text-red-500">Xatolik: {xato}</p>;

  return (
    <div className="grid gap-4 p-4">
      {murojaatlar.map((murojaat) => (
        <div
          key={murojaat.id}
          className="bg-white shadow rounded-lg p-4 flex flex-col gap-2"
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-bold text-lg">
                #{murojaat.id} — {murojaat.fio}
              </h2>
              <p className="text-gray-700">{murojaat.muammo}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[murojaat.status]}`}
            >
              {murojaat.status}
            </span>
          </div>

          <div className="text-sm text-gray-600 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" />
              {murojaat.manzil}
            </div>
            <div className="flex items-center gap-1">
              <PhoneIcon className="h-4 w-4" />
              {formatPhone(murojaat.telefon) }
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              {formatDate(murojaat.operator.qabulQilganSana)}
            </div>
            <em>{murojaat.tashkilotNomi}</em>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() =>
                router.push(`/dashboard/operator/bajarilgan/${murojaat.id}`)
              }
              className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
            >
              <EyeIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
