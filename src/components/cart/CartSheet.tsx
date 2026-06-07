import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/contexts/I18nContext";
import { DELIVERY_FEE, WHATSAPP_NUMBER } from "@/lib/menu";

type Mode = "delivery" | "pickup";

export function CartSheet() {
  const { items, subtotal, setQty, remove, clear, open, setOpen } = useCart();
  const { t, lang } = useI18n();
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [mode, setMode] = useState<Mode>("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [maps, setMaps] = useState("");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const delivery = mode === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;
  const cur = t("currency");

  const send = () => {
    if (!name.trim() || !phone.trim() || (mode === "delivery" && !address.trim())) {
      setErr(t("co.required"));
      return;
    }
    const lines: string[] = [];
    lines.push(`*RICEY CROUSTY — Nouvelle commande*`);
    lines.push("");
    lines.push(`👤 ${name}`);
    lines.push(`📞 ${phone}`);
    lines.push(`🚚 ${mode === "delivery" ? t("co.delivery") : t("co.pickup")}`);
    if (mode === "delivery") {
      lines.push(`📍 ${address}`);
      if (maps.trim()) lines.push(`🗺️ ${maps}`);
    }
    if (notes.trim()) lines.push(`📝 ${notes}`);
    lines.push("");
    lines.push(`*${t("cart.title")}:*`);
    for (const it of items) {
      lines.push(`• ${it.qty}× ${it.product.name[lang]} — ${it.qty * it.product.price} ${cur}`);
    }
    lines.push("");
    lines.push(`${t("cart.subtotal")}: ${subtotal} ${cur}`);
    if (mode === "delivery") lines.push(`${t("cart.delivery")}: ${delivery} ${cur}`);
    lines.push(`*${t("cart.total")}: ${total} ${cur}*`);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank");
    clear();
    setOpen(false);
    setStep("cart");
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { setOpen(v); if (!v) setStep("cart"); }}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 border-l border-border bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border/60 p-5">
          <SheetTitle className="font-display text-2xl tracking-wider text-foreground">
            {step === "cart" ? t("cart.title") : t("co.title")}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("cart.empty")}</p>
          </div>
        ) : step === "cart" ? (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-3">
                {items.map((it) => (
                  <li key={it.product.id} className="flex gap-3 rounded-2xl border border-border/60 bg-card/60 p-3 animate-fade-in">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-background/40">
                      <img src={it.product.image} alt="" className="h-full w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-display text-lg tracking-wide text-foreground">{it.product.name[lang]}</div>
                      <div className="text-xs text-flame font-bold">{it.product.price} {cur}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <button onClick={() => setQty(it.product.id, it.qty - 1)} aria-label="-" className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card transition hover:border-flame">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[20px] text-center text-sm font-bold">{it.qty}</span>
                        <button onClick={() => setQty(it.product.id, it.qty + 1)} aria-label="+" className="flex h-7 w-7 items-center justify-center rounded-full bg-flame text-accent-foreground transition hover:scale-110">
                          <Plus className="h-3 w-3" strokeWidth={3} />
                        </button>
                        <button onClick={() => remove(it.product.id)} aria-label="remove" className="ml-auto text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-border/60 bg-card/40 p-5 backdrop-blur">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>{t("cart.subtotal")}</span><span>{subtotal} {cur}</span></div>
                <div className="flex items-baseline justify-between font-display text-2xl text-foreground">
                  <span>{t("cart.total")}</span>
                  <span className="text-gradient-flame">{subtotal} {cur}</span>
                </div>
              </div>
              <button onClick={() => setStep("checkout")} className="mt-4 w-full rounded-full bg-flame px-6 py-3 text-sm font-bold text-accent-foreground shadow-flame transition hover:scale-[1.02]">
                {t("cart.continue")}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{t("co.name")} *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value.slice(0, 80))} maxLength={80} required />
                </div>
                <div>
                  <Label htmlFor="phone">{t("co.phone")} *</Label>
                  <Input id="phone" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value.slice(0, 25))} maxLength={25} required />
                </div>
                <div>
                  <Label>{t("co.mode")} *</Label>
                  <RadioGroup value={mode} onValueChange={(v) => setMode(v as Mode)} className="mt-2 grid grid-cols-2 gap-2">
                    {(["delivery", "pickup"] as Mode[]).map((m) => (
                      <label key={m} className={`flex cursor-pointer items-center gap-2 rounded-2xl border p-3 transition ${mode === m ? "border-flame bg-flame/10" : "border-border bg-card/40"}`}>
                        <RadioGroupItem value={m} className="sr-only" />
                        <span className="text-sm font-semibold">{m === "delivery" ? t("co.delivery") : t("co.pickup")}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                {mode === "delivery" && (
                  <>
                    <div>
                      <Label htmlFor="address">{t("co.address")} *</Label>
                      <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value.slice(0, 300))} maxLength={300} rows={2} />
                    </div>
                    <div>
                      <Label htmlFor="maps">{t("co.maps")}</Label>
                      <Input id="maps" value={maps} onChange={(e) => setMaps(e.target.value.slice(0, 300))} maxLength={300} placeholder="https://maps.app.goo.gl/..." />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="notes">{t("co.notes")}</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value.slice(0, 300))} maxLength={300} rows={2} />
                </div>
                {err && <p className="text-xs text-destructive">{err}</p>}
              </div>
            </div>
            <div className="border-t border-border/60 bg-card/40 p-5 backdrop-blur">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>{t("cart.subtotal")}</span><span>{subtotal} {cur}</span></div>
                {mode === "delivery" && (
                  <div className="flex justify-between text-muted-foreground"><span>{t("cart.delivery")}</span><span>{delivery} {cur}</span></div>
                )}
                <div className="flex items-baseline justify-between font-display text-2xl text-foreground">
                  <span>{t("cart.total")}</span>
                  <span className="text-gradient-flame">{total} {cur}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setStep("cart")} className="rounded-full border border-border bg-card px-4 py-3 text-sm font-bold text-foreground transition hover:border-flame">
                  {t("cart.back")}
                </button>
                <button onClick={send} className="flex-1 rounded-full bg-flame px-6 py-3 text-sm font-bold text-accent-foreground shadow-flame transition hover:scale-[1.02]">
                  {t("co.send")}
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
