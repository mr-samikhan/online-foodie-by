"use client";
import { useState, useEffect } from "react";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Load orders from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(saved);
  }, []);

  const saveOrders = (updated) => {
    localStorage.setItem("orders", JSON.stringify(updated));
    setOrders(updated);
  };

  const deleteOrder = (id) => {
    if (!confirm("Delete this order?")) return;
    const updated = orders.filter((o) => o.id !== id);
    saveOrders(updated);
    if (selectedOrder?.id === id) setSelectedOrder(null);
  };

  const updateItemQty = (itemName, qty) => {
    if (!selectedOrder) return;

    const updatedItems = selectedOrder.items.map((i) =>
      i.name === itemName ? { ...i, qty } : i
    );

    const updatedTotal = updatedItems.reduce(
      (sum, i) => sum + i.qty * i.price,
      0
    );

    const updatedOrder = {
      ...selectedOrder,
      items: updatedItems,
      total: updatedTotal,
    };

    const updatedOrders = orders.map((o) =>
      o.id === selectedOrder.id ? updatedOrder : o
    );

    saveOrders(updatedOrders);
    setSelectedOrder(updatedOrder);
  };

  const deleteItem = (itemName) => {
    if (!selectedOrder) return;

    const updatedItems = selectedOrder.items.filter((i) => i.name !== itemName);

    const updatedTotal = updatedItems.reduce(
      (sum, i) => sum + i.qty * i.price,
      0
    );

    const updatedOrder = {
      ...selectedOrder,
      items: updatedItems,
      total: updatedTotal,
    };

    const updatedOrders = orders.map((o) =>
      o.id === selectedOrder.id ? updatedOrder : o
    );

    saveOrders(updatedOrders);
    setSelectedOrder(updatedOrder);
  };

  // Filter orders by date range
  const dateFilteredOrders = orders.filter((o) => {
    const orderDate = new Date(o.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) return orderDate >= start && orderDate <= end;
    if (start) return orderDate >= start;
    if (end) return orderDate <= end;
    return true;
  });

  // Filter further by search term (cashier name or item name)
  const filteredOrders = dateFilteredOrders.filter((o) => {
    const term = searchTerm.toLowerCase();
    return (
      o.cashier.toLowerCase().includes(term) ||
      o.items.some((i) => i.name.toLowerCase().includes(term))
    );
  });

  const totalFiltered = filteredOrders.reduce((sum, o) => sum + o.total, 0);

  const clearFilter = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-1rem)] gap-4 p-2 md:p-4">
      {/* Order List */}
      <div className="w-full md:w-1/2 flex flex-col border rounded-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 border-b flex-wrap">
          <h2 className="text-xl font-bold">📋 Order History</h2>

          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="date"
              className="border rounded-lg p-2 text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <input
              type="date"
              className="border rounded-lg p-2 text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
            <input
              type="text"
              className="border rounded-lg p-2 text-sm"
              placeholder="Search by cashier or item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {(startDate || endDate || searchTerm) && (
              <button
                onClick={clearFilter}
                className="bg-gray-300 text-black px-3 py-1 rounded text-sm"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        <p className="font-semibold p-2">
          Total: <span className="text-green-600">Rs {totalFiltered}</span>
        </p>

        {/* Scrollable orders */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredOrders.length === 0 && (
            <p className="text-gray-400 text-center">No orders found.</p>
          )}

          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-3 bg-white rounded-lg shadow flex justify-between items-center border-l-4 border-green-600 cursor-pointer"
            >
              <div onClick={() => setSelectedOrder(order)} className="flex-1">
                <p className="font-semibold">Rs {order.total}</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.date).toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-600">{order.cashier}</p>
              </div>

              <button
                onClick={() => deleteOrder(order.id)}
                className="text-red-600 font-bold text-sm ml-2"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Receipt */}
      <div className="w-full md:w-1/2 bg-white rounded-lg shadow flex flex-col overflow-hidden">
        {selectedOrder ? (
          <>
            <div className="p-4 border-b text-center">
              <h3 className="text-lg font-bold">🍽️ My Restaurant</h3>
              <p className="text-xs text-gray-500">
                {new Date(selectedOrder.date).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                Cashier: {selectedOrder.cashier}
              </p>
            </div>

            {/* Scrollable items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {selectedOrder.items.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between items-center border-b pb-1 flex-wrap gap-2"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm">{item.name}</span>
                    <button
                      onClick={() =>
                        updateItemQty(item.name, Math.max(1, item.qty - 1))
                      }
                      className="px-2 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => updateItemQty(item.name, item.qty + 1)}
                      className="px-2 bg-gray-200 rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => deleteItem(item.name)}
                      className="px-2 bg-red-600 text-white rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>

                  <span className="font-semibold text-sm">
                    Rs {item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex justify-between font-bold">
              <span>Total</span>
              <span className="text-green-600">Rs {selectedOrder.total}</span>
            </div>

            <button
              onClick={() => window.print()}
              className="bg-black text-white py-2 m-4 rounded-lg"
            >
              🖨️ Reprint Receipt
            </button>
          </>
        ) : (
          <p className="text-gray-400 text-center mt-10">
            Select an order to view details
          </p>
        )}
      </div>
    </div>
  );
}
