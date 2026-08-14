import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ArrowLeft, TrendingUp, MapPin, Info, Bookmark, Languages, Eye, Flame, ShieldAlert } from "lucide-react";
import { createServerSupabaseClient, hasPro } from "@/lib/supabase/server";
import { AdsChart } from "@/components/ads-chart";
import { SignalBadge } from "@/components/signal-badge";
import { validateUrl } from "@/lib/security/url-validator";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("products").select("name, niche").eq("slug", slug).single();
  return {
    title: data ? `${data.name} — Detalle` : "Producto",
    description: data ? `Análisis de actividad publicitaria: ${data.name}` : undefined,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pro = await hasPro();

  const supabase = await createServerSupabaseClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !product) notFound();

  // Non-Pro users can view sample products for demo preview; otherwise redirect to upgrade
  if (!pro && !product.is_sample) {
    redirect("/upgrade");
  }

  // Fetch snapshots for history chart & timeline
  const { data: snapshots } = await supabase
    .from("ad_snapshots")
    .select("snapshot_date, active_ads_count")
    .eq("product_id", product.id)
    .order("snapshot_date", { ascending: true })
    .limit(30);

  const chartData = (snapshots ?? []).map((s) => ({
    date: new Date(s.snapshot_date).toLocaleDateString("es-AR", { day: "2-digit", month: "short" }),
    count: s.active_ads_count,
  }));

  const daysSince = product.first_seen_at
    ? Math.floor((Date.now() - new Date(product.first_seen_at).getTime()) / 86400000)
    : null;

  const landingUrl = validateUrl(product.landing_url);
  const checkoutUrl = validateUrl(product.checkout_url);
  const metaAdsUrl = validateUrl(product.meta_ads_url);

  // Generate "Por qué vale la pena mirarlo" summary dynamically
  const whyItMatters = `${product.signal ?? "Oferta activa"}: ${product.active_ads_count} anuncios activos. ${daysSince !== null ? `${daysSince} días activo.` : ""} ${product.checkout_platform ? `Checkout: ${product.checkout_platform}.` : ""} Mercado: ${product.country_code}.`;

  return (
    <div className="min-h-full pb-12">
      {/* Top sticky header */}
      <div className="sticky top-0 z-10 px-6 py-3.5 border-b"
        style={{ background: "rgba(13,15,20,0.92)", backdropFilter: "blur(12px)", borderColor: "#1f2128" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/library" className="inline-flex items-center gap-2 text-xs font-medium transition-colors hover:text-white" style={{ color: "#9899a0" }}>
            <ArrowLeft size={15} />
            Volver a la biblioteca
          </Link>
          <div className="flex items-center gap-2">
            <SignalBadge signal={product.signal} />
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs font-medium" style={{ color: "#10b981" }}>{product.active_ads_count} anuncios</span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto grid lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN (Main details & chart) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Banner / Visual Frame */}
          <div className="glass-card overflow-hidden border" style={{ borderColor: "#1f2128" }}>
            <div className="relative h-72 w-full flex items-center justify-center bg-neutral-900 overflow-hidden">
              {product.thumbnail_url ? (
                <img
                  src={product.thumbnail_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={
                    product.niche?.toLowerCase().includes("salud") || product.niche?.toLowerCase().includes("bienestar")
                      ? "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop"
                      : product.niche?.toLowerCase().includes("educación") || product.niche?.toLowerCase().includes("marketing")
                      ? "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop"
                      : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover opacity-90"
                />
              )}

              {/* Status pill */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <SignalBadge signal={product.signal} />
                {product.is_sample && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow"
                    style={{ background: "rgba(56,189,248,0.2)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.4)" }}>
                    Demo
                  </span>
                )}
              </div>
            </div>

            {/* Banner Notice */}
            <div className="p-3.5 border-t flex items-start gap-2 text-xs"
              style={{ background: "rgba(251,191,36,0.04)", borderColor: "#1f2128" }}>
              <Info size={15} className="shrink-0 mt-0.5" style={{ color: "#f59e0b" }} />
              <p style={{ color: "#d0d0d5" }}>
                Esta oferta es monitoreada automáticamente mediante la Meta Ads Library API. Las señales reflejan actividad publicitaria observable.
              </p>
            </div>
          </div>

          {/* Title & Actions Bar */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <SignalBadge signal={product.signal} />
              <button className="p-1.5 rounded-lg border text-xs transition-colors hover:bg-white/5" style={{ borderColor: "#1f2128", color: "#9899a0" }} title="Guardar producto">
                <Bookmark size={14} />
              </button>
              <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs transition-colors hover:bg-white/5" style={{ borderColor: "#1f2128", color: "#9899a0" }}>
                <Languages size={13} />
                Traducir
              </button>
            </div>

            <h1 className="text-xl font-bold leading-tight mb-4" style={{ color: "#f0f0ee" }}>
              {product.name}
            </h1>

            {/* Callout box: Por qué vale la pena mirarlo */}
            <div className="glass-card p-4 mb-4 border" style={{ background: "rgba(255,255,255,0.01)", borderColor: "#1f2128" }}>
              <div className="flex items-center gap-2 mb-1.5">
                <Eye size={15} style={{ color: "#10b981" }} />
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#f0f0ee" }}>
                  Por qué vale la pena analizarlo
                </h3>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#9899a0" }}>
                {whyItMatters}
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              {metaAdsUrl && (
                <ActionLink href={metaAdsUrl} label="Abrir en Meta Ad Library" />
              )}
              {landingUrl && (
                <ActionLink href={landingUrl} label="Ver landing page" />
              )}
              {checkoutUrl && (
                <ActionLink href={checkoutUrl} label="Ver checkout" />
              )}
            </div>
          </div>

          {/* Historical Ads Chart (Exclusive to AdPulse) */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} style={{ color: "#10b981" }} />
                <h2 className="text-sm font-semibold" style={{ color: "#f0f0ee" }}>Evolución de anuncios activos</h2>
              </div>
              <span className="text-[10px]" style={{ color: "#5a5c66" }}>
                Últimos {chartData.length} registros
              </span>
            </div>
            <AdsChart data={chartData} />
          </div>
        </div>

        {/* RIGHT COLUMN (Data Breakdown & History) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Card: Datos */}
          <div className="glass-card p-5 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest border-b pb-2 mb-3" style={{ color: "#5a5c66", borderColor: "#1f2128" }}>
              Datos de la oferta
            </h2>

            <DataRow label="📢 Anuncios activos" value={product.active_ads_count.toString()} accent />
            <DataRow label="📅 Días activo" value={daysSince !== null ? `${daysSince} días` : "—"} />
            <DataRow label="🗓️ Primera detección" value={product.first_seen_at ? new Date(product.first_seen_at).toLocaleDateString("es-AR") : "—"} />
            <DataRow label="🕒 Última verificación" value={product.last_seen_at ? new Date(product.last_seen_at).toLocaleDateString("es-AR") : "—"} />
            <DataRow label="🌐 Mercado principal" value={product.country_name} />
            <DataRow label="🏷️ Nicho" value={product.niche ?? "—"} />
            <DataRow label="🛒 Checkout" value={product.checkout_platform ?? "—"} />
            <DataRow label="🎯 Tipo de embudo" value="Directo a checkout" />
            <DataRow label="🎥 Formato media" value={product.media_type ?? "—"} capitalize />
          </div>

          {/* Card: Historial de Cambios */}
          <div className="glass-card p-5 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest border-b pb-2 mb-3" style={{ color: "#5a5c66", borderColor: "#1f2128" }}>
              Historial de cambios
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "#10b981" }} />
                <div>
                  <p className="font-medium" style={{ color: "#f0f0ee" }}>Estado: activo ({product.active_ads_count} anuncios)</p>
                  <p className="text-[10px]" style={{ color: "#5a5c66" }}>
                    {product.last_seen_at ? new Date(product.last_seen_at).toLocaleDateString("es-AR") : "Hoy"}
                  </p>
                </div>
              </div>

              {product.first_seen_at && (
                <div className="flex items-start gap-2.5 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "#38bdf8" }} />
                  <div>
                    <p className="font-medium" style={{ color: "#f0f0ee" }}>Primera detección en sistema</p>
                    <p className="text-[10px]" style={{ color: "#5a5c66" }}>
                      {new Date(product.first_seen_at).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Report link */}
          <div className="text-center pt-2">
            <button className="text-xs transition-colors hover:text-red-400 flex items-center justify-center gap-1.5 mx-auto" style={{ color: "#5a5c66" }}>
              <ShieldAlert size={13} />
              Reportar oferta inactiva
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

function DataRow({ label, value, accent, capitalize }: { label: string; value: string; accent?: boolean; capitalize?: boolean }) {
  return (
    <div className="flex justify-between items-center text-xs py-1 border-b border-white/3">
      <span style={{ color: "#9899a0" }}>{label}</span>
      <span className={`font-semibold truncate max-w-[180px] ${capitalize ? "capitalize" : ""}`}
        style={{ color: accent ? "#10b981" : "#f0f0ee" }}>
        {value}
      </span>
    </div>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-semibold transition-all hover:bg-white/5"
      style={{ background: "#161820", borderColor: "#1f2128", color: "#f0f0ee" }}
    >
      <span>{label}</span>
      <ExternalLink size={14} style={{ color: "#9899a0" }} />
    </a>
  );
}
