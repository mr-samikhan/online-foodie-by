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

  const addCategory = (name) => {
    const updated = { ...menu, [name]: {} };
    saveMenu(updated);
  };

  const addItem = (cat, item, price) => {
    const updated = {
      ...menu,
      [cat]: {
        ...menu[cat],
        [item]: price,
      },
    };
    saveMenu(updated);
  };

  return { menu, addCategory, addItem };
}
