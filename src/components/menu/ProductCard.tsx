import { Plus } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/menu";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/contexts/I18nContext";

const ACCENT: Record<NonNullable<Product["accent"]>, string> = {
  red: "from-primary/30 via-primary/10 to-transparent",
  mint: "from-emerald-500/30 via-emerald-500/10 to-transparent",
  purple: "from-purple-500/30 via-purple-500/10 to-transparent",
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
      className="group relative isolate flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-4 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-flame/40 hover:shadow-flame sm:p-5"
      style={{ animationDelay: `${(index % 8) * 60}ms` }}
    >
      <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${ACCENT[accent]} opacity-60 transition-opacity duration-500 group-hover:opacity-100`} />

      <div className="relative mb-4 flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-background/40 sm:h-52">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.71_0.20_45_/_0.18),transparent_65%)]" />
        <img
          src={product.image}
          alt={product.name[lang]}
          loading="lazy"
          decoding="async"
          className="relative h-full w-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-2"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-display text-2xl leading-tight tracking-wide text-foreground sm:text-3xl">
          {product.name[lang]}
        </h3>
        {product.desc && (
          <p className="mt-1.5 text-[12px] leading-snug text-muted-foreground line-clamp-2">
            {product.desc[lang]}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Prix</div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-3xl text-gradient-flame sm:text-4xl">{product.price}</span>
            <span className="text-xs font-bold text-flame">{t("currency")}</span>
          </div>
        </div>

        <button
          onClick={onAdd}
          aria-label={`Add ${product.name[lang]}`}
          className="group/btn relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-flame text-accent-foreground shadow-flame transition-all duration-300 hover:scale-110 hover:rotate-90 active:scale-95 sm:h-16 sm:w-16"
        >
          <Plus className="h-7 w-7" strokeWidth={3} />
          <span className="absolute inset-0 -z-10 rounded-2xl bg-flame opacity-40 blur-md group-hover/btn:opacity-70" />
          {pop > 0 && (
            <span
              key={pop}
              className="pointer-events-none absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-flame text-xs font-black animate-pop-in"
            >
              +1
            </span>
          )}
        </button>
      </div>
    </article>
  );
}
