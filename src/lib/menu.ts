import riceyCrousty from "@/assets/ricey-crousty.png.asset.json";
import riceySweet from "@/assets/ricey-sweet.png.asset.json";
import riceySpicy from "@/assets/ricey-spicy.png.asset.json";
import riceyCurry from "@/assets/ricey-curry.png.asset.json";
import riceyMix from "@/assets/ricey-mix.png.asset.json";
import riceyFries from "@/assets/ricey-fries.png.asset.json";
import tenders from "@/assets/tenders.png.asset.json";
import friedChips from "@/assets/fried-chips.png.asset.json";
import tiramisu from "@/assets/tiramisu.png.asset.json";
import tresLeche from "@/assets/tres-leche.png.asset.json";
import cheeseCake from "@/assets/cheese-cake.png.asset.json";
import whiteSauce from "@/assets/white-sauce.png.asset.json";
import sweetSauce from "@/assets/sweet-sauce.png.asset.json";
import currySauce from "@/assets/curry-sauce.png.asset.json";
import chilliSauce from "@/assets/chilli-sauce.png.asset.json";
import fanta from "@/assets/fanta.png.asset.json";
import water from "@/assets/water.png.asset.json";
import cocaCola from "@/assets/coca-cola.png.asset.json";
import hamoud from "@/assets/hamoud.png.asset.json";

export type Category = "ricey" | "sides" | "desserts" | "sauces" | "drinks";

export type Product = {
  id: string;
  image: string;
  price: number;
  category: Category;
  name: { fr: string; ar: string };
  desc?: { fr: string; ar: string };
  accent?: "red" | "mint" | "purple" | "orange" | "gold";
};

export const PRODUCTS: Product[] = [
  { id: "ricey-crousty", image: riceyCrousty.url, price: 550, category: "ricey", accent: "red",
    name: { fr: "Ricey Crousty", ar: "ريسي كروستي" },
    desc: { fr: "Riz blanc · Poulet crousty · Sauce blanche · Oignon frit · Persil",
            ar: "أرز أبيض · دجاج كروستي · صلصة بيضاء · بصل مقلي · بقدونس" } },
  { id: "ricey-sweet", image: riceySweet.url, price: 600, category: "ricey", accent: "mint",
    name: { fr: "Ricey Sweet", ar: "ريسي سويت" },
    desc: { fr: "Riz · Poulet crousty · Sauce blanche · Sauce sucrée · Oignon · Persil",
            ar: "أرز · دجاج كروستي · صلصة بيضاء · صلصة حلوة · بصل · بقدونس" } },
  { id: "ricey-spicy", image: riceySpicy.url, price: 600, category: "ricey", accent: "red",
    name: { fr: "Ricey Spicy", ar: "ريسي سبايسي" },
    desc: { fr: "Riz · Poulet crousty · Sauce blanche · Sauce piquante · Oignon · Persil",
            ar: "أرز · دجاج · صلصة بيضاء · صلصة حارة · بصل · بقدونس" } },
  { id: "ricey-curry", image: riceyCurry.url, price: 600, category: "ricey", accent: "orange",
    name: { fr: "Ricey Curry", ar: "ريسي كاري" },
    desc: { fr: "Riz · Poulet crousty · Sauce blanche · Sauce curry · Oignon · Persil",
            ar: "أرز · دجاج · صلصة بيضاء · صلصة كاري · بصل · بقدونس" } },
  { id: "ricey-mix", image: riceyMix.url, price: 600, category: "ricey", accent: "purple",
    name: { fr: "Ricey Mix", ar: "ريسي ميكس" },
    desc: { fr: "Riz · Poulet · Toutes les sauces · Oignon frit · Persil",
            ar: "أرز · دجاج · كل الصلصات · بصل مقلي · بقدونس" } },
  { id: "ricey-fries", image: riceyFries.url, price: 600, category: "ricey", accent: "gold",
    name: { fr: "Ricey Fries", ar: "ريسي فرايز" },
    desc: { fr: "Frites · Poulet crousty · Sauce blanche · Fromage · Oignon · Persil",
            ar: "بطاطس · دجاج · صلصة بيضاء · جبن · بصل · بقدونس" } },

  { id: "tenders", image: tenders.url, price: 400, category: "sides", accent: "red",
    name: { fr: "Tenders", ar: "تندرز" }, desc: { fr: "Aiguillettes croustillantes", ar: "قطع دجاج مقرمشة" } },
  { id: "fried-chips", image: friedChips.url, price: 200, category: "sides", accent: "red",
    name: { fr: "Frites", ar: "بطاطس مقلية" }, desc: { fr: "Frites croustillantes", ar: "بطاطس مقرمشة" } },

  { id: "tiramisu", image: tiramisu.url, price: 300, category: "desserts", accent: "red",
    name: { fr: "Tiramisu", ar: "تيراميسو" } },
  { id: "tres-leche", image: tresLeche.url, price: 300, category: "desserts", accent: "red",
    name: { fr: "Tres Leches", ar: "تريس ليتشي" } },
  { id: "cheese-cake", image: cheeseCake.url, price: 300, category: "desserts", accent: "red",
    name: { fr: "Cheesecake", ar: "تشيز كيك" } },

  { id: "white-sauce", image: whiteSauce.url, price: 50, category: "sauces",
    name: { fr: "Sauce Blanche", ar: "صلصة بيضاء" } },
  { id: "sweet-sauce", image: sweetSauce.url, price: 50, category: "sauces",
    name: { fr: "Sauce Sucrée", ar: "صلصة حلوة" } },
  { id: "curry-sauce", image: currySauce.url, price: 50, category: "sauces",
    name: { fr: "Sauce Curry", ar: "صلصة كاري" } },
  { id: "chilli-sauce", image: chilliSauce.url, price: 50, category: "sauces",
    name: { fr: "Sauce Piquante", ar: "صلصة حارة" } },

  { id: "fanta", image: fanta.url, price: 70, category: "drinks",
    name: { fr: "Fanta 33cl", ar: "فانتا 33سل" } },
  { id: "water", image: water.url, price: 50, category: "drinks",
    name: { fr: "Eau Minérale 0.5L", ar: "ماء معدنية 0.5ل" } },
  { id: "coca-cola", image: cocaCola.url, price: 150, category: "drinks",
    name: { fr: "Coca-Cola 1L", ar: "كوكا كولا 1ل" } },
  { id: "hamoud", image: hamoud.url, price: 100, category: "drinks",
    name: { fr: "Hamoud (canette)", ar: "حمود (علبة)" } },
];

export const CATEGORIES: { id: Category | "all"; label: { fr: string; ar: string } }[] = [
  { id: "all", label: { fr: "Tout", ar: "الكل" } },
  { id: "ricey", label: { fr: "Ricey", ar: "ريسي" } },
  { id: "sides", label: { fr: "Sides", ar: "إضافات" } },
  { id: "desserts", label: { fr: "Desserts", ar: "حلويات" } },
  { id: "sauces", label: { fr: "Sauces", ar: "صلصات" } },
  { id: "drinks", label: { fr: "Boissons", ar: "مشروبات" } },
];

export const DELIVERY_FEE = 200;
export const WHATSAPP_NUMBER = "213549539046"; // +213 549 53 90 46
export const MAPS_LINK = "https://maps.app.goo.gl/WAyzzjRJkHN8nH3n8";
export const MAPS_EMBED_QUERY = "Ricey Crousty Tiaret";
