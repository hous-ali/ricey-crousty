import { useI18n, type Lang } from "@/contexts/I18nContext";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  const opts: { v: Lang; label: string }[] = [
    { v: "fr", label: "FR" },
    { v: "ar", label: "ع" },
  ];
  return (
    <div className={`inline-flex items-center rounded-full border border-border/60 bg-card/60 p-1 backdrop-blur-md ${className}`}>
      {opts.map((o) => (
        <button
          key={o.v}
          onClick={() => setLang(o.v)}
          aria-pressed={lang === o.v}
          className={`relative rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${
            lang === o.v ? "bg-flame text-accent-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
