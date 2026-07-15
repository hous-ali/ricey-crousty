import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { storageUrl } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Trash2 } from "lucide-react";

export function ImageUploader({
  bucket,
  value,
  onChange,
  aspect = "square",
}: {
  bucket: "product-images" | "gallery" | "branding";
  value: string | null;
  onChange: (url: string | null) => void;
  aspect?: "square" | "wide";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      onChange(storageUrl(bucket, path));
      toast.success("Image envoyée");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div
        className={`relative flex ${aspect === "wide" ? "aspect-video" : "aspect-square"} w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border/60 bg-background/40`}
      >
        {value ? (
          <img src={value} alt="" className="h-full w-full object-contain" />
        ) : (
          <span className="text-xs text-muted-foreground">Aucune image</span>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
          <Upload className="mr-2 h-4 w-4" />
          {busy ? "…" : value ? "Remplacer" : "Télécharger"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
