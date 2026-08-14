import Link from "next/link";
import { Lock } from "lucide-react";

interface PaywallBannerProps {
  className?: string;
}

export function PaywallBanner({ className = "" }: PaywallBannerProps) {
  return (
    <div
      className={`rounded-xl p-4 border flex items-start sm:items-center gap-4 flex-col sm:flex-row ${className}`}
      style={{
        background: "rgba(5,150,105,0.05)",
        borderColor: "rgba(5,150,105,0.2)",
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "rgba(5,150,105,0.12)" }}
      >
        <Lock size={16} style={{ color: "#10b981" }} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold" style={{ color: "#f0f0ee" }}>
          Biblioteca completa disponible con Plan Pro
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#9899a0" }}>
          Estás viendo solo las fichas de muestra. Activa tu plan para acceder a todos los productos, tendencias y modo Match.
        </p>
      </div>
      <Link
        href="/upgrade"
        className="shrink-0 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 whitespace-nowrap"
        style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}
      >
        Ver planes →
      </Link>
    </div>
  );
}
