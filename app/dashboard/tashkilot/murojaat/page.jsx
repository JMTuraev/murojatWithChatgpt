"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function TashkilotMurojaatlarPage() {
  const [murojaatlar, setMurojaatlar] = useState([]);

  useEffect(() => {
    // Mock ma'lumot: bu tashkilotga biriktirilgan murojaatlar
    const mock = [
      {
        id: 1,
        fio: "Abdulloh Karimov",
        muammo: "Ko‘chada yoritgich yo‘q",
        manzil: "Romitan, Yangi ko‘cha",
        telefon: "911223344",
        status: "biriktirildi",
      },
      {
        id: 2,
        fio: "Shahnoza Karimova",
        muammo: "Ichimlik suvi yo‘q",
        manzil: "Romitan, G‘alaba MFY",
        telefon: "900112233",
        status: "tushuntirildi",
      },
    ];

    setMurojaatlar(mock);
  }, []);

  const statusStyle = (status) => {
    switch (status) {
      case "biriktirildi":
        return "bg-yellow-100 text-yellow-800";
      case "bajarildi":
        return "bg-green-100 text-green-700";
      case "tushuntirildi":
        return "bg-blue-100 text-blue-700";
      case "rad etildi":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📂 Mening Murojaatlarim</h1>

      <div className="space-y-4">
        {murojaatlar.length === 0 && (
          <p className="text-gray-500">Sizga biriktirilgan murojaatlar yo‘q.</p>
        )}

        {murojaatlar.map((m) => (
          <div
            key={m.id}
            className="border border-gray-200 rounded p-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center">
              <div className="font-semibold">{m.fio}</div>
              <span
                className={`text-xs px-2 py-1 rounded font-medium ${statusStyle(
                  m.status
                )}`}
              >
                {m.status}
              </span>
            </div>
            <div className="text-sm text-gray-600">📞 {m.telefon}</div>
            <div className="text-gray-700 mt-2">📝 {m.muammo}</div>
            <div className="text-xs text-gray-500 italic">📍 {m.manzil}</div>

            <div className="flex justify-end mt-4">
              <Link href={`/dashboard/tashkilot/murojaat/${m.id}`}>
                <Button>Ko‘rish / Tahrirlash</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
