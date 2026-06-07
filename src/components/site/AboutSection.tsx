import { Flame, Clock, Sparkles } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import interiorCounter from "@/assets/interior-counter.png.asset.json";

export function AboutSection() {
  const { t } = useI18n();
  return (
    <section id="about" className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-flame opacity-25 blur-3xl" />
          <div className="overflow-hidden rounded-[2rem] border border-border/60 shadow-2xl">
            <img src={interiorCounter.url} alt="Inside Ricey Crousty" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-4 flex items-center gap-2 rounded-2xl border border-border/60 bg-card/90 px-4 py-3 shadow-flame backdrop-blur-md sm:-right-6">
            <Flame className="h-5 w-5 text-flame" />
            <span className="font-display text-lg tracking-wider text-foreground">CROUSTY FOOD</span>
          </div>
        </div>

        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-flame" />
            {t("about.tag")}
          </span>
          <h2 className="mt-4 font-display text-4xl leading-[0.95] tracking-tight text-foreground sm:text-6xl">
            {t("about.title")}
          </h2>
          <p className="mt-5 max-w-md text-base text-muted-foreground">{t("about.body")}</p>

          <dl className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { k: t("about.stat1.k"), v: "6+", icon: Sparkles },
              { k: t("about.stat2.k"), v: "4", icon: Flame },
              { k: t("about.stat3.k"), v: "10", icon: Clock },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
                <s.icon className="h-5 w-5 text-flame" />
                <dd className="mt-2 font-display text-3xl text-foreground sm:text-4xl">{s.v}</dd>
                <dt className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.k}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
