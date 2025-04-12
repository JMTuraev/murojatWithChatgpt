'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckIcon, EyeIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function MurojaatDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [xato, setXato] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3001/murojaatlar/${id}`);
        if (!res.ok) throw new Error('Xatolik yuz berdi!');
        const result = await res.json();
        setData(result);
      } catch (err) {
        setXato(err.message);
      }
    };
    fetchData();
  }, [id]);

  if (xato) return <p className="text-red-500 p-6">{xato}</p>;
  if (!data) return <p className="p-6">⏳ Yuklanmoqda...</p>;

  const steps = [
    {
      name: 'Murojaatchi',
      description: data.muammo,
      status: 'complete',
    },
    {
      name: 'Operator biriktirdi',
      description: `${data.operator?.fio} — ${data.operator?.qabulQilganSana}, muddat: ${data.operator?.muddat}`,
      status: data.status !== 'yangi' ? 'complete' : 'current',
    },
    {
      name: 'Tashkilot ishlov berdi',
      description: data.tashkilot?.nomi || 'Yuborilmagan',
      status:
        data.status === 'bajarildi' || data.status === 'tushuntirildi' || data.status === 'rad etildi'
          ? 'complete'
          : data.tashkilot
          ? 'current'
          : 'upcoming',
    },
  ];

  const statusBadge = {
    yangi: 'bg-gray-200 text-gray-800',
    biriktirildi: 'bg-yellow-200 text-yellow-900',
    tushuntirildi: 'bg-blue-200 text-blue-900',
    bajarildi: 'bg-green-200 text-green-900',
    'rad etildi': 'bg-red-200 text-red-900',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* STATUS BADGE */}
      <div className="flex justify-center mb-8">
        <span
          className={classNames(
            'inline-block px-4 py-1 rounded-full text-sm font-semibold shadow',
            statusBadge[data.status] || 'bg-gray-100 text-gray-700'
          )}
        >
          {data.status.toUpperCase()}
        </span>
      </div>

      {/* PROGRESS STEPS */}
      <nav aria-label="Progress">
        <ol className="overflow-hidden">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className={classNames(stepIdx !== steps.length - 1 ? 'pb-10' : '', 'relative')}>
              {/* Line */}
              {step.status === 'complete' && stepIdx !== steps.length - 1 && (
                <div className="absolute top-4 left-4 h-full w-0.5 bg-indigo-600" aria-hidden="true" />
              )}
              {step.status !== 'complete' && stepIdx !== steps.length - 1 && (
                <div className="absolute top-4 left-4 h-full w-0.5 bg-gray-300" aria-hidden="true" />
              )}

              <div className="relative flex items-start">
                <span className="flex h-9 items-center">
                  <span
                    className={classNames(
                      'relative z-10 flex size-8 items-center justify-center rounded-full',
                      step.status === 'complete'
                        ? 'bg-indigo-600'
                        : step.status === 'current'
                        ? 'border-2 border-indigo-600 bg-white'
                        : 'border-2 border-gray-300 bg-white'
                    )}
                  >
                    {step.status === 'complete' ? (
                      <CheckIcon className="w-5 h-5 text-white" />
                    ) : step.status === 'current' ? (
                      <span className="size-2.5 rounded-full bg-indigo-600" />
                    ) : (
                      <span className="size-2.5 rounded-full bg-gray-300" />
                    )}
                  </span>
                </span>

                <span className="ml-4 flex flex-col">
                  <span
                    className={classNames(
                      'text-sm font-medium',
                      step.status === 'complete'
                        ? 'text-gray-900'
                        : step.status === 'current'
                        ? 'text-indigo-600'
                        : 'text-gray-500'
                    )}
                  >
                    {step.name}
                  </span>
                  <span className="text-sm text-gray-500 whitespace-pre-line">{step.description}</span>
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      {/* TASHKILOT MA'LUMOTLARI */}
      {data.tashkilot && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Tashkilotning izohi:</h3>
          <p className="text-sm text-gray-700 mb-4">{data.tashkilot.izoh}</p>

          {data.tashkilot.rasmlar?.length > 0 && (
            <>
              <h4 className="text-sm font-medium mb-2">Biriktirilgan fayllar:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {data.tashkilot.rasmlar.map((src, i) => (
                  <div key={i} className="relative aspect-square border rounded overflow-hidden">
                    <Image src={src} alt={`Rasm ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
