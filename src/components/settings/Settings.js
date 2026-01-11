"use client";
import { useAuth } from "@/store/AuthContext";
import UserManager from "./UserManager";
import MenuEditor from "./MenuEditor";

export default function Settings() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <p className="text-red-600">Access Denied</p>;
  }

  return (
    <>
      <MenuEditor />
      <UserManager />
    </>
  );
}
