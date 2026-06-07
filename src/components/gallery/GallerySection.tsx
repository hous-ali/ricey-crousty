import { useMemo, useState } from "react";
import exteriorDay from "@/assets/exterior-day.png.asset.json";
import exteriorEntrance from "@/assets/exterior-entrance.png.asset.json";
import interiorCounter from "@/assets/interior-counter.png.asset.json";
import { GalleryTile } from "./GalleryTile";
import { Lightbox, type GalleryPhoto } from "./Lightbox";

const PHOTOS: GalleryPhoto[] = [
  {
    src: exteriorEntrance.url,
    alt: "Ricey Crousty storefront entrance with red carpet",
    category: "Exterior",
  },
  {
    src: interiorCounter.url,
    alt: "Inside the restaurant — neon Ricey Crousty sign and flame wall",
    category: "Interior",
  },
  {
    src: exteriorDay.url,
    alt: "Ricey Crousty signage by day",
    category: "Exterior",
  },
];

const CATEGORIES = ["All", "Exterior", "Interior"] as const;
type Category = (typeof CATEGORIES)[number];

export function GallerySection() {
  const [filter, setFilter] = useState<Category>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === "All" ? PHOTOS : PHOTOS.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <section id="gallery" className="relative bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center sm:mb-14">
          <span className="inline-block rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Gallery
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Step inside Ricey Crousty
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-muted-foreground">
            A quick look at our storefront and dining space — discover the atmosphere
            before you order.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => {
            const active = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filtered.map((photo, i) => {
            const featured = filter === "All" && i === 0;
            return (
              <GalleryTile
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                category={photo.category}
                index={i}
                onClick={() => setOpenIndex(i)}
                className={`aspect-[4/5] ${
                  featured ? "lg:col-span-2 lg:row-span-2 lg:aspect-auto" : ""
                }`}
              />
            );
          })}
        </div>
      </div>

      {openIndex !== null && (
        <Lightbox
          photos={filtered}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </section>
  );
}
