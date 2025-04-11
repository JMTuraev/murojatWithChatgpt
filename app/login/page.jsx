"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authenticate } from "@/lib/auth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    const user = authenticate(login, password);
    if (user) {
      router.push(`/dashboard/${user.role}`);
    } else {
      setError("Login yoki parol noto‘g‘ri!");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Kirish</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <Input
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Input
            type="password"
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="text-center">
          <Button type="submit">Kirish</Button>
        </div>
      </form>
    </div>
  );
}
