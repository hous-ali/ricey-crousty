import { createFileRoute } from "@tanstack/react-router";
import { GallerySection } from "@/components/gallery/GallerySection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ricey Crousty — Gallery" },
      {
        name: "description",
        content:
          "Step inside Ricey Crousty — see our storefront and dining space before you order.",
      },
      { property: "og:title", content: "Ricey Crousty — Gallery" },
      {
        property: "og:description",
        content:
          "Step inside Ricey Crousty — see our storefront and dining space before you order.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <GallerySection />
    </main>
  );
}
