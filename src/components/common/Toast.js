"use client";
import { Transition } from "@headlessui/react";
import { useToastStore } from "@/store/ToastStore";

export default function Toast() {
  const { toast, hideToast } = useToastStore();

  return (
    <Transition
      show={!!toast}
      as="div" // ensures a single DOM element
      className="fixed top-5 right-5 z-50"
      enter="transition transform duration-300"
      enterFrom="-translate-y-5 opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transition transform duration-300"
      leaveFrom="translate-y-0 opacity-100"
      leaveTo="-translate-y-5 opacity-0"
    >
      {toast && (
        <div
          className={`px-4 py-2 rounded shadow-lg text-white font-semibold flex items-center gap-3
          ${
            toast.type === "success"
              ? "bg-green-500"
              : toast.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          <span>{toast.message}</span>
          <button
            className="ml-auto text-white font-bold text-xl"
            onClick={hideToast}
          >
            ×
          </button>
        </div>
      )}
    </Transition>
  );
}
