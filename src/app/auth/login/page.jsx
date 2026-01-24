"use client";
import { useState } from "react";
import { useAuth } from "@/store/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(username, password);
    if (result?.success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Login form */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-80 bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-8 flex flex-col gap-4 mx-auto my-auto top-1/2 transform -translate-y-1/2"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          🍽️ My Restaurant
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="border p-2 rounded w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin(e);
          }}
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
