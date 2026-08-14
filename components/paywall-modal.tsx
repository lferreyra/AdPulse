"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Check, Sparkles, Zap, Lock, ShieldCheck } from "lucide-react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  productCount?: number;
}

export function PaywallModal({ isOpen, onClose, productCount = 580 }: PaywallModalProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);

  if (!isOpen) return null;

  const monthlyPrice = 29990;
  const annualMonthlyEquivalent = 14995;

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (discountCode.trim().toUpperCase() === "PROMO50") {
      setAppliedDiscount(50);
    } else {
      setAppliedDiscount(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}>
      <div className="relative w-full max-w-lg glass-card p-6 border overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
        style={{ background: "#12141c", borderColor: "#1f2128" }}>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}>
            AP
          </span>
          <h2 className="text-lg font-bold flex items-center gap-1.5" style={{ color: "#f0f0ee" }}>
            AdPulse <span style={{ color: "#10b981" }}>Pro</span>
          </h2>
        </div>

        <p className="text-xs mb-5 leading-relaxed" style={{ color: "#9899a0" }}>
          Desbloquea los <strong>+{productCount} productos digitales validados</strong>. Acceso completo y herramientas avanzadas de investigación.
        </p>

        {/* Feature checklist */}
        <div className="grid sm:grid-cols-2 gap-2.5 mb-6 text-xs">
          {[
            { icon: "🔍", text: `Biblioteca completa — +${productCount} ofertas` },
            { icon: "🎛️", text: "Filtros por país, nicho y media" },
            { icon: "📈", text: "Evolución histórica de anuncios" },
            { icon: "🃏", text: "Modo Match táctil y por teclado" },
            { icon: "🔖", text: "Guardados y notas ilimitadas" },
            { icon: "💬", text: "Soporte directo con el equipo" },
          ].map((f) => (
            <div key={f.text} className="flex items-center gap-2 p-2 rounded-lg"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <span>{f.icon}</span>
              <span style={{ color: "#d0d0d5" }}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Pricing card */}
        <div className="rounded-2xl p-5 border mb-4"
          style={{ background: "rgba(5,150,105,0.04)", borderColor: "rgba(5,150,105,0.2)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9899a0" }}>
              {billingCycle === "monthly" ? "Plan Mensual" : "Plan Anual (Ahorro 50%)"}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>
              {billingCycle === "monthly" ? "40% OFF" : "50% OFF"}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xs line-through" style={{ color: "#5a5c66" }}>
              ARS ${billingCycle === "monthly" ? "49.983" : "29.990"}
            </span>
            <span className="text-2xl font-bold font-serif" style={{ color: "#10b981" }}>
              ARS ${billingCycle === "monthly" ? "29.990" : "14.995"}
            </span>
            <span className="text-xs" style={{ color: "#9899a0" }}>/ mes</span>
          </div>

          <p className="text-[10px]" style={{ color: "#5a5c66" }}>
            Pagás cuando quieras · Cancela en 1-clic sin compromisos
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex rounded-xl p-1 mb-4" style={{ background: "#181a24" }}>
          <button
            onClick={() => setBillingCycle("monthly")}
            className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: billingCycle === "monthly" ? "#222534" : "transparent",
              color: billingCycle === "monthly" ? "#f0f0ee" : "#5a5c66",
            }}
          >
            Mensual
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className="flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5"
            style={{
              background: billingCycle === "annual" ? "#222534" : "transparent",
              color: billingCycle === "annual" ? "#f0f0ee" : "#5a5c66",
            }}
          >
            Anual
            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
              style={{ background: "rgba(16,185,129,0.2)", color: "#10b981" }}>
              -50%
            </span>
          </button>
        </div>

        {/* Discount form */}
        <form onSubmit={handleApplyDiscount} className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="CÓDIGO DE DESCUENTO"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            className="flex-1 text-xs px-3 py-2 rounded-xl border outline-none uppercase font-mono"
            style={{ background: "#181a24", borderColor: "#242736", color: "#f0f0ee" }}
          />
          <button
            type="submit"
            className="text-xs px-4 py-2 rounded-xl font-semibold border transition-colors hover:bg-white/5"
            style={{ borderColor: "#242736", color: "#9899a0" }}
          >
            Aplicar
          </button>
        </form>

        {/* Upgrade CTA */}
        <Link
          href="/upgrade"
          className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg"
          style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}
        >
          <Zap size={16} />
          Pasarme a Pro →
        </Link>
      </div>
    </div>
  );
}
