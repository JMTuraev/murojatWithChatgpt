  'use client';

  import { useEffect, useState } from "react";
  import Link from "next/link";
  import Button from "@/components/ui/Button";

  export default function TashkilotMurojaatlarPage() {
    const [murojaatlar, setMurojaatlar] = useState([]);
    const [xato, setXato] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchMurojaatlar = async () => {
        try {
          const res = await fetch('http://localhost:5000/murojaatlar');
          if (!res.ok) throw new Error("Serverdan noto‘g‘ri javob");
          const data = await res.json();
          setMurojaatlar(data);
        } catch (err) {
          setXato("❌ Xatolik: " + err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchMurojaatlar();
    }, []);

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">📂 Telegramdan kelgan murojaatlar</h1>

        {loading && <p>⏳ Yuklanmoqda...</p>}
        {xato && <p className="text-red-500">{xato}</p>}

        <div className="space-y-4">
          {!loading && murojaatlar.length === 0 && (
            <p className="text-gray-500">Hech qanday murojaat topilmadi.</p>
          )}

          {murojaatlar.map((m) => (
            <div
              key={m.id}
              className="border border-gray-200 rounded p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between items-center">
                <div className="font-semibold">{m.username || "👤 Noma'lum foydalanuvchi"}</div>
                <span className="text-xs text-gray-500">{new Date(m.timestamp).toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-600">📞 {m.phone || "Telefon raqam yo‘q"}</div>
              <div className="text-gray-700 mt-2">📝 {m.text}</div>

              <div className="flex justify-end mt-4">
                <Link href={`/dashboard/tashkilot/murojaat/${m.id}`}>
                  <Button>Ko‘rish</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
