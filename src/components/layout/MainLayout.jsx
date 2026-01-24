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
        <main
          className="flex-1  md:p-4 overflow-auto relative"
          style={{
            backgroundImage: "url('/login-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay for better contrast */}
          <div className="hidden md:block absolute inset-0 bg-black/10 pointer-events-none"></div>

          {/* Actual content */}
          <div className="relative z-10">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
