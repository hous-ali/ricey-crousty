import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/contexts/I18nContext";

export function FloatingCart() {
  const { count, subtotal, setOpen, bump } = useCart();
  const { t } = useI18n();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (bump === 0) return;
    setPulse(true);
    const id = setTimeout(() => setPulse(false), 500);
    return () => clearTimeout(id);
  }, [bump]);

  if (count === 0) return null;

  return (
    <button
      onClick={() => setOpen(true)}
      className={`fixed bottom-4 right-4 z-30 flex items-center gap-3 rounded-full bg-flame px-5 py-3 text-accent-foreground shadow-flame transition-all duration-300 hover:scale-105 sm:bottom-6 sm:right-6 ${pulse ? "animate-pop-in" : ""}`}
      aria-label="Open cart"
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <ShoppingBag className="h-5 w-5" strokeWidth={2.5} />
        <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-black text-flame">
          {count}
        </span>
      </span>
      <span className="font-display text-base tracking-wider">
        {subtotal} {t("currency")}
      </span>
    </button>
  );
}
