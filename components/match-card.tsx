"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, X, Eye, ChevronLeft } from "lucide-react";
import { SignalBadge } from "@/components/signal-badge";
import type { Product } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/client";

interface MatchCardProps {
  product: Product;
  onSave: (productId: string) => Promise<void>;
  onDismiss: (productId: string) => Promise<void>;
  onUndo: () => void;
  canUndo: boolean;
}

export function MatchCard({ product, onSave, onDismiss, onUndo, canUndo }: MatchCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"save" | "dismiss" | null>(null);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (loading) return;
      if (e.key === "ArrowLeft" || e.key === "d") handleDismiss();
      if (e.key === "ArrowRight" || e.key === "s") handleSave();
      if (e.key === "Enter") router.push(`/products/${product.slug}`);
      if (e.key === "z" && (e.ctrlKey || e.metaKey) && canUndo) onUndo();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [loading, product.slug, canUndo]);

  const handleSave = useCallback(async () => {
    if (loading) return;
    setLoading("save");
    setSwipeDir("right");
    setTimeout(async () => {
      await onSave(product.id);
      setLoading(null);
      setSwipeDir(null);
    }, 300);
  }, [loading, onSave, product.id]);

  const handleDismiss = useCallback(async () => {
    if (loading) return;
    setLoading("dismiss");
    setSwipeDir("left");
    setTimeout(async () => {
      await onDismiss(product.id);
      setLoading(null);
      setSwipeDir(null);
    }, 300);
  }, [loading, onDismiss, product.id]);

  const daysSince = product.first_seen_at
    ? Math.floor((Date.now() - new Date(product.first_seen_at).getTime()) / 86400000)
    : null;

  return (
    <div className="relative flex flex-col items-center">
      {/* Card */}
      <div
        className="w-full max-w-sm glass-card p-6 transition-all duration-300 select-none"
        style={{
          transform: swipeDir === "left" ? "translateX(-60px) rotate(-4deg) opacity(0)" : swipeDir === "right" ? "translateX(60px) rotate(4deg)" : undefined,
          opacity: swipeDir ? 0 : 1,
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <SignalBadge signal={product.signal} />
              {product.is_sample && (
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest"
                  style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.2)" }}>
                  Demo
                </span>
              )}
            </div>
            <h2 className="text-base font-semibold leading-snug" style={{ color: "#f0f0ee" }}>
              {product.name}
            </h2>
          </div>
        </div>

        <div className="space-y-2 text-xs mb-5">
          <DataRow label="🌎 País" value={product.country_name} />
          <DataRow label="🏷️ Nicho" value={product.niche ?? "—"} />
          <DataRow label="🛒 Checkout" value={product.checkout_platform ?? "—"} />
          <DataRow label="📢 Anuncios" value={product.active_ads_count.toString()} accent />
          <DataRow label="📅 Días activo" value={daysSince !== null ? `${daysSince}d` : "—"} />
          <DataRow label="🎥 Media" value={product.media_type ?? "—"} capitalize />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDismiss}
            disabled={!!loading}
            aria-label="Descartar producto"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all hover:bg-red-500/10 hover:border-red-500/30 disabled:opacity-50 focus-visible:ring-2"
            style={{ borderColor: "#1f2128", color: "#9899a0" }}
          >
            <X size={15} />
            Descartar
          </button>
          <button
            onClick={() => router.push(`/products/${product.slug}`)}
            aria-label="Ver detalle del producto"
            className="p-2.5 rounded-xl border transition-all hover:bg-white/5 focus-visible:ring-2"
            style={{ borderColor: "#1f2128", color: "#9899a0" }}
          >
            <Eye size={15} />
          </button>
          <button
            onClick={handleSave}
            disabled={!!loading}
            aria-label="Guardar producto"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 focus-visible:ring-2"
            style={{ background: "linear-gradient(135deg, #059669, #0d7377)", color: "white" }}
          >
            <Heart size={15} />
            Guardar
          </button>
        </div>

        {/* Keyboard hints */}
        <div className="mt-3 flex justify-center gap-4">
          <span className="text-[10px]" style={{ color: "#3a3c45" }}>← Descartar</span>
          <span className="text-[10px]" style={{ color: "#3a3c45" }}>Enter: Detalle</span>
          <span className="text-[10px]" style={{ color: "#3a3c45" }}>→ Guardar</span>
        </div>
      </div>

      {/* Undo */}
      {canUndo && (
        <button
          onClick={onUndo}
          className="mt-4 flex items-center gap-1.5 text-xs transition-colors hover:text-white"
          style={{ color: "#9899a0" }}
        >
          <ChevronLeft size={12} />
          Deshacer última acción (⌘Z)
        </button>
      )}
    </div>
  );
}

function DataRow({ label, value, accent, capitalize }: { label: string; value: string; accent?: boolean; capitalize?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span style={{ color: "#5a5c66" }}>{label}</span>
      <span className={`font-medium truncate ${capitalize ? "capitalize" : ""}`}
        style={{ color: accent ? "#10b981" : "#c0c0c8" }}>
        {value}
      </span>
    </div>
  );
}
