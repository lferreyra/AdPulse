import { NextResponse } from "next/server";
import { createServerSupabaseClient, isOwner } from "@/lib/supabase/server";
import { z } from "zod";
import { upsertManualProduct } from "@/lib/meta/manual-adapter";

const productSchema = z.object({
  name: z.string().min(2),
  niche: z.string().optional(),
  country_code: z.string().length(2),
  country_name: z.string().min(2),
  checkout_platform: z.string().optional(),
  media_type: z.enum(["video", "image", "mixed", "unknown"]),
  landing_url: z.string().url().optional().or(z.literal("")),
  meta_ads_url: z.string().url().optional().or(z.literal("")),
  checkout_url: z.string().url().optional().or(z.literal("")),
  active_ads_count: z.number().min(0),
});

export async function POST(request: Request) {
  // Validate owner server-side
  const owner = await isOwner();
  if (!owner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 422 }
    );
  }

  try {
    const productId = await upsertManualProduct(parsed.data);
    return NextResponse.json({ success: true, id: productId }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
