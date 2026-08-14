import { redirect } from "next/navigation";
import { createServerSupabaseClient, hasPro } from "@/lib/supabase/server";
import { MatchClientPage } from "./match-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Match",
  description: "Descubre y decide sobre productos digitales con señales activas.",
};

export default async function MatchPage() {
  const pro = await hasPro();
  if (!pro) redirect("/upgrade");

  const supabase = await createServerSupabaseClient();

  // Get user's existing decisions to exclude
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id ?? "00000000-0000-0000-0000-000000000000";

  let decidedIds: string[] = [];
  if (user) {
    const { data: decisions } = await supabase
      .from("match_decisions")
      .select("product_id")
      .eq("user_id", user.id);
    decidedIds = (decisions ?? []).map((d) => d.product_id);
  }

  // Fetch active products
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("active_ads_count", { ascending: false })
    .limit(20);

  if (decidedIds.length > 0) {
    query = query.not("id", "in", `(${decidedIds.join(",")})`);
  }

  const { data: products } = await query;

  return <MatchClientPage initialProducts={products ?? []} userId={userId} />;
}
