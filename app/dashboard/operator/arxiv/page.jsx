'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FolderIcon,
  EyeIcon,
  PencilIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import RejectedList from '@/components/RejectedList';

// Telefon raqamni oddiy formatlash funksiyasi
function formatPhone(phone) {
  if (!phone) return '';
  return phone.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '+998 ($1) $2-$3-$4');
}

// Status badge rangini aniqlash
function statusBadge(nomi) {
  const base = 'inline-block px-2 py-1 text-xs font-semibold rounded-full';
  switch (nomi) {
    case 'yangi':
      return `${base} bg-blue-100 text-blue-800`;
    case 'biriktirildi':
      return `${base} bg-indigo-100 text-indigo-800`;
    case 'ko‘rilmoqda':
      return `${base} bg-yellow-100 text-yellow-800`;
    case 'rad etildi':
      return `${base} bg-red-100 text-red-800`;
    case 'bajarildi':
      return `${base} bg-green-100 text-green-800`;
    case 'bekor qilindi':
      return `${base} bg-gray-100 text-gray-800`;
    case 'murojaat emas':
      return `${base} bg-red-200 text-red-900`;
    default:
      return `${base} bg-gray-100 text-gray-800`;
  }
}

export default function OperatorArxivPage() {
  const router = useRouter();
  const [biriktirilgan, setBiriktirilgan] = useState([]);
  const [radEtilganlar, setRadEtilganlar] = useState([]);
  const [xato, setXato] = useState('');

  useEffect(() => {
    const fetchMurojaatlar = async () => {
      try {
        const res = await fetch('/api/webhook');
        if (!res.ok) throw new Error('Maʼlumotlarni olishda xatolik');
        const data = await res.json();

        // 7 — "murojaat emas", 4 — "rad etildi"
        const murojatEmas = data.filter((m) => m.status_id === 7);
        const radEtilgan = data.filter((m) => m.status_id === 4);

        setBiriktirilgan(murojatEmas);
        setRadEtilganlar(radEtilgan);
      } catch (err) {
        setXato(err.message);
      }
    };

    fetchMurojaatlar();
  }, []);

  return (
    <div className="pt-1">
      <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FolderIcon className="w-6 h-6 text-indigo-600" />
        Arxivlangan Murojaatlar
      </h1>

      <RejectedList data={radEtilganlar} />

      {xato && <p className="text-red-500">{xato}</p>}
      {!xato && biriktirilgan.length === 0 && (
        <p>🔍 Murojaat emas holatdagi murojaatlar topilmadi.</p>
      )}


    </div>
  );
}
