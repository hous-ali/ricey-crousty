import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { qk } from "@/lib/data";

export type AuthState = {
  loading: boolean;
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
};

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: true, userId: null, email: null, isAdmin: false,
  });

  useEffect(() => {
    let cancelled = false;

    const checkAdmin = async (uid: string): Promise<boolean> => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    };

    const apply = async (session: { user: { id: string; email?: string | null } } | null) => {
      if (!session) {
        if (!cancelled) setState({ loading: false, userId: null, email: null, isAdmin: false });
        return;
      }
      const admin = await checkAdmin(session.user.id);
      if (!cancelled) setState({
        loading: false,
        userId: session.user.id,
        email: session.user.email ?? null,
        isAdmin: admin,
      });
    };

    supabase.auth.getSession().then(({ data }) => apply(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      apply(session);
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  return state;
}

/** Subscribes to realtime changes and invalidates matching query keys. */
export function useRealtimeInvalidation() {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel("site-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" },
        () => qc.invalidateQueries({ queryKey: qk.products }))
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" },
        () => qc.invalidateQueries({ queryKey: qk.categories }))
      .on("postgres_changes", { event: "*", schema: "public", table: "gallery_images" },
        () => qc.invalidateQueries({ queryKey: qk.gallery }))
      .on("postgres_changes", { event: "*", schema: "public", table: "banners" },
        () => qc.invalidateQueries({ queryKey: qk.banners }))
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" },
        () => qc.invalidateQueries({ queryKey: qk.settings }))
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" },
        () => qc.invalidateQueries({ queryKey: qk.orders }))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);
}
