"use client";
import { useMenu } from "@/hooks/useMenu";
import { useState } from "react";
import { useToastStore } from "@/store/ToastStore";

export default function MenuEditor() {
  const { menu, addCategory, addItem, deleteCategory, deleteItem } = useMenu();
  const [cat, setCat] = useState("");
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const { showToast } = useToastStore();

  const handleAddCategory = () => {
    if (!cat) return showToast("Enter category name", "error");
    addCategory(cat);
    showToast(`Category "${cat}" added!`, "success");
    setCat("");
  };

  const handleDeleteCategory = (category) => {
    if (!confirm(`Delete category "${category}"?`)) return;
    deleteCategory(category);
    showToast(`Category "${category}" deleted`, "info");
    if (selectedCat === category) setSelectedCat("");
  };

  const handleAddItem = () => {
    if (!selectedCat || !item || !price)
      return showToast("Fill all fields to add item", "error");
    addItem(selectedCat, item, Number(price));
    showToast(`Item "${item}" added to "${selectedCat}"`, "success");
    setItem("");
    setPrice("");
  };

  const handleDeleteItem = (category, itemName) => {
    if (!confirm(`Delete item "${itemName}" from "${category}"?`)) return;
    deleteItem(category, itemName);
    showToast(`Item "${itemName}" deleted from "${category}"`, "info");
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-bold mb-4">Menu Settings</h2>

      {/* Add Category */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <input
          placeholder="New Category"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="border p-2 flex-1"
        />
        <button
          onClick={handleAddCategory}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </div>

      {/* Add Item */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap mb-4">
        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="border p-2"
        >
          <option value="">Select Category</option>
          {Object.keys(menu).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          placeholder="Item Name"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          className="border p-2 flex-1"
        />

        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 w-24"
        />

        <button
          onClick={handleAddItem}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </div>

      {/* Category List */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 flex-wrap ">
        {Object.keys(menu).map((c) => (
          <div
            key={c}
            className={`border p-3 rounded flex flex-col w-full sm:w-1/3`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{c}</span>
              <button
                onClick={() => handleDeleteCategory(c)}
                className="text-red-600 font-bold px-2 rounded hover:bg-red-100"
              >
                Delete
              </button>
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
                  <button
                    onClick={() => handleDeleteItem(c, iName)}
                    className="text-red-600 px-2 rounded hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
