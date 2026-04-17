import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [localItems, setLocalItems] = useState([]);

  const value = useMemo(
    () => ({
      localItems,
      setLocalItems,
      localCount: localItems.reduce((n, i) => n + i.quantity, 0),
    }),
    [localItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
