
# Ricey Crousty — Admin Panel

Goal: give the owner a private, password-protected panel that controls every dynamic part of the public site in real time, without changing the customer-facing look.

## 1. Backend (Lovable Cloud)

Schema (Postgres, all RLS-enabled, public SELECT for site data, writes gated by `admin` role):

- `categories` — id, slug, name_fr, name_ar, sort_order, is_active
- `products` — id, category_id, name_fr, name_ar, desc_fr, desc_ar, price, image_url, accent, sort_order, is_available, is_featured
- `gallery_images` — id, image_url, caption, sort_order
- `banners` — id, message_fr, message_ar, is_active, starts_at, ends_at
- `orders` — id, customer_name, phone, address, items (jsonb), subtotal, delivery_fee, total, status (`pending|preparing|ready|delivered|cancelled`), notes, created_at
- `site_settings` — single-row key/value JSON: name, logo_url, whatsapp, delivery_fee, instagram_url, maps_url, hours (JSON per weekday), texts (JSON of editable copy blocks), closed_override (bool)
- `user_roles` + `app_role` enum + `has_role()` security-definer function (per platform rules — never store role on profiles)

Storage buckets: `product-images`, `gallery`, `branding` (public read; authenticated write).

Seed migration copies current `PRODUCTS`, `CATEGORIES`, gallery, and settings (WhatsApp, hours, delivery fee, maps link) into the DB so nothing disappears on launch.

## 2. Auth

Email + password only. First-time setup: owner signs up, then a one-shot server function grants the `admin` role if no admin exists yet (bootstrap). After that, only existing admins can grant admin.

Protected routes live under `src/routes/_authenticated/admin/*` using the managed auth layout. Non-admins signing in are redirected to `/auth` with an "unauthorized" message.

## 3. Admin UI (`/admin`)

Sidebar layout, responsive (drawer on mobile), matches site's dark flame theme (reuses tokens — no new palette).

Sections:

- **Dashboard** — today's orders, revenue, pending count, open/closed status, quick "force closed" toggle.
- **Menu** — table + drawer editor. Add/edit/delete, price, FR/AR name & description, image upload/replace, availability toggle, featured toggle, drag-and-drop reorder (`@dnd-kit`).
- **Categories** — inline rename, add, delete (blocked if products attached), drag reorder.
- **Gallery** — grid; upload (multi), replace, delete, drag reorder.
- **Banners** — list + editor with schedule and active toggle.
- **Orders** — searchable/filterable table (status, date, phone); detail drawer with status dropdown; realtime new-order toast via Supabase Realtime.
- **Settings** — restaurant name, logo upload, WhatsApp number, delivery fee, Instagram, Google Maps link, opening hours per weekday, editable text blocks (hero tagline, about text, footer note), manual open/close override.

All mutations use `createServerFn` with `requireSupabaseAuth` + admin role check, then invalidate TanStack Query keys so the public site refreshes.

## 4. Customer site changes (data source only, UI untouched)

- `src/lib/menu.ts` becomes a fallback + types file; `PRODUCTS`, `CATEGORIES` fetched from DB via server function, cached with TanStack Query.
- `Hero`, `Footer`, `Header`, `LocationSection`, `GallerySection`, `ClosedScreen`, `hours.ts` read from `site_settings`.
- Checkout submits an `orders` row (in addition to the existing WhatsApp redirect).
- Supabase Realtime subscription invalidates queries so edits appear on the live site within seconds — no reload.

Layout, colors, animations, fonts, cart flow: unchanged.

## 5. Order of implementation

1. Enable Cloud, run migration (schema + seed + RLS + roles + storage buckets).
2. Auth pages + admin bootstrap.
3. Public site reads from DB (behind Query, with seeded data so nothing visually changes).
4. Admin shell + Menu + Categories.
5. Gallery + Settings + Banners.
6. Orders (write on checkout + admin view + realtime).
7. Verify open/close, image uploads, and live updates end-to-end.

## Technical notes

- Server functions in `src/lib/admin/*.functions.ts` (client-safe path); admin-only ones use `requireSupabaseAuth` + `has_role(uid,'admin')` check inside handler.
- Image uploads: signed upload via server fn → client PUT to Storage → save returned public URL.
- Drag reorder persists new `sort_order` in a single batched update.
- Realtime: one channel per table subscribed in a root effect; on change → `queryClient.invalidateQueries`.
- No design tokens changed; admin reuses existing shadcn components.

Approve to proceed, or tell me what to cut/add.
