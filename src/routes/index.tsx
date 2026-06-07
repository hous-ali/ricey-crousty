import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/contexts/I18nContext";
import { CartProvider } from "@/contexts/CartContext";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { MenuSection } from "@/components/menu/MenuSection";
import { GallerySection } from "@/components/gallery/GallerySection";
import { AboutSection } from "@/components/site/AboutSection";
import { LocationSection } from "@/components/site/LocationSection";
import { Footer } from "@/components/site/Footer";
import { FloatingCart } from "@/components/cart/FloatingCart";
import { CartSheet } from "@/components/cart/CartSheet";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ricey Crousty — Tiaret · Commander en ligne" },
      {
        name: "description",
        content: "Crousty chicken, riz & frites. Commande en ligne, livraison à Tiaret ou à emporter.",
      },
      { property: "og:title", content: "Ricey Crousty — Tiaret" },
      {
        property: "og:description",
        content: "Crousty chicken, riz & frites. Commande en ligne via WhatsApp.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <I18nProvider>
      <CartProvider>
        <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
          <Header />
          <main>
            <Hero />
            <MenuSection />
            <GallerySection />
            <AboutSection />
            <LocationSection />
          </main>
          <Footer />
          <FloatingCart />
          <CartSheet />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}
