"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/library";
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);
  const [mode, setMode] = useState<"password" | "magic">("password");

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = redirectTo;
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setMagicSent(true);
    }
    setLoading(false);
  };

  if (magicSent) {
    return (
      <div className="text-center">
        <p className="text-3xl mb-4">📬</p>
        <h2 className="text-base font-semibold mb-2" style={{ color: "#f0f0ee" }}>Revisa tu correo</h2>
        <p className="text-sm" style={{ color: "#9899a0" }}>
          Enviamos un enlace mágico a <strong style={{ color: "#f0f0ee" }}>{email}</strong>.
          Haz clic en el enlace para acceder.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl font-semibold text-center mb-6" style={{ color: "#f0f0ee" }}>
        Iniciar sesión
      </h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-900/30 bg-red-950/20">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      <div className="flex rounded-lg p-0.5 mb-6" style={{ background: "#1f2128" }}>
        <button
          onClick={() => setMode("password")}
          className="flex-1 py-1.5 rounded-md text-xs font-medium transition-all"
          style={{
            background: mode === "password" ? "#161820" : "transparent",
            color: mode === "password" ? "#f0f0ee" : "#5a5c66",
          }}
        >
          Contraseña
        </button>
        <button
          onClick={() => setMode("magic")}
          className="flex-1 py-1.5 rounded-md text-xs font-medium transition-all"
          style={{
            background: mode === "magic" ? "#161820" : "transparent",
            color: mode === "magic" ? "#f0f0ee" : "#5a5c66",
          }}
        >
          Magic link
        </button>
      </div>

      <form onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#9899a0" }}>Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full ap-input"
            placeholder="tu@email.com"
          />
        </div>

        {mode === "password" && (
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#9899a0" }}>Contraseña</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full ap-input"
              placeholder="••••••••"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          id="login-submit"
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}
        >
          {loading ? "Cargando…" : mode === "password" ? "Ingresar" : "Enviar enlace mágico"}
        </button>
      </form>

      <p className="text-center text-xs mt-6" style={{ color: "#5a5c66" }}>
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="hover:text-white transition-colors" style={{ color: "#10b981" }}>
          Registrarse
        </Link>
      </p>

      <style jsx>{`
        .ap-input {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #f0f0ee;
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 13px;
          transition: border-color 0.15s;
          outline: none;
          width: 100%;
        }
        .ap-input:focus { border-color: rgba(5,150,105,0.5); }
        .ap-input::placeholder { color: #3a3c45; }
      `}</style>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-xs text-neutral-500 py-10">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
