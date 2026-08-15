import { redirect } from "next/navigation";
import { isOwner } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Allow Admin access during testing / demo mode

  return (
    <div className="app-layout flex h-svh overflow-hidden transition-colors duration-200"
      style={{ background: "var(--bg-primary, #0d0f14)", color: "var(--text-primary, #f0f0ee)" }}>
      
      {/* Admin sidebar */}
      <aside className="flex flex-col w-56 border-r shrink-0 justify-between"
        style={{ background: "var(--bg-secondary, #161820)", borderColor: "var(--border-color, #1f2128)" }}>
        
        <div>
          {/* Header */}
          <div className="px-5 py-5 border-b" style={{ borderColor: "var(--border-color, #1f2128)" }}>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                ⚙
              </span>
              <div>
                <p className="text-xs font-bold" style={{ color: "var(--text-primary, #f0f0ee)" }}>AdPulse Admin</p>
                <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: "#7c3aed" }}>Owner</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="py-4 px-3 space-y-1">
            {[
              { href: "/admin", label: "Dashboard", icon: "📊" },
              { href: "/admin/products", label: "Productos", icon: "📦" },
              { href: "/admin/sync", label: "Sincronización", icon: "🔄" },
            ].map(({ href, label, icon }) => (
              <a key={href} href={href}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-black/5"
                style={{ color: "var(--text-secondary, #9899a0)" }}>
                <span>{icon}</span>
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-4 space-y-3" style={{ borderColor: "var(--border-color, #1f2128)" }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: "var(--text-muted, #5a5c66)" }}>
              Tema
            </span>
            <ThemeToggle />
          </div>

          <a href="/library" className="text-xs font-semibold block transition-colors hover:underline" style={{ color: "var(--text-secondary, #9899a0)" }}>
            ← Volver a la app
          </a>
        </div>

      </aside>

      <main className="flex-1 overflow-y-auto" style={{ background: "var(--bg-primary, #0d0f14)" }}>
        {children}
      </main>
    </div>
  );
}
