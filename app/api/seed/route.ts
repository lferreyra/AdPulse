import { NextResponse } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient({ useServiceRole: true });

  const products = [
    {
      id: "a0000000-0000-0000-0000-000000000001",
      name: "36 Cartas del Tarot Gitano en Mapas Mentales",
      slug: "36-cartas-tarot-gitano-mapas-mentales",
      niche: "Espiritualidad", country_code: "BR", country_name: "Brasil", checkout_platform: "Kirvano", media_type: "image",
      landing_url: "https://baralhocigano.com", meta_ads_url: "https://facebook.com/ads/library/?id=10101", checkout_url: "https://kirvano.com/pay/baralho",
      active_ads_count: 51, signal: "Escalando", signal_reason: "Incremento sostenido de anuncios en los últimos 14 días (35 -> 51 anuncios en Brasil).",
      is_sample: false, is_active: true
    },
    {
      id: "a0000000-0000-0000-0000-000000000002",
      name: "Desafío Keto 28 Días y Ayuno Intermitente",
      slug: "desafio-keto-28-dias",
      niche: "Salud & Fitness", country_code: "MX", country_name: "México", checkout_platform: "Hotmart", media_type: "video",
      landing_url: "https://desafioketo.com", meta_ads_url: "https://facebook.com/ads/library/?id=10102", checkout_url: "https://pay.hotmart.com/keto28",
      active_ads_count: 64, signal: "Escalado", signal_reason: "Mantiene +60 anuncios activos continuos durante más de 3 semanas en México.",
      is_sample: false, is_active: true
    },
    {
      id: "a0000000-0000-0000-0000-000000000003",
      name: "Inglés Acelerado con Inteligencia Artificial",
      slug: "ingles-acelerado-inteligencia-artificial",
      niche: "Idiomas", country_code: "CO", country_name: "Colombia", checkout_platform: "Kiwify", media_type: "video",
      landing_url: "https://inglesconia.com", meta_ads_url: "https://facebook.com/ads/library/?id=10103", checkout_url: "https://kiwify.com.br/inglesia",
      active_ads_count: 38, signal: "Nuevo", signal_reason: "Producto detectado por primera vez hace menos de 10 días con fuerte aceleración inicial.",
      is_sample: false, is_active: true
    },
    {
      id: "a0000000-0000-0000-0000-000000000004",
      name: "Finanzas en Orden — Plantilla Notion & Excel",
      slug: "finanzas-en-orden-plantilla-notion",
      niche: "Finanzas", country_code: "AR", country_name: "Argentina", checkout_platform: "Capa", media_type: "image",
      landing_url: "https://finanzasenorden.app", meta_ads_url: "https://facebook.com/ads/library/?id=10104", checkout_url: "https://capa.to/finanzas",
      active_ads_count: 29, signal: "Estable", signal_reason: "Actividad constante de 25-30 anuncios sostenidos en Argentina.",
      is_sample: false, is_active: true
    },
    {
      id: "a0000000-0000-0000-0000-000000000005",
      name: "Planifica sin Fricción — Sistema de Productividad",
      slug: "planifica-sin-friccion-sistema-productividad",
      niche: "Productividad", country_code: "ES", country_name: "España", checkout_platform: "Hotmart", media_type: "video",
      landing_url: "https://planificasinfriccion.es", meta_ads_url: "https://facebook.com/ads/library/?id=10105", checkout_url: "https://pay.hotmart.com/planifica",
      active_ads_count: 19, signal: "Nuevo", signal_reason: "Primera vez detectado en España con 19 anuncios activos.",
      is_sample: false, is_active: true
    },
    {
      id: "a0000000-0000-0000-0000-000000000006",
      name: "Método Ventas IG — Automatización de Reels",
      slug: "metodo-ventas-ig-automatizacion-reels",
      niche: "Marketing", country_code: "BR", country_name: "Brasil", checkout_platform: "Kiwify", media_type: "video",
      landing_url: "https://metodoventasig.br", meta_ads_url: "https://facebook.com/ads/library/?id=10106", checkout_url: "https://kiwify.com.br/ventasig",
      active_ads_count: 67, signal: "Escalando", signal_reason: "La oferta sumó actividad en México y Colombia durante los últimos 7 días.",
      is_sample: false, is_active: true
    }
  ];

  for (const p of products) {
    await supabase.from("products").upsert(p, { onConflict: "id" });
  }

  const { data } = await supabase.from("products").select("*").eq("is_active", true);
  return NextResponse.json({ success: true, total: data?.length, products: data });
}
