"use client";

import Link from "next/link";
import { ExternalLink, Lock, Eye, Heart, MapPin, Tag, Flame } from "lucide-react";
import { SignalBadge } from "@/components/signal-badge";
import type { Product } from "@/lib/supabase/types";
import { validateUrl } from "@/lib/security/url-validator";

interface ProductCardProps {
  product: Product;
  isPro?: boolean;
  onLockClick?: () => void;
  isLocked?: boolean;
}

export function ProductCard({ product, isPro = true, onLockClick, isLocked }: ProductCardProps) {
  const landingUrl = validateUrl(product.landing_url);
  const daysSince = product.first_seen_at
    ? Math.floor((Date.now() - new Date(product.first_seen_at).getTime()) / 86400000)
    : null;

  if (isLocked) {
    return (
      <div
        onClick={onLockClick}
        className="glass-card relative overflow-hidden cursor-pointer group p-5 flex flex-col justify-between h-64 border transition-all hover:border-emerald-500/30 select-none"
        style={{ borderColor: "#1f2128" }}
      >
        {/* Blurred background preview */}
        <div className="absolute inset-0 p-5 filter blur-[6px] opacity-40 pointer-events-none select-none">
          <div className="h-24 rounded-lg bg-neutral-800 mb-3" />
          <div className="h-4 w-3/4 bg-neutral-700 rounded mb-2" />
          <div className="h-3 w-1/2 bg-neutral-800 rounded" />
        </div>

        {/* Lock Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 shadow-lg"
            style={{ background: "rgba(5,150,105,0.15)", border: "1px solid rgba(5,150,105,0.3)" }}>
            <Lock size={18} style={{ color: "#10b981" }} />
          </div>
          <p className="text-xs font-semibold mb-1" style={{ color: "#f0f0ee" }}>
            Oferta bloqueada
          </p>
          <span className="text-[11px] font-semibold px-3 py-1.5 rounded-lg text-white transition-all group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}>
            🔒 Desbloquear con Pro
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-emerald-900/40 group">
      {/* Banner / Visual Frame */}
      <div className="relative h-36 w-full overflow-hidden flex items-center justify-center border-b bg-neutral-900"
        style={{ borderColor: "#1f2128" }}>
        
        {product.thumbnail_url ? (
          <img
            src={product.thumbnail_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <img
            src={
              product.niche?.toLowerCase().includes("salud") || product.niche?.toLowerCase().includes("bienestar")
                ? "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop"
                : product.niche?.toLowerCase().includes("educación") || product.niche?.toLowerCase().includes("marketing")
                ? "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
                : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
            }
            alt={product.name ?? "Producto digital"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
          />
        )}

        {/* Active Ads Pill */}
        <div className="absolute bottom-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
          style={{ background: "rgba(5,150,105,0.15)", color: "#10b981", border: "1px solid rgba(5,150,105,0.25)" }}>
          <Flame size={11} />
          {product.active_ads_count} anuncios
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold mb-2 line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors"
            style={{ color: "#f0f0ee" }}>
            {product.name}
          </h3>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mb-3" style={{ color: "#9899a0" }}>
            <span className="flex items-center gap-1">
              <MapPin size={11} style={{ color: "#5a5c66" }} />
              {product.country_name}
            </span>
            {daysSince !== null && (
              <span className="flex items-center gap-1">
                📅 {daysSince}d activo
              </span>
            )}
          </div>
        </div>

        {/* Footer tags & links */}
        <div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.niche && (
              <span className="text-[10px] px-2 py-0.5 rounded-md"
                style={{ background: "rgba(255,255,255,0.03)", color: "#9899a0", border: "1px solid rgba(255,255,255,0.05)" }}>
                {product.niche}
              </span>
            )}
            {product.checkout_platform && (
              <span className="text-[10px] px-2 py-0.5 rounded-md"
                style={{ background: "rgba(255,255,255,0.03)", color: "#9899a0", border: "1px solid rgba(255,255,255,0.05)" }}>
                🛒 {product.checkout_platform}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: "#1f2128" }}>
            <Link
              href={`/products/${product.slug}`}
              className="flex-1 text-center py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-1"
              style={{ background: "rgba(5,150,105,0.12)", color: "#10b981" }}
            >
              <Eye size={12} />
              Ver análisis
            </Link>

            {landingUrl && (
              <a
                href={landingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg border transition-colors hover:bg-white/5"
                style={{ borderColor: "#1f2128", color: "#9899a0" }}
                title="Ver landing page"
              >
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
