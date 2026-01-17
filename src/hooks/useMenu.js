import { useEffect, useState } from "react";
import { defaultMenu } from "@/utils/menuData";

export function useMenu() {
  const [menu, setMenu] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("menu");
    if (stored) {
      setMenu(JSON.parse(stored));
    } else {
      setMenu(defaultMenu);
      localStorage.setItem("menu", JSON.stringify(defaultMenu));
    }
  }, []);

  const saveMenu = (updated) => {
    setMenu(updated);
    localStorage.setItem("menu", JSON.stringify(updated));
  };

  // Add a new category
  const addCategory = (name) => {
    if (!name) return;
    if (menu[name]) return; // category already exists
    const updated = { ...menu, [name]: {} };
    saveMenu(updated);
  };

  // Delete a category
  const deleteCategory = (name) => {
    if (!menu[name]) return;
    const updated = { ...menu };
    delete updated[name];
    saveMenu(updated);
  };

  // Add a new item to a category
  const addItem = (cat, item, price) => {
    if (!cat || !item || price == null) return;
    const updated = {
      ...menu,
      [cat]: {
        ...menu[cat],
        [item]: price,
      },
    };
    saveMenu(updated);
  };

  // Delete an item from a category
  const deleteItem = (cat, item) => {
    if (!menu[cat] || !menu[cat][item]) return;
    const updated = { ...menu, [cat]: { ...menu[cat] } };
    delete updated[cat][item];
    saveMenu(updated);
  };

  return { menu, addCategory, addItem, deleteCategory, deleteItem };
}
