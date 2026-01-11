"use client";
import Header from "./Header";
import Sidebar from "./Sidebar";
import InvoicePanel from "@/components/invoice/InvoicePanel";
import { useAuth } from "@/store/AuthContext";
import LoginScreen from "@/components/auth/LoginScreen";
import LoaderScreen from "@/components/common/LoaderScreen";
import Toast from "@/components/common/Toast";

export default function MainLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoaderScreen />;
  if (!user) return <LoginScreen />;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content (Route renders here) */}
        <main className="flex-1 bg-gray-100 p-4 overflow-auto relative">
          {children}
        </main>

        {/* Cart / Invoice */}
        <InvoicePanel />
      </div>

      {/* Toast notifications */}
      <Toast />
    </div>
  );
}
