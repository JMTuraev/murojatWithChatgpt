"use client";
import { useEffect, useState } from "react";

export default function TashkilotListPage() {
  const [tashkilotlar, setTashkilotlar] = useState([]);

  useEffect(() => {
    // Bu mock — kelajakda API'dan chaqiramiz
    const mock = [
      {
        id: 1,
        nomi: "Tuman elektr tarmoqlari",
        manzil: "Romitan tumani, Mustaqillik ko‘chasi 15",
        status: "faol",
      },
      {
        id: 2,
        nomi: "Mahalla qo‘mitasi",
        manzil: "Romitan tumani, Do‘stlik MFY",
        status: "faol emas",
      },
    ];
    setTashkilotlar(mock);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏢 Tashkilotlar Ro‘yxati</h1>

      <div className="space-y-4">
        {tashkilotlar.length === 0 && (
          <p className="text-gray-500">Tashkilotlar hozircha mavjud emas.</p>
        )}

        {tashkilotlar.map((t) => (
          <div
            key={t.id}
            className="border border-gray-200 rounded p-4 bg-white shadow-sm"
          >
            <div className="text-lg font-semibold">{t.nomi}</div>
            <div className="text-sm text-gray-700 mb-1">📍 {t.manzil}</div>
            <div
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                t.status === "faol"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {t.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
