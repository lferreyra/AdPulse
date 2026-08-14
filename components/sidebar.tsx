"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  TrendingUp,
  Heart,
  Shuffle,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface SidebarProps {
  isOwner?: boolean;
  isPro?: boolean;
  userEmail?: string;
}

export function Sidebar({ isOwner, isPro, userEmail }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const navItems = [
    { href: "/library", label: "Biblioteca", icon: LayoutGrid, isProOnly: false },
    { href: "/trends", label: "Tendencias", icon: TrendingUp, isProOnly: true },
    { href: "/match", label: "Match", icon: Shuffle, isProOnly: true },
    { href: "/saved", label: "Guardados", icon: Heart, isProOnly: true },
    { href: "/profile", label: "Mi cuenta", icon: User, isProOnly: false },
  ];

  return (
    <aside
      className="flex flex-col h-full w-60 border-r shrink-0"
      style={{
        background: "var(--ap-carbon-soft, #161820)",
        borderColor: "var(--ap-carbon-border, #1f2128)",
      }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "#1f2128" }}>
        <Link href="/library" className="flex items-center gap-2.5 group">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 transition-opacity group-hover:opacity-80"
            style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}
          >
            AP
          </span>
          <div>
            <p className="text-sm font-semibold leading-none" style={{ color: "#f0f0ee" }}>AdPulse</p>
            <p className="text-[10px] mt-0.5 uppercase tracking-widest" style={{ color: "#5a5c66" }}>Intelligence</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, isProOnly }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive(href)
                ? "text-white"
                : "hover:text-white"
            }`}
            style={{
              background: isActive(href)
                ? "rgba(5,150,105,0.12)"
                : "transparent",
              color: isActive(href) ? "#10b981" : "#9899a0",
              borderLeft: isActive(href) ? "2px solid #059669" : "2px solid transparent",
            }}
          >
            <div className="flex items-center gap-3">
              <Icon size={16} strokeWidth={1.8} />
              {label}
            </div>
            {isProOnly && !isPro && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
                PRO
              </span>
            )}
          </Link>
        ))}

        {/* Admin section */}
        {isOwner && (
          <>
            <div className="pt-4 pb-2 px-3">
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "#3a3c45" }}>
                Admin
              </p>
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:text-white"
              style={{
                background: isActive("/admin") ? "rgba(124,58,237,0.1)" : "transparent",
                color: isActive("/admin") ? "#a78bfa" : "#9899a0",
                borderLeft: isActive("/admin") ? "2px solid #7c3aed" : "2px solid transparent",
              }}
            >
              <Settings size={16} strokeWidth={1.8} />
              Panel Admin
            </Link>
          </>
        )}
      </nav>

      {/* User section */}
      <div className="border-t px-4 py-4 space-y-3" style={{ borderColor: "var(--border-color, #1f2128)" }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: "var(--text-muted, #5a5c66)" }}>
            Tema
          </span>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3">
          <Link href="/profile" className="flex items-center gap-3 flex-1 min-w-0 group">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 group-hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}
            >
              {userEmail ? userEmail[0].toUpperCase() : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate group-hover:text-white transition-colors" style={{ color: "var(--text-primary, #d0d0d5)" }}>
                {userEmail ?? "Usuario"}
              </p>
              {isOwner ? (
                <p className="text-[10px]" style={{ color: "#7c3aed" }}>Owner</p>
              ) : isPro ? (
                <p className="text-[10px]" style={{ color: "var(--accent-emerald, #10b981)" }}>Pro</p>
              ) : (
                <p className="text-[10px]" style={{ color: "var(--text-muted, #5a5c66)" }}>Free</p>
              )}
            </div>
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: "var(--text-muted, #5a5c66)" }}
              title="Cerrar sesión"
            >
              <LogOut size={14} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
