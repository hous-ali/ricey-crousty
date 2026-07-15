import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { bannersQuery, qk } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/banners")({ component: Banners });

function Banners() {
  const qc = useQueryClient();
  const { data: banners = [] } = useQuery(bannersQuery);
  const [fr, setFr] = useState(""); const [ar, setAr] = useState("");

  const add = async () => {
    if (!fr.trim()) return;
    const { error } = await supabase.from("banners").insert({ message_fr: fr, message_ar: ar || fr, sort_order: banners.length });
    if (error) return toast.error(error.message);
    setFr(""); setAr(""); qc.invalidateQueries({ queryKey: qk.banners });
  };
  const patch = async (id: string, p: { is_active?: boolean; message_fr?: string; message_ar?: string }) => {
    await supabase.from("banners").update(p).eq("id", id);
    qc.invalidateQueries({ queryKey: qk.banners });
  };
  const remove = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    await supabase.from("banners").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: qk.banners });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-wider">Bannières promo</h1>
        <p className="text-sm text-muted-foreground">Messages affichés en haut du site</p>
      </div>
      <div className="grid gap-2 rounded-3xl border border-border/60 bg-card/60 p-4 sm:grid-cols-[1fr_1fr_auto]">
        <Input placeholder="Message (FR)" value={fr} onChange={(e) => setFr(e.target.value)} />
        <Input dir="rtl" placeholder="الرسالة (AR)" value={ar} onChange={(e) => setAr(e.target.value)} />
        <Button onClick={add}><Plus className="mr-2 h-4 w-4" />Ajouter</Button>
      </div>
      <div className="space-y-2">
        {banners.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-3">
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold">{b.message_fr}</div>
              <div className="truncate text-xs text-muted-foreground" dir="rtl">{b.message_ar}</div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs">Actif</Label>
              <Switch checked={b.is_active} onCheckedChange={(v) => patch(b.id, { is_active: v })} />
              <Button variant="ghost" size="icon" onClick={() => remove(b.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
        {banners.length === 0 && <p className="text-sm text-muted-foreground">Aucune bannière.</p>}
      </div>
    </div>
  );
}
