
CREATE POLICY "public read site images" ON storage.objects FOR SELECT
  USING (bucket_id IN ('product-images','gallery','branding'));

CREATE POLICY "admins upload site images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('product-images','gallery','branding') AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "admins update site images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('product-images','gallery','branding') AND public.has_role(auth.uid(),'admin'))
  WITH CHECK (bucket_id IN ('product-images','gallery','branding') AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "admins delete site images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('product-images','gallery','branding') AND public.has_role(auth.uid(),'admin'));
