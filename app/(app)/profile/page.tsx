"use client";

import { useState } from "react";
import { User, Shield, CreditCard, Save, Bell, Send, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const supabase = createClient();
  const [tab, setTab] = useState<"profile" | "security" | "plan">("profile");

  const [fullName, setFullName] = useState("Lucas");
  const [email, setEmail] = useState("lucas.ferreyra@gmail.com");
  const [whatsapp, setWhatsapp] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [notifyNewOffers, setNotifyNewOffers] = useState(true);
  const [notifyChanges, setNotifyChanges] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-full pb-12">
      {/* Header */}
      <div className="sticky top-0 z-10 px-6 py-4 border-b"
        style={{ background: "rgba(13,15,20,0.9)", backdropFilter: "blur(12px)", borderColor: "#1f2128" }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-bold"
              style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}>
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight" style={{ color: "#f0f0ee" }}>{fullName}</h1>
              <p className="text-xs" style={{ color: "#5a5c66" }}>{email}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
            PRO
          </span>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">

        {/* Tabs header */}
        <div className="flex gap-2 border-b pb-3" style={{ borderColor: "#1f2128" }}>
          {[
            { id: "profile", label: "Perfil", icon: User },
            { id: "security", label: "Seguridad", icon: Shield },
            { id: "plan", label: "Plan y pagos", icon: CreditCard },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: active ? "rgba(5,150,105,0.15)" : "transparent",
                  color: active ? "#10b981" : "#9899a0",
                  border: active ? "1px solid rgba(5,150,105,0.3)" : "1px solid transparent",
                }}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: PROFILE */}
        {tab === "profile" && (
          <div className="space-y-6">
            {/* Card: Personal info */}
            <div className="glass-card p-6 border" style={{ borderColor: "#1f2128" }}>
              <h2 className="text-sm font-semibold mb-4" style={{ color: "#f0f0ee" }}>Información personal</h2>

              {savedSuccess && (
                <div className="mb-4 p-3 rounded-xl border border-emerald-900/30 bg-emerald-950/20 text-xs text-emerald-400">
                  ✓ Cambios guardados correctamente.
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#9899a0" }}>Email</label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border opacity-60 cursor-not-allowed"
                    style={{ background: "#181a24", borderColor: "#242736", color: "#f0f0ee" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#9899a0" }}>Nombre completo</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border outline-none focus:border-emerald-500/50 transition-colors"
                    style={{ background: "#181a24", borderColor: "#242736", color: "#f0f0ee" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#9899a0" }}>
                    WhatsApp (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: +5491112345678"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border outline-none focus:border-emerald-500/50 transition-colors"
                    style={{ background: "#181a24", borderColor: "#242736", color: "#f0f0ee" }}
                  />
                  <p className="text-[10px] mt-1" style={{ color: "#5a5c66" }}>
                    Si lo dejas, aceptas que te contactemos para soporte directo y sugerencias sobre el producto.
                  </p>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-2 transition-all hover:opacity-90 shadow-md"
                  style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}
                >
                  <Save size={14} />
                  Guardar cambios
                </button>
              </form>
            </div>

            {/* Card: Notifications */}
            <div className="glass-card p-6 border" style={{ borderColor: "#1f2128" }}>
              <div className="flex items-center gap-2 mb-4">
                <Bell size={16} style={{ color: "#10b981" }} />
                <h2 className="text-sm font-semibold" style={{ color: "#f0f0ee" }}>Notificaciones</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div>
                    <p className="text-xs font-medium" style={{ color: "#f0f0ee" }}>Nuevas ofertas del día</p>
                    <p className="text-[10px]" style={{ color: "#5a5c66" }}>Recibe un aviso cuando se detecten ofertas nuevas.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyNewOffers}
                    onChange={(e) => setNotifyNewOffers(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-xs font-medium" style={{ color: "#f0f0ee" }}>Cambios en ofertas guardadas</p>
                    <p className="text-[10px]" style={{ color: "#5a5c66" }}>Si una oferta guardada cambia de estado o volumen.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyChanges}
                    onChange={(e) => setNotifyChanges(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Community cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="glass-card p-5 border" style={{ background: "rgba(5,150,105,0.03)", borderColor: "rgba(5,150,105,0.2)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Send size={16} style={{ color: "#10b981" }} />
                  <h3 className="text-xs font-semibold" style={{ color: "#f0f0ee" }}>Canal de novedades</h3>
                </div>
                <p className="text-[11px] leading-relaxed mb-4" style={{ color: "#9899a0" }}>
                  Únete a nuestra comunidad en Telegram/WhatsApp. Solo enviamos novedades y actualizaciones importantes.
                </p>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:bg-white/5"
                  style={{ borderColor: "#10b981", color: "#10b981" }}
                >
                  Unirse al canal →
                </a>
              </div>

              <div className="glass-card p-5 border" style={{ background: "rgba(56,189,248,0.03)", borderColor: "rgba(56,189,248,0.2)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Users size={16} style={{ color: "#38bdf8" }} />
                  <h3 className="text-xs font-semibold" style={{ color: "#f0f0ee" }}>Súmate al equipo</h3>
                </div>
                <p className="text-[11px] leading-relaxed mb-4" style={{ color: "#9899a0" }}>
                  Buscamos personas con buen ojo para investigar anuncios Meta Ads. Si te gusta la investigación de mercado, escríbenos.
                </p>
                <a
                  href="mailto:soporte@adpulse.ai"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:bg-white/5"
                  style={{ borderColor: "#38bdf8", color: "#38bdf8" }}
                >
                  Quiero participar →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SECURITY */}
        {tab === "security" && (
          <div className="glass-card p-6 border" style={{ borderColor: "#1f2128" }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: "#f0f0ee" }}>Seguridad de la cuenta</h2>
            <p className="text-xs mb-4" style={{ color: "#9899a0" }}>
              Para cambiar tu contraseña o activar autenticación en dos pasos, te enviaremos un correo de verificación.
            </p>
            <button className="px-4 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-white/5"
              style={{ borderColor: "#1f2128", color: "#f0f0ee" }}>
              Enviar correo de cambio de contraseña
            </button>
          </div>
        )}

        {/* TAB 3: PLAN */}
        {tab === "plan" && (
          <div className="glass-card p-6 border" style={{ borderColor: "#1f2128" }}>
            <h2 className="text-sm font-semibold mb-2" style={{ color: "#f0f0ee" }}>Tu suscripción actual</h2>
            <div className="flex items-center gap-3 p-4 rounded-xl mb-4" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <span className="text-2xl">✨</span>
              <div>
                <p className="text-sm font-bold" style={{ color: "#10b981" }}>Plan AdPulse Pro Activo</p>
                <p className="text-xs" style={{ color: "#9899a0" }}>Acceso completo a toda la biblioteca, tendencias y modo Match.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
