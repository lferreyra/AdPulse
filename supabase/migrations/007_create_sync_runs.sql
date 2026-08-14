-- ============================================================
-- Migration 007: sync_runs
-- ============================================================

CREATE TABLE IF NOT EXISTS public.sync_runs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at    timestamptz NOT NULL DEFAULT now(),
  finished_at   timestamptz,
  status        text NOT NULL DEFAULT 'running'
                  CHECK (status IN ('running','success','partial','failed')),
  items_read    integer NOT NULL DEFAULT 0,
  items_created integer NOT NULL DEFAULT 0,
  items_updated integer NOT NULL DEFAULT 0,
  error_message text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS (only service role can write; no user reads)
ALTER TABLE public.sync_runs ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sync_runs_status ON public.sync_runs(status);
CREATE INDEX IF NOT EXISTS idx_sync_runs_started_at ON public.sync_runs(started_at DESC);
