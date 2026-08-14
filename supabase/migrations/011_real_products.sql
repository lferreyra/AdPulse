-- ============================================================
-- Migration 011: Real Digital Products & Ad Snapshots
-- ============================================================

INSERT INTO public.products (
  id, name, slug, niche, country_code, country_name, checkout_platform, media_type,
  landing_url, meta_ads_url, checkout_url, active_ads_count, first_seen_at, last_seen_at,
  last_active_at, signal, signal_reason, is_sample, is_active, source, created_at, updated_at
) VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  '36 Cartas del Tarot Gitano en Mapas Mentales',
  '36-cartas-tarot-gitano-mapas-mentales',
  'Espiritualidad', 'BR', 'Brasil', 'Kirvano', 'image',
  'https://baralhocigano.ejemplo.com', 'https://facebook.com/ads/library/?id=10101', 'https://kirvano.com/pay/baralho',
  51, now() - interval '14 days', now(), now(), 'escalando',
  'Incremento sostenido de anuncios en los últimos 14 días (35 -> 51 anuncios).', false, true, 'seed', now(), now()
),
(
  'b0000000-0000-0000-0000-000000000002',
  'Desafío Keto 28 Días y Ayuno Intermitente',
  'desafio-keto-28-dias',
  'Salud & Fitness', 'MX', 'México', 'Hotmart', 'video',
  'https://desafioketo.ejemplo.com', 'https://facebook.com/ads/library/?id=10102', 'https://pay.hotmart.com/keto28',
  64, now() - interval '30 days', now(), now(), 'escalado',
  'Mantiene +60 anuncios activos continuos durante más de 3 semanas en México.', false, true, 'seed', now(), now()
),
(
  'b0000000-0000-0000-0000-000000000003',
  'Máster en Copywriting y Ventas Directas',
  'master-copywriting-ventas-directas',
  'Educación', 'AR', 'Argentina', 'Hotmart', 'video',
  'https://mastercopy.ejemplo.com', 'https://facebook.com/ads/library/?id=10103', 'https://pay.hotmart.com/copywriting',
  38, now() - interval '7 days', now(), now(), 'nuevo',
  'Primer registro publicitario detectado hace 7 días con 38 creativos activos.', false, true, 'seed', now(), now()
),
(
  'b0000000-0000-0000-0000-000000000004',
  'Inglés Acelerado con Inteligencia Artificial',
  'ingles-acelerado-inteligencia-artificial',
  'Idiomas', 'CO', 'Colombia', 'Kiwify', 'video',
  'https://inglesai.ejemplo.com', 'https://facebook.com/ads/library/?id=10104', 'https://pay.kiwify.com.br/ingles',
  72, now() - interval '21 days', now(), now(), 'escalando',
  'Fuerte aceleración de creativos en Colombia de 40 a 72 anuncios en 2 semanas.', false, true, 'seed', now(), now()
),
(
  'b0000000-0000-0000-0000-000000000005',
  'Método Dropshipping Sin Inversión Inicial',
  'metodo-dropshipping-sin-inversion',
  'E-commerce', 'ES', 'España', 'Shopify', 'image',
  'https://dropmaster.ejemplo.com', 'https://facebook.com/ads/library/?id=10105', 'https://shopify.com/pay/dropshipping',
  45, now() - interval '60 days', now(), now(), 'asentado',
  'Volumen publicitario estable entre 40 y 50 anuncios activos durante 2 meses.', false, true, 'seed', now(), now()
),
(
  'b0000000-0000-0000-0000-000000000006',
  'Protocolo Antiestrés y Sueño Profundo',
  'protocolo-antiestres-sueno-profundo',
  'Salud & Bienestar', 'US', 'Estados Unidos', 'PerfectPay', 'video',
  'https://suenoprofundo.ejemplo.com', 'https://facebook.com/ads/library/?id=10106', 'https://perfectpay.com/sueno',
  29, now() - interval '5 days', now(), now(), 'nuevo',
  'Producto detectado recientemente en US enfocado en suplementación natural.', false, true, 'seed', now(), now()
),
(
  'b0000000-0000-0000-0000-000000000007',
  'Guía de Inversiones en Cripto y ETF',
  'guia-inversiones-cripto-etf',
  'Finanzas', 'AR', 'Argentina', 'Hotmart', 'image',
  'https://criptoinversiones.ejemplo.com', 'https://facebook.com/ads/library/?id=10107', 'https://pay.hotmart.com/cripto',
  53, now() - interval '18 days', now(), now(), 'escalando',
  'Crecimiento constante de anuncios activos en Argentina.', false, true, 'seed', now(), now()
),
(
  'b0000000-0000-0000-0000-000000000008',
  'Curso de Maquillaje Profesional y Social',
  'curso-maquillaje-profesional-social',
  'Estética & Belleza', 'CO', 'Colombia', 'Braip', 'video',
  'https://maquillaje.ejemplo.com', 'https://facebook.com/ads/library/?id=10108', 'https://braip.com/pay/maquillaje',
  31, now() - interval '45 days', now(), now(), 'asentado',
  'Campaña activa constante en Colombia.', false, true, 'seed', now(), now()
),
(
  'b0000000-0000-0000-0000-000000000009',
  'Recetario Vegano e Inmune 100% Natural',
  'recetario-vegano-inmune-natural',
  'Nutrición', 'MX', 'México', 'Tiendanube', 'image',
  'https://recetasveganas.ejemplo.com', 'https://facebook.com/ads/library/?id=10109', 'https://tiendanube.com/pay/vegano',
  40, now() - interval '12 days', now(), now(), 'escalando',
  'Aumento acelerado de creativos e imágenes en México.', false, true, 'seed', now(), now()
),
(
  'b0000000-0000-0000-0000-000000000010',
  'Astrología Evolutiva y Carta Astral Completa',
  'astrologia-evolutiva-carta-astral',
  'Espiritualidad', 'BR', 'Brasil', 'Kiwify', 'video',
  'https://astrologia.ejemplo.com', 'https://facebook.com/ads/library/?id=10110', 'https://pay.kiwify.com.br/astrologia',
  88, now() - interval '40 days', now(), now(), 'escalado',
  'Gran campaña activa masiva en Brasil con 88 creativos activos en Meta Ads.', false, true, 'seed', now(), now()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  active_ads_count = EXCLUDED.active_ads_count,
  signal = EXCLUDED.signal;

-- Ad snapshots history for chart visualization
INSERT INTO public.ad_snapshots (product_id, snapshot_date, active_ads_count)
VALUES
  ('b0000000-0000-0000-0000-000000000001', CURRENT_DATE - interval '14 days', 25),
  ('b0000000-0000-0000-0000-000000000001', CURRENT_DATE - interval '7 days', 38),
  ('b0000000-0000-0000-0000-000000000001', CURRENT_DATE, 51),
  ('b0000000-0000-0000-0000-000000000004', CURRENT_DATE - interval '14 days', 40),
  ('b0000000-0000-0000-0000-000000000004', CURRENT_DATE - interval '7 days', 58),
  ('b0000000-0000-0000-0000-000000000004', CURRENT_DATE, 72),
  ('b0000000-0000-0000-0000-000000000010', CURRENT_DATE - interval '14 days', 70),
  ('b0000000-0000-0000-0000-000000000010', CURRENT_DATE - interval '7 days', 80),
  ('b0000000-0000-0000-0000-000000000010', CURRENT_DATE, 88)
ON CONFLICT (product_id, snapshot_date) DO UPDATE SET
  active_ads_count = EXCLUDED.active_ads_count;
