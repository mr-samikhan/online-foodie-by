"use client";
import { useState } from "react";
import { useAuth } from "@/store/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    const result = login(username, password);
    if (result?.success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow w-96">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <input
        placeholder="Username"
        className="border p-2 mb-2 w-full"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        className="border p-2 mb-4 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-black text-white px-4 py-2 rounded w-full"
      >
        Login
      </button>
    </div>
  );
}
