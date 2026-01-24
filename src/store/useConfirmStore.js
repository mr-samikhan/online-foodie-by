import { create } from "zustand";

export const useConfirmStore = create((set) => ({
  isOpen: false,
  title: "Are you sure?",
  message: "",
  onConfirm: null,
  type: "delete",

  showConfirm: ({ title, message, onConfirm, type = "delete" }) =>
    set({
      isOpen: true,
      title,
      message,
      onConfirm,
      type,
    }),

  closeConfirm: () =>
    set({
      isOpen: false,
      onConfirm: null,
    }),
}));
