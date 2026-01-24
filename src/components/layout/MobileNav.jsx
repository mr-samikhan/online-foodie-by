"use client";
import Link from "next/link";

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2 z-50 md:hidden">
      <Link href="/dashboard">🏠</Link>
      <Link href="/dashboard/services">🛒</Link>
      <Link href="/dashboard/order-history">📜</Link>
      <Link href="/dashboard/settings">⚙️</Link>
    </nav>
  );
}
