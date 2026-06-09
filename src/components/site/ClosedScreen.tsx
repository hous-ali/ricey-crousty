import { useEffect, useState } from "react";
import logo from "@/assets/ricey-crousty-logo.jpg.asset.json";

export function ClosedScreen() {
  const [ar, setAr] = useState(false);

  useEffect(() => {
    document.documentElement.lang = ar ? "ar" : "fr";
    document.documentElement.dir = ar ? "rtl" : "ltr";
  }, [ar]);

  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-y-auto bg-background px-6 py-10 text-foreground">
      {/* Glow backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-flame opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-primary opacity-20 blur-3xl" />
      </div>

      <div className="w-full max-w-xl animate-fade-in text-center">
        <div className="mx-auto mb-8 h-28 w-28 overflow-hidden rounded-full border border-border/60 shadow-flame animate-scale-in sm:h-36 sm:w-36">
          <img src={logo.url} alt="Ricey Crousty" className="h-full w-full object-cover" />
        </div>

        <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
          <span className="text-gradient-flame">
            {ar ? "المطعم مغلق حالياً" : "Restaurant fermé"}
          </span>
        </h1>

        {ar ? (
          <div className="mt-6 space-y-4 text-base text-muted-foreground sm:text-lg" dir="rtl">
            <p>المطعم مغلق حالياً.</p>
            <p>ندعوك للعودة خلال أوقات العمل لتقديم طلبك.</p>
            <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-border/60 bg-card/60 p-5 text-right backdrop-blur">
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-flame">أوقات العمل</div>
              <div className="mt-3 space-y-2 text-foreground">
                <div>
                  <div className="text-sm text-muted-foreground">من السبت إلى الخميس</div>
                  <div className="font-display text-xl">10:00 صباحاً - 1:30 ليلاً</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">يوم الجمعة</div>
                  <div className="font-display text-xl">2:00 ظهراً - 1:30 ليلاً</div>
                </div>
              </div>
            </div>
            <p className="pt-2">شكراً لتفهمكم.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4 text-base text-muted-foreground sm:text-lg">
            <p>Le restaurant est actuellement fermé.</p>
            <p>Nous vous invitons à revenir pendant les heures d'ouverture pour passer votre commande.</p>
            <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-border/60 bg-card/60 p-5 text-left backdrop-blur">
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-flame">Horaires d'ouverture</div>
              <div className="mt-3 space-y-2 text-foreground">
                <div>
                  <div className="text-sm text-muted-foreground">Samedi au Jeudi</div>
                  <div className="font-display text-xl">10h00 - 01h30</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Vendredi</div>
                  <div className="font-display text-xl">14h00 - 01h30</div>
                </div>
              </div>
            </div>
            <p className="pt-2">Merci pour votre compréhension.</p>
          </div>
        )}

        <button
          onClick={() => setAr((v) => !v)}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-flame px-6 py-3 text-sm font-bold text-accent-foreground shadow-flame transition hover:scale-105"
        >
          {ar ? "Traduire en français" : "ترجم إلى العربية"}
        </button>
      </div>
    </div>
  );
}
