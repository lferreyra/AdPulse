import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient({ useServiceRole: true });

  const [
    { count: productCount },
    { count: activeAdsTotal },
    { data: recentRuns },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("products").select("active_ads_count", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("sync_runs").select("*").order("started_at", { ascending: false }).limit(5),
  ]);

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-10 px-6 py-4 border-b"
        style={{ background: "rgba(14,16,24,0.9)", backdropFilter: "blur(12px)", borderColor: "#1f2128" }}>
        <h1 className="text-lg font-semibold" style={{ color: "#f0f0ee" }}>Dashboard Admin</h1>
        <p className="text-xs mt-0.5" style={{ color: "#5a5c66" }}>Panel de control del propietario</p>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard label="Productos activos" value={productCount?.toString() ?? "—"} />
          <StatCard label="Muestras" value="2" accent />
          <StatCard label="Último sync" value={recentRuns?.[0]?.status ?? "—"} />
        </div>

        {/* Quick actions */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold mb-3" style={{ color: "#f0f0ee" }}>Acciones rápidas</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/products/new"
              className="text-xs font-semibold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}>
              + Nuevo producto
            </Link>
            <Link href="/admin/sync"
              className="text-xs font-semibold px-4 py-2 rounded-lg border transition-all hover:bg-white/5"
              style={{ borderColor: "#1f2128", color: "#9899a0" }}>
              Ver sincronizaciones
            </Link>
          </div>
        </div>

        {/* Recent sync runs */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold mb-3" style={{ color: "#f0f0ee" }}>Últimas sincronizaciones</h2>
          {!recentRuns || recentRuns.length === 0 ? (
            <p className="text-xs" style={{ color: "#5a5c66" }}>No hay sincronizaciones registradas.</p>
          ) : (
            <div className="space-y-2">
              {recentRuns.map((run) => (
                <div key={run.id} className="flex items-center gap-3 text-xs">
                  <StatusDot status={run.status} />
                  <span style={{ color: "#9899a0" }}>
                    {new Date(run.started_at).toLocaleString("es-AR")}
                  </span>
                  <span className="font-medium" style={{ color: run.status === "success" ? "#10b981" : run.status === "failed" ? "#f87171" : "#f59e0b" }}>
                    {run.status}
                  </span>
                  {run.items_read > 0 && (
                    <span style={{ color: "#5a5c66" }}>
                      {run.items_read} leídos · {run.items_created} creados · {run.items_updated} actualizados
                    </span>
                  )}
                  {run.error_message && (
                    <span className="truncate max-w-xs" style={{ color: "#f87171" }}>{run.error_message}</span>
                  )}
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
    <div className="glass-card p-4 text-center">
      <p className="text-2xl font-bold mb-1" style={{ color: accent ? "#10b981" : "#f0f0ee" }}>{value}</p>
      <p className="text-[10px] uppercase tracking-wider" style={{ color: "#5a5c66" }}>{label}</p>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color = status === "success" ? "#10b981" : status === "failed" ? "#f87171" : status === "running" ? "#f59e0b" : "#9899a0";
  return <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />;
}
