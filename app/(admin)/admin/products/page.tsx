import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SignalBadge } from "@/components/signal-badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Productos" };

export default async function AdminProductsPage() {
  const supabase = await createServerSupabaseClient({ useServiceRole: true });
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between"
        style={{ background: "rgba(14,16,24,0.9)", backdropFilter: "blur(12px)", borderColor: "#1f2128" }}>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "#f0f0ee" }}>Productos</h1>
          <p className="text-xs mt-0.5" style={{ color: "#5a5c66" }}>{(products ?? []).length} productos registrados</p>
        </div>
        <Link href="/admin/products/new"
          className="text-xs font-semibold px-4 py-2 rounded-lg text-white"
          style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}>
          + Nuevo
        </Link>
      </div>

      <div className="p-6">
        <div className="space-y-2">
          {(products ?? []).map((p) => (
            <div key={p.id} className="glass-card px-4 py-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium truncate" style={{ color: "#f0f0ee" }}>{p.name}</span>
                  {p.is_sample && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest shrink-0"
                      style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.2)" }}>
                      Demo
                    </span>
                  )}
                  {!p.is_active && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest shrink-0"
                      style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>
                      Archivado
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: "#5a5c66" }}>
                  {p.country_name}{p.niche ? ` · ${p.niche}` : ""} · {p.active_ads_count} anuncios
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <SignalBadge signal={p.signal} />
                <Link href={`/admin/products/${p.id}/edit`}
                  className="text-[11px] px-3 py-1.5 rounded-lg border transition-all hover:bg-white/5"
                  style={{ borderColor: "#1f2128", color: "#9899a0" }}>
                  Editar
                </Link>
              </div>
            </div>
          ))}
          {(!products || products.length === 0) && (
            <div className="text-center py-12 rounded-2xl border border-dashed" style={{ borderColor: "#1f2128" }}>
              <p className="text-xs" style={{ color: "#5a5c66" }}>Sin productos. Crea el primero o ejecuta una sincronización.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
