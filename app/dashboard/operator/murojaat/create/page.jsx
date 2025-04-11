"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function CreateMurojaatPage() {
  const [form, setForm] = useState({
    fio: "",
    telefon: "",
    muammo: "",
    manzil: "",
  });

  const [xabar, setXabar] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/^\d{9}$/.test(form.telefon)) {
      setXabar("❌ Telefon raqami 9 raqamdan iborat bo‘lishi kerak.");
      return;
    }

    if (!form.fio || !form.muammo || !form.manzil) {
      setXabar("❌ Barcha maydonlarni to‘ldiring.");
      return;
    }

    console.log("✅ Yangi murojaat:", form);
    setXabar("✅ Murojaat muvaffaqiyatli qo‘shildi!");

    setForm({
      fio: "",
      telefon: "",
      muammo: "",
      manzil: "",
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Yangi Murojaat Qo‘shish</h2>
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
          name="fio"
          placeholder="F.I.Sh."
          value={form.fio}
          onChange={handleChange}
        />
        <Input
          name="telefon"
          placeholder="Telefon raqami (9 raqam)"
          value={form.telefon}
          onChange={handleChange}
        />
        <Input
          name="manzil"
          placeholder="Manzil"
          value={form.manzil}
          onChange={handleChange}
        />
        <textarea
          name="muammo"
          placeholder="Muammo tavsifi"
          value={form.muammo}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 w-full min-h-[100px]"
        ></textarea>
        <Button type="submit">Yuborish</Button>
      </form>
    </div>
  );
}
