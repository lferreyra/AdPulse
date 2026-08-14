// ============================================================
// app/api/cron/sync-meta/route.ts
// Vercel Cron Job endpoint for Meta Ads synchronization.
// ============================================================

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { searchByTerms, searchByPages } from '@/lib/meta/ads-library';
import { calculateSignal } from '@/lib/signals/calculate-signal';
import type { SyncRunStatus } from '@/lib/supabase/types';

export const maxDuration = 300; // 5 minutes max duration on Vercel Pro
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // 1. Validate CRON_SECRET
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 500 });
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Use service role for cron operations
  const supabase = await createServerSupabaseClient({ useServiceRole: true });

  // 2. Create sync_runs record
  const { data: run, error: runError } = await supabase
    .from('sync_runs')
    .insert({
      status: 'running',
      items_read: 0,
      items_created: 0,
      items_updated: 0,
    })
    .select('id')
    .single();

  if (runError || !run) {
    return NextResponse.json({ error: 'Failed to start sync run' }, { status: 500 });
  }

  const runId = run.id;
  let finalStatus: SyncRunStatus = 'success';
  let finalError: string | null = null;
  
  let stats = {
    items_read: 0,
    items_created: 0,
    items_updated: 0,
  };

  try {
    // 3. Get active products to sync
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_sample', false);

    if (productsError) {
      throw new Error(`Failed to fetch products: ${productsError.message}`);
    }

    // Process each product sequentially to respect rate limits
    for (const product of products) {
      try {
        if (!product.meta_page_id && !product.name) {
          continue; // Nothing to search by
        }

        let ads: any[] = [];
        
        // Use page ID search if available, otherwise fallback to term search
        if (product.meta_page_id) {
          const res = await searchByPages({
            search_page_ids: [product.meta_page_id],
            ad_reached_countries: [product.country_code],
            ad_active_status: 'ACTIVE',
            limit: 100, // Only fetch the most recent 100 for the sync update
          });
          ads = res.ads;
        } else {
          const res = await searchByTerms({
            search_terms: product.name,
            ad_reached_countries: [product.country_code],
            ad_active_status: 'ACTIVE',
            limit: 100,
          });
          ads = res.ads;
        }

        stats.items_read += ads.length;
        const activeAdsCount = ads.filter(ad => ad.is_active).length;

        // Extract library IDs and markets for the snapshot
        const activeLibraryIds = ads.filter(ad => ad.is_active).map(ad => ad.library_id);
        
        // Build media breakdown
        const mediaBreakdown = ads.reduce((acc, ad) => {
          acc[ad.media_type] = (acc[ad.media_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // 4. Update ads (upsert)
        for (const ad of ads) {
          const { error: adUpsertError } = await supabase
            .from('product_ads')
            .upsert({
              product_id: product.id,
              library_id: ad.library_id,
              page_id: ad.page_id,
              page_name: ad.page_name,
              ad_snapshot_url: ad.ad_snapshot_url,
              creative_body: ad.creative_body,
              media_type: ad.media_type,
              publisher_platforms: ad.publisher_platforms,
              delivery_start_at: ad.delivery_start_at,
              delivery_stop_at: ad.delivery_stop_at,
              is_active: ad.is_active,
            }, { onConflict: 'library_id' });
          
          if (!adUpsertError) {
            stats.items_updated++; // Just counting touches
          }
        }

        // 5. Insert daily snapshot (idempotent due to unique index)
        const today = new Date().toISOString().split('T')[0];
        await supabase
          .from('ad_snapshots')
          .upsert({
            product_id: product.id,
            snapshot_date: today,
            active_ads_count: activeAdsCount,
            active_library_ids: activeLibraryIds,
            media_breakdown: mediaBreakdown,
            source: 'meta_api',
          }, { onConflict: 'product_id,snapshot_date' });

        // 6. Recalculate Signal
        // Fetch recent snapshots to evaluate stability
        const { data: snapshots } = await supabase
          .from('ad_snapshots')
          .select('snapshot_date, active_ads_count')
          .eq('product_id', product.id)
          .order('snapshot_date', { ascending: false })
          .limit(10);

        const signalOutput = calculateSignal({
          first_seen_at: product.first_seen_at || new Date().toISOString(),
          active_ads_count: activeAdsCount,
          recent_snapshots: snapshots || [],
        });

        // 7. Update Product
        await supabase
          .from('products')
          .update({
            active_ads_count: activeAdsCount,
            last_seen_at: new Date().toISOString(),
            last_active_at: activeAdsCount > 0 ? new Date().toISOString() : product.last_active_at,
            signal: signalOutput.signal,
            signal_reason: signalOutput.signal_reason,
          })
          .eq('id', product.id);

      } catch (prodErr) {
        // Log individual product failure but continue with others
        console.error(`Failed syncing product ${product.id}:`, prodErr);
        finalStatus = 'partial';
      }
    }
  } catch (err: any) {
    finalStatus = 'failed';
    finalError = err.message || 'Unknown error during sync';
    console.error('Sync failed:', err);
  }

  // 8. Close sync_run
  await supabase
    .from('sync_runs')
    .update({
      status: finalStatus,
      finished_at: new Date().toISOString(),
      items_read: stats.items_read,
      items_created: stats.items_created,
      items_updated: stats.items_updated,
      error_message: finalError,
    })
    .eq('id', runId);

  return NextResponse.json({
    status: finalStatus,
    run_id: runId,
    stats,
    error: finalError,
  });
}
