import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const OLD_PROJECT_REF = "niejysnlgbnhyxyvgddc";

type SetupStatus = {
  configured: boolean;
  projectId: string | null;
  usingOldProject: boolean;
  hasServiceRole: boolean;
  hasPublishableKey: boolean;
  authHealthOk: boolean;
  schemaReady: boolean;
  storageReady: boolean;
  adminCount: number;
  errors: string[];
};

type CreateFirstAdminInput = { email: string; password: string };

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined);
    if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function inferProjectId(url: string): string | null {
  return url.match(/^https:\/\/([a-z0-9]+)\.supabase\.co/i)?.[1] ?? null;
}

function getConfig() {
  const url = process.env.BYO_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const publishableKey = process.env.BYO_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "";
  const serviceRoleKey = process.env.BYO_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const projectId = process.env.BYO_SUPABASE_PROJECT_ID || process.env.SUPABASE_PROJECT_ID || inferProjectId(url);
  return { url, publishableKey, serviceRoleKey, projectId };
}

function createAdminClient(): SupabaseClient<Database> {
  const { url, serviceRoleKey } = getConfig();
  if (!url || !serviceRoleKey) throw new Error("Missing Supabase URL or service role key for setup.");
  return createClient<Database>(url, serviceRoleKey, {
    global: { fetch: createSupabaseFetch(serviceRoleKey) },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

async function getAdminCount(admin: SupabaseClient<Database>): Promise<number> {
  const { count, error } = await admin.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "admin");
  if (error) throw error;
  return count ?? 0;
}

async function ensureStorageBuckets(admin: SupabaseClient<Database>) {
  const required = ["product-images", "gallery", "branding"];
  const { data, error } = await admin.storage.listBuckets();
  if (error) throw error;
  const existing = new Set((data ?? []).map((bucket) => bucket.name));
  for (const bucket of required) {
    if (!existing.has(bucket)) {
      const { error: createError } = await admin.storage.createBucket(bucket, { public: false });
      if (createError && !createError.message.toLowerCase().includes("already exists")) throw createError;
    }
  }
}

async function findUserIdByEmail(admin: SupabaseClient<Database>, email: string): Promise<string | null> {
  const normalized = email.trim().toLowerCase();
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const match = data.users.find((user) => user.email?.toLowerCase() === normalized);
    if (match) return match.id;
    if (data.users.length < 100) break;
  }
  return null;
}

export async function getAdminSetupStatusServer(): Promise<SetupStatus> {
  const { url, publishableKey, serviceRoleKey, projectId } = getConfig();
  const errors: string[] = [];
  const usingOldProject = projectId === OLD_PROJECT_REF || url.includes(OLD_PROJECT_REF);
  let authHealthOk = false;
  let schemaReady = false;
  let storageReady = false;
  let adminCount = 0;

  if (!url) errors.push("Missing Supabase URL.");
  if (!publishableKey) errors.push("Missing Supabase publishable key.");
  if (!serviceRoleKey) errors.push("Missing Supabase service role key.");
  if (usingOldProject) errors.push("The app is still pointed at the old Supabase project.");

  if (url && publishableKey) {
    try {
      const response = await fetch(`${url}/auth/v1/health`, { headers: { apikey: publishableKey } });
      authHealthOk = response.ok;
      if (!response.ok) errors.push(`Auth health check failed with HTTP ${response.status}.`);
    } catch (error) {
      errors.push((error as Error).message);
    }
  }

  if (url && serviceRoleKey && !usingOldProject) {
    try {
      const admin = createAdminClient();
      adminCount = await getAdminCount(admin);
      schemaReady = true;
      await ensureStorageBuckets(admin);
      storageReady = true;
    } catch (error) {
      errors.push((error as Error).message);
    }
  }

  return {
    configured: !!url && !!publishableKey && !!serviceRoleKey && !usingOldProject && authHealthOk && schemaReady && storageReady,
    projectId: projectId ?? null,
    usingOldProject,
    hasServiceRole: !!serviceRoleKey,
    hasPublishableKey: !!publishableKey,
    authHealthOk,
    schemaReady,
    storageReady,
    adminCount,
    errors,
  };
}

export async function createFirstAdminServer(input: CreateFirstAdminInput) {
  const status = await getAdminSetupStatusServer();
  if (!status.configured) throw new Error(status.errors[0] || "Supabase setup is not ready.");
  if (status.adminCount > 0) return { created: false, email: input.email, message: "An admin account already exists." };

  const admin = createAdminClient();
  const email = input.email.trim().toLowerCase();
  let userId: string | null = null;
  const { data, error } = await admin.auth.admin.createUser({ email, password: input.password, email_confirm: true });

  if (error) {
    if (!error.message.toLowerCase().includes("already")) throw error;
    userId = await findUserIdByEmail(admin, email);
    if (!userId) throw error;
  } else {
    userId = data.user?.id ?? null;
  }

  if (!userId) throw new Error("Admin user could not be created.");
  const { error: roleError } = await admin.from("user_roles").upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
  if (roleError) throw roleError;
  return { created: true, email, message: "Admin account is ready." };
}