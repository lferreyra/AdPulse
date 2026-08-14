-- ============================================================
-- Migration 006: match_decisions
-- ============================================================

CREATE TABLE IF NOT EXISTS public.match_decisions (
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  decision   text NOT NULL CHECK (decision IN ('saved','dismissed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  -- Unique: one decision per (user, product)
  CONSTRAINT udx_match_decisions_user_product UNIQUE (user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.match_decisions ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_match_decisions_user_id ON public.match_decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_match_decisions_product_id ON public.match_decisions(product_id);
