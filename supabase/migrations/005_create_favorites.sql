-- ============================================================
-- Migration 005: favorites
-- ============================================================

CREATE TABLE IF NOT EXISTS public.favorites (
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  note       text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON public.favorites(product_id);

-- Auto-update updated_at
DROP TRIGGER IF EXISTS set_favorites_updated_at ON public.favorites;
CREATE TRIGGER set_favorites_updated_at
  BEFORE UPDATE ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
