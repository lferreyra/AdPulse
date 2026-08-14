import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actualizar plan",
  description: "Desbloquea la biblioteca completa de AdPulse Intelligence.",
};

export default function UpgradePage() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-6"
          style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}>
          AP
        </div>
        <h1 className="text-2xl font-semibold mb-2" style={{ color: "#f0f0ee" }}>
          Desbloquea AdPulse Pro
        </h1>
        <p className="text-sm mb-8" style={{ color: "#9899a0" }}>
          Accede a la biblioteca completa, tendencias, modo Match, guardados ilimitados y notas personales.
        </p>

        {/* Plan card */}
        <div className="glass-card p-6 mb-6 text-left">
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold" style={{ color: "#f0f0ee" }}>Pro</span>
          </div>
          <ul className="space-y-2.5 mb-6">
            {[
              "Biblioteca completa de productos",
              "Filtros avanzados combinables",
              "Gráficos históricos de anuncios",
              "Modo Match con teclado y móvil",
              "Guardados y notas personales",
              "Página de tendencias semanales",
              "Acceso a todos los países y nichos",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "#c0c0c8" }}>
                <span style={{ color: "#10b981" }}>✓</span>
                {f}
              </li>
            ))}
          </ul>

          {/* Stripe not configured notice */}
          <div className="rounded-lg p-3 border mb-4" style={{ background: "rgba(251,191,36,0.05)", borderColor: "rgba(251,191,36,0.2)" }}>
            <p className="text-xs" style={{ color: "#f59e0b" }}>
              <strong>Configuración pendiente:</strong> La integración con Stripe no está activa todavía.
              Configura <code>STRIPE_SECRET_KEY</code> y <code>STRIPE_PRO_PRICE_ID</code> para habilitar pagos.
            </p>
          </div>

          <button
            disabled
            className="w-full py-3 rounded-xl font-semibold text-sm text-white opacity-50 cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}
          >
            Próximamente disponible
          </button>
        </div>

        <p className="text-xs" style={{ color: "#5a5c66" }}>
          ¿Ya tienes una suscripción activa?{" "}
          <Link href="/library" className="hover:text-white transition-colors" style={{ color: "#9899a0" }}>
            Volver a la biblioteca →
          </Link>
        </p>
      </div>
    </div>
  );
}
