import { createFileRoute } from "@tanstack/react-router";

const ADMIN_EMAIL = "admin@riceycrousty.local";
const ADMIN_PASSWORD = "admin_riceycrousty1212@";

export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Find or create the sole admin user
        let userId: string | null = null;
        const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
        const existing = list?.users?.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL);
        if (existing) {
          userId = existing.id;
          await supabaseAdmin.auth.admin.updateUserById(existing.id, {
            password: ADMIN_PASSWORD,
            email_confirm: true,
          });
        } else {
          const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            email_confirm: true,
          });
          if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
          userId = created.user.id;
        }

        // Remove every other user (single-account policy)
        if (list?.users) {
          for (const u of list.users) {
            if (u.id !== userId) {
              await supabaseAdmin.auth.admin.deleteUser(u.id);
            }
          }
        }

        // Wipe user_roles and grant admin to the single user
        await supabaseAdmin.from("user_roles").delete().neq("user_id", userId!);
        await supabaseAdmin.from("user_roles").upsert(
          { user_id: userId!, role: "admin" },
          { onConflict: "user_id,role" },
        );

        return new Response(JSON.stringify({ ok: true, userId }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
