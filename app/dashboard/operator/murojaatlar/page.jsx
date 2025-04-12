'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MurojaatlarPage() {
  const [murojaatlar, setMurojaatlar] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/murojaatlar')
      .then(res => res.json())
      .then(data => setMurojaatlar(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Murojaatlar</h1>
      <ul className="space-y-4">
        {murojaatlar.map((item) => (
          <li key={item.id} className="border rounded p-4 bg-white shadow">
            <div className="flex justify-between items-center">
              <div>
                <p><strong>F.I.Sh:</strong> {item.fio}</p>
                <p><strong>Muammo:</strong> {item.muammo}</p>
              </div>

              <div className="text-right">
                {item.status === 'yangi' && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    Yangi
                  </span>
                )}
                {item.status === 'biriktirildi' && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                    Biriktirilgan
                  </span>
                )}

                {item.muddat && (
                  <p className="text-xs text-gray-500 mt-1">
                    Ijro muddati: {item.muddat}
                  </p>
                )}

                <Link
                  href={`/dashboard/operator/murojaatlar/${item.id}`}
                  className="text-blue-500 text-sm mt-2 block"
                >
                  Batafsil
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
