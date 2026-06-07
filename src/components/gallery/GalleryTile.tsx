import { useEffect, useRef, useState } from "react";
import { Expand } from "lucide-react";

interface GalleryTileProps {
  src: string;
  alt: string;
  category: string;
  onClick: () => void;
  className?: string;
  index: number;
}

export function GalleryTile({ src, alt, category, onClick, className, index }: GalleryTileProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      onClick={onClick}
      aria-label={`Open ${alt}`}
      style={{ transitionDelay: visible ? `${index * 80}ms` : "0ms" }}
      className={`group relative overflow-hidden rounded-2xl bg-muted ring-1 ring-border/50 shadow-lg transition-all duration-700 ease-out will-change-transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } hover:shadow-2xl hover:ring-primary/40 ${className ?? ""}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
        <div className="text-left">
          <span className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
            {category}
          </span>
          <p className="mt-2 text-sm sm:text-base font-medium text-white drop-shadow">{alt}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-transform duration-500 group-hover:scale-110 group-hover:bg-white/25">
          <Expand className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}
