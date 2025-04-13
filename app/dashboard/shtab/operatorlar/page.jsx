'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EllipsisVerticalIcon, UserIcon } from '@heroicons/react/24/outline';

export default function OperatorlarPage() {
  const router = useRouter();
  const [operatorlar, setOperatorlar] = useState([]);
  const [xato, setXato] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/operatorlar')
      .then((res) => res.json())
      .then(setOperatorlar)
      .catch((err) => setXato('Xatolik: ' + err.message));
  }, []);

  const formatPhone = (raw) => {
    const digits = raw.replace(/\D/g, '').slice(-9);
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7)}`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-purple-600" />
          Operatorlar
        </h1>
        <button
          onClick={() => router.push('/dashboard/shtab/operatorlar/create')}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <span className="text-lg">+</span>
          Yangi operator
        </button>
      </div>

      {xato && <p className="text-red-500">{xato}</p>}

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {operatorlar.map((op) => (
          <li
            key={op.id}
            className="relative bg-white rounded-lg shadow p-4 flex flex-col items-center text-center"
          >
            {/* 3 nuqta tugma */}
            <button
              onClick={() => router.push(`/dashboard/shtab/operatorlar/${op.id}/edit`)}
              className="absolute top-2 right-2 text-gray-500 hover:text-indigo-600"
              title="Tahrirlash"
            >
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>

            {/* Avatar */}
            {op.rasm ? (
              <img
                src={op.rasm}
                alt={op.fio}
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                <UserIcon className="w-12 h-12 text-gray-500" />
              </div>
            )}

            {/* Ism, telefon */}
            <h3 className="font-semibold text-lg">{op.fio}</h3>
            <p className="text-sm text-gray-600">{formatPhone(op.telefon)}</p>

            {/* Online / Offline badge */}
            <span
              className={`mt-2 inline-block px-3 py-1 text-xs rounded-full ${
                op.status === 'online'
                  ? 'bg-green-100 text-green-700 ring-1 ring-green-300'
                  : 'bg-gray-100 text-gray-500 ring-1 ring-gray-300'
              }`}
            >
              {op.status === 'online' ? 'Online' : 'Offline'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
