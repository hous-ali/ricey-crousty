import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { ordersQuery, qk, type Order } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const STATUSES = ["pending", "preparing", "ready", "delivered", "cancelled"] as const;
type Status = typeof STATUSES[number];

export const Route = createFileRoute("/_authenticated/admin/orders")({ component: OrdersPage });

function OrdersPage() {
  const qc = useQueryClient();
  const { data: orders = [] } = useQuery(ordersQuery);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Status | "all">("all");
  const [open, setOpen] = useState<Order | null>(null);

  const filtered = useMemo(() => orders.filter((o) => {
    if (status !== "all" && o.status !== status) return false;
    if (q && !(`${o.customer_name} ${o.phone}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [orders, q, status]);

  const setStatusFor = async (id: string, s: Status) => {
    const { error } = await supabase.from("orders").update({ status: s }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: qk.orders });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-wider">Commandes</h1>
        <p className="text-sm text-muted-foreground">{orders.length} au total</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Input placeholder="Rechercher (nom, téléphone)" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <Select value={status} onValueChange={(v) => setStatus(v as Status | "all")}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto rounded-3xl border border-border/60 bg-card/60">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr><th className="p-3">Client</th><th className="p-3">Total</th><th className="p-3">Statut</th><th className="p-3">Date</th><th /></tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-t border-border/40">
                <td className="p-3"><div className="font-semibold">{o.customer_name}</div><div className="text-xs text-muted-foreground">{o.phone}</div></td>
                <td className="p-3 font-display text-lg text-gradient-flame">{Number(o.total).toFixed(0)} DZD</td>
                <td className="p-3">
                  <Select value={o.status} onValueChange={(v) => setStatusFor(o.id, v as Status)}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("fr-FR")}</td>
                <td className="p-3 text-right"><Button variant="ghost" size="sm" onClick={() => setOpen(o)}>Détails</Button></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Aucune commande.</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Commande</DialogTitle></DialogHeader>
          {open && (
            <div className="space-y-3 text-sm">
              <div><b>{open.customer_name}</b> — {open.phone}</div>
              {open.address && <div className="text-muted-foreground">📍 {open.address}</div>}
              {open.notes && <div className="text-muted-foreground">📝 {open.notes}</div>}
              <ul className="rounded-xl border border-border/60 p-3 text-sm">
                {(open.items as Array<{ name: string; qty: number; price: number }>).map((it, i) => (
                  <li key={i} className="flex justify-between py-1"><span>{it.qty}× {it.name}</span><span>{it.qty * it.price} DZD</span></li>
                ))}
              </ul>
              <div className="flex justify-between font-display text-lg"><span>Total</span><span className="text-gradient-flame">{Number(open.total).toFixed(0)} DZD</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
