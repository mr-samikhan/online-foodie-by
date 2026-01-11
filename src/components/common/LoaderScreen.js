"use client";

export default function LoaderScreen() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">🍽️ My Restaurant</h1>

      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

      <p className="mt-4 text-sm">Loading POS...</p>
    </div>
  );
}
