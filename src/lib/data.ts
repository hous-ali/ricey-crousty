import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Category = Tables<"categories">;
export type Product = Tables<"products">;
export type GalleryImage = Tables<"gallery_images">;
export type Banner = Tables<"banners">;
export type Order = Tables<"orders">;
export type SiteSettings = Tables<"site_settings">;

export type HoursMap = Partial<Record<
  "sat" | "sun" | "mon" | "tue" | "wed" | "thu" | "fri",
  { open: string; close: string } | null
>>;

export type SiteTexts = Partial<{
  hero_tag: { fr: string; ar: string };
  hero_subtitle: { fr: string; ar: string };
  footer_tag: { fr: string; ar: string };
  about: { fr: string; ar: string };
}>;

export const qk = {
  categories: ["categories"] as const,
  products: ["products"] as const,
  gallery: ["gallery"] as const,
  banners: ["banners"] as const,
  settings: ["settings"] as const,
  orders: ["orders"] as const,
};

export const categoriesQuery = queryOptions({
  queryKey: qk.categories,
  queryFn: async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const productsQuery = queryOptions({
  queryKey: qk.products,
  queryFn: async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const galleryQuery = queryOptions({
  queryKey: qk.gallery,
  queryFn: async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const bannersQuery = queryOptions({
  queryKey: qk.banners,
  queryFn: async () => {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const settingsQuery = queryOptions({
  queryKey: qk.settings,
  queryFn: async (): Promise<SiteSettings | null> => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const ordersQuery = queryOptions({
  queryKey: qk.orders,
  queryFn: async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

// Public storage URL helper (private buckets are readable via policy).
export function storageUrl(bucket: string, path: string): string {
  const base = import.meta.env.VITE_SUPABASE_URL as string;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

export function isOpenByHours(hours: HoursMap, closedOverride: boolean, now: Date = new Date()): boolean {
  if (closedOverride) return false;
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Algiers",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const map: Record<string, keyof HoursMap> = {
    Sun: "sun", Mon: "mon", Tue: "tue", Wed: "wed", Thu: "thu", Fri: "fri", Sat: "sat",
  };
  const orderList: (keyof HoursMap)[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const today = map[get("weekday")];
  if (!today) return false;
  let hour = parseInt(get("hour"), 10);
  if (hour === 24) hour = 0;
  const minute = parseInt(get("minute"), 10);
  const minutes = hour * 60 + minute;

  const parseHM = (s: string): number => {
    const [h, m] = s.split(":").map(Number);
    return h * 60 + (m || 0);
  };
  const isOpenWindow = (day: keyof HoursMap, curMin: number, sameDay: boolean): boolean => {
    const w = hours[day];
    if (!w) return false;
    const openMin = parseHM(w.open);
    const closeMin = parseHM(w.close);
    if (closeMin > openMin) {
      // Same-day window
      return sameDay && curMin >= openMin && curMin < closeMin;
    }
    // Wraps past midnight
    if (sameDay) return curMin >= openMin;
    return curMin < closeMin; // tail from previous day
  };

  const idx = orderList.indexOf(today);
  const prev = orderList[(idx + 6) % 7];
  return isOpenWindow(today, minutes, true) || isOpenWindow(prev, minutes, false);
}
