import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, UtensilsCrossed, Layers, Images, Megaphone, ShoppingBag, Settings, LogOut, ExternalLink, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";
import logoAsset from "@/assets/ricey-crousty-logo.jpg.asset.json";
import { useQueryClient } from "@tanstack/react-query";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/admin/categories", label: "Catégories", icon: Layers },
  { to: "/admin/gallery", label: "Galerie", icon: Images },
  { to: "/admin/banners", label: "Bannières", icon: Megaphone },
  { to: "/admin/orders", label: "Commandes", icon: ShoppingBag },
  { to: "/admin/settings", label: "Paramètres", icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(to + "/");

  const SideNav = (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border/60 bg-card/40 backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-border/60 px-5 py-4">
        <img src={logoAsset.url} alt="" className="h-9 w-9 rounded-full object-cover shadow-flame" />
        <div className="leading-tight">
          <div className="font-display text-lg tracking-wider">RICEY</div>
          <div className="text-[9px] font-semibold tracking-[0.3em] text-flame">ADMIN PANEL</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to, item.exact);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-flame text-accent-foreground shadow-flame" : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-border/60 p-3">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-card hover:text-foreground">
          <ExternalLink className="h-4 w-4" /> Voir le site
        </a>
        <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-card hover:text-destructive">
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">{SideNav}</div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur" onClick={() => setOpen(false)} />
          <div className="relative">{SideNav}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="menu" className="rounded-lg border border-border/60 p-2">
            <Menu className="h-4 w-4" />
          </button>
          <span className="font-display text-lg tracking-wider">ADMIN</span>
        </header>
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
