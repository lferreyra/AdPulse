"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-xl border border-neutral-800 bg-neutral-900/50 opacity-40 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-xl border transition-all duration-200 hover:scale-105 flex items-center justify-center cursor-pointer"
      style={{
        background: "var(--bg-card, rgba(255,255,255,0.05))",
        borderColor: "var(--border-color, #1f2128)",
        color: "var(--text-primary, #f0f0ee)",
      }}
      title={`Cambiar a modo ${isDark ? "claro" : "oscuro"}`}
    >
      {isDark ? (
        <Sun size={15} className="text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon size={15} className="text-emerald-700 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
