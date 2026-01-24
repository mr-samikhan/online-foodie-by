import { useInvoice } from "@/store/InvoiceContext";

export default function InvoicePanel() {
  const {
    items,
    increaseQty,
    decreaseQty,
    clearInvoice,
    completeOrder,
    subTotal,
    taxPercent,
    setTaxPercent,
    taxAmount,
    discount,
    setDiscount,
    serviceCharge,
    setServiceCharge,
    grandTotal,
    showConfirm,
  } = useInvoice();

  return (
    <aside className="bg-white p-4 h-full flex flex-col">
      <h2 className="font-bold mb-2 text-lg">🧾 Cart</h2>

      {/* Items */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {items.map((item) => (
          <div key={item.name} className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold">{item.name}</p>
              <p className="text-xs">Rs {item.price}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => decreaseQty(item.name)}
                className="px-2 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{item.qty}</span>
              <button
                onClick={() => increaseQty(item.name)}
                className="px-2 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Charges */}
      <div className="border-t pt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Sub Total</span>
          <span>Rs {subTotal}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Tax (%)</span>
          <input
            type="number"
            className="border w-20 p-1 rounded text-right"
            value={taxPercent}
            onChange={(e) => setTaxPercent(+e.target.value)}
          />
        </div>

        <div className="flex justify-between">
          <span>Tax Amount</span>
          <span>Rs {taxAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Service Charges</span>
          <input
            type="number"
            className="border w-24 p-1 rounded text-right"
            value={serviceCharge}
            onChange={(e) => setServiceCharge(+e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center">
          <span>Discount</span>
          <input
            type="number"
            className="border w-24 p-1 rounded text-right"
            value={discount}
            onChange={(e) => setDiscount(+e.target.value)}
          />
        </div>

        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span className="text-green-600">Rs {grandTotal.toFixed(2)}</span>
        </div>

        <button
          onClick={() =>
            showConfirm({
              title: "Invoice Checkout",
              message: "Are you sure to checkout?",
              onConfirm: () => completeOrder(),
              type: "info",
            })
          }
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Checkout
        </button>

        <button
          onClick={() =>
            showConfirm({
              title: "Clear Invoice",
              message: "Are you sure to clear Invoice?",
              onConfirm: () => clearInvoice(),
            })
          }
          // onClick={clearInvoice}
          className="w-full bg-gray-300 py-2 rounded"
        >
          Clear
        </button>
      </div>
    </aside>
  );
}
