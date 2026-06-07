## Heads up on the photos

You uploaded 10 images, but only 3 are actual photos of the restaurant:

1. `image.png` — Exterior storefront (Ricey Crousty sign, daytime)
2. `image-2.png` — Exterior storefront with red carpet entrance
3. `image-3.png` — Interior (counter, neon Ricey Crousty sign, flame wall decor)

The other 7 are menu/product graphics (Ricey Crousty, Spicy, Curry, Mix, Fries, Tenders, Drinks, Sauces, Desserts) — those are menu artwork, not restaurant photos.

Per your instruction (no stock photos, no generated images, only what you provide), the gallery will ship with just these 3 photos. There are no separate "seating area" or "decoration only" photos in the upload — the interior shot covers both. If you want richer coverage (seating, dining tables, more decor angles, exterior at night), upload them and I'll drop them in.

## What I'll build

**1. Gallery section on the homepage** (`src/routes/index.tsx`)
- New `<GallerySection />` between existing content
- Category chips: All · Exterior · Interior (only categories with actual photos)
- Animated grid: each tile fades + scales in on scroll, hover zoom + subtle tilt
- Lightbox: click a tile → full-screen overlay with prev/next arrows, keyboard nav (← → Esc), backdrop click to close, swipe support on mobile
- Mobile: single-column stack with snappy spring animation
- Desktop: 3-column masonry-style grid with the first tile spanning 2 cols for premium feel

**2. Assets**
- Upload the 3 restaurant photos to the CDN via `lovable-assets` and reference them through `.asset.json` pointers (keeps repo light, fast delivery)

**3. Component structure**
- `src/components/gallery/GallerySection.tsx` — section wrapper + grid
- `src/components/gallery/GalleryTile.tsx` — animated image card
- `src/components/gallery/Lightbox.tsx` — modal with nav
- Animations via existing Tailwind utilities (`animate-fade-in`, `animate-scale-in`) + a small IntersectionObserver hook for scroll-triggered reveal
- Lightbox uses the existing shadcn `Dialog` for accessibility (focus trap, Esc handling)

**4. Global CSS — hide Lovable badge**
- Add to `src/styles.css`:
```css
#lovable-badge { display: none !important; }
```

## Technical notes

- All colors via existing design tokens (`bg-background`, `text-foreground`, etc.) — no hardcoded values
- Photos use `loading="lazy"` and `decoding="async"` for performance
- Tile aspect ratio fixed (4/5 portrait) for visual consistency since the source photos are portrait
- Lightbox image uses `object-contain` so nothing is cropped at full view
- No new dependencies needed

## Ready to build?

Confirm and I'll implement. If you want to add more photos (seating, night shots, etc.) first, drop them in and I'll include them.