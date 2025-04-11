"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function EditTashkilotPage() {
  const { id } = useParams();
  const [form, setForm] = useState({
    nomi: "",
    manzil: "",
    status: "faol",
  });
  const [xabar, setXabar] = useState("");

  useEffect(() => {
    // Hozircha mock: keyinchalik API orqali chaqiriladi
    const mockData = {
      id,
      nomi: "Tuman elektr tarmoqlari",
      manzil: "Romitan tumani, Mustaqillik ko‘chasi 15",
      status: "faol",
    };
    setForm({
      nomi: mockData.nomi,
      manzil: mockData.manzil,
      status: mockData.status,
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nomi || !form.manzil) {
      setXabar("❌ Barcha maydonlarni to‘ldiring.");
      return;
    }

    console.log("✏️ Tahrirlangan tashkilot:", {
      id,
      ...form,
    });

    setXabar("✅ Tashkilot ma’lumotlari yangilandi!");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Tashkilotni Tahrirlash</h2>

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
        <Input
          name="nomi"
          placeholder="Tashkilot nomi"
          value={form.nomi}
          onChange={handleChange}
        />
        <Input
          name="manzil"
          placeholder="Tashkilot manzili"
          value={form.manzil}
          onChange={handleChange}
        />
        <div>
          <label className="block mb-1 text-sm font-medium">Status:</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="faol">Faol</option>
            <option value="faol emas">Faol emas</option>
          </select>
        </div>

        <Button type="submit">Saqlash</Button>
      </form>
    </div>
  );
}
