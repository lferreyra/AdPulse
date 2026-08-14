import { createServerSupabaseClient, isOwner } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Sincronización" };

export default async function AdminSyncPage() {
  const supabase = await createServerSupabaseClient({ useServiceRole: true });

  const { data: runs } = await supabase
    .from("sync_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(20);

  const isMetaConfigured = Boolean(process.env.META_AD_LIBRARY_ACCESS_TOKEN);

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-10 px-6 py-4 border-b"
        style={{ background: "rgba(14,16,24,0.9)", backdropFilter: "blur(12px)", borderColor: "#1f2128" }}>
        <h1 className="text-lg font-semibold" style={{ color: "#f0f0ee" }}>Sincronización</h1>
        <p className="text-xs mt-0.5" style={{ color: "#5a5c66" }}>Estado del cron job y Meta API</p>
      </div>

      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Meta API status */}
        <div className={`glass-card p-4 border ${isMetaConfigured ? "border-emerald-900/30" : "border-amber-900/30"}`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">{isMetaConfigured ? "✅" : "⚠️"}</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#f0f0ee" }}>
                Meta Ads Library API: {isMetaConfigured ? "Configurada" : "No configurada"}
              </p>
              {!isMetaConfigured && (
                <p className="text-xs mt-0.5" style={{ color: "#f59e0b" }}>
                  Agrega <code>META_AD_LIBRARY_ACCESS_TOKEN</code> en tus variables de entorno para activar la sincronización automática.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cron info */}
        <div className="glass-card p-4">
          <h2 className="text-sm font-semibold mb-2" style={{ color: "#f0f0ee" }}>Configuración del Cron</h2>
          <div className="space-y-1 text-xs" style={{ color: "#9899a0" }}>
            <p>Ruta: <code className="text-emerald-400">/api/cron/sync-meta</code></p>
            <p>Frecuencia: <code className="text-emerald-400">0 3 * * *</code> (diario a las 3:00 UTC)</p>
            <p>Autenticación: <code>Authorization: Bearer {"${CRON_SECRET}"}</code></p>
          </div>
        </div>

        {/* Sync runs history */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold mb-3" style={{ color: "#f0f0ee" }}>
            Historial de sincronizaciones ({(runs ?? []).length})
          </h2>
          {!runs || runs.length === 0 ? (
            <p className="text-xs" style={{ color: "#5a5c66" }}>Sin sincronizaciones registradas.</p>
          ) : (
            <div className="space-y-2">
              {runs.map((run) => (
                <div key={run.id}
                  className="flex flex-wrap items-center gap-3 px-3 py-2.5 rounded-lg text-xs"
                  style={{ background: "rgba(255,255,255,0.01)" }}>
                  <StatusDot status={run.status} />
                  <span className="font-medium" style={{ color: statusColor(run.status) }}>{run.status}</span>
                  <span style={{ color: "#5a5c66" }}>{new Date(run.started_at).toLocaleString("es-AR")}</span>
                  {run.finished_at && (
                    <span style={{ color: "#3a3c45" }}>
                      {Math.round((new Date(run.finished_at).getTime() - new Date(run.started_at).getTime()) / 1000)}s
                    </span>
                  )}
                  <span style={{ color: "#5a5c66" }}>
                    {run.items_read}r · {run.items_created}c · {run.items_updated}u
                  </span>
                  {run.error_message && (
                    <span className="text-red-400 truncate max-w-xs">{run.error_message}</span>
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

function StatusDot({ status }: { status: string }) {
  return <span className="w-2 h-2 rounded-full shrink-0" style={{ background: statusColor(status) }} />;
}

function statusColor(status: string) {
  return status === "success" ? "#10b981" : status === "failed" ? "#f87171" : status === "running" ? "#f59e0b" : "#9899a0";
}
