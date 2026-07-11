
UPDATE public.products SET image_url = CASE slug
  WHEN 'cheese-cake' THEN '/__l5e/assets-v1/a59fd48b-af06-4b3f-9ea6-0ae31d0e14ec/cheese-cake.png'
  WHEN 'chilli-sauce' THEN '/__l5e/assets-v1/8470fb22-e473-4a44-9664-649c58c2e3d9/chilli-sauce.png'
  WHEN 'coca-cola' THEN '/__l5e/assets-v1/4019fd37-11ce-45a8-b734-ef1e9372f09a/coca-cola-1L.png'
  WHEN 'curry-sauce' THEN '/__l5e/assets-v1/19d4e883-29f7-4fc6-a03b-4ed1166062d2/sauce-crrry.png'
  WHEN 'fanta' THEN '/__l5e/assets-v1/80f690a8-1696-4e4e-b977-62742e6b7e91/fanta-33cl.png'
  WHEN 'fried-chips' THEN '/__l5e/assets-v1/255fe68f-a0e9-4e02-8ca4-0e51ba242513/fried-chips.png'
  WHEN 'hamoud' THEN '/__l5e/assets-v1/58e5ecaa-2bc1-46ed-800f-ed2605f975b6/hamoud-canaette.png'
  WHEN 'ricey-crousty' THEN '/__l5e/assets-v1/f1d07fbe-c2c0-454c-8116-f27370a614c3/ricey-crousty.png'
  WHEN 'ricey-curry' THEN '/__l5e/assets-v1/48138c6c-3d18-4df1-b5e8-919b25aa3926/ricey-curry.png'
  WHEN 'ricey-fries' THEN '/__l5e/assets-v1/136534df-9bdf-4404-8709-b0841609c72f/ricey-fries.png'
  WHEN 'ricey-mix' THEN '/__l5e/assets-v1/d98abda5-782e-4475-9cd7-ecd0c95e0f74/ricey-mix.png'
  WHEN 'ricey-spicy' THEN '/__l5e/assets-v1/8f6adc97-a383-45c1-85c7-6dc06170542c/ricey-spicy.png'
  WHEN 'ricey-sweet' THEN '/__l5e/assets-v1/0252e611-ec08-4dea-90af-691637644a58/ricey-sweet.png'
  WHEN 'sweet-sauce' THEN '/__l5e/assets-v1/77373367-f6a8-4e73-bb5a-0cb59ebe3b4e/sauce-sucr%C3%A9e.png'
  WHEN 'tenders' THEN '/__l5e/assets-v1/55055efb-7821-4d86-9f89-3426cec10404/tenders.png'
  WHEN 'tiramisu' THEN '/__l5e/assets-v1/31f69936-d176-464b-89a8-9f54223d20f1/tiramisu.png'
  WHEN 'tres-leche' THEN '/__l5e/assets-v1/f0afcc2e-8d83-4297-aa8f-7c43ff5250b6/tres-leche.png'
  WHEN 'water' THEN '/__l5e/assets-v1/a4a10716-708f-46bd-a244-4b7b6af32c14/eau_min%C3%A9rale-0.5L.png'
  WHEN 'white-sauce' THEN '/__l5e/assets-v1/478ea799-2761-47a7-86c3-e0f85fceefac/white-sauce.png'
  ELSE image_url
END
WHERE slug IN ('cheese-cake','chilli-sauce','coca-cola','curry-sauce','fanta','fried-chips','hamoud','ricey-crousty','ricey-curry','ricey-fries','ricey-mix','ricey-spicy','ricey-sweet','sweet-sauce','tenders','tiramisu','tres-leche','water','white-sauce');
