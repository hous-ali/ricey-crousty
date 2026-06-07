import { useEffect, useState } from "react";
import { Flame, ShoppingBag } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { useCart } from "@/contexts/CartContext";
import { LanguageToggle } from "./LanguageToggle";

const links = [
  { id: "menu", k: "nav.menu" },
  { id: "gallery", k: "nav.gallery" },
  { id: "about", k: "nav.about" },
  { id: "location", k: "nav.location" },
];

export function Header() {
  const { t } = useI18n();
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/60" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <a href="#top" className="group flex items-center gap-2">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-flame shadow-flame">
            <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
            <span className="absolute inset-0 rounded-xl ring-2 ring-flame/40 animate-ping-soft" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-wider text-foreground">RICEY</span>
            <span className="text-[10px] font-semibold tracking-[0.3em] text-flame">CROUSTY</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-card hover:text-foreground"
            >
              {t(l.k)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            onClick={() => setOpen(true)}
            aria-label="Cart"
            className="relative flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-2 text-sm font-semibold text-foreground backdrop-blur-md transition hover:border-flame hover:bg-card"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">{count}</span>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-flame px-1 text-[10px] font-bold text-accent-foreground shadow-md sm:hidden">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
