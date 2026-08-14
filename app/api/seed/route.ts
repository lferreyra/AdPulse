import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  // Create 8 realistic active digital products
  const products = [
    {
      id: "a0000000-0000-0000-0000-000000000001",
      name: "36 Cartas del Tarot Gitano en Mapas Mentales",
      slug: "36-cartas-tarot-gitano-mapas-mentales",
      niche: "Espiritualidad", country_code: "BR", country_name: "Brasil", checkout_platform: "Kirvano", media_type: "image",
      landing_url: "https://baralhocigano.com", meta_ads_url: "https://facebook.com/ads/library/?id=10101", checkout_url: "https://kirvano.com/pay/baralho",
      active_ads_count: 51, signal: "Escalando", signal_reason: "Incremento sostenido de anuncios en los últimos 14 días (35 -> 51 anuncios en Brasil).",
      is_sample: true, is_active: true
    },
    {
      id: "a0000000-0000-0000-0000-000000000002",
      name: "Desafío Keto 28 Días y Ayuno Intermitente",
      slug: "desafio-keto-28-dias",
      niche: "Salud & Fitness", country_code: "MX", country_name: "México", checkout_platform: "Hotmart", media_type: "video",
      landing_url: "https://desafioketo.com", meta_ads_url: "https://facebook.com/ads/library/?id=10102", checkout_url: "https://pay.hotmart.com/keto28",
      active_ads_count: 64, signal: "Escalado", signal_reason: "Mantiene +60 anuncios activos continuos durante más de 3 semanas en México.",
      is_sample: true, is_active: true
    }
  ];

  // Try update existing sample products or insert
  for (const p of products) {
    await supabase.from("products").upsert(p, { onConflict: "id" });
  }

  const { data } = await supabase.from("products").select("*");
  return NextResponse.json({ success: true, total: data?.length, products: data });
}
