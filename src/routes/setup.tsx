import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { createFirstAdmin, getAdminSetupStatus } from "@/lib/admin-setup.functions";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoAsset from "@/assets/ricey-crousty-logo.jpg.asset.json";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Admin setup — Ricey Crousty" },
      { name: "description", content: "One-time Ricey Crousty admin account setup." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SetupPage,
});

function SetupPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const setupStatusFn = useServerFn(getAdminSetupStatus);
  const createAdminFn = useServerFn(createFirstAdmin);
  const [email, setEmail] = useState("admin@riceycrousty.com");
  const [password, setPassword] = useState("");

  const { data: status, isLoading } = useQuery({ queryKey: ["admin-setup-status"], queryFn: () => setupStatusFn() });

  const createMutation = useMutation({
    mutationFn: async () => createAdminFn({ data: { email, password } }),
    onSuccess: async (result) => {
      await qc.invalidateQueries({ queryKey: ["admin-setup-status"] });
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        toast.success(result.message);
        toast.error(error.message);
        navigate({ to: "/auth" });
        return;
      }
      toast.success("Compte administrateur créé");
      navigate({ to: "/admin", replace: true });
    },
    onError: (error) => toast.error((error as Error).message),
  });

  const disabled = createMutation.isPending || !status?.configured || status.adminCount > 0;

  return (
    <div className="grid min-h-screen place-items-center bg-background p-6 text-foreground">
      <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card/60 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={logoAsset.url} alt="Ricey Crousty" className="mb-3 h-14 w-14 rounded-full object-cover shadow-flame" />
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-flame/15 text-flame"><ShieldCheck className="h-5 w-5" /></div>
          <h1 className="font-display text-3xl tracking-wider">Admin Setup</h1>
          <p className="mt-1 text-xs text-muted-foreground">Ricey Crousty · première connexion</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-border/60 p-4 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Vérification…</div>
        ) : status?.adminCount ? (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-flame" />
            <p className="text-sm text-muted-foreground">Un administrateur existe déjà.</p>
            <Button asChild className="w-full"><Link to="/auth">Se connecter</Link></Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); createMutation.mutate(); }}>
            {!status?.configured && (
              <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                <div className="flex items-center gap-2 font-medium"><TriangleAlert className="h-4 w-4" /> Configuration incomplète</div>
                <ul className="mt-2 list-inside list-disc text-xs">
                  {(status?.errors?.length ? status.errors : ["Backend configuration is not ready."]).map((error) => <li key={error}>{error}</li>)}
                </ul>
              </div>
            )}
            <div><Label htmlFor="setup-email">Email</Label><Input id="setup-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><Label htmlFor="setup-password">Mot de passe</Label><Input id="setup-password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <Button type="submit" className="w-full" disabled={disabled || password.length < 8}>{createMutation.isPending ? "Création…" : "Créer l'admin"}</Button>
          </form>
        )}

        <div className="mt-6 text-center text-xs"><Link to="/" className="text-muted-foreground hover:text-foreground">← Retour au site</Link></div>
      </div>
    </div>
  );
}