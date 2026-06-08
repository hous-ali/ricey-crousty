import { Flame, Instagram, Phone } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="relative border-t border-border/60 bg-card/40 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-flame shadow-flame">
              <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-2xl tracking-wider text-foreground">RICEY CROUSTY</span>
              <span className="text-[10px] font-semibold tracking-[0.3em] text-flame">TIARET</span>
            </span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">{t("footer.tag")}</p>
          <div className="flex items-center gap-2">
            <a href="tel:+213549539046" className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition hover:border-flame hover:text-flame">
              <Phone className="h-4 w-4" />
            </a>
            <a href="https://wa.me/213549539046" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition hover:border-flame hover:text-flame">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6 1.8.8 2.5.9 3.4.7.5-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition hover:border-flame hover:text-flame">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
          <div className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} Ricey Crousty Tiaret — {t("footer.rights")}
          </div>
        </div>
      </div>
    </footer>
  );
}
