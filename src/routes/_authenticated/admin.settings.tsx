import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery, qk, type HoursMap } from "@/lib/data";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const DAYS: Array<{ key: keyof HoursMap; label: string }> = [
  { key: "sat", label: "Samedi" }, { key: "sun", label: "Dimanche" },
  { key: "mon", label: "Lundi" }, { key: "tue", label: "Mardi" },
  { key: "wed", label: "Mercredi" }, { key: "thu", label: "Jeudi" },
  { key: "fri", label: "Vendredi" },
];

export const Route = createFileRoute("/_authenticated/admin/settings")({ component: SettingsPage });

function SettingsPage() {
  const qc = useQueryClient();
  const { data: s } = useQuery(settingsQuery);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);

  useEffect(() => { if (s && !draft) setDraft({ ...s }); }, [s, draft]);
  if (!draft) return <p>Chargement…</p>;

  const hours = (draft.hours as HoursMap) ?? {};
  const setField = (k: string, v: unknown) => setDraft({ ...draft, [k]: v });
  const setHours = (day: keyof HoursMap, patch: { open?: string; close?: string } | null) => {
    const next = { ...hours, [day]: patch ? { ...(hours[day] ?? { open: "10:00", close: "01:30" }), ...patch } : null };
    setDraft({ ...draft, hours: next });
  };

  const save = async () => {
    const d = draft as Record<string, any>;
    const { error } = await supabase.from("site_settings").update({
      name: String(d.name ?? ""),
      logo_url: d.logo_url ?? null,
      whatsapp: String(d.whatsapp ?? ""),
      delivery_fee: Number(d.delivery_fee) || 0,
      instagram_url: d.instagram_url ?? null,
      maps_url: d.maps_url ?? null,
      hours: d.hours ?? {},
      texts: d.texts ?? {},
      closed_override: !!d.closed_override,
    }).eq("id", 1);
    if (error) return toast.error(error.message);
    toast.success("Paramètres enregistrés");
    qc.invalidateQueries({ queryKey: qk.settings });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl tracking-wider">Paramètres du site</h1>
        <p className="text-sm text-muted-foreground">Tout est publié en temps réel</p>
      </div>

      <section className="space-y-4 rounded-3xl border border-border/60 bg-card/60 p-6">
        <h2 className="font-display text-xl">Identité</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Nom du restaurant</Label><Input value={String(draft.name ?? "")} onChange={(e) => setField("name", e.target.value)} /></div>
          <div><Label>Numéro WhatsApp (avec indicatif)</Label><Input value={String(draft.whatsapp ?? "")} onChange={(e) => setField("whatsapp", e.target.value)} placeholder="213779862137" /></div>
          <div><Label>Frais de livraison (DZD)</Label><Input type="number" value={Number(draft.delivery_fee ?? 0)} onChange={(e) => setField("delivery_fee", e.target.value)} /></div>
          <div><Label>Instagram (URL)</Label><Input value={String(draft.instagram_url ?? "")} onChange={(e) => setField("instagram_url", e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Google Maps (URL)</Label><Input value={String(draft.maps_url ?? "")} onChange={(e) => setField("maps_url", e.target.value)} /></div>
          <div className="sm:col-span-2">
            <Label>Logo</Label>
            <ImageUploader bucket="branding" value={(draft.logo_url as string) ?? null} onChange={(u) => setField("logo_url", u)} />
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-border/60 bg-card/60 p-6">
        <h2 className="font-display text-xl">Horaires d'ouverture</h2>
        <p className="text-xs text-muted-foreground">Fuseau Africa/Algiers. Laissez vide pour indiquer un jour fermé.</p>
        <div className="space-y-2">
          {DAYS.map(({ key, label }) => {
            const h = hours[key];
            return (
              <div key={key} className="flex flex-wrap items-center gap-2 rounded-xl border border-border/40 p-2">
                <div className="w-24 text-sm font-semibold">{label}</div>
                <Switch checked={!!h} onCheckedChange={(v) => setHours(key, v ? { open: "10:00", close: "01:30" } : null)} />
                {h && (
                  <>
                    <Input type="time" value={h.open} onChange={(e) => setHours(key, { open: e.target.value })} className="w-32" />
                    <span className="text-muted-foreground">→</span>
                    <Input type="time" value={h.close} onChange={(e) => setHours(key, { close: e.target.value })} className="w-32" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex items-center justify-between rounded-3xl border border-border/60 bg-card/60 p-6">
        <div>
          <h2 className="font-display text-xl">Forcer la fermeture</h2>
          <p className="text-xs text-muted-foreground">Ferme le site immédiatement, quels que soient les horaires.</p>
        </div>
        <Switch checked={!!draft.closed_override} onCheckedChange={(v) => setField("closed_override", v)} />
      </section>

      <div className="flex justify-end"><Button onClick={save}>Enregistrer</Button></div>
    </div>
  );
}
