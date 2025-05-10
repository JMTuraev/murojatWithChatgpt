'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EllipsisVerticalIcon, UserIcon } from '@heroicons/react/24/outline';

export default function OperatorlarPage() {
  const router = useRouter();
  const [operatorlar, setOperatorlar] = useState([]);
  const [xato, setXato] = useState('');

  useEffect(() => {
    const fetchOperatorlar = async () => {
      try {
        const res = await fetch('/api/users?rol=operator');
        const data = await res.json();
  
        // Qo‘shimcha tekshiruv
        console.log('✅ Kelgan data:', data);
  
        // To‘g‘ri array bo‘lsa set qilamiz
        if (Array.isArray(data)) {
          setOperatorlar(data);
        } else {
          setXato('❌ Xatolik: Kutilgan array emas');
        }
      } catch (err) {
        setXato('❌ Xatolik: ' + err.message);
      }
    };
  
    fetchOperatorlar();
  }, []);
  

  const formatPhone = (raw) => {
    if (!raw) return 'Noma’lum';
    const digits = raw.replace(/\D/g, '').slice(-9);
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7)}`;
  };

  const getInitials = (ism, familiya) => {
    return `${(ism?.[0] || '').toUpperCase()}${(familiya?.[0] || '').toUpperCase()}`;
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

              {/* #ID ko‘rsatish */}
  <span className="absolute top-2 left-2 text-xl  text-gray-700 px-2 py-1 rounded font-semibold">
    #{op.id}
  </span>


            <button
              onClick={() => router.push(`/dashboard/shtab/operatorlar/${op.id}/edit`)}
              className="absolute top-2 right-2 text-gray-500 hover:text-indigo-600"
              title="Tahrirlash"
            >
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2 text-3xl font-bold text-gray-600">
              {getInitials(op.ism, op.familiya)}
            </div>

            {/* Ism, telefon */}
            <h3 className="font-semibold text-lg">{op.ism} {op.familiya}</h3>
            
          </li>
        ))}
      </ul>
    </div>
  );
}