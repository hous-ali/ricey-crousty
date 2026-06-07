import { ArrowDown, Phone } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import exteriorEntrance from "@/assets/exterior-entrance.png.asset.json";
import riceyCrousty from "@/assets/ricey-crousty.png.asset.json";

export function Hero() {
  const { t } = useI18n();
  return (
    <section id="top" className="relative isolate overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-20">
      {/* Glow backdrop */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-flame opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-primary opacity-25 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-6">
        <div className="relative z-10 order-2 text-center lg:order-1 lg:text-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-flame animate-pulse" />
            {t("hero.tag")}
          </div>

          <h1 className="mt-5 font-display text-[18vw] leading-[0.85] tracking-tight sm:text-[88px] lg:text-[112px]">
            <span className="block text-foreground">{t("hero.title1")}</span>
            <span className="block text-gradient-flame">{t("hero.title2")}</span>
            <span className="block text-foreground">
              {t("hero.title3")}
              <span className="ml-2 inline-block h-3 w-3 rounded-full bg-flame align-middle shadow-flame" />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-base text-muted-foreground sm:text-lg lg:mx-0">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href="#menu"
              className="group inline-flex items-center gap-2 rounded-full bg-flame px-6 py-3 text-sm font-bold text-accent-foreground shadow-flame transition hover:scale-105"
            >
              {t("hero.cta")}
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="tel:+213549539046"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-bold text-foreground backdrop-blur transition hover:border-flame"
            >
              <Phone className="h-4 w-4" />
              {t("hero.cta2")}
            </a>
          </div>
        </div>

        {/* Visual collage */}
        <div className="relative order-1 mx-auto h-[360px] w-full max-w-[520px] sm:h-[480px] lg:order-2 lg:h-[560px]">
          <div className="absolute right-0 top-4 h-[80%] w-[70%] overflow-hidden rounded-[2rem] border border-border/50 shadow-2xl">
            <img src={exteriorEntrance.url} alt="Ricey Crousty storefront" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -left-2 bottom-0 h-[60%] w-[58%] animate-float-slow">
            <div className="relative h-full w-full">
              <div className="absolute -inset-4 rounded-full bg-flame opacity-30 blur-2xl" />
              <img src={riceyCrousty.url} alt="Ricey Crousty bowl" className="relative h-full w-full object-contain drop-shadow-2xl" />
            </div>
          </div>
          <span className="absolute right-2 top-0 rotate-6 rounded-full bg-card/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-flame backdrop-blur">
            Crousty Food
          </span>
          <span className="absolute left-2 top-2 -rotate-6 rounded-full bg-flame px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
            Tiaret
          </span>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="relative mt-12 overflow-hidden border-y border-border/40 bg-card/30 py-4 sm:mt-16">
        <div className="flex w-[200%] animate-marquee gap-12 whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="font-display text-2xl tracking-[0.2em] text-muted-foreground sm:text-3xl">
              {t("hero.marquee")} <span className="text-flame">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
