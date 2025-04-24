'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FolderIcon,
  EyeIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function OperatorArxivPage() {
  const [data, setData] = useState([]);
  const [xato, setXato] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        const res = await fetch('/api/archive', { credentials: 'include' });
        if (!res.ok) throw new Error('Maʼlumotlarni olishda xatolik');
        const archiveData = await res.json();
        setData(archiveData);
      } catch (err) {
        setXato(err.message);
        console.error('❌ Arxiv murojaatlarni olishda xatolik:', err.message);
      }
    };

    fetchArchive();
  }, []);

  const formatPhone = (raw) => {
    if (!raw) return '';
    const digits = raw.replace(/\D/g, '').slice(-9);
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7)}`;
  };

  return (
    <div className="pt-1">
      <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FolderIcon className="w-6 h-6 text-indigo-600" />
        Arxivdagi murojaatlar
      </h1>

      {xato && <p className="text-red-500">{xato}</p>}
      {!xato && data?.length === 0 && <p>🔍 Arxivda murojaatlar topilmadi.</p>}

      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((item) => (
          <li
            key={item.id}
            className="relative col-span-1 rounded-lg bg-white shadow-sm p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">{item.username || "Noma'lum"}</h3>
            </div>

            <p className="text-sm text-gray-600 line-clamp-3">{item.text}</p>

            <div className="mt-4 space-y-1 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" />
                <span>Manzil ko‘rsatilmagan</span>
              </div>
              <div className="flex items-center gap-1">
                <PhoneIcon className="w-4 h-4" />
                <span>{formatPhone(item.phone)}</span>
              </div>
              {item.muddat && (
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>Muddat: {new Date(item.muddat).toLocaleString()}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => router.push(`/dashboard/operator/murojaat/${item.id}`)}
              className="absolute bottom-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
