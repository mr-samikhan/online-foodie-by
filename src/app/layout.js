// app/layout.jsx
"use client";
import { AuthProvider } from "@/store/AuthContext";
import { InvoiceProvider } from "@/store/InvoiceContext";
import Toast from "@/components/common/Toast";
import "@/styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <InvoiceProvider>
            {children}
            <Toast /> {/* Toast works globally */}
          </InvoiceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
