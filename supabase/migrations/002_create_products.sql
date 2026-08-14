-- ============================================================
-- Migration 002: products
-- ============================================================

CREATE TABLE IF NOT EXISTS public.products (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                      text NOT NULL,
  slug                      text UNIQUE NOT NULL,
  niche                     text,
  country_code              text NOT NULL,
  country_name              text NOT NULL,
  checkout_platform         text,
  media_type                text CHECK (media_type IN ('video','image','mixed','unknown')),
  landing_url               text,
  meta_ads_url              text,
  checkout_url              text,
  meta_page_id              text,
  representative_library_id text,
  active_ads_count          integer NOT NULL DEFAULT 0,
  first_seen_at             timestamptz,
  last_seen_at              timestamptz,
  last_active_at            timestamptz,
  signal                    text CHECK (signal IN ('Nuevo','Escalando','Escalado','Asentado')),
  signal_reason             text,
  is_sample                 boolean NOT NULL DEFAULT false,
  is_active                 boolean NOT NULL DEFAULT true,
  source                    text CHECK (source IN ('meta_api','owner','manual_import')),
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_sample ON public.products(is_sample);
CREATE INDEX IF NOT EXISTS idx_products_signal ON public.products(signal);
CREATE INDEX IF NOT EXISTS idx_products_country_code ON public.products(country_code);
CREATE INDEX IF NOT EXISTS idx_products_niche ON public.products(niche);
CREATE INDEX IF NOT EXISTS idx_products_active_ads_count ON public.products(active_ads_count DESC);
CREATE INDEX IF NOT EXISTS idx_products_first_seen_at ON public.products(first_seen_at DESC);

-- Auto-update updated_at function & trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
