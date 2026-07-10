import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logoAsset from "@/assets/ricey-crousty-logo.jpg.asset.json";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Espace admin — Ricey Crousty" },
      { name: "description", content: "Connexion à l'espace administrateur Ricey Crousty." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: redirect ?? "/admin" });
    });
  }, [nav, redirect]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connecté");
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        toast.success("Compte créé");
        // First admin bootstrap
        await supabase.rpc("claim_admin_bootstrap");
      }
      nav({ to: redirect ?? "/admin" });
    } catch (err) {
      toast.error((err as Error).message || "Erreur");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background p-6">
      <div className="w-full max-w-sm rounded-3xl border border-border/60 bg-card/60 p-8 backdrop-blur-xl shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={logoAsset.url} alt="" className="mb-3 h-14 w-14 rounded-full object-cover shadow-flame" />
          <h1 className="font-display text-3xl tracking-wider text-foreground">Espace Admin</h1>
          <p className="mt-1 text-xs text-muted-foreground">Ricey Crousty · Tiaret</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "..." : mode === "signin" ? "Se connecter" : "Créer un compte"}
          </Button>
        </form>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <button className="underline underline-offset-4 hover:text-foreground" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
            {mode === "signin" ? "Première fois ? Créer le compte admin" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
        <div className="mt-6 text-center text-xs">
          <Link to="/" className="text-muted-foreground hover:text-foreground">← Retour au site</Link>
        </div>
      </div>
    </div>
  );
}
