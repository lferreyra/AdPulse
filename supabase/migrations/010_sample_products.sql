-- ============================================================
-- Migration 010: Sample Products (DEMO only, clearly labeled)
-- ============================================================
-- These two products are seeded as samples for unauthenticated
-- and non-Pro users. They are NOT real products and carry
-- explicit is_sample=true flags. Never mix with production data.

INSERT INTO public.products (
  id,
  name,
  slug,
  niche,
  country_code,
  country_name,
  checkout_platform,
  media_type,
  landing_url,
  meta_ads_url,
  checkout_url,
  active_ads_count,
  first_seen_at,
  last_seen_at,
  last_active_at,
  signal,
  signal_reason,
  is_sample,
  is_active,
  source,
  created_at,
  updated_at
) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  '[DEMO] Curso de Marketing Digital',
  'demo-curso-marketing-digital',
  'Educación online',
  'AR',
  'Argentina',
  'Hotmart',
  'video',
  'https://example.com/landing-demo-1',
  NULL,
  NULL,
  42,
  now() - interval '15 days',
  now(),
  now() - interval '1 day',
  'Nuevo',
  'Producto visto por primera vez hace menos de 30 días con 42 anuncios activos.',
  true,
  true,
  'owner',
  now(),
  now()
),
(
  'a0000000-0000-0000-0000-000000000002',
  '[DEMO] Suplemento Vegano Premium',
  'demo-suplemento-vegano-premium',
  'Salud y bienestar',
  'MX',
  'México',
  'Tiendanube',
  'image',
  'https://example.com/landing-demo-2',
  NULL,
  NULL,
  95,
  now() - interval '65 days',
  now(),
  now() - interval '1 day',
  'Escalado',
  'Más de 80 anuncios activos y producto activo hace más de 30 días.',
  true,
  true,
  'owner',
  now(),
  now()
)
ON CONFLICT (slug) DO NOTHING;

-- Insert initial snapshot for sample product 1
INSERT INTO public.ad_snapshots (
  product_id, snapshot_date, active_ads_count, source
)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  CURRENT_DATE,
  42,
  'owner'
)
ON CONFLICT (product_id, snapshot_date) DO NOTHING;

-- Insert initial snapshot for sample product 2
INSERT INTO public.ad_snapshots (
  product_id, snapshot_date, active_ads_count, source
)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  CURRENT_DATE,
  95,
  'owner'
)
ON CONFLICT (product_id, snapshot_date) DO NOTHING;
