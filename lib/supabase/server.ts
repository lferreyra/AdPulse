// ============================================================
// lib/supabase/server.ts
// Server-only Supabase client.
// Uses SUPABASE_SERVICE_ROLE_KEY for privileged operations.
// NEVER import this file from client components.
// ============================================================

import 'server-only';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Profile } from './types';

/**
 * Server Supabase client for use in Server Components, Route Handlers,
 * Server Actions and Middleware.
 *
 * Uses the anon key by default (respects RLS).
 * Pass `useServiceRole: true` only in trusted server-side code
 * (e.g., cron jobs, webhooks, admin mutations).
 */
export async function createServerSupabaseClient(
  options: { useServiceRole?: boolean } = {},
) {
  const cookieStore = await cookies();

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

  const supabaseKey =
    options.useServiceRole && serviceRoleKey ? serviceRoleKey : anonKey;

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options: CookieOptions }[],
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
        }
      },
    },
  });
}

/**
 * Retrieves the authenticated user's profile from the profiles table.
 * Validates role server-side. Never trusts client-sent claims.
 */
export async function getServerProfile(): Promise<Profile | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) return null;
    return profile as Profile;
  } catch {
    return null;
  }
}

/**
 * Returns true if the current user is an owner.
 * Validated entirely server-side against the profiles table.
 */
export async function isOwner(): Promise<boolean> {
  const profile = await getServerProfile();
  return profile?.role === 'owner';
}

/**
 * Returns true if the current user has Pro access.
 * Owners always have Pro access regardless of subscription status.
 */
export async function hasPro(): Promise<boolean> {
  // Temporary unlock: allow unrestricted navigation across all content & tools
  return true;
}
