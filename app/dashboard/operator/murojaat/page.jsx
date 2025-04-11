"use client";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

export default function MurojaatListPage() {
  const [murojaatlar, setMurojaatlar] = useState([]);

  // Simulyatsiya uchun — bu keyinchalik backenddan keladi
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        fio: "Abdulloh Karimov",
        telefon: "911223344",
        muammo: "Ko‘chada yoritgich yo‘q",
        manzil: "Buxoro, Romitan",
      },
      {
        id: 2,
        fio: "Mansur Qodirov",
        telefon: "912334455",
        muammo: "Ichimlik suvi yo‘q",
        manzil: "Toshkent, Shayxontohur",
      },
    ];
    setMurojaatlar(mockData);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Yangi Murojaatlar Roʻyxati</h1>

      <div className="space-y-4">
        {murojaatlar.map((m) => (
          <div
            key={m.id}
            className="border border-gray-200 rounded p-4 shadow-sm bg-white"
          >
            <div className="font-semibold">{m.fio}</div>
            <div className="text-sm text-gray-600">📞 {m.telefon}</div>
            <div className="text-gray-700 mt-2">📝 {m.muammo}</div>
            <div className="text-xs text-gray-500 italic">📍 {m.manzil}</div>

            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => alert(`Biriktirish: ${m.id}`)}
              >
                Biriktirish
              </Button>
              <Button
                onClick={() => alert(`Ko‘rish: ${m.id}`)}
                type="button"
              >
                Ko‘rish
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
