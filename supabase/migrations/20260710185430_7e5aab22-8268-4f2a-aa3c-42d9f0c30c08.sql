
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "self can read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Bootstrap: first authenticated user to call promotes themselves if no admin exists.
CREATE OR REPLACE FUNCTION public.claim_admin_bootstrap()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE has_any boolean; uid uuid;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO has_any;
  IF has_any THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin');
  RETURN true;
END; $$;
GRANT EXECUTE ON FUNCTION public.claim_admin_bootstrap() TO authenticated;

-- updated_at helper
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_fr text NOT NULL,
  name_ar text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "admins write categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  category_id uuid REFERENCES public.categories(id) ON DELETE RESTRICT,
  name_fr text NOT NULL,
  name_ar text NOT NULL,
  desc_fr text,
  desc_ar text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text,
  accent text,
  sort_order int NOT NULL DEFAULT 0,
  is_available boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "admins write products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Gallery
CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text,
  category text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read gallery" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "admins write gallery" ON public.gallery_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Banners
CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_fr text NOT NULL,
  message_ar text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.banners TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.banners TO authenticated;
GRANT ALL ON public.banners TO service_role;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read banners" ON public.banners FOR SELECT USING (
  is_active AND (starts_at IS NULL OR starts_at <= now()) AND (ends_at IS NULL OR ends_at >= now())
);
CREATE POLICY "admins read all banners" ON public.banners FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins write banners" ON public.banners FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_banners_updated BEFORE UPDATE ON public.banners
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Orders
CREATE TYPE public.order_status AS ENUM ('pending','preparing','ready','delivered','cancelled');
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text,
  items jsonb NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can place order" ON public.orders FOR INSERT
  WITH CHECK (true);
CREATE POLICY "admins read orders" ON public.orders FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update orders" ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete orders" ON public.orders FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Site settings (single row)
CREATE TABLE public.site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name text NOT NULL DEFAULT 'Ricey Crousty',
  logo_url text,
  whatsapp text NOT NULL DEFAULT '213779862137',
  delivery_fee numeric(10,2) NOT NULL DEFAULT 200,
  instagram_url text,
  maps_url text,
  hours jsonb NOT NULL DEFAULT '{}'::jsonb,
  texts jsonb NOT NULL DEFAULT '{}'::jsonb,
  closed_override boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "admins update settings" ON public.site_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.products, public.categories, public.gallery_images, public.banners, public.orders, public.site_settings;

-- Seed categories
INSERT INTO public.categories (slug, name_fr, name_ar, sort_order) VALUES
  ('ricey','Ricey','ريسي',1),
  ('sides','Sides','إضافات',2),
  ('desserts','Desserts','حلويات',3),
  ('sauces','Sauces','صلصات',4),
  ('drinks','Boissons','مشروبات',5);

-- Seed products
INSERT INTO public.products (slug, category_id, name_fr, name_ar, desc_fr, desc_ar, price, accent, sort_order) VALUES
  ('ricey-crousty', (SELECT id FROM public.categories WHERE slug='ricey'), 'Ricey Crousty','ريسي كروستي','Riz blanc · Poulet crousty · Sauce blanche · Oignon frit · Persil','أرز أبيض · دجاج كروستي · صلصة بيضاء · بصل مقلي · بقدونس',550,'red',1),
  ('ricey-sweet',  (SELECT id FROM public.categories WHERE slug='ricey'), 'Ricey Sweet','ريسي سويت','Riz · Poulet crousty · Sauce blanche · Sauce sucrée · Oignon · Persil','أرز · دجاج كروستي · صلصة بيضاء · صلصة حلوة · بصل · بقدونس',600,'mint',2),
  ('ricey-spicy',  (SELECT id FROM public.categories WHERE slug='ricey'), 'Ricey Spicy','ريسي سبايسي','Riz · Poulet crousty · Sauce blanche · Sauce piquante · Oignon · Persil','أرز · دجاج · صلصة بيضاء · صلصة حارة · بصل · بقدونس',600,'red',3),
  ('ricey-curry',  (SELECT id FROM public.categories WHERE slug='ricey'), 'Ricey Curry','ريسي كاري','Riz · Poulet crousty · Sauce blanche · Sauce curry · Oignon · Persil','أرز · دجاج · صلصة بيضاء · صلصة كاري · بصل · بقدونس',600,'orange',4),
  ('ricey-mix',    (SELECT id FROM public.categories WHERE slug='ricey'), 'Ricey Mix','ريسي ميكس','Riz · Poulet · Toutes les sauces · Oignon frit · Persil','أرز · دجاج · كل الصلصات · بصل مقلي · بقدونس',600,'purple',5),
  ('ricey-fries',  (SELECT id FROM public.categories WHERE slug='ricey'), 'Ricey Fries','ريسي فرايز','Frites · Poulet crousty · Sauce blanche · Fromage · Oignon · Persil','بطاطس · دجاج · صلصة بيضاء · جبن · بصل · بقدونس',600,'gold',6),
  ('tenders',      (SELECT id FROM public.categories WHERE slug='sides'), 'Tenders','تندرز','Aiguillettes croustillantes','قطع دجاج مقرمشة',400,'red',1),
  ('fried-chips',  (SELECT id FROM public.categories WHERE slug='sides'), 'Frites','بطاطس مقلية','Frites croustillantes','بطاطس مقرمشة',200,'red',2),
  ('tiramisu',     (SELECT id FROM public.categories WHERE slug='desserts'), 'Tiramisu','تيراميسو',NULL,NULL,300,'red',1),
  ('tres-leche',   (SELECT id FROM public.categories WHERE slug='desserts'), 'Tres Leches','تريس ليتشي',NULL,NULL,300,'red',2),
  ('cheese-cake',  (SELECT id FROM public.categories WHERE slug='desserts'), 'Cheesecake','تشيز كيك',NULL,NULL,300,'red',3),
  ('white-sauce',  (SELECT id FROM public.categories WHERE slug='sauces'), 'Sauce Blanche','صلصة بيضاء',NULL,NULL,50,NULL,1),
  ('sweet-sauce',  (SELECT id FROM public.categories WHERE slug='sauces'), 'Sauce Sucrée','صلصة حلوة',NULL,NULL,50,NULL,2),
  ('curry-sauce',  (SELECT id FROM public.categories WHERE slug='sauces'), 'Sauce Curry','صلصة كاري',NULL,NULL,50,NULL,3),
  ('chilli-sauce', (SELECT id FROM public.categories WHERE slug='sauces'), 'Sauce Piquante','صلصة حارة',NULL,NULL,50,NULL,4),
  ('fanta',        (SELECT id FROM public.categories WHERE slug='drinks'), 'Fanta 33cl','فانتا 33سل',NULL,NULL,70,NULL,1),
  ('water',        (SELECT id FROM public.categories WHERE slug='drinks'), 'Eau Minérale 0.5L','ماء معدنية 0.5ل',NULL,NULL,50,NULL,2),
  ('coca-cola',    (SELECT id FROM public.categories WHERE slug='drinks'), 'Coca-Cola 1L','كوكا كولا 1ل',NULL,NULL,150,NULL,3),
  ('hamoud',       (SELECT id FROM public.categories WHERE slug='drinks'), 'Hamoud (canette)','حمود (علبة)',NULL,NULL,100,NULL,4);

-- Seed site settings
INSERT INTO public.site_settings (id, name, whatsapp, delivery_fee, maps_url, hours, texts) VALUES
  (1, 'Ricey Crousty', '213779862137', 200,
   'https://maps.app.goo.gl/WAyzzjRJkHN8nH3n8',
   '{"sat":{"open":"10:00","close":"01:30"},"sun":{"open":"10:00","close":"01:30"},"mon":{"open":"10:00","close":"01:30"},"tue":{"open":"10:00","close":"01:30"},"wed":{"open":"10:00","close":"01:30"},"thu":{"open":"10:00","close":"01:30"},"fri":{"open":"14:00","close":"01:30"}}'::jsonb,
   '{}'::jsonb);
