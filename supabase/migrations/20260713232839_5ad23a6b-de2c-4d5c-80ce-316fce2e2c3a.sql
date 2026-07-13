
-- Create private schema not exposed by PostgREST
CREATE SCHEMA IF NOT EXISTS private_security;
REVOKE ALL ON SCHEMA private_security FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private_security TO postgres, service_role;

-- Recreate has_role in private schema
CREATE OR REPLACE FUNCTION private_security.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

REVOKE ALL ON FUNCTION private_security.has_role(uuid, public.app_role) FROM PUBLIC;
-- Postgres requires the invoker of a function used in an RLS predicate to have EXECUTE.
-- Granting to authenticated is required for policies to evaluate; the function lives in a
-- non-API schema so PostgREST won't expose it as a callable RPC.
GRANT EXECUTE ON FUNCTION private_security.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Update all policies to reference private_security.has_role
DROP POLICY "admins manage roles" ON public.user_roles;
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL
  USING (private_security.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private_security.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "admins write categories" ON public.categories;
CREATE POLICY "admins write categories" ON public.categories FOR ALL
  USING (private_security.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private_security.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "admins write products" ON public.products;
CREATE POLICY "admins write products" ON public.products FOR ALL
  USING (private_security.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private_security.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "admins write gallery" ON public.gallery_images;
CREATE POLICY "admins write gallery" ON public.gallery_images FOR ALL
  USING (private_security.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private_security.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "admins read all banners" ON public.banners;
CREATE POLICY "admins read all banners" ON public.banners FOR SELECT
  USING (private_security.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "admins write banners" ON public.banners;
CREATE POLICY "admins write banners" ON public.banners FOR ALL
  USING (private_security.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private_security.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "admins read orders" ON public.orders;
CREATE POLICY "admins read orders" ON public.orders FOR SELECT
  USING (private_security.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "admins update orders" ON public.orders;
CREATE POLICY "admins update orders" ON public.orders FOR UPDATE
  USING (private_security.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "admins delete orders" ON public.orders;
CREATE POLICY "admins delete orders" ON public.orders FOR DELETE
  USING (private_security.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "admins update settings" ON public.site_settings;
CREATE POLICY "admins update settings" ON public.site_settings FOR UPDATE
  USING (private_security.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "admins upload site images" ON storage.objects;
CREATE POLICY "admins upload site images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('product-images','gallery','branding') AND private_security.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "admins update site images" ON storage.objects;
CREATE POLICY "admins update site images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('product-images','gallery','branding') AND private_security.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "admins delete site images" ON storage.objects;
CREATE POLICY "admins delete site images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('product-images','gallery','branding') AND private_security.has_role(auth.uid(), 'admin'::app_role));

-- Drop old public functions
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.claim_admin_bootstrap();
