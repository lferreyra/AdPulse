import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "AdPulse Intelligence — Detectá señales. Mové primero.",
  description:
    "Una biblioteca curada de ofertas digitales con actividad publicitaria real. Menos ruido, más claridad para investigar qué está tomando tracción.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="marketing-layout min-h-svh flex flex-col font-sans transition-colors duration-200"
      style={{ background: "var(--bg-primary, #f8f7f2)", color: "var(--text-primary, #1a1a19)" }}>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{ background: "var(--bg-secondary, rgba(248,247,242,0.92))", borderColor: "var(--border-color, #e4e2d9)" }}>
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-lg group">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#137c60" }} />
            <span className="text-base font-extrabold tracking-tight" style={{ color: "var(--text-primary, #1a1a19)" }}>adpulse</span>
            <span className="text-[10px] uppercase font-semibold tracking-widest pl-1" style={{ color: "var(--text-muted, #85857c)" }}>INTELLIGENCE</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold" style={{ color: "var(--text-secondary, #62625a)" }}>
            <Link href="/library" className="transition-colors hover:text-emerald-700 relative py-1 border-b-2"
              style={{ borderColor: "#137c60", color: "#137c60" }}>
              Biblioteca
            </Link>
            <Link href="/trends" className="transition-colors hover:text-emerald-700">
              Tendencias
            </Link>
            <Link href="/match" className="transition-colors hover:text-emerald-700">
              Match
            </Link>
            <Link href="/saved" className="transition-colors hover:text-emerald-700">
              Guardados
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-xs font-semibold px-4 py-2 rounded-full border transition-all hover:bg-black/5"
              style={{ borderColor: "var(--border-strong, #d9d7cd)", color: "var(--text-primary, #1a1a19)", background: "var(--bg-card, #ffffff)" }}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/upgrade"
              className="text-xs font-bold px-3.5 py-2 rounded-full text-white flex items-center gap-1.5 transition-all hover:opacity-90 shadow-sm"
              style={{ background: "#1a1a19" }}
            >
              <span>Pro</span>
              <span className="text-amber-400">⚡</span>
            </Link>
          </div>

        </nav>
      </header>

      {/* Main Page Body */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t py-8 px-6 text-xs"
        style={{ borderColor: "var(--border-color, #e4e2d9)", background: "var(--bg-primary, #f8f7f2)", color: "var(--text-muted, #85857c)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full" style={{ background: "#137c60" }} />
            <span className="font-extrabold" style={{ color: "var(--text-primary, #1a1a19)" }}>adpulse</span>
          </div>

          <p className="text-center">Datos sin humo. Señales reales. Impulsá decisiones.</p>

          <p>© 2026 AdPulse Intelligence</p>
        </div>
      </footer>

    </div>
  );
}
