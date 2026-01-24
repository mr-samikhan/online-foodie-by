"use client";
import { useMenu } from "@/hooks/useMenu";
import { useState } from "react";
import { useToastStore } from "@/store/ToastStore";
import { useConfirmStore } from "@/store/useConfirmStore";

export default function MenuEditor() {
  const { menu, addCategory, addItem, deleteCategory, deleteItem } = useMenu();
  const { showToast } = useToastStore();
  const { showConfirm } = useConfirmStore();

  const [modal, setModal] = useState({
    open: false,
    type: "",
    category: null,
    itemName: null,
    price: "",
  });
  const [catInput, setCatInput] = useState("");
  const [itemInput, setItemInput] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  /* ---------------- OPEN MODAL ---------------- */
  const openCategoryModal = (existing = null) => {
    setCatInput(existing || "");
    setModal({ open: true, type: "category" });
  };

  const openItemModal = (category, existingItem = null, price = "") => {
    setItemInput(existingItem || "");
    setItemPrice(price || "");
    setModal({ open: true, type: "item", category });
  };

  const closeModal = () => {
    setModal({ open: false, type: "" });
    setCatInput("");
    setItemInput("");
    setItemPrice("");
  };

  /* ---------------- CATEGORY ACTIONS ---------------- */
  const handleAddCategory = () => {
    if (!catInput) return showToast("Enter category name", "error");
    addCategory(catInput);
    showToast(`Category "${catInput}" added!`, "success");
    closeModal();
  };

  const handleDeleteCategory = (category) => {
    deleteCategory(category);
    showToast(`Category "${category}" deleted`, "info");
  };

  /* ---------------- ITEM ACTIONS ---------------- */
  const handleAddItem = () => {
    if (!modal.category || !itemInput || !itemPrice)
      return showToast("Fill all fields to add item", "error");

    addItem(modal.category, itemInput, Number(itemPrice));
    showToast(`Item "${itemInput}" added to "${modal.category}"`, "success");
    closeModal();
  };

  const handleDeleteItem = (category, itemName) => {
    deleteItem(category, itemName);
    showToast(`Item "${itemName}" deleted from "${category}"`, "info");
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-bold mb-4">Menu Settings</h2>

      {/* Buttons to open modals */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => openCategoryModal()}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
        <button
          onClick={() => {
            if (!Object.keys(menu).length)
              return showToast("Add a category first", "error");
            openItemModal(Object.keys(menu)[0]);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </div>

      {/* Category List */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 flex-wrap">
        {Object.keys(menu).map((c) => (
          <div
            key={c}
            className="border p-3 rounded flex flex-col w-full sm:w-1/3"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{c}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => openItemModal(c)}
                  className="bg-green-500 text-white px-2 rounded"
                >
                  + Item
                </button>
                <button
                  onClick={() =>
                    showConfirm({
                      title: "Delete Category",
                      message: "Are you sure to delete this category?",
                      onConfirm: () => handleDeleteCategory(c),
                    })
                  }
                  className="text-red-600 font-bold px-2 rounded hover:bg-red-100"
                >
                  X
                </button>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-1">
              {Object.entries(menu[c]).map(([iName, price]) => (
                <div
                  key={iName}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  <span>
                    {iName} - Rs {price}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openItemModal(c, iName, price)}
                      className="bg-yellow-500 text-white px-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        showConfirm({
                          title: "Delete Item",
                          message: "Are you sure to delete this item?",
                          onConfirm: () => handleDeleteItem(c, iName),
                        })
                      }
                      className="text-red-600 px-2 rounded hover:bg-red-100"
                    >
                      x
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- MODAL ---------------- */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-96 relative">
            {modal.type === "category" ? (
              <>
                <h3 className="text-lg font-bold mb-4">Add Category</h3>
                <input
                  placeholder="Category Name"
                  className="border p-2 w-full mb-4"
                  value={catInput}
                  onChange={(e) => setCatInput(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={closeModal}
                    className="bg-gray-400 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      showConfirm({
                        title: "Add Category",
                        message: "Are you sure you want to add this category?",
                        onConfirm: handleAddCategory,
                      })
                    }
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    Add
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-4">
                  {itemInput ? "Update Item" : "Add Item"} in "{modal.category}"
                </h3>
                <input
                  placeholder="Item Name"
                  className="border p-2 w-full mb-2"
                  value={itemInput}
                  onChange={(e) => setItemInput(e.target.value)}
                />
                <input
                  placeholder="Price"
                  type="number"
                  className="border p-2 w-full mb-4"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={closeModal}
                    className="bg-gray-400 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      showConfirm({
                        title: "Add/Update Item",
                        message: "Are you sure?",
                        onConfirm: handleAddItem,
                      })
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    {itemInput ? "Update" : "Add"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
