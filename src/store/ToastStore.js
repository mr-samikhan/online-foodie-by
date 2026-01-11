"use client";
import { create } from "zustand";

export const useToastStore = create((set) => ({
  toast: null, // { message: "", type: "success" | "error" | "info" }

  showToast: (message, type = "info") => {
    set({ toast: { message, type } });

    // Auto-hide after 3 seconds
    setTimeout(() => set({ toast: null }), 3000);
  },

  hideToast: () => set({ toast: null }),
}));
