-- ============================================================
-- AdPulse Intelligence — All Migrations Combined (001 - 010)
-- Copy and paste this ENTIRE file into Supabase SQL Editor and click RUN.
-- ============================================================

-- ─── MIGRATION 001: PROFILES ─────────────────────────────────

DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('user', 'owner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.subscription_status AS ENUM ('inactive', 'trialing', 'active', 'past_due', 'canceled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id                        uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                     text UNIQUE,
  full_name                 text,
  role                      public.user_role NOT NULL DEFAULT 'user',
  subscription_status       public.subscription_status NOT NULL DEFAULT 'inactive',
  subscription_provider     text DEFAULT 'stripe',
  subscription_customer_id  text UNIQUE,
  subscription_period_end   timestamptz,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_profiles_customer_id ON public.profiles(subscription_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, subscription_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user',
    'inactive'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ─── MIGRATION 002: PRODUCTS ─────────────────────────────────

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

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_sample ON public.products(is_sample);
CREATE INDEX IF NOT EXISTS idx_products_signal ON public.products(signal);
CREATE INDEX IF NOT EXISTS idx_products_country_code ON public.products(country_code);
CREATE INDEX IF NOT EXISTS idx_products_niche ON public.products(niche);
CREATE INDEX IF NOT EXISTS idx_products_active_ads_count ON public.products(active_ads_count DESC);
CREATE INDEX IF NOT EXISTS idx_products_first_seen_at ON public.products(first_seen_at DESC);

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─── MIGRATION 003: AD_SNAPSHOTS ─────────────────────────────

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

ALTER TABLE public.ad_snapshots ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS udx_ad_snapshots_product_date
  ON public.ad_snapshots(product_id, snapshot_date);

CREATE INDEX IF NOT EXISTS idx_ad_snapshots_product_id ON public.ad_snapshots(product_id);
CREATE INDEX IF NOT EXISTS idx_ad_snapshots_snapshot_date ON public.ad_snapshots(snapshot_date DESC);


-- ─── MIGRATION 004: PRODUCT_ADS ──────────────────────────────

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
  raw_metadata        jsonb,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_ads ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS udx_product_ads_library_id
  ON public.product_ads(library_id);

CREATE INDEX IF NOT EXISTS idx_product_ads_product_id ON public.product_ads(product_id);
CREATE INDEX IF NOT EXISTS idx_product_ads_is_active ON public.product_ads(is_active);
CREATE INDEX IF NOT EXISTS idx_product_ads_delivery_start_at ON public.product_ads(delivery_start_at DESC);

DROP TRIGGER IF EXISTS set_product_ads_updated_at ON public.product_ads;
CREATE TRIGGER set_product_ads_updated_at
  BEFORE UPDATE ON public.product_ads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─── MIGRATION 005: FAVORITES ────────────────────────────────

CREATE TABLE IF NOT EXISTS public.favorites (
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  note       text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON public.favorites(product_id);

DROP TRIGGER IF EXISTS set_favorites_updated_at ON public.favorites;
CREATE TRIGGER set_favorites_updated_at
  BEFORE UPDATE ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─── MIGRATION 006: MATCH_DECISIONS ─────────────────────────

CREATE TABLE IF NOT EXISTS public.match_decisions (
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  decision   text NOT NULL CHECK (decision IN ('saved','dismissed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT udx_match_decisions_user_product UNIQUE (user_id, product_id)
);

ALTER TABLE public.match_decisions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_match_decisions_user_id ON public.match_decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_match_decisions_product_id ON public.match_decisions(product_id);


-- ─── MIGRATION 007: SYNC_RUNS ────────────────────────────────

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

ALTER TABLE public.sync_runs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_sync_runs_status ON public.sync_runs(status);
CREATE INDEX IF NOT EXISTS idx_sync_runs_started_at ON public.sync_runs(started_at DESC);


-- ─── MIGRATION 008: AUDIT_LOGS ───────────────────────────────

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action        text NOT NULL,
  entity_type   text NOT NULL,
  entity_id     uuid,
  metadata      jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);


-- ─── MIGRATION 009: RLS POLICIES ─────────────────────────────

DO $$ BEGIN
  CREATE POLICY profiles_select_own ON public.profiles FOR SELECT USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY products_select_samples_anon ON public.products FOR SELECT TO anon USING (is_sample = true AND is_active = true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY products_select_pro ON public.products FOR SELECT TO authenticated USING (
    is_active = true AND (
      EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'owner') OR
      EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.subscription_status IN ('active', 'trialing')) OR
      is_sample = true
    )
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY favorites_all_own ON public.favorites FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY match_decisions_all_own ON public.match_decisions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;


-- ─── MIGRATION 010: SAMPLE PRODUCTS (DEMO) ────────────────────

INSERT INTO public.products (
  id, name, slug, niche, country_code, country_name, checkout_platform, media_type, landing_url, active_ads_count, first_seen_at, last_seen_at, last_active_at, signal, signal_reason, is_sample, is_active, source, created_at, updated_at
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

INSERT INTO public.ad_snapshots (product_id, snapshot_date, active_ads_count, source)
VALUES ('a0000000-0000-0000-0000-000000000001', CURRENT_DATE, 42, 'owner')
ON CONFLICT (product_id, snapshot_date) DO NOTHING;

INSERT INTO public.ad_snapshots (product_id, snapshot_date, active_ads_count, source)
VALUES ('a0000000-0000-0000-0000-000000000002', CURRENT_DATE, 95, 'owner')
ON CONFLICT (product_id, snapshot_date) DO NOTHING;
