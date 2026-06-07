import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fr" | "ar";

type Dict = Record<string, { fr: string; ar: string }>;

const DICT: Dict = {
  "nav.menu": { fr: "Menu", ar: "القائمة" },
  "nav.gallery": { fr: "Galerie", ar: "المعرض" },
  "nav.about": { fr: "À propos", ar: "من نحن" },
  "nav.location": { fr: "Localisation", ar: "العنوان" },
  "nav.order": { fr: "Commander", ar: "اطلب الآن" },

  "hero.tag": { fr: "Tiaret · Crousty Food", ar: "تيارت · كروستي فود" },
  "hero.title1": { fr: "LE GOÛT", ar: "النكهة" },
  "hero.title2": { fr: "COMMENCE", ar: "تبدأ" },
  "hero.title3": { fr: "ICI", ar: "هنا" },
  "hero.subtitle": {
    fr: "Du poulet ultra-crousty, du riz, des frites — servis vite, faits avec passion.",
    ar: "دجاج مقرمش، أرز، بطاطس — يُقدَّم بسرعة وبشغف.",
  },
  "hero.cta": { fr: "Voir le menu", ar: "اطلب الآن" },
  "hero.cta2": { fr: "Nous appeler", ar: "اتصل بنا" },
  "hero.marquee": {
    fr: "RICEY CROUSTY · CHICKEN · RICE · FRIES · ALL WE DO ·",
    ar: "ريسي كروستي · دجاج · أرز · بطاطس · كل ما نقدمه ·",
  },

  "menu.tag": { fr: "Notre Menu", ar: "قائمتنا" },
  "menu.title": { fr: "CHOISIS TON BOL", ar: "اختر طبقك" },
  "menu.subtitle": {
    fr: "Chaque produit est préparé à la commande. Ajoute au panier en un tap.",
    ar: "كل طبق يُحضَّر عند الطلب. أضف إلى السلة بنقرة واحدة.",
  },

  "gallery.tag": { fr: "Galerie", ar: "المعرض" },
  "gallery.title": { fr: "ENTRE CHEZ NOUS", ar: "ادخل إلى عالمنا" },
  "gallery.subtitle": {
    fr: "Une vue rapide de notre devanture et de notre espace.",
    ar: "نظرة سريعة على واجهتنا وفضائنا الداخلي.",
  },
  "gallery.all": { fr: "Tout", ar: "الكل" },
  "gallery.exterior": { fr: "Extérieur", ar: "خارج" },
  "gallery.interior": { fr: "Intérieur", ar: "داخل" },

  "about.tag": { fr: "À propos", ar: "من نحن" },
  "about.title": { fr: "ALL WE DO IS CHICKEN, RICE & FRIES", ar: "كل ما نقدمه: دجاج، أرز، وبطاطس" },
  "about.body": {
    fr: "Ricey Crousty, c'est de la vraie street food : pas de fast food, juste du bon crousty food servi rapidement, à Tiaret.",
    ar: "ريسي كروستي ليس وجبات سريعة عادية، بل طعام مقرمش حقيقي يُقدَّم بسرعة، في تيارت.",
  },
  "about.stat1.k": { fr: "Recettes Signature", ar: "وصفات مميزة" },
  "about.stat2.k": { fr: "Sauces Maison", ar: "صلصات بيتية" },
  "about.stat3.k": { fr: "Min Préparation", ar: "دقائق التحضير" },

  "loc.tag": { fr: "Localisation", ar: "الموقع" },
  "loc.title": { fr: "VIENS NOUS VOIR", ar: "زورنا" },
  "loc.address": { fr: "Tiaret, Algérie", ar: "تيارت، الجزائر" },
  "loc.directions": { fr: "Itinéraire", ar: "الإتجاهات" },
  "loc.call": { fr: "Appeler", ar: "اتصل" },

  "cart.title": { fr: "Votre commande", ar: "طلبك" },
  "cart.empty": { fr: "Votre panier est vide", ar: "السلة فارغة" },
  "cart.subtotal": { fr: "Sous-total", ar: "المجموع الفرعي" },
  "cart.delivery": { fr: "Livraison", ar: "التوصيل" },
  "cart.total": { fr: "Total", ar: "المجموع" },
  "cart.checkout": { fr: "Commander via WhatsApp", ar: "اطلب عبر واتساب" },
  "cart.continue": { fr: "Continuer", ar: "متابعة" },
  "cart.back": { fr: "Retour", ar: "رجوع" },

  "co.title": { fr: "Finaliser la commande", ar: "إتمام الطلب" },
  "co.name": { fr: "Nom complet", ar: "الاسم الكامل" },
  "co.phone": { fr: "Téléphone", ar: "الهاتف" },
  "co.mode": { fr: "Mode de service", ar: "طريقة الخدمة" },
  "co.delivery": { fr: "Livraison", ar: "توصيل" },
  "co.pickup": { fr: "À emporter", ar: "استلام" },
  "co.address": { fr: "Adresse", ar: "العنوان" },
  "co.maps": { fr: "Lien Google Maps (optionnel)", ar: "رابط جوجل ماب (اختياري)" },
  "co.notes": { fr: "Instructions (optionnel)", ar: "ملاحظات (اختياري)" },
  "co.send": { fr: "Envoyer sur WhatsApp", ar: "إرسال عبر واتساب" },
  "co.required": { fr: "Champ obligatoire", ar: "حقل مطلوب" },

  "footer.rights": { fr: "Tous droits réservés.", ar: "جميع الحقوق محفوظة." },
  "footer.tag": { fr: "Le goût qui commence dès la première bouchée.", ar: "اللذة تبدأ من أول لقمة." },

  "currency": { fr: "DA", ar: "دج" },
};

type I18n = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
};

const Ctx = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("rc-lang")) as Lang | null;
    if (saved === "fr" || saved === "ar") setLangState(saved);
  }, []);

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("rc-lang", l);
  };

  const t = (key: string) => DICT[key]?.[lang] ?? key;

  return <Ctx.Provider value={{ lang, setLang, t, dir }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be inside I18nProvider");
  return v;
}
