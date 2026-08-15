import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SyncButton } from "./sync-button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Sincronización Meta Ads" };

export default async function AdminSyncPage() {
  const supabase = await createServerSupabaseClient({ useServiceRole: true });

  const { data: runs } = await supabase
    .from("sync_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(20);

  const isMetaConfigured = Boolean(process.env.META_AD_LIBRARY_ACCESS_TOKEN);

  return (
    <div className="min-h-full transition-colors duration-200" style={{ background: "var(--bg-primary, #0d0f14)", color: "var(--text-primary, #f0f0ee)" }}>
      
      {/* Header */}
      <div className="sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-md flex items-center justify-between"
        style={{ background: "var(--bg-secondary, rgba(22,24,32,0.9))", borderColor: "var(--border-color, #1f2128)" }}>
        <div>
          <h1 className="text-lg font-bold" style={{ color: "var(--text-primary, #f0f0ee)" }}>Sincronización Meta Ads</h1>
          <p className="text-xs" style={{ color: "var(--text-secondary, #9899a0)" }}>Métricas observadas y capturas en tiempo real</p>
        </div>
        <SyncButton />
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        
        {/* Meta API status card */}
        <div className="glass-card p-5 border flex items-center justify-between gap-4"
          style={{ borderColor: "var(--border-color, #1f2128)", background: "var(--bg-card, #12141c)" }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isMetaConfigured ? "✅" : "⚡"}</span>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--text-primary, #f0f0ee)" }}>
                Motor de Sincronización Meta Ads: {isMetaConfigured ? "Graph API Token Configurado" : "Modo Observador Activo"}
              </p>
              <p className="text-xs" style={{ color: "var(--text-secondary, #9899a0)" }}>
                {isMetaConfigured
                  ? "Sincronización directa vía Meta Graph API activa."
                  : "Sincroniza anuncios activos, toma snapshots diarios y recalcula señales (Escalando, Nuevo, Estable)."}
              </p>
            </div>
          </div>
          <SyncButton />
        </div>

        {/* Cron info card */}
        <div className="glass-card p-5 border space-y-2" style={{ borderColor: "var(--border-color, #1f2128)", background: "var(--bg-card, #12141c)" }}>
          <h2 className="text-sm font-bold" style={{ color: "var(--text-primary, #f0f0ee)" }}>Sincronización Automática Diaria</h2>
          <div className="space-y-1 text-xs font-mono" style={{ color: "var(--text-secondary, #9899a0)" }}>
            <p>Ruta Cron: <code style={{ color: "var(--accent-emerald, #10b981)" }}>/api/cron/sync-meta</code></p>
            <p>Frecuencia: <code style={{ color: "var(--accent-emerald, #10b981)" }}>0 3 * * *</code> (Diario a las 3:00 UTC)</p>
          </div>
        </div>

        {/* Sync runs history */}
        <div className="glass-card p-6 border space-y-4" style={{ borderColor: "var(--border-color, #1f2128)", background: "var(--bg-card, #12141c)" }}>
          <h2 className="text-sm font-bold" style={{ color: "var(--text-primary, #f0f0ee)" }}>
            Historial de Sincronizaciones ({(runs ?? []).length})
          </h2>
          {!runs || runs.length === 0 ? (
            <p className="text-xs" style={{ color: "var(--text-muted, #5a5c66)" }}>Sin sincronizaciones registradas aún. Haz clic en "Sincronizar Meta Ads Ahora" para iniciar la primera.</p>
          ) : (
            <div className="space-y-2">
              {runs.map((run) => (
                <div key={run.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl border text-xs"
                  style={{ background: "var(--bg-secondary, #161820)", borderColor: "var(--border-color, #1f2128)" }}>
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: run.status === "success" ? "#10b981" : "#f59e0b" }} />
                    <span className="font-semibold" style={{ color: "var(--text-primary, #f0f0ee)" }}>
                      {new Date(run.started_at).toLocaleString("es-AR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4" style={{ color: "var(--text-secondary, #9899a0)" }}>
                    <span>Status: <strong className="uppercase font-mono text-emerald-600">{run.status}</strong></span>
                    <span>{run.items_read} anuncios leídos</span>
                    <span>{run.items_updated} productos actualizados</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
