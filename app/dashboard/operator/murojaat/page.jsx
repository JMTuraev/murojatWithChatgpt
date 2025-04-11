"use client";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

export default function MurojaatListPage() {
  const [murojaatlar, setMurojaatlar] = useState([]);

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        fio: "Abdulloh Karimov",
        telefon: "911223344",
        muammo: "Ko‘chada yoritgich yo‘q",
        manzil: "Buxoro, Romitan",
        status: "yangi",
      },
      {
        id: 2,
        fio: "Mansur Qodirov",
        telefon: "912334455",
        muammo: "Ichimlik suvi yo‘q",
        manzil: "Toshkent, Shayxontohur",
        status: "biriktirildi",
      },
      {
        id: 3,
        fio: "Shahnoza Karimova",
        telefon: "903443322",
        muammo: "Gaz yo‘q",
        manzil: "Toshkent, Uchtepa",
        status: "tushuntirildi",
      },
    ];
    setMurojaatlar(mockData);
  }, []);

  const statusStyle = (status) => {
    switch (status) {
      case "yangi":
        return "bg-gray-200 text-gray-800";
      case "biriktirildi":
        return "bg-yellow-100 text-yellow-800";
      case "bajarildi":
        return "bg-green-100 text-green-700";
      case "rad etildi":
        return "bg-red-100 text-red-600";
      case "tushuntirildi":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">\ud83d\udccb Murojaatlar Roʻyxati</h1>

      <div className="space-y-4">
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
            <div className="text-sm text-gray-600">\ud83d\udcde {m.telefon}</div>
            <div className="text-gray-700 mt-2">\ud83d\udcc4 {m.muammo}</div>
            <div className="text-xs text-gray-500 italic">\ud83d\udccd {m.manzil}</div>

            <div className="flex gap-3 mt-4">
              <Button onClick={() => alert(`Biriktirish: ${m.id}`)}>
                Biriktirish
              </Button>
              <Button onClick={() => alert(`Ko‘rish: ${m.id}`)} type="button">
                Ko‘rish
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
