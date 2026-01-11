// app/components/auth/AuthLayout.jsx
"use client";

export default function AuthLayout({ children }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {children}
    </div>
  );
}
