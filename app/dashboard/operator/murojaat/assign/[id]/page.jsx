"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AssignMurojaatPage() {
  const { id } = useParams();

  const [murojaat, setMurojaat] = useState(null);
  const [tashkilot, setTashkilot] = useState("");
  const [muddat, setMuddat] = useState("");
  const [xabar, setXabar] = useState("");

  useEffect(() => {
    // Bu mock: keyinchalik API orqali murojaat ma'lumotlari olinadi
    const mock = {
      id,
      fio: "Abdulloh Karimov",
      muammo: "Ko‘chada yoritgich yo‘q",
    };
    setMurojaat(mock);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!tashkilot || !muddat) {
      setXabar("❌ Tashkilot va muddatni tanlang!");
      return;
    }

    console.log("Biriktirildi:", {
      murojaatId: id,
      tashkilot,
      muddat,
    });

    setXabar("✅ Murojaat tashkilotga biriktirildi!");
  };

  if (!murojaat) return <p className="p-6">Yuklanmoqda...</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 mt-10 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Murojaatni Biriktirish</h2>
      <p className="mb-2"><strong>F.I.Sh:</strong> {murojaat.fio}</p>
      <p className="mb-4"><strong>Muammo:</strong> {murojaat.muammo}</p>

      {xabar && (
        <p
          className={`text-center mb-4 ${
            xabar.startsWith("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {xabar}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Tashkilot tanlang:</label>
          <select
            value={tashkilot}
            onChange={(e) => setTashkilot(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Tanlang --</option>
            <option value="Tuman elektr tarmoqlari">Tuman elektr tarmoqlari</option>
            <option value="Yo‘l boshqarmasi">Yo‘l boshqarmasi</option>
            <option value="Mahalla qo‘mitasi">Mahalla qo‘mitasi</option>
            <option value="Tashkilot 4">Tashkilot 4</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Ijro muddati:</label>
          <Input
            type="date"
            value={muddat}
            onChange={(e) => setMuddat(e.target.value)}
          />
        </div>

        <Button type="submit">Biriktirish</Button>
      </form>
    </div>
  );
}
