// ============================================================
// lib/meta/ads-library.ts
// Server-only Meta Ads Library API client.
// NEVER import this from client components.
// ============================================================

import 'server-only';
import { z } from 'zod';

// ─── Configuration ────────────────────────────────────────────

const META_BASE_URL = 'https://graph.facebook.com';
const DEFAULT_VERSION = process.env.META_GRAPH_API_VERSION ?? 'v26.0';
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT_MS = 25_000;
const MAX_RESULTS_PER_PAGE = 100;
const MAX_PAGES_PER_CALL = 10; // Safety limit to respect Vercel timeout

// ─── Zod schemas for Meta API responses ──────────────────────

const MetaAdSchema = z.object({
  id: z.string(),
  ad_creative_link_titles: z.array(z.string()).optional().default([]),
  ad_creative_link_captions: z.array(z.string()).optional().default([]),
  ad_creative_bodies: z.array(z.string()).optional().default([]),
  ad_snapshot_url: z.string().url().optional().nullable(),
  page_id: z.string().optional().nullable(),
  page_name: z.string().optional().nullable(),
  publisher_platforms: z.array(z.string()).optional().default([]),
  ad_delivery_start_time: z.string().optional().nullable(),
  ad_delivery_stop_time: z.string().optional().nullable(),
  ad_active_status: z.enum(['ACTIVE', 'INACTIVE']).optional().nullable(),
  impressions: z
    .object({
      lower_bound: z.string().optional().nullable(),
      upper_bound: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  reach_estimate: z.record(z.string(), z.unknown()).optional().nullable(),
});

const MetaPagingSchema = z.object({
  cursors: z
    .object({
      before: z.string().optional(),
      after: z.string().optional(),
    })
    .optional(),
  next: z.string().url().optional(),
});

const MetaAdsResponseSchema = z.object({
  data: z.array(MetaAdSchema),
  paging: MetaPagingSchema.optional(),
});

const MetaErrorSchema = z.object({
  error: z.object({
    message: z.string(),
    type: z.string().optional(),
    code: z.number().optional(),
    fbtrace_id: z.string().optional(),
  }),
});

// ─── Normalized internal model ────────────────────────────────

export interface NormalizedAd {
  library_id: string;
  page_id: string | null;
  page_name: string | null;
  ad_snapshot_url: string | null;
  creative_body: string | null;
  media_type: 'video' | 'image' | 'mixed' | 'unknown';
  publisher_platforms: string[];
  delivery_start_at: string | null;
  delivery_stop_at: string | null;
  is_active: boolean;
}

export interface SearchResult {
  ads: NormalizedAd[];
  /** Cursor for pagination continuation */
  next_cursor: string | null;
  /** Total ads retrieved in this call */
  total_fetched: number;
}

export interface MetaClientConfig {
  accessToken: string;
  version?: string;
}

// ─── Configuration check ─────────────────────────────────────

export function isMetaConfigured(): boolean {
  return Boolean(process.env.META_AD_LIBRARY_ACCESS_TOKEN);
}

// ─── Search parameters ────────────────────────────────────────

export interface SearchByTermsParams {
  search_terms: string;
  ad_reached_countries: string[];
  ad_type?: 'ALL' | 'POLITICAL_AND_ISSUE_ADS' | 'EMPLOYMENT_ADS' | 'HOUSING_ADS' | 'FINANCIAL_PRODUCTS_AND_SERVICES_ADS';
  ad_active_status?: 'ACTIVE' | 'ALL' | 'INACTIVE';
  languages?: string[];
  media_type?: 'ALL' | 'IMAGE' | 'VIDEO' | 'MEME' | 'NONE';
  after_cursor?: string;
  limit?: number;
}

export interface SearchByPagesParams {
  search_page_ids: string[];
  ad_reached_countries: string[];
  ad_active_status?: 'ACTIVE' | 'ALL' | 'INACTIVE';
  after_cursor?: string;
  limit?: number;
}

// ─── Main client functions ────────────────────────────────────

/**
 * Search Meta Ads Library by search terms.
 * Server-only. Validates all responses with Zod.
 */
export async function searchByTerms(
  params: SearchByTermsParams,
): Promise<SearchResult> {
  const token = process.env.META_AD_LIBRARY_ACCESS_TOKEN;
  if (!token) {
    throw new MetaNotConfiguredError(
      'META_AD_LIBRARY_ACCESS_TOKEN is not configured.',
    );
  }

  return fetchAdsWithPagination(token, buildSearchParams(params));
}

/**
 * Search Meta Ads Library by Facebook Page IDs.
 * Supports up to 10 page IDs per call.
 * Server-only.
 */
export async function searchByPages(
  params: SearchByPagesParams,
): Promise<SearchResult> {
  const token = process.env.META_AD_LIBRARY_ACCESS_TOKEN;
  if (!token) {
    throw new MetaNotConfiguredError(
      'META_AD_LIBRARY_ACCESS_TOKEN is not configured.',
    );
  }

  const searchParams: Record<string, string> = {
    search_page_ids: params.search_page_ids.slice(0, 10).join(','),
    ad_reached_countries: JSON.stringify(params.ad_reached_countries),
    ad_type: 'ALL',
    ad_active_status: params.ad_active_status ?? 'ACTIVE',
    fields: getFieldsList(),
    limit: String(Math.min(params.limit ?? MAX_RESULTS_PER_PAGE, MAX_RESULTS_PER_PAGE)),
  };

  if (params.after_cursor) {
    searchParams.after = params.after_cursor;
  }

  return fetchAdsWithPagination(token, searchParams);
}

// ─── Internal helpers ─────────────────────────────────────────

function buildSearchParams(params: SearchByTermsParams): Record<string, string> {
  const p: Record<string, string> = {
    search_terms: params.search_terms,
    ad_reached_countries: JSON.stringify(params.ad_reached_countries),
    ad_type: params.ad_type ?? 'ALL',
    ad_active_status: params.ad_active_status ?? 'ACTIVE',
    fields: getFieldsList(),
    limit: String(
      Math.min(params.limit ?? MAX_RESULTS_PER_PAGE, MAX_RESULTS_PER_PAGE),
    ),
  };

  if (params.languages && params.languages.length > 0) {
    p.languages = JSON.stringify(params.languages);
  }
  if (params.media_type) {
    p.media_type = params.media_type;
  }
  if (params.after_cursor) {
    p.after = params.after_cursor;
  }

  return p;
}

function getFieldsList(): string {
  return [
    'id',
    'ad_creative_link_titles',
    'ad_creative_link_captions',
    'ad_creative_bodies',
    'ad_snapshot_url',
    'page_id',
    'page_name',
    'publisher_platforms',
    'ad_delivery_start_time',
    'ad_delivery_stop_time',
    'ad_active_status',
  ].join(',');
}

async function fetchAdsWithPagination(
  token: string,
  initialParams: Record<string, string>,
): Promise<SearchResult> {
  const allAds: NormalizedAd[] = [];
  let currentParams = { ...initialParams };
  let pagesProcessed = 0;
  let nextCursor: string | null = null;

  while (pagesProcessed < MAX_PAGES_PER_CALL) {
    const response = await fetchPageWithRetry(token, currentParams);

    const normalized = response.data.map(normalizeAd);
    allAds.push(...normalized);
    pagesProcessed++;

    const afterCursor = response.paging?.cursors?.after;
    const hasNext = Boolean(response.paging?.next) && Boolean(afterCursor);

    if (!hasNext || !afterCursor) {
      nextCursor = null;
      break;
    }

    nextCursor = afterCursor;

    // Continue to next page
    currentParams = { ...initialParams, after: afterCursor };
  }

  return {
    ads: allAds,
    next_cursor: nextCursor,
    total_fetched: allAds.length,
  };
}

async function fetchPageWithRetry(
  token: string,
  params: Record<string, string>,
  attempt = 0,
): Promise<z.infer<typeof MetaAdsResponseSchema>> {
  const url = new URL(`${META_BASE_URL}/${DEFAULT_VERSION}/ads_archive`);

  // Build query params — NEVER log the token
  url.searchParams.set('access_token', token);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let rawResponse: Response;

  try {
    rawResponse = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'AdPulse-Intelligence/1.0',
      },
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (attempt < MAX_RETRIES - 1) {
      await sleep(exponentialBackoff(attempt));
      return fetchPageWithRetry(token, params, attempt + 1);
    }
    throw new MetaAPIError('Network error contacting Meta Ads Library API.', {
      retries: attempt,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  // Handle rate limiting (613)
  if (rawResponse.status === 429 || rawResponse.status === 613) {
    if (attempt < MAX_RETRIES - 1) {
      const retryAfter = parseInt(rawResponse.headers.get('Retry-After') ?? '60', 10);
      await sleep(retryAfter * 1000);
      return fetchPageWithRetry(token, params, attempt + 1);
    }
    throw new MetaRateLimitError('Meta Ads Library API rate limit exceeded.');
  }

  // Enforce response size limit (10MB)
  const contentLength = rawResponse.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > 10 * 1024 * 1024) {
    throw new MetaAPIError('Meta API response exceeds size limit.');
  }

  const json: unknown = await rawResponse.json();

  // Check for Meta API errors
  const errorCheck = MetaErrorSchema.safeParse(json);
  if (errorCheck.success) {
    const { code, message, type } = errorCheck.data.error;
    // Retry on transient errors (code 1, 2, 4)
    if ([1, 2, 4].includes(code ?? -1) && attempt < MAX_RETRIES - 1) {
      await sleep(exponentialBackoff(attempt));
      return fetchPageWithRetry(token, params, attempt + 1);
    }
    throw new MetaAPIError(`Meta API error [${code}]: ${type}`, {
      code,
      // Never include message in logs if it could contain tokens
      sanitized_message: sanitizeErrorMessage(message),
    });
  }

  // Validate response structure
  const parsed = MetaAdsResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new MetaAPIError('Unexpected Meta API response structure.', {
      validation_errors: parsed.error.issues.map((i) => i.message),
    });
  }

  return parsed.data;
}

function normalizeAd(raw: z.infer<typeof MetaAdSchema>): NormalizedAd {
  const bodies = raw.ad_creative_bodies ?? [];
  const titles = raw.ad_creative_link_titles ?? [];
  const creativeBody = [...titles, ...bodies].join(' ').trim() || null;

  const platforms = raw.publisher_platforms ?? [];
  let mediaType: NormalizedAd['media_type'] = 'unknown';
  if (platforms.length === 0) mediaType = 'unknown';

  return {
    library_id: raw.id,
    page_id: raw.page_id ?? null,
    page_name: raw.page_name ?? null,
    ad_snapshot_url: validateSnapshotUrl(raw.ad_snapshot_url),
    creative_body: creativeBody,
    media_type: mediaType,
    publisher_platforms: platforms,
    delivery_start_at: raw.ad_delivery_start_time ?? null,
    delivery_stop_at: raw.ad_delivery_stop_time ?? null,
    is_active: raw.ad_active_status === 'ACTIVE',
  };
}

/** Validate snapshot URLs to prevent SSRF and XSS */
function validateSnapshotUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!['https:'].includes(parsed.protocol)) return null;
    if (!parsed.hostname.endsWith('facebook.com') && !parsed.hostname.endsWith('fbcdn.net')) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function sanitizeErrorMessage(message: string): string {
  // Remove anything that looks like a token (long alphanumeric strings)
  return message.replace(/\b[A-Za-z0-9]{20,}\b/g, '[REDACTED]');
}

function exponentialBackoff(attempt: number): number {
  return Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 30_000);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Custom errors ────────────────────────────────────────────

export class MetaNotConfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MetaNotConfiguredError';
  }
}

export class MetaAPIError extends Error {
  public readonly metadata: Record<string, unknown>;
  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message);
    this.name = 'MetaAPIError';
    this.metadata = metadata;
  }
}

export class MetaRateLimitError extends MetaAPIError {
  constructor(message: string) {
    super(message);
    this.name = 'MetaRateLimitError';
  }
}
