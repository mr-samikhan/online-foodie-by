"use client";
import { createContext, useContext, useState } from "react";
import { generateInvoiceNumber } from "@/utils/invoiceNumber";
import { useConfirmStore } from "./useConfirmStore";

const InvoiceContext = createContext();

export function InvoiceProvider({ children }) {
  const [items, setItems] = useState([]);
  const { showConfirm } = useConfirmStore();

  // 🔹 NEW FIELDS
  const [taxPercent, setTaxPercent] = useState(10); // default 10%
  const [discount, setDiscount] = useState(0); // Rs
  const [serviceCharge, setServiceCharge] = useState(0); // Rs

  const addItem = (item) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.name === item.name);
      if (exists) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const increaseQty = (name) => {
    setItems((prev) =>
      prev.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i))
    );
  };

  const decreaseQty = (name) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.name === name ? { ...i, qty: Math.max(1, i.qty - 1) } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const clearInvoice = () => {
    setItems([]);
    setDiscount(0);
    setServiceCharge(0);
  };

  // 🔹 CALCULATIONS
  const subTotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const taxAmount = (subTotal * taxPercent) / 100;

  const grandTotal = subTotal + taxAmount + serviceCharge - discount;

  const completeOrder = () => {
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      invoiceNo: generateInvoiceNumber(),
      items,
      subTotal,
      taxPercent,
      taxAmount,
      discount,
      serviceCharge,
      total: grandTotal,
      cashier: "Admin",
    };

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify([...orders, order]));

    clearInvoice();
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

        // 🔹 expose new fields
        subTotal,
        taxPercent,
        setTaxPercent,
        discount,
        setDiscount,
        serviceCharge,
        setServiceCharge,
        taxAmount,
        grandTotal,
        showConfirm,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export const useInvoice = () => useContext(InvoiceContext);
