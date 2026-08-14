import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/library";

  // Validate `next` to prevent open redirect
  const allowedPrefixes = ["/library", "/trends", "/match", "/saved", "/upgrade"];
  const safeNext = allowedPrefixes.some((p) => next.startsWith(p)) ? next : "/library";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Auth error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
