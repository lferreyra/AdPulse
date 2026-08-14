-- ============================================================
-- Migration 004: product_ads
-- ============================================================

CREATE TABLE IF NOT EXISTS public.product_ads (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id          uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  library_id          text NOT NULL,
  page_id             text,
  page_name           text,
  ad_snapshot_url     text,
  creative_body       text,
  media_type          text,
  publisher_platforms jsonb,
  delivery_start_at   timestamptz,
  delivery_stop_at    timestamptz,
  is_active           boolean,
  -- raw_metadata: only non-sensitive fields, never tokens
  raw_metadata        jsonb,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_ads ENABLE ROW LEVEL SECURITY;

-- Unique index on library_id for idempotent upserts
CREATE UNIQUE INDEX IF NOT EXISTS udx_product_ads_library_id
  ON public.product_ads(library_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_ads_product_id ON public.product_ads(product_id);
CREATE INDEX IF NOT EXISTS idx_product_ads_is_active ON public.product_ads(is_active);
CREATE INDEX IF NOT EXISTS idx_product_ads_delivery_start_at ON public.product_ads(delivery_start_at DESC);

-- Auto-update updated_at
DROP TRIGGER IF EXISTS set_product_ads_updated_at ON public.product_ads;
CREATE TRIGGER set_product_ads_updated_at
  BEFORE UPDATE ON public.product_ads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
