import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { categoriesQuery, qk, type Category } from "@/lib/data";
import { Sortable } from "@/components/admin/Sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/categories")({ component: Cats });

function Cats() {
  const qc = useQueryClient();
  const { data: cats = [] } = useQuery(categoriesQuery);
  const [newFr, setNewFr] = useState("");
  const [newAr, setNewAr] = useState("");

  const add = async () => {
    if (!newFr.trim()) return;
    const slug = newFr.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || crypto.randomUUID().slice(0, 6);
    const { error } = await supabase.from("categories").insert({
      slug, name_fr: newFr, name_ar: newAr || newFr, sort_order: cats.length,
    });
    if (error) return toast.error(error.message);
    setNewFr(""); setNewAr("");
    qc.invalidateQueries({ queryKey: qk.categories });
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette catégorie ? Impossible si des produits y sont liés.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: qk.categories });
  };

  const patch = async (c: Category, p: Partial<Category>) => {
    const { error } = await supabase.from("categories").update(p).eq("id", c.id);
    if (error) toast.error(error.message);
    qc.invalidateQueries({ queryKey: qk.categories });
  };

  const reorder = async (list: Category[]) => {
    qc.setQueryData(qk.categories, list.map((c, i) => ({ ...c, sort_order: i })));
    await Promise.all(list.map((c, i) => supabase.from("categories").update({ sort_order: i }).eq("id", c.id)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-wider">Catégories</h1>
        <p className="text-sm text-muted-foreground">Glissez pour réorganiser · double-cliquez pour renommer</p>
      </div>

      <div className="flex flex-wrap items-end gap-2 rounded-3xl border border-border/60 bg-card/60 p-4">
        <div className="flex-1 min-w-[160px]">
          <Input placeholder="Nom (FR)" value={newFr} onChange={(e) => setNewFr(e.target.value)} />
        </div>
        <div className="flex-1 min-w-[160px]">
          <Input dir="rtl" placeholder="الاسم (AR)" value={newAr} onChange={(e) => setNewAr(e.target.value)} />
        </div>
        <Button onClick={add}><Plus className="mr-2 h-4 w-4" />Ajouter</Button>
      </div>

      <Sortable
        items={cats}
        onReorder={reorder}
        renderItem={(c) => <CategoryRow c={c} onPatch={patch} onRemove={remove} />}
      />
    </div>
  );
}

function CategoryRow({ c, onPatch, onRemove }: { c: Category; onPatch: (c: Category, p: Partial<Category>) => void; onRemove: (id: string) => void }) {
  const [edit, setEdit] = useState(false);
  const [fr, setFr] = useState(c.name_fr);
  const [ar, setAr] = useState(c.name_ar);
  if (edit) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Input value={fr} onChange={(e) => setFr(e.target.value)} />
        <Input dir="rtl" value={ar} onChange={(e) => setAr(e.target.value)} />
        <Button size="icon" onClick={() => { onPatch(c, { name_fr: fr, name_ar: ar }); setEdit(false); }}><Check className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" onClick={() => setEdit(false)}><X className="h-4 w-4" /></Button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 p-2" onDoubleClick={() => setEdit(true)}>
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold">{c.name_fr}</div>
        <div className="truncate text-xs text-muted-foreground" dir="rtl">{c.name_ar}</div>
      </div>
      <Switch checked={c.is_active} onCheckedChange={(v) => onPatch(c, { is_active: v })} />
      <Button variant="ghost" size="icon" onClick={() => setEdit(true)}>✎</Button>
      <Button variant="ghost" size="icon" onClick={() => onRemove(c.id)}><Trash2 className="h-4 w-4" /></Button>
    </div>
  );
}
