import { Plus } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/menu";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/contexts/I18nContext";

const ACCENT: Record<NonNullable<Product["accent"]>, string> = {
  red: "from-primary/30 via-primary/10 to-transparent",
  mint: "from-primary/25 via-primary/10 to-transparent",
  purple: "from-flame/25 via-flame/10 to-transparent",
  orange: "from-flame/30 via-flame/10 to-transparent",
  gold: "from-gold/30 via-gold/10 to-transparent",
};

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const { add } = useCart();
  const { lang, t } = useI18n();
  const [pop, setPop] = useState(0);

  const onAdd = () => { add(product); setPop((n) => n + 1); };

  const accent = product.accent ?? "red";

  return (
    <article
      className="group relative isolate flex items-stretch gap-3 overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-3 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-flame sm:gap-4 sm:p-4"
      style={{ animationDelay: `${(index % 8) * 60}ms` }}
    >
      <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${ACCENT[accent]} opacity-60 transition-opacity duration-500 group-hover:opacity-100`} />

      {/* Transparent PNG centered on the left */}
      <div className="relative grid h-40 w-32 shrink-0 place-items-center rounded-2xl sm:h-48 sm:w-40">
        <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.577_0.245_27.325_/_0.28),transparent_70%)] blur-xl" />
        <img
          src={product.image}
          alt={product.name[lang]}
          loading="lazy"
          decoding="async"
          className="relative h-full w-full object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)] transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>

      {/* Right: text + price + plus */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-tight tracking-wide text-foreground sm:text-2xl">
            {product.name[lang]}
          </h3>
          {product.desc && (
            <p className="mt-1 text-[12px] leading-snug text-muted-foreground line-clamp-2 sm:line-clamp-3">
              {product.desc[lang]}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Prix</div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl text-gradient-flame sm:text-3xl">{product.price}</span>
              <span className="text-xs font-bold text-primary">{t("currency")}</span>
            </div>
          </div>

          <button
            onClick={onAdd}
            aria-label={`Add ${product.name[lang]}`}
            className="group/btn relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-flame text-primary-foreground shadow-flame transition-all duration-300 hover:scale-110 hover:rotate-90 active:scale-95 sm:h-14 sm:w-14"
          >
            <Plus className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={3} />
            <span className="absolute inset-0 -z-10 rounded-2xl bg-flame opacity-50 blur-md group-hover/btn:opacity-80" />
            {pop > 0 && (
              <span
                key={pop}
                className="pointer-events-none absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-primary text-xs font-black animate-pop-in"
              >
                +1
              </span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
