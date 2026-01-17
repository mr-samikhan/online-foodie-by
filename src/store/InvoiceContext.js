"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useToastStore } from "./ToastStore";

const InvoiceContext = createContext();

export function InvoiceProvider({ children }) {
  const { showToast } = useToastStore();
  const [items, setItems] = useState([]);

  // Load invoice items from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("invoice");
    if (stored) setItems(JSON.parse(stored));
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("invoice", JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const increaseQty = (name) =>
    setItems((prev) =>
      prev.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i))
    );

  const decreaseQty = (name) =>
    setItems((prev) =>
      prev
        .map((i) => (i.name === name ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );

  const clearInvoice = () => {
    showToast("Invoice cleared", "info");
    setItems([]);
  };

  const completeOrder = () => {
    if (items.length === 0) return;

    const user = JSON.parse(localStorage.getItem("user")); // Client-side safe

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.unshift({
      id: Date.now(),
      items,
      total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
      date: new Date().toISOString(),
      cashier: user?.username || "Unknown",
      role: user?.role || "Staff",
    });

    localStorage.setItem("orders", JSON.stringify(orders));
    showToast("Order completed successfully", "success");
    setItems([]);
    localStorage.removeItem("invoice");
  };

  return (
    <InvoiceContext.Provider
      value={{
        items,
        addItem,
        increaseQty,
        decreaseQty,
        clearInvoice,
        completeOrder,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export const useInvoice = () => useContext(InvoiceContext);
