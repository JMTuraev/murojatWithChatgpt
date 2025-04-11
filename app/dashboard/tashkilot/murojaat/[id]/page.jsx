"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function MurojaatStatusUpdatePage() {
  const { id } = useParams();
  const [murojaat, setMurojaat] = useState(null);
  const [status, setStatus] = useState("");
  const [izoh, setIzoh] = useState("");
  const [rasmlar, setRasmlar] = useState([]);
  const [rasmPreviews, setRasmPreviews] = useState([]);
  const [xabar, setXabar] = useState("");

  useEffect(() => {
    // Mock ma’lumot
    const mock = {
      id,
      fio: "Abdulloh Karimov",
      muammo: "Ko‘chada yoritgich yo‘q",
      manzil: "Romitan, Yangi ko‘cha",
      telefon: "911223344",
      status: "biriktirildi",
    };
    setMurojaat(mock);
    setStatus(mock.status);
  }, [id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setRasmlar((prev) => [...prev, ...files]);
    setRasmPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleImageDelete = (index) => {
    setRasmlar((prev) => prev.filter((_, i) => i !== index));
    setRasmPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!status) {
      setXabar("❌ Statusni tanlang.");
      return;
    }

    const formData = {
      id,
      yangiStatus: status,
      izoh,
      rasmlar: rasmlar.map((file) => file.name), // hozircha nomi
    };

    console.log("📤 Yuborilmoqda:", formData);
    setXabar("✅ Ma’lumotlar muvaffaqiyatli yuborildi!");
  };

  if (!murojaat) return <p className="p-6">Yuklanmoqda...</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 mt-10 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Murojaat Tafsilotlari</h2>
      <p><strong>F.I.Sh:</strong> {murojaat.fio}</p>
      <p><strong>Telefon:</strong> {murojaat.telefon}</p>
      <p><strong>Manzil:</strong> {murojaat.manzil}</p>
      <p className="mb-4"><strong>Muammo:</strong> {murojaat.muammo}</p>

      {xabar && (
        <p className={`text-center mb-4 ${xabar.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>
          {xabar}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Status tanlang:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Tanlang --</option>
            <option value="bajarildi">✅ Bajarildi</option>
            <option value="tushuntirildi">ℹ️ Tushuntirish berildi</option>
            <option value="rad etildi">❌ Rad etildi</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Izoh:</label>
          <textarea
            value={izoh}
            onChange={(e) => setIzoh(e.target.value)}
            placeholder="Tushuntirish yoki holat haqida izoh..."
            className="w-full border border-gray-300 rounded px-3 py-2 min-h-[80px]"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Rasm(lar) yuklang (dalolatnoma):</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          {rasmPreviews.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-3">
              {rasmPreviews.map((src, idx) => (
                <div key={idx} className="relative w-24 h-24">
                  <img
                    src={src}
                    alt={`rasm-${idx}`}
                    className="w-full h-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageDelete(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit">Saqlash</Button>
      </form>
    </div>
  );
}
