import { useLocalStorage } from "@/hooks/useLocalStorage";

export function useInvoice() {
  const [items, setItems] = useLocalStorage("invoice", []);

  const addItem = (item) => {
    setItems([...items, item]);
  };

  const clearInvoice = () => setItems([]);

  return { items, addItem, clearInvoice };
}
