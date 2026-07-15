import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ordersQuery, productsQuery, settingsQuery, isOpenByHours, type HoursMap } from "@/lib/data";
import { supabase } from "@/lib/supabase/client";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: orders = [] } = useQuery(ordersQuery);
  const { data: products = [] } = useQuery(productsQuery);
  const { data: settings } = useQuery(settingsQuery);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todays = orders.filter((o) => new Date(o.created_at) >= today);
  const revenue = todays.reduce((n, o) => n + Number(o.total || 0), 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const hours = (settings?.hours ?? {}) as HoursMap;
  const isOpen = settings ? isOpenByHours(hours, settings.closed_override) : true;

  const toggleClosed = async (v: boolean) => {
    const { error } = await supabase.from("site_settings").update({ closed_override: v }).eq("id", 1);
    if (error) toast.error(error.message);
    else toast.success(v ? "Site fermé manuellement" : "Site rouvert");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-wider">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">Vue d'ensemble en temps réel</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Commandes aujourd'hui" value={todays.length} />
        <StatCard label="Chiffre du jour" value={`${revenue.toFixed(0)} DZD`} />
        <StatCard label="En attente" value={pending} accent={pending > 0} />
        <StatCard label="Plats actifs" value={products.filter((p) => p.is_available).length} />
      </div>

      <div className="rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl tracking-wide">État du site</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {settings?.closed_override
                ? "Site fermé manuellement — les clients voient l'écran de fermeture."
                : isOpen
                ? "Ouvert selon les horaires — les clients peuvent commander."
                : "Fermé automatiquement (hors horaires d'ouverture)."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Forcer fermé</span>
            <Switch checked={!!settings?.closed_override} onCheckedChange={toggleClosed} />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur">
        <h2 className="font-display text-xl tracking-wide">Dernières commandes</h2>
        <ul className="mt-4 space-y-2">
          {orders.slice(0, 8).map((o) => (
            <li key={o.id} className="flex items-center justify-between rounded-xl border border-border/40 p-3 text-sm">
              <div>
                <div className="font-semibold">{o.customer_name} — {o.phone}</div>
                <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("fr-FR")}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-lg text-gradient-flame">{Number(o.total).toFixed(0)} DZD</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{o.status}</div>
              </div>
            </li>
          ))}
          {orders.length === 0 && <li className="text-sm text-muted-foreground">Aucune commande.</li>}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`rounded-3xl border p-5 backdrop-blur ${accent ? "border-flame/60 bg-flame/10" : "border-border/60 bg-card/60"}`}>
      <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl tracking-wide text-foreground">{value}</div>
    </div>
  );
}
