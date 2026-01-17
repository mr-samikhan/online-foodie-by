"use client";
import { useInvoice } from "@/store/InvoiceContext";

export default function InvoicePanel() {
  const { items, increaseQty, decreaseQty, clearInvoice, completeOrder } =
    useInvoice();

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <aside
      className="
        bg-white p-4 flex flex-col
        h-auto md:h-full
        max-h-[50vh] md:max-h-screen
        md:w-[300px] w-full
        shadow-md rounded-lg
      "
    >
      {/* Header */}
      <h2 className="font-bold mb-3 text-lg">🧾 Cart</h2>

      {/* Items list scrollable */}
      <div
        className={`
          flex-1 overflow-y-auto pr-1
          ${items.length > 2 ? "max-h-[40vh] md:max-h-[calc(100vh-2rem)]" : ""}
        `}
      >
        {items.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-2">
            No items added
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.name}
            className="flex justify-between items-center p-2 bg-gray-50 rounded mb-2"
          >
            <div>
              <p className="font-semibold text-sm">{item.name}</p>
              <p className="text-xs">Rs {item.price}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => decreaseQty(item.name)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>

              <span className="text-sm">{item.qty}</span>

              <button
                onClick={() => increaseQty(item.name)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t pt-3 mt-3 flex flex-col gap-2">
        <p className="font-bold text-gray-800">Total: Rs {total}</p>

        <button
          onClick={completeOrder}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Checkout
        </button>

        <button
          onClick={() => window.print()}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Print Receipt
        </button>

        <button
          onClick={clearInvoice}
          className="w-full bg-gray-300 py-2 rounded"
        >
          Clear
        </button>
      </div>
    </aside>
  );
}
