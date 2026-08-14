-- ============================================================
-- Migration 003: ad_snapshots
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ad_snapshots (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  snapshot_date    date NOT NULL,
  active_ads_count integer NOT NULL,
  active_library_ids jsonb,
  markets          jsonb,
  media_breakdown  jsonb,
  source           text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ad_snapshots ENABLE ROW LEVEL SECURITY;

-- Unique index to ensure idempotent daily sync
CREATE UNIQUE INDEX IF NOT EXISTS udx_ad_snapshots_product_date
  ON public.ad_snapshots(product_id, snapshot_date);

-- Index for time-series queries
CREATE INDEX IF NOT EXISTS idx_ad_snapshots_product_id ON public.ad_snapshots(product_id);
CREATE INDEX IF NOT EXISTS idx_ad_snapshots_snapshot_date ON public.ad_snapshots(snapshot_date DESC);
