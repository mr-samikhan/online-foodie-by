"use client";
import { useMenu } from "@/hooks/useMenu";
import { useState } from "react";

export default function MenuEditor() {
  const { menu, addCategory, addItem } = useMenu();
  const [cat, setCat] = useState("");
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Menu Settings</h2>

      <div className="mb-4">
        <input
          placeholder="New Category"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={() => addCategory(cat)}
          className="bg-black text-white px-4 py-2"
        >
          Add Category
        </button>
      </div>

      <div className="mb-4">
        <input
          placeholder="Item Name"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          className="border p-2 mr-2"
        />

        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 mr-2"
        />

        <select
          onChange={(e) => setCat(e.target.value)}
          className="border p-2 mr-2"
        >
          <option>Select Category</option>
          {Object.keys(menu).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <button
          onClick={() => addItem(cat, item, Number(price))}
          className="bg-green-600 text-white px-4 py-2"
        >
          Add Item
        </button>
      </div>
    </div>
  );
}
