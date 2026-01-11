// "use client";
// import { useState, useEffect } from "react";

// export default function OrderHistory() {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [filterDate, setFilterDate] = useState("");

//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem("orders")) || [];
//     setOrders(saved);
//   }, []);

//   const filteredOrders = filterDate
//     ? orders.filter((o) => o.date.startsWith(filterDate))
//     : orders;

//   const dailyTotal = filteredOrders.reduce((sum, o) => sum + o.total, 0);

//   return (
//     <div className="flex gap-4">
//       {/* Left: Order List */}
//       <div className="w-1/2">
//         <h2 className="text-xl font-bold mb-3">Order History</h2>

//         <input
//           type="date"
//           className="border p-2 mb-3 w-full"
//           onChange={(e) => setFilterDate(e.target.value)}
//         />

//         <p className="font-semibold mb-2">Daily Total: Rs {dailyTotal}</p>

//         <div className="space-y-2">
//           {filteredOrders.map((order, i) => (
//             <div
//               key={i}
//               className="bg-white p-3 rounded shadow cursor-pointer hover:bg-gray-50"
//               onClick={() => setSelectedOrder(order)}
//             >
//               <p className="font-semibold">Rs {order.total}</p>
//               <p className="text-sm text-gray-500">
//                 {new Date(order.date).toLocaleString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right: Receipt */}
//       <div className="w-1/2 bg-white p-4 rounded shadow receipt">
//         {selectedOrder ? (
//           <>
//             <h3 className="text-center font-bold text-lg">Restaurant Name</h3>
//             <p className="text-center text-sm mb-3">
//               {new Date(selectedOrder.date).toLocaleString()}
//             </p>
//             <p className="text-center text-sm">
//               Cashier: {selectedOrder.cashier}
//             </p>

//             {selectedOrder.items.map((item, i) => (
//               <div key={i} className="flex justify-between text-sm">
//                 <span>
//                   {item.name} x {item.qty}
//                 </span>
//                 <span>Rs {item.price * item.qty}</span>
//               </div>
//             ))}

//             <hr className="my-2" />

//             <p className="font-bold text-right">
//               Total: Rs {selectedOrder.total}
//             </p>

//             <button
//               onClick={() => window.print()}
//               className="mt-4 w-full bg-black text-white py-2 rounded"
//             >
//               Reprint Receipt
//             </button>
//           </>
//         ) : (
//           <p>Select an order to view details</p>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterDate, setFilterDate] = useState("");

  // Load orders from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(saved);
  }, []);

  // Helper to save orders
  const saveOrders = (updated) => {
    localStorage.setItem("orders", JSON.stringify(updated));
    setOrders(updated);
  };

  // Delete entire order
  const deleteOrder = (id) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    const updated = orders.filter((o) => o.id !== id);
    saveOrders(updated);
    if (selectedOrder?.id === id) setSelectedOrder(null);
  };

  // Update quantity of an item
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

  // Delete an item from order
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

  const filteredOrders = filterDate
    ? orders.filter((o) => o.date.startsWith(filterDate))
    : orders;

  const dailyTotal = filteredOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="flex h-[calc(100vh-1rem)] gap-6 p-4">
      {/* Left: Order List */}
      <div className="w-1/2 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">📋 Order History</h2>
          <input
            type="date"
            className="border rounded-lg p-2 text-sm"
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        <p className="text-gray-700 font-semibold mb-3">
          Daily Total: <span className="text-green-600">Rs {dailyTotal}</span>
        </p>

        {/* Scrollable order list */}
        <div className="overflow-y-auto flex-1 space-y-3">
          {filteredOrders.length === 0 && (
            <p className="text-gray-400">No orders for this date.</p>
          )}

          {filteredOrders.map((order, i) => (
            <div
              key={i}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer flex flex-col gap-1 border-l-4 border-green-600"
            >
              <div className="flex justify-between items-center">
                <div onClick={() => setSelectedOrder(order)} className="flex-1">
                  <p className="font-semibold text-gray-800">
                    Rs {order.total}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.date).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-gray-600">{order.cashier}</p>
                </div>

                {/* Delete Order Button */}
                <button
                  onClick={() => deleteOrder(order.id)}
                  className="ml-2 text-red-600 font-bold hover:text-red-800 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Receipt */}
      <div className="w-1/2 h-full bg-white rounded-2xl shadow p-6 overflow-y-auto receipt">
        {selectedOrder ? (
          <div className="flex flex-col gap-3">
            {/* Header */}
            <div className="text-center border-b pb-2 mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                🍽️ My Restaurant
              </h3>
              <p className="text-sm text-gray-500">
                {new Date(selectedOrder.date).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Cashier: {selectedOrder.cashier}
              </p>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {selectedOrder.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 text-sm">{item.name}</span>

                    {/* Quantity buttons */}
                    <button
                      onClick={() =>
                        updateItemQty(item.name, Math.max(1, item.qty - 1))
                      }
                      className="px-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => updateItemQty(item.name, item.qty + 1)}
                      className="px-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      +
                    </button>

                    {/* Delete Item */}
                    <button
                      onClick={() => deleteItem(item.name)}
                      className="ml-2 px-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                  <span className="font-semibold text-gray-800">
                    Rs {item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 flex justify-between items-center border-t pt-2">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-bold text-green-600 text-lg">
                Rs {selectedOrder.total}
              </span>
            </div>

            {/* Print Button */}
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => window.print()}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
              >
                🖨️ Reprint Receipt
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-20">
            Select an order to view details
          </p>
        )}
      </div>
    </div>
  );
}
