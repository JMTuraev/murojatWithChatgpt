"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AssignMurojaatPage() {
  const { id } = useParams();

  const [murojaat, setMurojaat] = useState(null);
  const [tashkilotlar, setTashkilotlar] = useState([]);
  const [tashkilotId, setTashkilotId] = useState("");
  const [muddat, setMuddat] = useState("");
  const [xabar, setXabar] = useState("");

  useEffect(() => {
    // Murojaat mock
    setMurojaat({
      id,
      fio: "Abdulloh Karimov",
      muammo: "Ko‘chada yoritgich yo‘q",
    });

    // Tashkilotlar mock (keyinchalik API orqali)
    const mockTashkilotlar = [
      { id: 1, nomi: "Tuman elektr tarmoqlari" },
      { id: 2, nomi: "Yo‘l xo‘jaligi" },
      { id: 3, nomi: "Shahar gaz ta’minoti" },
    ];
    setTashkilotlar(mockTashkilotlar);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!tashkilotId || !muddat) {
      setXabar("❌ Tashkilot va muddatni tanlang!");
      return;
    }

    const tanlangan = tashkilotlar.find((t) => t.id === parseInt(tashkilotId));

    console.log("✅ Biriktirildi:", {
      murojaatId: id,
      tashkilotId,
      tashkilotNomi: tanlangan?.nomi,
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
            value={tashkilotId}
            onChange={(e) => setTashkilotId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Tanlang --</option>
            {tashkilotlar.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nomi}
              </option>
            ))}
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
