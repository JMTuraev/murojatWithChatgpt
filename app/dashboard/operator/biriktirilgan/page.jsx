'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';
import RejectedList from '@/components/RejectedList';

export default function OperatorBiriktirilganPage() {
  const [biriktirilgan, setbiriktirilgan] = useState([]);
  const [radEtilganlar, setRadEtilganlar] = useState([]);
  const [xato, setXato] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/murojaatlar');
        if (!res.ok) throw new Error('Serverdan noto‘g‘ri javob');
        const result = await res.json();

        const biriktirilgan = result.filter(item => item.status === 'biriktirildi');
        const radEtilgan = result.filter(item => item.status === 'rad etildi');

        setbiriktirilgan(biriktirilgan);
        setRadEtilganlar(radEtilgan);
      } catch (err) {
        setXato('Xatolik: ' + err.message);
      }
    };
    fetchData();
  }, []);

  const formatPhone = (raw) => {
    if (!raw) return '';
    const onlyDigits = raw.replace(/\D/g, '');
    const last9 = onlyDigits.slice(-9);
    if (last9.length !== 9) return raw;
    return `${last9.slice(0, 2)}-${last9.slice(2, 5)}-${last9.slice(5, 7)}-${last9.slice(7)}`;
  };

  const statusBadge = (status) => {
    const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ';
    switch (status) {
      case 'biriktirildi':
        return base + 'text-blue-700 bg-blue-50 ring-blue-600/20';
      case 'rad etildi':
        return base + 'text-red-700 bg-red-50 ring-red-600/20';
      default:
        return base + 'text-gray-700 bg-gray-50 ring-gray-600/20';
    }
  };

  return (
    <div className="pt-1">
      <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FolderIcon className="w-6 h-6 text-indigo-600" />
        Biriktirilgan Murojaatlar
      </h1>

      {/* RAD ETILGANLAR KOMPONENTI */}
      <RejectedList data={radEtilganlar} />

      {xato && <p className="text-red-500">{xato}</p>}
      {!xato && biriktirilgan.length === 0 && <p>🔍 Biriktirilgan murojaatlar topilmadi.</p>}

      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {biriktirilgan.map((item) => (
          <li
            key={item.id}
            className="relative col-span-1 rounded-lg bg-white shadow-sm p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">{item.fio}</h3>
              <span className={statusBadge(item.status)}>biriktirildi</span>
            </div>

            <p className="text-sm text-gray-600 line-clamp-3">{item.muammo}</p>

            <div className="mt-4 space-y-1 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" />
                <span>{item.manzil}</span>
              </div>
              <div className="flex items-center gap-1">
                <PhoneIcon className="w-4 h-4" />
                <span>{formatPhone(item.telefon)}</span>
              </div>
              {item.muddat && (
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>Muddat: {item.muddat}</span>
                </div>
              )}
            </div>

            {/* ✅ Tashkilot nomi pastda (truncate bilan) */}
            {item.tashkilot?.nomi && (
              <div className="mt-2 text-xs text-gray-500 italic truncate max-w-full">
                {item.tashkilot.nomi}
              </div>
            )}

            {/* 👁 Ko‘rish + ✏️ Tahrirlash */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={() => router.push(`/dashboard/operator/murojaat/${item.id}`)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2"
                title="Ko‘rish"
              >
                <EyeIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => router.push(`/dashboard/operator/murojaat/${item.id}/edit`)}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-full p-2"
                title="Tahrirlash"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
