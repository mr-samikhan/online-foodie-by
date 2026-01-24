"use client";
import { useConfirmStore } from "@/store/useConfirmStore";

export default function ConfirmDialog() {
  const {
    isOpen,
    title,
    message,
    onConfirm,
    closeConfirm,
    type = "delete",
  } = useConfirmStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-[90%] max-w-sm p-4 shadow-lg">
        <h2 className="font-bold text-lg mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-4">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={closeConfirm}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            No
          </button>

          <button
            onClick={() => {
              onConfirm?.();
              closeConfirm();
            }}
            className={`px-4 py-2 ${
              type === "delete" ? "bg-red-600" : "bg-blue-600"
            } text-white rounded`}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
