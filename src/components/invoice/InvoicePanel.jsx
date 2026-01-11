import { useInvoice } from "@/store/InvoiceContext";

export default function InvoicePanel() {
  const { items, increaseQty, decreaseQty, clearInvoice, completeOrder } =
    useInvoice();

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const printReceipt = () => {
    window.print();
  };

  return (
    <aside className="w-[300px] bg-white border-l p-4">
      <h2 className="font-bold mb-3">🧾 Cart</h2>

      <div className="receipt">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex justify-between items-center mb-2"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm">Rs {item.price}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => decreaseQty(item.name)}
                className="px-2 bg-gray-200"
              >
                -
              </button>

              <span>{item.qty}</span>

              <button
                onClick={() => increaseQty(item.name)}
                className="px-2 bg-gray-200"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <hr className="my-3" />

      <p className="font-bold">Total: Rs {total}</p>

      <button
        className="mt-4 w-full bg-green-600 text-white py-2"
        onClick={completeOrder}
      >
        Checkout
      </button>

      <button
        onClick={printReceipt}
        className="mt-2 w-full bg-blue-600 text-white py-2"
      >
        Print Receipt
      </button>

      <button onClick={clearInvoice} className="mt-2 w-full bg-gray-300 py-2">
        Clear
      </button>
    </aside>
  );
}
