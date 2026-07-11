import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { useRealtimeInvalidation } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  useRealtimeInvalidation();
  const [state, setState] = useState<"loading" | "ok" | "no-admin">("loading");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) { setState("no-admin"); return; }
      const { data } = await supabase
        .from("user_roles").select("role")
        .eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
      setState(data ? "ok" : "no-admin");
    })();
  }, []);

  if (state === "loading") {
    return <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">Chargement…</div>;
  }

  if (state === "no-admin") {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-6">
        <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card/60 p-8 text-center backdrop-blur-xl">
          <h1 className="font-display text-2xl tracking-wider">Accès restreint</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Votre compte n'a pas le rôle administrateur.
          </p>
          <button
            onClick={async () => { await supabase.auth.signOut(); location.href = "/auth"; }}
            className="mt-6 text-xs text-muted-foreground underline underline-offset-4"
          >Se déconnecter</button>
        </div>
      </div>
    );
  }

  return <AdminShell><Outlet /></AdminShell>;
}
