import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/menu";

export type CartItem = { product: Product; qty: number };

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (p: Product) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (b: boolean) => void;
  bump: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("rc-cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("rc-cart", JSON.stringify(items)); } catch {}
  }, [items]);

  const add = (p: Product) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.product.id === p.id);
      if (i >= 0) { const copy = [...prev]; copy[i] = { ...copy[i], qty: copy[i].qty + 1 }; return copy; }
      return [...prev, { product: p, qty: 1 }];
    });
    setBump((n) => n + 1);
  };
  const remove = (id: string) => setItems((p) => p.filter((x) => x.product.id !== id));
  const setQty = (id: string, qty: number) =>
    setItems((p) => qty <= 0 ? p.filter((x) => x.product.id !== id) : p.map((x) => x.product.id === id ? { ...x, qty } : x));
  const clear = () => setItems([]);

  const { count, subtotal } = useMemo(() => {
    let c = 0, s = 0;
    for (const it of items) { c += it.qty; s += it.qty * it.product.price; }
    return { count: c, subtotal: s };
  }, [items]);

  return (
    <Ctx.Provider value={{ items, count, subtotal, add, remove, setQty, clear, open, setOpen, bump }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be inside CartProvider");
  return v;
}
