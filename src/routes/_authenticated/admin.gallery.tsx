import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { galleryQuery, qk, storageUrl } from "@/lib/data";
import { Sortable } from "@/components/admin/Sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useRef } from "react";

export const Route = createFileRoute("/_authenticated/admin/gallery")({ component: Gallery });

function Gallery() {
  const qc = useQueryClient();
  const { data: photos = [] } = useQuery(galleryQuery);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList) => {
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: e1 } = await supabase.storage.from("gallery").upload(path, file, { contentType: file.type });
      if (e1) { toast.error(e1.message); continue; }
      const { error: e2 } = await supabase.from("gallery_images").insert({
        image_url: storageUrl("gallery", path),
        sort_order: photos.length,
      });
      if (e2) toast.error(e2.message);
    }
    qc.invalidateQueries({ queryKey: qk.gallery });
    toast.success("Ajouté");
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette photo ?")) return;
    await supabase.from("gallery_images").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: qk.gallery });
  };

  const patchCaption = async (id: string, caption: string) => {
    await supabase.from("gallery_images").update({ caption }).eq("id", id);
  };

  const reorder = async (list: typeof photos) => {
    qc.setQueryData(qk.gallery, list.map((p, i) => ({ ...p, sort_order: i })));
    await Promise.all(list.map((p, i) => supabase.from("gallery_images").update({ sort_order: i }).eq("id", p.id)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl tracking-wider">Galerie</h1>
          <p className="text-sm text-muted-foreground">Glissez pour réorganiser</p>
        </div>
        <input ref={fileRef} type="file" hidden multiple accept="image/*" onChange={(e) => e.target.files && upload(e.target.files)} />
        <Button onClick={() => fileRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Ajouter des photos</Button>
      </div>

      <Sortable
        items={photos}
        onReorder={reorder}
        renderItem={(p) => (
          <div className="flex items-center gap-3 p-2">
            <img src={p.image_url} alt="" className="h-16 w-24 rounded-lg object-cover" />
            <Input
              defaultValue={p.caption ?? ""}
              placeholder="Légende (optionnel)"
              onBlur={(e) => patchCaption(p.id, e.target.value)}
              className="flex-1"
            />
            <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        )}
      />
      {photos.length === 0 && <p className="text-sm text-muted-foreground">Aucune photo.</p>}
    </div>
  );
}
