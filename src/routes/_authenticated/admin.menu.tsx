import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { productsQuery, categoriesQuery, qk, type Product, type Category } from "@/lib/data";
import { Sortable } from "@/components/admin/Sortable";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/menu")({ component: MenuAdmin });

type Draft = Partial<Product> & { category_id: string | null };

function emptyDraft(): Draft {
  return {
    slug: "", name_fr: "", name_ar: "", desc_fr: "", desc_ar: "",
    price: 0, image_url: null, accent: "red", is_available: true, is_featured: false,
    category_id: null, sort_order: 0,
  };
}

function MenuAdmin() {
  const qc = useQueryClient();
  const { data: products = [] } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const [catFilter, setCatFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Draft | null>(null);

  const filtered = catFilter === "all" ? products : products.filter((p) => p.category_id === catFilter);

  const save = async () => {
    if (!editing) return;
    const slug = (editing.slug || editing.name_fr || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || crypto.randomUUID().slice(0, 8);
    const payload = { ...editing, slug, price: Number(editing.price) || 0 };
    const { error } = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload as never);
    if (error) return toast.error(error.message);
    toast.success("Enregistré");
    setEditing(null);
    qc.invalidateQueries({ queryKey: qk.products });
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Supprimé");
    qc.invalidateQueries({ queryKey: qk.products });
  };

  const toggle = async (p: Product, patch: Partial<Product>) => {
    const { error } = await supabase.from("products").update(patch).eq("id", p.id);
    if (error) toast.error(error.message);
    qc.invalidateQueries({ queryKey: qk.products });
  };

  const reorder = async (list: Product[]) => {
    qc.setQueryData(qk.products, list.map((p, i) => ({ ...p, sort_order: i })));
    await Promise.all(list.map((p, i) => supabase.from("products").update({ sort_order: i }).eq("id", p.id)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl tracking-wider">Menu</h1>
          <p className="text-sm text-muted-foreground">Glissez pour réorganiser · les changements sont instantanés</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name_fr}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => setEditing(emptyDraft())}><Plus className="mr-2 h-4 w-4" />Ajouter</Button>
        </div>
      </div>

      <Sortable
        items={filtered}
        onReorder={reorder}
        renderItem={(p) => (
          <div className="flex items-center gap-3 p-2">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-background/40">
              {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-contain" /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="truncate font-semibold">{p.name_fr}</div>
                {p.is_featured && <Badge variant="outline" className="border-flame/50 text-flame">★</Badge>}
                {!p.is_available && <Badge variant="secondary">Indisponible</Badge>}
              </div>
              <div className="text-xs text-muted-foreground truncate">{p.desc_fr || "—"}</div>
            </div>
            <div className="hidden font-display text-lg text-gradient-flame sm:block">{Number(p.price)} DZD</div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => toggle(p, { is_available: !p.is_available })} title="Disponible">
                <Switch checked={p.is_available} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => toggle(p, { is_featured: !p.is_featured })} title="En vedette">
                <Star className={`h-4 w-4 ${p.is_featured ? "fill-flame text-flame" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setEditing({ ...p })}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        )}
      />
      {filtered.length === 0 && <p className="text-sm text-muted-foreground">Aucun produit.</p>}

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Modifier" : "Nouveau produit"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Image</Label>
                <ImageUploader bucket="product-images" value={editing.image_url ?? null} onChange={(u) => setEditing({ ...editing, image_url: u })} />
              </div>
              <div>
                <Label>Nom (FR)</Label>
                <Input value={editing.name_fr ?? ""} onChange={(e) => setEditing({ ...editing, name_fr: e.target.value })} />
              </div>
              <div>
                <Label>الاسم (AR)</Label>
                <Input dir="rtl" value={editing.name_ar ?? ""} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Description (FR)</Label>
                <Textarea rows={2} value={editing.desc_fr ?? ""} onChange={(e) => setEditing({ ...editing, desc_fr: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>الوصف (AR)</Label>
                <Textarea dir="rtl" rows={2} value={editing.desc_ar ?? ""} onChange={(e) => setEditing({ ...editing, desc_ar: e.target.value })} />
              </div>
              <div>
                <Label>Prix (DZD)</Label>
                <Input type="number" step="1" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Catégorie</Label>
                <Select value={editing.category_id ?? ""} onValueChange={(v) => setEditing({ ...editing, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>{categories.map((c: Category) => <SelectItem key={c.id} value={c.id}>{c.name_fr}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Couleur d'accent</Label>
                <Select value={editing.accent ?? "red"} onValueChange={(v) => setEditing({ ...editing, accent: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["red", "mint", "purple", "orange", "gold"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                <Label className="cursor-pointer">Disponible</Label>
                <Switch checked={!!editing.is_available} onCheckedChange={(v) => setEditing({ ...editing, is_available: v })} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                <Label className="cursor-pointer">Mis en avant</Label>
                <Switch checked={!!editing.is_featured} onCheckedChange={(v) => setEditing({ ...editing, is_featured: v })} />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setEditing(null)}>Annuler</Button>
                <Button onClick={save}>Enregistrer</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
