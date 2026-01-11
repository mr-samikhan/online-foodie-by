"use client";
import { useState } from "react";
import { useAuth } from "@/store/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  if (!user) return null; // safety

  return (
    <header className="h-14 bg-black text-white flex justify-between items-center px-4 relative">
      {/* Restaurant Name */}
      <h1 className="text-lg font-semibold flex items-center gap-2">
        🍽️ My Restaurant
      </h1>

      {/* User Info */}
      <div className="relative">
        <button
          onClick={() => setShowModal((prev) => !prev)}
          className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded hover:bg-gray-700 transition"
        >
          <span className="font-medium">{user.username}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Modal */}
        {showModal && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
            <div className="p-4 border-b">
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm text-gray-600">{user.role}</p>
            </div>

            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
