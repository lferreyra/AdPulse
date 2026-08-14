// ============================================================
// lib/meta/manual-adapter.ts
// Handles explicit manual imports for products/ads when Meta API
// coverage is insufficient or not configured.
// ============================================================

import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { NormalizedAd } from './ads-library';
import { sanitizeText } from '../security/sanitize';

export interface ManualProductInput {
  name: string;
  niche?: string;
  country_code: string;
  country_name: string;
  checkout_platform?: string;
  media_type: 'video' | 'image' | 'mixed' | 'unknown';
  landing_url?: string;
  meta_ads_url?: string;
  checkout_url?: string;
  active_ads_count: number;
}

/**
 * Creates or updates a product manually.
 * Audits the action.
 */
export async function upsertManualProduct(input: ManualProductInput, productId?: string) {
  const supabase = await createServerSupabaseClient({ useServiceRole: true });
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  const slug = sanitizeText(input.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const productData = {
    name: sanitizeText(input.name),
    slug: productId ? undefined : slug, // Don't update slug if editing
    niche: input.niche ? sanitizeText(input.niche) : null,
    country_code: input.country_code,
    country_name: input.country_name,
    checkout_platform: input.checkout_platform ? sanitizeText(input.checkout_platform) : null,
    media_type: input.media_type,
    landing_url: input.landing_url || null,
    meta_ads_url: input.meta_ads_url || null,
    checkout_url: input.checkout_url || null,
    active_ads_count: input.active_ads_count,
    is_active: true,
    is_sample: false,
    source: 'manual_import' as const,
    last_seen_at: new Date().toISOString(),
    last_active_at: input.active_ads_count > 0 ? new Date().toISOString() : null,
  };

  let finalProductId = productId;

  if (productId) {
    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId);
    if (error) throw new Error(`Failed to update product: ${error.message}`);
  } else {
    // Determine first_seen_at for new products
    const { data: newProd, error } = await supabase
      .from('products')
      .insert({
        ...productData,
        first_seen_at: new Date().toISOString(),
      })
      .select('id')
      .single();
    if (error) throw new Error(`Failed to create product: ${error.message}`);
    finalProductId = newProd.id;
  }

  // Audit log
  await supabase.from('audit_logs').insert({
    actor_user_id: user.id,
    action: productId ? 'manual_update_product' : 'manual_create_product',
    entity_type: 'product',
    entity_id: finalProductId,
    metadata: { input },
  });

  return finalProductId;
}
