// app/dashboard/layout.jsx
"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/store/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoaderScreen from "@/components/common/LoaderScreen";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading]);

  if (loading || !user) return <LoaderScreen />;

  return <MainLayout>{children}</MainLayout>;
}
