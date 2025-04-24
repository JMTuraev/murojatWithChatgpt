'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { EyeIcon, MapPinIcon, PhoneIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function OperatorMurojaatlarPage() {
  const [murojaatlar, setMurojaatlar] = useState([]);
  const [tashkilotlar, setTashkilotlar] = useState([]);
  const [formValues, setFormValues] = useState([]);

  const handleMarkAsNotMurojaat = async (id) => {
    try {
      const res = await fetch(`/api/murojaatlar/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status_id: 7 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Xatolik yuz berdi');

      setMurojaatlar((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('❌ Statusni o‘zgartirishda xatolik:', err.message);
      alert('Statusni o‘zgartirishda xatolik yuz berdi');
    }
  };

  useEffect(() => {
    const fetchMurojaatlar = async () => {
      try {
        const res = await fetch('/api/webhook');
        if (!res.ok) throw new Error('Murojaatlar olinmadi');
        const data = await res.json();
        setMurojaatlar(data.filter((m) => m.status_id === 1));
      } catch (err) {
        console.error('❌ Murojaat olishda xatolik:', err.message);
      }
    };

    const fetchTashkilotlar = async () => {
      try {
        const res = await fetch('/api/users?rol=tashkilot');
        if (!res.ok) throw new Error('Tashkilotlar olinmadi');
        const data = await res.json();
        setTashkilotlar(data);
      } catch (err) {
        console.error('❌ Tashkilot olishda xatolik:', err.message);
      }
    };

    fetchMurojaatlar();
    fetchTashkilotlar();
  }, []);

  const handleChange = (id, field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [id]: {
        birlik: 'kun', // default qiymat doim mavjud bo‘ladi
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (id) => {
    const { tashkilotId, muddat, birlik = 'kun' } = formValues[id] || {};
    if (!tashkilotId || !muddat || !birlik || isNaN(muddat)) {
      alert('❗ Barcha maydonlar to‘g‘ri to‘ldirilishi shart');
      return;
    }

    const now = new Date();
    const ms =
      birlik === 'kun' ? muddat * 86400000 :
      birlik === 'soat' ? muddat * 3600000 :
      muddat * 60000;

    const deadline = new Date(now.getTime() + ms);

    try {
      const res = await fetch(`/api/murojaatlar/${id}/biriktirish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tashkilotId: parseInt(tashkilotId),
          muddat: deadline.toISOString()
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '❌ Biriktirishda xatolik');

      setMurojaatlar((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('❌ Biriktirishda xatolik:', err.message);
      alert('❌ Biriktirishda xatolik yuz berdi');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📂 Telegramdan kelgan murojaatlar</h1>

      <div className="space-y-6">
        {murojaatlar.map((m) => {
          const fv = {
            birlik: 'kun', // frontendda boshlanishda har doim mavjud
            ...formValues[m.id]
          };

          return (
            <div key={m.id} className="bg-white rounded shadow p-6 border">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">
                    {m.username || "Noma'lum foydalanuvchi"}
                  </h2>
                  <p className="mt-1 text-gray-700">{m.text}</p>

                  <div className="mt-3 space-y-1 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>Manzil ko‘rsatilmagan</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <PhoneIcon className="w-4 h-4" />
                      <span>{m.phone || "Telefon raqam yo‘q"}</span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-400 flex items-center justify-end gap-3 mt-1">
                  <button
                    onClick={() => handleMarkAsNotMurojaat(m.id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Murojaat emas</span>
                  </button>

                  <span className="text-xs text-gray-500">
                    {new Date(m.timestamp).toLocaleString()}
                  </span>

                  <EyeIcon className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="grid grid-cols-4 gap-3 items-center">
                  <select
                    className="border px-3 py-2 rounded w-full"
                    value={fv.tashkilotId || ''}
                    onChange={(e) => handleChange(m.id, 'tashkilotId', e.target.value)}
                  >
                    <option value="">Tashkilotni tanlang</option>
                    {tashkilotlar.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.qisqaNomi}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Muddat"
                    value={fv.muddat || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*$/.test(val)) handleChange(m.id, 'muddat', val);
                    }}
                    className="border px-3 py-2 rounded w-full"
                  />

                  <select
                    className="border px-3 py-2 rounded w-full"
                    value={fv.birlik}
                    onChange={(e) => handleChange(m.id, 'birlik', e.target.value)}
                  >
                    <option value="kun">kun</option>
                    <option value="soat">soat</option>
                    <option value="minut">minut</option>
                  </select>

                  <Button
                    onClick={() => handleSubmit(m.id)}
                    className="w-full h-full"
                  >
                    Biriktirish
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
