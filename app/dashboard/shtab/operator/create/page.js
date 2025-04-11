"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function CreateOperatorPage() {
  const [form, setForm] = useState({
    ism: "",
    familiya: "",
    login: "",
    parol: "",
    parolTasdiq: "",
  });

  const [xabar, setXabar] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.parol !== form.parolTasdiq) {
      setXabar("❌ Parollar mos emas!");
      return;
    }

    if (!form.login || !form.parol || !form.ism || !form.familiya) {
      setXabar("❌ Barcha maydonlarni to‘ldiring.");
      return;
    }

    // Bu yerda siz POST so‘rov yuborishingiz mumkin
    // Masalan: fetch("https://mockapi.io/operator", { ... })

    console.log("Yangi operator:", form);
    setXabar("✅ Operator muvaffaqiyatli qo‘shildi!");

    // formani tozalash
    setForm({
      ism: "",
      familiya: "",
      login: "",
      parol: "",
      parolTasdiq: "",
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Yangi Operator Qo‘shish</h2>
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
          name="ism"
          placeholder="Ism"
          value={form.ism}
          onChange={handleChange}
        />
        <Input
          name="familiya"
          placeholder="Familiya"
          value={form.familiya}
          onChange={handleChange}
        />
        <Input
          name="login"
          placeholder="Login"
          value={form.login}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="parol"
          placeholder="Parol"
          value={form.parol}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="parolTasdiq"
          placeholder="Parolni tasdiqlang"
          value={form.parolTasdiq}
          onChange={handleChange}
        />
        <Button type="submit">Qo‘shish</Button>
      </form>
    </div>
  );
}
