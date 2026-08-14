import { redirect } from "next/navigation";
import { isOwner } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const owner = await isOwner();

  if (!owner) {
    // Server-side guard: redirect non-owners
    redirect("/library");
  }

  return (
    <div className="app-layout flex h-svh overflow-hidden" style={{ background: "#0d0f14" }}>
      {/* Admin sidebar */}
      <aside className="flex flex-col w-52 border-r shrink-0"
        style={{ background: "#0e1018", borderColor: "#1f2128" }}>
        <div className="px-5 py-5 border-b" style={{ borderColor: "#1f2128" }}>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
              ⚙
            </span>
            <div>
              <p className="text-xs font-semibold" style={{ color: "#f0f0ee" }}>Admin</p>
              <p className="text-[9px] uppercase tracking-widest" style={{ color: "#7c3aed" }}>Owner only</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/products", label: "Productos" },
            { href: "/admin/sync", label: "Sincronización" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all hover:bg-white/5"
              style={{ color: "#9899a0" }}>
              {label}
            </a>
          ))}
        </nav>
        <div className="border-t px-4 py-4" style={{ borderColor: "#1f2128" }}>
          <a href="/library" className="text-xs transition-colors hover:text-white" style={{ color: "#5a5c66" }}>
            ← Volver a la app
          </a>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
