import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard — AdPulse" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient({ useServiceRole: true });

  const [
    { count: productCount },
    { data: activeAdsData },
    { data: recentRuns },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("products").select("active_ads_count").eq("is_active", true),
    supabase.from("sync_runs").select("*").order("started_at", { ascending: false }).limit(5),
  ]);

  const totalAds = (activeAdsData ?? []).reduce((acc, p) => acc + (p.active_ads_count || 0), 0);

  return (
    <div className="min-h-full transition-colors duration-200" style={{ background: "var(--bg-primary, #0d0f14)", color: "var(--text-primary, #f0f0ee)" }}>
      
      {/* Header */}
      <div className="sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-md"
        style={{ background: "var(--bg-secondary, rgba(22,24,32,0.9))", borderColor: "var(--border-color, #1f2128)" }}>
        <h1 className="text-lg font-bold" style={{ color: "var(--text-primary, #f0f0ee)" }}>Dashboard Admin</h1>
        <p className="text-xs" style={{ color: "var(--text-secondary, #9899a0)" }}>Panel de control del propietario</p>
      </div>

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="PRODUCTOS ACTIVOS" value={productCount?.toString() ?? "0"} />
          <StatCard label="TOTAL ANUNCIOS OBSERVADOS" value={totalAds.toString()} accent />
          <StatCard label="ÚLTIMO SYNC" value={recentRuns?.[0]?.status ? recentRuns[0].status.toUpperCase() : "LISTO"} />
        </div>

        {/* Quick actions */}
        <div className="glass-card p-6 border space-y-4" style={{ borderColor: "var(--border-color, #1f2128)", background: "var(--bg-card, #12141c)" }}>
          <h2 className="text-sm font-bold" style={{ color: "var(--text-primary, #f0f0ee)" }}>Acciones rápidas</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/products/new"
              className="text-xs font-bold px-4 py-2.5 rounded-xl text-white transition-all hover:opacity-90 shadow-sm"
              style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}>
              + Nuevo producto real
            </Link>
            <Link href="/admin/sync"
              className="text-xs font-bold px-4 py-2.5 rounded-xl border transition-all hover:bg-black/5"
              style={{ borderColor: "var(--border-strong, #242736)", color: "var(--text-primary, #f0f0ee)", background: "var(--bg-secondary, #161820)" }}>
              Ver sincronizaciones Meta Ads
            </Link>
          </div>
        </div>

        {/* Recent sync runs */}
        <div className="glass-card p-6 border space-y-4" style={{ borderColor: "var(--border-color, #1f2128)", background: "var(--bg-card, #12141c)" }}>
          <h2 className="text-sm font-bold" style={{ color: "var(--text-primary, #f0f0ee)" }}>Últimas sincronizaciones</h2>
          {!recentRuns || recentRuns.length === 0 ? (
            <p className="text-xs" style={{ color: "var(--text-muted, #5a5c66)" }}>No hay sincronizaciones registradas aún.</p>
          ) : (
            <div className="space-y-2.5">
              {recentRuns.map((run) => (
                <div key={run.id} className="flex flex-wrap items-center gap-3 text-xs p-3 rounded-xl border"
                  style={{ background: "var(--bg-secondary, #161820)", borderColor: "var(--border-color, #1f2128)" }}>
                  <StatusDot status={run.status} />
                  <span className="font-semibold" style={{ color: "var(--text-primary, #f0f0ee)" }}>
                    {new Date(run.started_at).toLocaleString("es-AR")}
                  </span>
                  <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded"
                    style={{ background: run.status === "success" ? "rgba(16,185,129,0.15)" : "rgba(248,113,113,0.15)", color: run.status === "success" ? "#10b981" : "#f87171" }}>
                    {run.status}
                  </span>
                  <span style={{ color: "var(--text-secondary, #9899a0)" }}>
                    {run.items_read} leídos · {run.items_updated} actualizados
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="glass-card p-5 border text-center space-y-1" style={{ borderColor: "var(--border-color, #1f2128)", background: "var(--bg-card, #12141c)" }}>
      <p className="text-3xl font-extrabold font-mono" style={{ color: accent ? "var(--accent-emerald, #10b981)" : "var(--text-primary, #f0f0ee)" }}>{value}</p>
      <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--text-muted, #5a5c66)" }}>{label}</p>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color = status === "success" ? "#10b981" : status === "failed" ? "#f87171" : "#f59e0b";
  return <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />;
}
