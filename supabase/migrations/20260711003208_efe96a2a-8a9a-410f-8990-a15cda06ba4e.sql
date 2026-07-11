
UPDATE public.site_settings
SET logo_url = '/__l5e/assets-v1/01f37d06-09f6-4517-a067-7a175ea71daa/ricey-crousty-logo.jpg';

INSERT INTO public.gallery_images (image_url, caption, category, sort_order) VALUES
  ('/__l5e/assets-v1/69d2123e-f13b-4d16-9b63-386623c3d320/exterior-entrance.png', 'Entrée du restaurant', 'Exterior', 1),
  ('/__l5e/assets-v1/882ab676-d698-4aea-8b65-6f80f4b6d24b/interior-counter.png', 'Comptoir et enseigne néon', 'Interior', 2),
  ('/__l5e/assets-v1/6f6667a7-6624-426d-94e2-1d5a1ab4134b/exterior-day.png', 'Façade de jour', 'Exterior', 3)
ON CONFLICT DO NOTHING;
