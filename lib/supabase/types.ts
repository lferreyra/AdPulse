// ============================================================
// lib/supabase/types.ts
// TypeScript types matching the Supabase schema.
// Keep in sync with migrations.
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── Enums ────────────────────────────────────────────────────

export type UserRole = 'user' | 'owner';

export type SubscriptionStatus =
  | 'inactive'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled';

export type MediaType = 'video' | 'image' | 'mixed' | 'unknown';

export type ProductSource = 'meta_api' | 'owner' | 'manual_import';

export type SignalLabel = 'Nuevo' | 'Escalando' | 'Escalado' | 'Asentado';

export type SyncRunStatus = 'running' | 'success' | 'partial' | 'failed';

export type MatchDecision = 'saved' | 'dismissed';

// ─── Table row types ──────────────────────────────────────────

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  subscription_status: SubscriptionStatus;
  subscription_provider: string | null;
  subscription_customer_id: string | null;
  subscription_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  niche: string | null;
  country_code: string;
  country_name: string;
  checkout_platform: string | null;
  media_type: MediaType | null;
  landing_url: string | null;
  meta_ads_url: string | null;
  checkout_url: string | null;
  thumbnail_url?: string | null;
  meta_page_id: string | null;
  representative_library_id: string | null;
  active_ads_count: number;
  first_seen_at: string | null;
  last_seen_at: string | null;
  last_active_at: string | null;
  signal: SignalLabel | null;
  signal_reason: string | null;
  is_sample: boolean;
  is_active: boolean;
  source: ProductSource | null;
  created_at: string;
  updated_at: string;
}

export interface AdSnapshot {
  id: string;
  product_id: string;
  snapshot_date: string;
  active_ads_count: number;
  active_library_ids: Json | null;
  markets: Json | null;
  media_breakdown: Json | null;
  source: string | null;
  created_at: string;
}

export interface ProductAd {
  id: string;
  product_id: string;
  library_id: string;
  page_id: string | null;
  page_name: string | null;
  ad_snapshot_url: string | null;
  creative_body: string | null;
  media_type: string | null;
  publisher_platforms: Json | null;
  delivery_start_at: string | null;
  delivery_stop_at: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  user_id: string;
  product_id: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface MatchDecisionRow {
  user_id: string;
  product_id: string;
  decision: MatchDecision;
  created_at: string;
}

export interface SyncRun {
  id: string;
  started_at: string;
  finished_at: string | null;
  status: SyncRunStatus;
  items_read: number;
  items_created: number;
  items_updated: number;
  error_message: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Json | null;
  created_at: string;
}

// ─── Database type for Supabase client ────────────────────────

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & Pick<Profile, 'id'>;
        Update: Partial<Profile>;
        Relationships: any[];
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'> &
          Partial<Pick<Product, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Product>;
        Relationships: any[];
      };
      ad_snapshots: {
        Row: AdSnapshot;
        Insert: Omit<AdSnapshot, 'id' | 'created_at'> &
          Partial<Pick<AdSnapshot, 'id' | 'created_at'>>;
        Update: Partial<AdSnapshot>;
        Relationships: any[];
      };
      product_ads: {
        Row: ProductAd;
        Insert: Omit<ProductAd, 'id' | 'created_at' | 'updated_at'> &
          Partial<Pick<ProductAd, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<ProductAd>;
        Relationships: any[];
      };
      favorites: {
        Row: Favorite;
        Insert: Omit<Favorite, 'created_at' | 'updated_at'> &
          Partial<Pick<Favorite, 'created_at' | 'updated_at'>>;
        Update: Partial<Favorite>;
        Relationships: any[];
      };
      match_decisions: {
        Row: MatchDecisionRow;
        Insert: Omit<MatchDecisionRow, 'created_at'> &
          Partial<Pick<MatchDecisionRow, 'created_at'>>;
        Update: Partial<MatchDecisionRow>;
        Relationships: any[];
      };
      sync_runs: {
        Row: SyncRun;
        Insert: Omit<SyncRun, 'id' | 'created_at'> &
          Partial<Pick<SyncRun, 'id' | 'created_at'>>;
        Update: Partial<SyncRun>;
        Relationships: any[];
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at'> &
          Partial<Pick<AuditLog, 'id' | 'created_at'>>;
        Update: Partial<AuditLog>;
        Relationships: any[];
      };
    };
    Views: {
      [_ in string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: any[];
      };
    };
    Functions: {
      [_ in string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
    Enums: {
      [_ in string]: unknown;
    };
    CompositeTypes: {
      [_ in string]: unknown;
    };
  };
};
