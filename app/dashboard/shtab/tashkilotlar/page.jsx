"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function TashkilotListPage() {
  const [tashkilotlar, setTashkilotlar] = useState([]);

  useEffect(() => {
    // Mock ma’lumotlar
    const mock = [
      {
        id: 1,
        nomi: "Tuman elektr tarmoqlari",
        manzil: "Romitan tumani",
        status: "faol",
      },
      {
        id: 2,
        nomi: "Mahalla qo‘mitasi",
        manzil: "Do‘stlik MFY",
        status: "faol emas",
      },
    ];
    setTashkilotlar(mock);
  }, []);

  const statusStyle = (status) => {
    switch (status) {
      case "faol":
        return "bg-green-100 text-green-700";
      case "faol emas":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = confirm("Haqiqatan ham o‘chirmoqchimisiz?");
    if (!confirmDelete) return;

    const yangilangan = tashkilotlar.filter((t) => t.id !== id);
    setTashkilotlar(yangilangan);

    console.log("❌ O‘chirildi ID:", id);
  };

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
            className="border border-gray-200 rounded p-4 bg-white shadow-sm flex justify-between items-start"
          >
            <div>
              <div className="text-lg font-semibold">{t.nomi}</div>
              <div className="text-sm text-gray-700 mb-1">📍 {t.manzil}</div>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusStyle(
                  t.status
                )}`}
              >
                {t.status}
              </span>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Link href={`/dashboard/shtab/tashkilot/edit/${t.id}`}>
                <Button>Tahrirlash</Button>
              </Link>
              <Button onClick={() => handleDelete(t.id)} type="button" className="bg-red-600 hover:bg-red-700">
                🗑 O‘chirish
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
