"use client";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function MainLayout({ children }) {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Desktop only) */}
        <div className="hidden md:block w-60 border-r bg-white">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-3 md:p-4 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
