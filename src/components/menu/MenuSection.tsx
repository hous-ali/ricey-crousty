import { useMemo, useState } from "react";
import { PRODUCTS, CATEGORIES, type Category } from "@/lib/menu";
import { useI18n } from "@/contexts/I18nContext";
import { ProductCard } from "./ProductCard";

export function MenuSection() {
  const { t, lang } = useI18n();
  const [cat, setCat] = useState<Category | "all">("all");

  const filtered = useMemo(
    () => (cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)),
    [cat],
  );

  return (
    <section id="menu" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col items-center text-center sm:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-flame" />
            {t("menu.tag")}
          </span>
          <h2 className="mt-4 font-display text-5xl leading-none tracking-tight text-foreground sm:text-7xl">
            <span className="text-gradient-flame">{t("menu.title")}</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            {t("menu.subtitle")}
          </p>
        </div>

        {/* Category chips */}
        <div className="sticky top-16 z-20 -mx-4 mb-8 flex justify-start gap-2 overflow-x-auto px-4 py-2 sm:justify-center sm:overflow-visible">
          <div className="flex gap-2 rounded-full border border-border/60 bg-background/80 p-1.5 backdrop-blur-xl">
            {CATEGORIES.map((c) => {
              const active = cat === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    active
                      ? "bg-flame text-accent-foreground shadow-md scale-105"
                      : "text-muted-foreground hover:bg-card hover:text-foreground"
                  }`}
                >
                  {c.label[lang]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
