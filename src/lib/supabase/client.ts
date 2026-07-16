import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const OLD_PROJECT_REF = "niejysnlgbnhyxyvgddc";

type RuntimeSupabaseConfig = {
  url: string;
  publishableKey: string;
  projectId?: string;
};

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) {
      headers.delete("Authorization");
    }

    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function getProcessEnv(): Record<string, string | undefined> {
  if (typeof process === "undefined") return {};
  return process.env as Record<string, string | undefined>;
}

function inferProjectId(url: string): string | undefined {
  return url.match(/^https:\/\/([a-z0-9]+)\.supabase\.co/i)?.[1];
}

function isOldProjectValue(value: string | undefined): boolean {
  return !!value && value.includes(OLD_PROJECT_REF);
}

function firstUsableValue(...values: Array<string | undefined>): string | undefined {
  return values.find((value) => value && !isOldProjectValue(value));
}

function assertNewProject(config: RuntimeSupabaseConfig) {
  const projectId = config.projectId || inferProjectId(config.url);
  if (projectId === OLD_PROJECT_REF || config.url.includes(OLD_PROJECT_REF)) {
    throw new Error("Supabase is still configured with the old project. Update the runtime Supabase config before signing in.");
  }
}

export function getSupabaseRuntimeConfig(): RuntimeSupabaseConfig {
  const runtimeWindow = typeof window === "undefined"
    ? undefined
    : (window as Window & { __RICEY_SUPABASE_CONFIG__?: RuntimeSupabaseConfig });
  if (runtimeWindow?.__RICEY_SUPABASE_CONFIG__) {
    const config = runtimeWindow.__RICEY_SUPABASE_CONFIG__;
    assertNewProject(config);
    return config;
  }

  const env = getProcessEnv();
  const url = firstUsableValue(env.BYO_SUPABASE_URL, env.SUPABASE_URL, import.meta.env.VITE_SUPABASE_URL);
  const publishableKey = env.BYO_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY;
  const projectId = firstUsableValue(env.BYO_SUPABASE_PROJECT_ID, env.SUPABASE_PROJECT_ID, import.meta.env.VITE_SUPABASE_PROJECT_ID) || (url ? inferProjectId(url) : undefined);

  if (!url || !publishableKey) {
    throw new Error("Missing Supabase URL or publishable key. Add the new project configuration before signing in.");
  }

  const config = { url, publishableKey, projectId };
  assertNewProject(config);
  return config;
}

function createSupabaseClient() {
  const config = getSupabaseRuntimeConfig();

  return createClient<Database>(config.url, config.publishableKey, {
    global: { fetch: createSupabaseFetch(config.publishableKey) },
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let supabaseClient: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!supabaseClient) supabaseClient = createSupabaseClient();
    return Reflect.get(supabaseClient, prop, receiver);
  },
});

export function getSupabaseUrl(): string {
  return getSupabaseRuntimeConfig().url;
}