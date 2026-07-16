import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const OLD_PROJECT_REF = "niejysnlgbnhyxyvgddc";

function inferSupabaseProjectId(url: string): string {
  return url.match(/^https:\/\/([a-z0-9]+)\.supabase\.co/i)?.[1] ?? "";
}

function isOldSupabaseUrl(url: string): boolean {
  return url.includes(OLD_PROJECT_REF);
}

function firstUsableValue(...values: Array<string | undefined>): string {
  return values.find((value) => value && !isOldSupabaseUrl(value)) ?? "";
}

function getRuntimeSupabaseConfigScript() {
  const runtimeWindow = typeof window === "undefined"
    ? undefined
    : (window as Window & { __RICEY_SUPABASE_CONFIG__?: { url: string; publishableKey: string; projectId?: string } });
  if (runtimeWindow?.__RICEY_SUPABASE_CONFIG__) {
    return `window.__RICEY_SUPABASE_CONFIG__=${JSON.stringify(runtimeWindow.__RICEY_SUPABASE_CONFIG__)};`;
  }

  const env = typeof process === "undefined" ? {} : process.env;
  const url = firstUsableValue(env.BYO_SUPABASE_URL, env.SUPABASE_URL, import.meta.env.VITE_SUPABASE_URL);
  const publishableKey = env.BYO_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
  const projectId = firstUsableValue(env.BYO_SUPABASE_PROJECT_ID, env.SUPABASE_PROJECT_ID, import.meta.env.VITE_SUPABASE_PROJECT_ID) || inferSupabaseProjectId(url);

  return `window.__RICEY_SUPABASE_CONFIG__=${JSON.stringify({ url, publishableKey, projectId })};`;
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0a0a0a" },
      { title: "Ricey Crousty — Tiaret" },
      { name: "description", content: "Ricey Crousty Tiaret — Crousty chicken, rice & fries. Commande en ligne via WhatsApp." },
      { property: "og:title", content: "Ricey Crousty — Tiaret" },
      { property: "og:description", content: "Ricey Crousty Tiaret — Crousty chicken, rice & fries. Commande en ligne via WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ricey Crousty — Tiaret" },
      { name: "twitter:description", content: "Ricey Crousty Tiaret — Crousty chicken, rice & fries. Commande en ligne via WhatsApp." },
      { property: "og:image", content: "https://ricey-crousty.lovable.app/__l5e/assets-v1/01f37d06-09f6-4517-a067-7a175ea71daa/ricey-crousty-logo.jpg" },
      { name: "twitter:image", content: "https://ricey-crousty.lovable.app/__l5e/assets-v1/01f37d06-09f6-4517-a067-7a175ea71daa/ricey-crousty-logo.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/jpeg", href: "/__l5e/assets-v1/01f37d06-09f6-4517-a067-7a175ea71daa/ricey-crousty-logo.jpg" },
      { rel: "apple-touch-icon", href: "/__l5e/assets-v1/01f37d06-09f6-4517-a067-7a175ea71daa/ricey-crousty-logo.jpg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&family=Cairo:wght@400;600;700;800&family=Caveat:wght@600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: getRuntimeSupabaseConfigScript() }} />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
