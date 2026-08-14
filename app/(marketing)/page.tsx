import Link from "next/link";
import { Search, ChevronDown, Play, Image as ImageIcon, Bookmark, ArrowUpRight, Lock, TrendingUp, Sparkles } from "lucide-react";

export const metadata = {
  title: "AdPulse Intelligence — Detectá señales. Mové primero.",
  description: "Una biblioteca curada de ofertas digitales con actividad publicitaria real. Menos ruido, más claridad para investigar qué está tomando tracción.",
};

export default function LandingPage() {
  return (
    <div className="space-y-20 pb-20">

      {/* HERO SECTION (00 / LA PRESENTACIÓN) */}
      <section className="relative pt-12 pb-16 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider uppercase"
              style={{ color: "var(--accent-emerald, #137c60)" }}>
              <span>✳</span>
              INTEL DE MERCADO · ACTUALIZADO HOY
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1]"
              style={{ color: "var(--text-primary, #1a1a19)" }}>
              Detectá señales.<br />
              <em className="font-serif italic font-normal" style={{ color: "#137c60" }}>
                Mové primero.
              </em>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base leading-relaxed max-w-xl"
              style={{ color: "var(--text-secondary, #62625a)" }}>
              Una biblioteca curada de ofertas digitales con actividad publicitaria real. Menos ruido, más claridad para investigar qué está tomando tracción.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <Link
                href="/library"
                className="px-6 py-3 rounded-full text-xs font-semibold text-white inline-flex items-center gap-2 transition-all hover:opacity-90 shadow-sm"
                style={{ background: "#137c60" }}
              >
                Explorar biblioteca
                <ArrowUpRight size={14} />
              </Link>

              <a
                href="#como-funciona"
                className="text-xs font-semibold underline underline-offset-4 transition-colors hover:text-emerald-700"
                style={{ color: "var(--text-primary, #1a1a19)" }}
              >
                Cómo funciona
              </a>
            </div>

          </div>

          {/* Right Column Graphic (Orb / Wireframe Sphere) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-72 h-72 flex items-center justify-center">
              
              {/* Ellipse Wireframes */}
              <div className="absolute inset-0 rounded-full border border-emerald-500/20 rotate-45 animate-pulse" />
              <div className="absolute inset-4 rounded-full border border-teal-500/20 -rotate-12" />
              <div className="absolute inset-8 rounded-full border border-emerald-600/15 rotate-75" />

              {/* Floating Stat Card */}
              <div className="glass-card p-5 rounded-2xl shadow-xl border text-center space-y-1 z-10 backdrop-blur-md"
                style={{ background: "var(--bg-secondary, rgba(255,255,255,0.9))", borderColor: "var(--border-color, #e4e2d9)" }}>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                  style={{ background: "rgba(19,124,96,0.1)", color: "#137c60" }}>
                  <TrendingUp size={13} />
                  +28%
                </div>
                <p className="text-[10px] font-mono font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted, #85857c)" }}>
                  ACTIVIDAD 7D
                </p>
              </div>

            </div>

            <div className="text-center mt-3 space-y-0.5">
              <p className="text-[10px] font-mono uppercase tracking-widest font-semibold" style={{ color: "var(--text-muted, #85857c)" }}>
                SEÑALES DETECTADAS
              </p>
              <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "#137c60" }}>
                EN TIEMPO REAL
              </p>
            </div>
          </div>

        </div>

        {/* METRICS COUNTER BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 border-t mt-16"
          style={{ borderColor: "var(--border-color, #e4e2d9)" }}>
          {[
            { number: "1.284", label: "ofertas monitoreadas" },
            { number: "9", label: "mercados activos" },
            { number: "184", label: "campañas detectadas hoy" },
            { number: "24h", label: "frecuencia de actualización" },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <p className="text-2xl sm:text-3xl font-bold font-mono tracking-tight" style={{ color: "var(--text-primary, #1a1a19)" }}>
                {item.number}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted, #85857c)" }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>

      </section>


      {/* SECTION 01 / LA BIBLIOTECA */}
      <section className="max-w-6xl mx-auto px-6 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4"
          style={{ borderColor: "var(--border-color, #e4e2d9)" }}>
          <div>
            <p className="text-xs font-mono font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted, #85857c)" }}>
              01 / LA BIBLIOTECA
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary, #1a1a19)" }}>
              Señales que merecen una mirada.
            </h2>
          </div>
          <p className="text-xs max-w-xs text-right sm:text-right text-left" style={{ color: "var(--text-muted, #85857c)" }}>
            Cada oferta incluye su desarrollo, tipo de embudo y qué hacer con ella.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted, #85857c)" }} />
            <input
              type="text"
              placeholder="Buscar por producto, nicho o palabra..."
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border outline-none transition-colors"
              style={{ background: "var(--bg-secondary, #ffffff)", borderColor: "var(--border-color, #e4e2d9)", color: "var(--text-primary, #1a1a19)" }}
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none text-xs pl-4 pr-9 py-2.5 rounded-xl border outline-none cursor-pointer"
              style={{ background: "var(--bg-secondary, #ffffff)", borderColor: "var(--border-color, #e4e2d9)", color: "var(--text-primary, #1a1a19)" }}
            >
              <option>Todos los sectores</option>
              <option>Espiritualidad</option>
              <option>Salud & Fitness</option>
              <option>Educación</option>
              <option>E-commerce</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted, #85857c)" }} />
          </div>
        </div>

        {/* Product Cards Grid (4 Columns) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="glass-card overflow-hidden flex flex-col justify-between border" style={{ borderColor: "var(--border-color, #e4e2d9)", background: "var(--bg-secondary, #ffffff)" }}>
            <div className="h-32 p-4 flex flex-col justify-between text-white relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #7c4a3a, #4a2c22)" }}>
              <span className="text-xs font-serif italic opacity-80">Biblioteca de...</span>
              <div className="flex justify-end">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md flex items-center gap-1">
                  <Play size={10} fill="white" /> 0:45
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-[10px] uppercase font-mono font-semibold" style={{ color: "var(--text-muted, #85857c)" }}>
                <span>DESARROLLO PERSONAL · AR</span>
                <Bookmark size={13} className="cursor-pointer hover:text-emerald-700" />
              </div>
              <h3 className="text-sm font-bold leading-snug" style={{ color: "var(--text-primary, #1a1a19)" }}>
                Biblioteca de Ofertas
              </h3>
              <div className="flex gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold" style={{ background: "rgba(19,124,96,0.12)", color: "#137c60" }}>Escalando</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md" style={{ background: "rgba(0,0,0,0.04)", color: "var(--text-secondary)" }}>Hotmart</span>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-2 border-t text-center" style={{ borderColor: "var(--border-color, #e4e2d9)" }}>
                <div><p className="text-xs font-bold font-mono">94</p><p className="text-[9px]" style={{ color: "var(--text-muted)" }}>ANC. ACTIVOS</p></div>
                <div><p className="text-xs font-bold font-mono">42d</p><p className="text-[9px]" style={{ color: "var(--text-muted)" }}>DÍAS ACT.</p></div>
                <div><p className="text-xs font-bold font-mono text-emerald-600">+28%</p><p className="text-[9px]" style={{ color: "var(--text-muted)" }}>EVOLUC. 7D</p></div>
              </div>
              <div className="pt-1 text-right">
                <Link href="/products/36-cartas-tarot-gitano-mapas-mentales" className="text-[10px] font-semibold text-emerald-700 hover:underline inline-flex items-center gap-0.5">
                  Última actualización: Hoy <ArrowUpRight size={11} />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card overflow-hidden flex flex-col justify-between border" style={{ borderColor: "var(--border-color, #e4e2d9)", background: "var(--bg-secondary, #ffffff)" }}>
            <div className="h-32 p-4 flex flex-col justify-between text-white relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #2b4c5e, #1a2f3b)" }}>
              <span className="text-xs font-serif italic opacity-80">Método Ventas...</span>
              <div className="flex justify-end">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md flex items-center gap-1">
                  <ImageIcon size={10} /> Imagen
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-[10px] uppercase font-mono font-semibold" style={{ color: "var(--text-muted, #85857c)" }}>
                <span>NEGOCIOS · BRASIL</span>
                <Bookmark size={13} className="cursor-pointer hover:text-emerald-700" />
              </div>
              <h3 className="text-sm font-bold leading-snug" style={{ color: "var(--text-primary, #1a1a19)" }}>
                Método Ventas IG
              </h3>
              <div className="flex gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold" style={{ background: "rgba(19,124,96,0.12)", color: "#137c60" }}>Escalando</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md" style={{ background: "rgba(0,0,0,0.04)", color: "var(--text-secondary)" }}>Kiwify</span>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-2 border-t text-center" style={{ borderColor: "var(--border-color, #e4e2d9)" }}>
                <div><p className="text-xs font-bold font-mono">67</p><p className="text-[9px]" style={{ color: "var(--text-muted)" }}>ANC. ACTIVOS</p></div>
                <div><p className="text-xs font-bold font-mono">31d</p><p className="text-[9px]" style={{ color: "var(--text-muted)" }}>DÍAS ACT.</p></div>
                <div><p className="text-xs font-bold font-mono text-emerald-600">+19%</p><p className="text-[9px]" style={{ color: "var(--text-muted)" }}>EVOLUC. 7D</p></div>
              </div>
              <div className="pt-1 text-right">
                <Link href="/products/desafio-keto-28-dias" className="text-[10px] font-semibold text-emerald-700 hover:underline inline-flex items-center gap-0.5">
                  Última actualización: Hoy <ArrowUpRight size={11} />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card overflow-hidden flex flex-col justify-between border" style={{ borderColor: "var(--border-color, #e4e2d9)", background: "var(--bg-secondary, #ffffff)" }}>
            <div className="h-32 p-4 flex flex-col justify-between text-white relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #4c3b5e, #2e233b)" }}>
              <span className="text-xs font-serif italic opacity-80">Planifica sin...</span>
              <div className="flex justify-end">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md flex items-center gap-1">
                  <Play size={10} fill="white" /> 1:20
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-[10px] uppercase font-mono font-semibold" style={{ color: "var(--text-muted, #85857c)" }}>
                <span>PRODUCTIVIDAD · ESPAÑA</span>
                <Bookmark size={13} className="cursor-pointer hover:text-emerald-700" />
              </div>
              <h3 className="text-sm font-bold leading-snug" style={{ color: "var(--text-primary, #1a1a19)" }}>
                Planifica sin Fricción
              </h3>
              <div className="flex gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold" style={{ background: "rgba(56,189,248,0.15)", color: "#0284c7" }}>Nuevo</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md" style={{ background: "rgba(0,0,0,0.04)", color: "var(--text-secondary)" }}>Hotmart</span>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-2 border-t text-center" style={{ borderColor: "var(--border-color, #e4e2d9)" }}>
                <div><p className="text-xs font-bold font-mono">19</p><p className="text-[9px]" style={{ color: "var(--text-muted)" }}>ANC. ACTIVOS</p></div>
                <div><p className="text-xs font-bold font-mono">12d</p><p className="text-[9px]" style={{ color: "var(--text-muted)" }}>DÍAS ACT.</p></div>
                <div><p className="text-xs font-bold font-mono text-emerald-600">+64%</p><p className="text-[9px]" style={{ color: "var(--text-muted)" }}>EVOLUC. 7D</p></div>
              </div>
              <div className="pt-1 text-right">
                <Link href="/products/ingles-acelerado-inteligencia-artificial" className="text-[10px] font-semibold text-emerald-700 hover:underline inline-flex items-center gap-0.5">
                  Última actualización: Hoy <ArrowUpRight size={11} />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 4 (Blurred Lock Overlay) */}
          <div className="glass-card relative overflow-hidden flex flex-col justify-center items-center p-6 border text-center select-none"
            style={{ borderColor: "var(--border-color, #e4e2d9)", background: "var(--bg-secondary, #ffffff)" }}>
            <div className="absolute inset-0 p-4 filter blur-[6px] opacity-40 pointer-events-none">
              <div className="h-28 rounded-lg bg-neutral-300 mb-3" />
              <div className="h-4 w-3/4 bg-neutral-400 rounded mb-2 mx-auto" />
              <div className="h-3 w-1/2 bg-neutral-300 rounded mx-auto" />
            </div>

            <div className="relative z-10 space-y-3">
              <div className="w-9 h-9 rounded-full mx-auto flex items-center justify-center text-emerald-700"
                style={{ background: "rgba(19,124,96,0.12)" }}>
                <Lock size={16} />
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: "var(--text-primary, #1a1a19)" }}>
                  Desbloqueá la biblioteca
                </p>
                <p className="text-[10px] leading-tight" style={{ color: "var(--text-muted, #85857c)" }}>
                  Accedé a señales y tendencias completas.
                </p>
              </div>
              <Link href="/upgrade" className="inline-block text-xs font-semibold px-4 py-2 rounded-full text-white shadow-sm"
                style={{ background: "#137c60" }}>
                Pasarme a Pro ⚡
              </Link>
            </div>
          </div>

        </div>

        {/* Section Footer */}
        <div className="flex items-center justify-between text-xs pt-2">
          <span style={{ color: "var(--text-muted, #85857c)" }}>3 ofertas encontradas</span>
          <Link href="/library" className="px-4 py-2 rounded-full border font-semibold inline-flex items-center gap-1 transition-all hover:bg-black/5"
            style={{ borderColor: "var(--border-strong, #d9d7cd)", color: "var(--text-primary, #1a1a19)", background: "var(--bg-secondary, #ffffff)" }}>
            Ver la biblioteca completa <ArrowUpRight size={14} />
          </Link>
        </div>

      </section>


      {/* SECTION 02 / EL PULSO DEL MERCADO (Lo que cambió esta semana) */}
      <section className="max-w-6xl mx-auto px-6 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4"
          style={{ borderColor: "var(--border-color, #e4e2d9)" }}>
          <div>
            <p className="text-xs font-mono font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted, #85857c)" }}>
              02 / EL PULSO DEL MERCADO
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary, #1a1a19)" }}>
              Lo que cambió esta semana.
            </h2>
          </div>
          <Link href="/trends" className="text-xs font-semibold underline underline-offset-4 inline-flex items-center gap-1"
            style={{ color: "var(--text-primary, #1a1a19)" }}>
            Ver todas las tendencias <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* 2-Column Trends Grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Left Main Dark Emerald Card */}
          <div className="lg:col-span-7 rounded-2xl p-8 text-white space-y-6 flex flex-col justify-between shadow-lg"
            style={{ background: "linear-gradient(135deg, #137c60, #0c5240)" }}>
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider"
                style={{ color: "#b9d8cc" }}>
                <span>✳</span>
                MAYOR CRECIMIENTO
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Método Ventas IG
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed max-w-md opacity-90" style={{ color: "#d8eee5" }}>
                La oferta sumó actividad en México y Colombia durante los últimos 7 días.
              </p>
            </div>

            <div className="pt-6 border-t border-white/20">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold font-mono">+19%</span>
                <span className="text-xs opacity-80 uppercase tracking-wider">las ventas / anuncios</span>
              </div>
            </div>

          </div>

          {/* Right List of 2 Trend Items */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            
            {/* Item 1 */}
            <div className="glass-card p-6 border flex items-start justify-between gap-4"
              style={{ borderColor: "var(--border-color, #e4e2d9)", background: "var(--bg-secondary, #ffffff)" }}>
              <div className="space-y-1">
                <p className="text-[10px] font-mono font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted, #85857c)" }}>
                  NUEVO EN EL MERCADO
                </p>
                <h4 className="text-sm font-bold" style={{ color: "var(--text-primary, #1a1a19)" }}>
                  Planifica sin Fricción
                </h4>
                <p className="text-xs" style={{ color: "var(--text-secondary, #62625a)" }}>
                  Primera vez que la detectamos en España.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-neutral-200 text-neutral-800">
                ES
              </span>
            </div>

            {/* Item 2 */}
            <div className="glass-card p-6 border flex items-start justify-between gap-4"
              style={{ borderColor: "var(--border-color, #e4e2d9)", background: "var(--bg-secondary, #ffffff)" }}>
              <div className="space-y-1">
                <p className="text-[10px] font-mono font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted, #85857c)" }}>
                  SEÑAL DE CRECIMIENTO
                </p>
                <h4 className="text-sm font-bold" style={{ color: "var(--text-primary, #1a1a19)" }}>
                  Finanzas en Orden
                </h4>
                <p className="text-xs" style={{ color: "var(--text-secondary, #62625a)" }}>
                  9 anuncios activos con crecimiento sostenido.
                </p>
              </div>
              <span className="text-sm font-mono font-bold text-emerald-600">
                +51%
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* SECTION 03 / MODO MATCH (Tu próxima señal puede estar acá) */}
      <section className="max-w-6xl mx-auto px-6 pt-6">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border overflow-hidden relative"
          style={{ borderColor: "var(--border-color, #e4e2d9)", background: "var(--bg-secondary, #ffffff)" }}>
          
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted, #85857c)" }}>
                03 / DESCUBRÍ SIN SOBRECARGARTE
              </p>

              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.1]" style={{ color: "var(--text-primary, #1a1a19)" }}>
                Tu próxima señal<br />
                <em className="font-serif italic font-normal" style={{ color: "#137c60" }}>
                  puede estar acá.
                </em>
              </h2>

              <p className="text-xs sm:text-sm leading-relaxed max-w-md" style={{ color: "var(--text-secondary, #62625a)" }}>
                Match te presenta ofertas una por una. Guardá, descartá y seguí investigando sin abrir 40 pestañas.
              </p>

              <div>
                <Link
                  href="/match"
                  className="px-6 py-3 rounded-full text-xs font-bold text-white inline-flex items-center gap-2 transition-all hover:opacity-90 shadow-md"
                  style={{ background: "#1a1a19" }}
                >
                  Abrir Match
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Stack of Tilted Mint Cards */}
            <div className="lg:col-span-5 flex items-center justify-center relative min-h-[220px]">
              <div className="relative w-64 h-44">
                
                {/* Back card */}
                <div className="absolute inset-0 rounded-2xl shadow-md border -rotate-6 translate-x-2"
                  style={{ background: "#cbe5d9", borderColor: "#a9d4c2" }} />
                
                {/* Middle card */}
                <div className="absolute inset-0 rounded-2xl shadow-md border rotate-3 -translate-y-2"
                  style={{ background: "#b7dccb", borderColor: "#93c7b2" }} />
                
                {/* Front main card */}
                <div className="absolute inset-0 rounded-2xl shadow-xl border p-5 flex flex-col justify-between font-mono"
                  style={{ background: "#a3d3be", borderColor: "#82bfa8", color: "#134e3f" }}>
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span>01 / 30</span>
                    <span className="px-2 py-0.5 rounded bg-white/40">OFERTA</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold font-sans">PRIORIZÁ POCO PROFUNDO</p>
                    <p className="text-[10px] opacity-80 font-sans">E-book · Hotmart</p>
                  </div>
                  <div className="flex justify-center gap-4 pt-1">
                    <span className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-xs">💚</span>
                    <span className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-xs">🔽</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
