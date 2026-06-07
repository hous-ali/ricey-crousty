import { MapPin, Navigation, Phone } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { MAPS_LINK, MAPS_EMBED_QUERY } from "@/lib/menu";

export function LocationSection() {
  const { t } = useI18n();
  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_EMBED_QUERY)}&output=embed`;
  return (
    <section id="location" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-flame" />
            {t("loc.tag")}
          </span>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-foreground sm:text-6xl">
            <span className="text-gradient-flame">{t("loc.title")}</span>
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-2xl">
              <iframe
                title="Ricey Crousty location"
                src={embedSrc}
                className="h-[360px] w-full sm:h-[440px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-md">
              <MapPin className="h-6 w-6 text-flame" />
              <h3 className="mt-3 font-display text-2xl tracking-wide text-foreground">Ricey Crousty</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t("loc.address")}</p>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-flame px-4 py-3 text-sm font-bold text-accent-foreground shadow-flame transition hover:scale-[1.02]"
              >
                <Navigation className="h-4 w-4" />
                {t("loc.directions")}
              </a>
            </div>
            <a
              href="tel:+213549539046"
              className="flex items-center justify-between rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-md transition hover:border-flame"
            >
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {t("loc.call")}
                </div>
                <div className="mt-1 font-display text-xl tracking-wider text-foreground">0549 53 90 46</div>
              </div>
              <Phone className="h-5 w-5 text-flame" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
