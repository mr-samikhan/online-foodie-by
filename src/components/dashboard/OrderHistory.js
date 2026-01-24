"use client";
import { useConfirmStore } from "@/store/useConfirmStore";
import { useEffect, useState } from "react";

export default function OrderHistory() {
  const { showConfirm } = useConfirmStore();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // original
  const [draftOrder, setDraftOrder] = useState(null); // editable copy

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  /* ---------------- LOAD ORDERS ---------------- */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(saved);
  }, []);

  const saveOrders = (updated) => {
    localStorage.setItem("orders", JSON.stringify(updated));
    setOrders(updated);
  };

  /* ---------------- CALCULATE ORDER ---------------- */
  const recalculateOrder = (order) => {
    const subTotal = order.items.reduce((sum, i) => sum + i.qty * i.price, 0);

    const taxPercent = order.taxPercent ?? 10;
    const discount = order.discount ?? 0;
    const serviceCharge = order.serviceCharge ?? 0;

    const taxAmount = (subTotal * taxPercent) / 100;
    const total = subTotal + taxAmount + serviceCharge - discount;

    return {
      ...order,
      subTotal,
      taxPercent,
      taxAmount,
      discount,
      serviceCharge,
      total,
    };
  };

  /* ---------------- DRAFT EDITING ---------------- */
  const updateItemQty = (itemName, qty) => {
    if (!draftOrder) return;

    const updatedItems = draftOrder.items.map((i) =>
      i.name === itemName ? { ...i, qty } : i
    );

    setDraftOrder(recalculateOrder({ ...draftOrder, items: updatedItems }));
  };

  const deleteItem = (itemName) => {
    if (!draftOrder) return;

    const updatedItems = draftOrder.items.filter((i) => i.name !== itemName);

    setDraftOrder(recalculateOrder({ ...draftOrder, items: updatedItems }));
  };

  const updateCharges = (field, value) => {
    if (!draftOrder) return;

    setDraftOrder(
      recalculateOrder({
        ...draftOrder,
        [field]: Number(value),
      })
    );
  };

  /* ---------------- SAVE UPDATE ---------------- */
  const updateInvoice = () => {
    const updatedOrders = orders.map((o) =>
      o.id === draftOrder.id ? draftOrder : o
    );

    saveOrders(updatedOrders);
    setSelectedOrder(draftOrder);
    // alert("Invoice updated successfully");
  };

  /* ---------------- DELETE ORDER ---------------- */
  const deleteOrder = (id) => {
    // if (!confirm("Delete this order?")) return;

    const updated = orders.filter((o) => o.id !== id);
    saveOrders(updated);

    if (draftOrder?.id === id) {
      setDraftOrder(null);
      setSelectedOrder(null);
    }
  };

  /* ---------------- FILTER ---------------- */
  const filteredOrders = orders
    .filter((o) => {
      const d = new Date(o.date);
      if (startDate && d < new Date(startDate)) return false;
      if (endDate && d > new Date(endDate)) return false;
      return true;
    })
    .filter((o) => {
      const t = searchTerm.toLowerCase();
      return (
        o.cashier.toLowerCase().includes(t) ||
        o.items.some((i) => i.name.toLowerCase().includes(t))
      );
    });

  /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-col md:flex-row h-screen gap-4 p-4 bg-slate-50">
      {/* ORDER LIST */}
      <div className="w-full md:w-1/2 border rounded-lg flex flex-col">
        <div className="p-3 border-b space-y-2">
          <h2 className="text-xl font-bold">📋 Order History</h2>

          <div className="flex gap-2 flex-wrap">
            <input
              type="date"
              className="border p-2 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="border p-2 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <input
              type="text"
              className="border p-2 rounded flex-1"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-3 border rounded cursor-pointer flex justify-between"
              onClick={() => {
                const recalculated = recalculateOrder(order);
                setSelectedOrder(recalculated);
                setDraftOrder(recalculated);
              }}
            >
              <div>
                <p className="font-semibold">Rs {order.total}</p>
                <p className="text-sm font-semibold">{order.invoiceNo}</p>

                <p className="text-xs">
                  {new Date(order.date).toLocaleString()}
                </p>
                <p className="text-sm">{order.cashier}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showConfirm({
                    title: "Delete",
                    message: "Are you sure to delete this Order?",
                    onConfirm: () => deleteOrder(order.id),
                  });
                }}
                className="text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RECEIPT */}
      <div className="w-full md:w-1/2 bg-white border rounded-lg flex flex-col print-area">
        {draftOrder ? (
          <>
            <div className="text-center">
              <h3 className="font-bold text-lg">🍽️ My Restaurant</h3>
              <p className="text-xs">Invoice: {draftOrder.invoiceNo}</p>
              <p className="text-xs">
                {new Date(draftOrder.date).toLocaleString()}
              </p>
              <p className="text-xs">Cashier: {draftOrder.cashier}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {draftOrder.items.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between border-b pb-1"
                >
                  <div className="flex gap-2 items-center">
                    <span>{item.name}</span>
                    <button
                      onClick={() =>
                        updateItemQty(item.name, Math.max(1, item.qty - 1))
                      }
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => updateItemQty(item.name, item.qty + 1)}
                    >
                      +
                    </button>
                    <button
                      onClick={() => deleteItem(item.name)}
                      className="text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                  <span>Rs {item.qty * item.price}</span>
                </div>
              ))}
            </div>

            <div className="p-4 border-t space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span>Rs {draftOrder.subTotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>Rs {draftOrder.taxAmount}</span>
              </div>

              <div className="flex justify-between">
                <span>Service Charge</span>
                <input
                  type="number"
                  className="border w-24 text-right"
                  value={draftOrder.serviceCharge}
                  onChange={(e) =>
                    updateCharges("serviceCharge", e.target.value)
                  }
                />
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <input
                  type="number"
                  className="border w-24 text-right"
                  value={draftOrder.discount}
                  onChange={(e) => updateCharges("discount", e.target.value)}
                />
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>Rs {draftOrder.total}</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="p-4 flex gap-2 no-print">
              <button
                onClick={() => {
                  showConfirm({
                    title: "Update Invoice",
                    message: "Are you sure you want to update this Invoice?",
                    onConfirm: () => updateInvoice(),
                    type: "info",
                  });
                }}
                className="bg-green-600 text-white px-4 py-2 rounded w-full"
              >
                ✅ Update Invoice
              </button>
              <button
                onClick={() => window.print()}
                className="bg-black text-white px-4 py-2 rounded w-full"
              >
                🖨️ Print
              </button>
            </div>
          </>
        ) : (
          <p className="text-center mt-20 text-gray-400">
            Select an order to view
          </p>
        )}
      </div>
    </div>
  );
}
