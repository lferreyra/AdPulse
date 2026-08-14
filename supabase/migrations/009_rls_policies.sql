-- ============================================================
-- Migration 009: RLS Policies
-- ============================================================
-- Policy naming convention: <table>_<action>_<who>

-- ----------------------------------------------------------------
-- PROFILES
-- ----------------------------------------------------------------

-- Users can only read their own profile
CREATE POLICY profiles_select_own
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (non-role fields)
CREATE POLICY profiles_update_own
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role: full access (implicit via SECURITY DEFINER functions)

-- ----------------------------------------------------------------
-- PRODUCTS
-- ----------------------------------------------------------------

-- Anonymous visitors: can only read sample products that are active
CREATE POLICY products_select_samples_anon
  ON public.products FOR SELECT
  TO anon
  USING (is_sample = true AND is_active = true);

-- Authenticated users with Pro subscription (or owner): read all active products
CREATE POLICY products_select_pro
  ON public.products FOR SELECT
  TO authenticated
  USING (
    is_active = true
    AND (
      -- Owner sees all
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role = 'owner'
      )
      OR
      -- Pro users see all active
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.subscription_status IN ('active', 'trialing')
      )
      OR
      -- Non-pro authenticated: only samples
      is_sample = true
    )
  );

-- Owner can insert products
CREATE POLICY products_insert_owner
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'owner'
    )
  );

-- Owner can update products
CREATE POLICY products_update_owner
  ON public.products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'owner'
    )
  );

-- Owner can delete products
CREATE POLICY products_delete_owner
  ON public.products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'owner'
    )
  );

-- ----------------------------------------------------------------
-- AD_SNAPSHOTS
-- ----------------------------------------------------------------

-- Pro users and owner can read snapshots of active products
CREATE POLICY ad_snapshots_select_pro
  ON public.ad_snapshots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products pr
      WHERE pr.id = product_id
        AND pr.is_active = true
    )
    AND (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid()
          AND (p.role = 'owner' OR p.subscription_status IN ('active','trialing'))
      )
    )
  );

-- No user insert/update/delete on snapshots (service role only)

-- ----------------------------------------------------------------
-- PRODUCT_ADS
-- ----------------------------------------------------------------

CREATE POLICY "Anon read active products"
  ON public.products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow insert active products"
  ON public.products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owners manage products"
  ON public.products FOR ALL
  USING (public.is_owner());

-- Pro users and owner can read product_ads (but NOT raw_metadata directly)
CREATE POLICY product_ads_select_pro
  ON public.product_ads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products pr
      WHERE pr.id = product_id AND pr.is_active = true
    )
    AND (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid()
          AND (p.role = 'owner' OR p.subscription_status IN ('active','trialing'))
      )
    )
  );

-- No user mutations on product_ads (service role only)

-- ----------------------------------------------------------------
-- FAVORITES
-- ----------------------------------------------------------------

-- Users can read their own favorites
CREATE POLICY favorites_select_own
  ON public.favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own favorites
CREATE POLICY favorites_insert_own
  ON public.favorites FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND (p.role = 'owner' OR p.subscription_status IN ('active','trialing'))
    )
  );

-- Users can update their own favorites (e.g., note)
CREATE POLICY favorites_update_own
  ON public.favorites FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own favorites
CREATE POLICY favorites_delete_own
  ON public.favorites FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ----------------------------------------------------------------
-- MATCH_DECISIONS
-- ----------------------------------------------------------------

-- Users can read their own decisions
CREATE POLICY match_decisions_select_own
  ON public.match_decisions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own decisions
CREATE POLICY match_decisions_insert_own
  ON public.match_decisions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own decisions
CREATE POLICY match_decisions_update_own
  ON public.match_decisions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own decisions (revert)
CREATE POLICY match_decisions_delete_own
  ON public.match_decisions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ----------------------------------------------------------------
-- SYNC_RUNS
-- ----------------------------------------------------------------

-- Owner can read sync_runs
CREATE POLICY sync_runs_select_owner
  ON public.sync_runs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'owner'
    )
  );

-- No authenticated user can insert/update (service role only via SECURITY DEFINER)

-- ----------------------------------------------------------------
-- AUDIT_LOGS
-- ----------------------------------------------------------------

-- Owner can read audit logs
CREATE POLICY audit_logs_select_owner
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'owner'
    )
  );

-- No user mutations on audit_logs (service role only)
