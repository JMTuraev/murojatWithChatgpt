'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  EyeIcon,
  FolderIcon 
} from '@heroicons/react/24/outline';

export default function ShtabMurojaatlarPage() {
  const [data, setData] = useState([]);
  const [xato, setXato] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/murojaatlar');
        if (!res.ok) throw new Error('Serverdan noto‘g‘ri javob');
        const result = await res.json();
        setData(result);
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
      case 'yangi':
        return base + 'text-green-700 bg-green-50 ring-green-600/20';
      case 'biriktirildi':
        return base + 'text-blue-700 bg-blue-50 ring-blue-600/20';
      case 'tushuntirildi':
        return base + 'text-yellow-800 bg-yellow-50 ring-yellow-600/20';
      case 'bajarildi':
        return base + 'text-emerald-700 bg-emerald-50 ring-emerald-600/20';
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
  Shtab Murojaatlari
</h1>
      {xato && <p className="text-red-500">{xato}</p>}
      {!xato && data.length === 0 && <p>🔍 Murojaatlar topilmadi.</p>}

      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((item) => {
          const isLong = item.muammo.length > 60;
          return (
            <li
              key={item.id}
              className="relative col-span-1 rounded-lg bg-white shadow-sm p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">{item.fio}</h3>
                <span className={statusBadge(item.status)}>{item.status}</span>
              </div>

              <p
                className={`text-sm text-gray-600 ${
                  isLong ? 'line-clamp-3 relative text-gray-400' : ''
                }`}
              >
                {item.muammo}
                {isLong && (
                  <span className="absolute bottom-0 right-0 w-full h-5 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
              </p>

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

              <button
                onClick={() => router.push(`/dashboard/shtab/murojaatlar/${item.id}`)}
                className="absolute bottom-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2"
              >
                <EyeIcon className="w-5 h-5" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
