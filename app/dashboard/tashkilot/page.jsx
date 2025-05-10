'use client';
import { useAuth } from '@/app/context/auth-context';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FolderIcon,
  EyeIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function TashkilotMurojaatlarPage() {
  const [data, setData] = useState([]);
  const [xato, setXato] = useState('');
  const router = useRouter();
  const { user } = useAuth(); // foydalanuvchini olish

 
  useEffect(() => {
    const fetchMurojaatlar = async () => {
      try {
        const res = await fetch('/api/webhook/tashkilot', {
          method: 'GET',
          credentials: 'include',
        });
      
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Xatolik');
        console.log(data, 'asdad');
        console.log(res, 'asdad');
        setData(data);
      } catch (err) {
        console.error('❌ Murojaatlarni olishda xatolik:', err.message);
      }
    };
  
    fetchMurojaatlar();
  }, []);
  
  
  const cookie = document.cookie;
const sbToken = cookie.match(/(^|;)\\s*sb-token\\s*=\\s*([^;]+)/)?.pop();
if (!sbToken) {
  console.log('sb-token topilmadi!');
} else {
  const payload = JSON.parse(atob(sbToken.split('.')[1]));
  console.log(payload);
}

console.log(xato);
  const formatPhone = (raw) => {
    if (!raw) return '';
    const digits = raw.replace(/\D/g, '').slice(-9);
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7)}`;
  };

  const statusBadge = (status) => {
    return 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800';
  };

  console.log(data);
  
  return (
    <div className="pt-1">
      <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FolderIcon className="w-6 h-6 text-indigo-600" />
        Shtab Murojaatlari
      </h1>

      {xato && <p className="text-red-500">{xato}</p>}
      {!xato && data?.length === 0 && <p>🔍 Murojaatlar topilmadi.</p>}

      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((item) => {
          const isLong = item?.text.length > 60;
          return (
            <li
              key={item.id}
              className="relative col-span-1 rounded-lg bg-white shadow-sm p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">{item.username}</h3>
              </div>

              <p className={`text-sm text-gray-600 ${isLong ? 'line-clamp-3 relative text-gray-400' : ''}`}>
                {item.text}
                {isLong && (
                  <span className="absolute bottom-0 right-0 w-full h-5 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
              </p>

              <div className="mt-4 space-y-1 text-xs text-gray-500">
            
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
                onClick={() => router.push(`/dashboard/tashkilot/murojaatlar/${item.id}`)}
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
