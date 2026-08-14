"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center">
        <p className="text-3xl mb-4">✅</p>
        <h2 className="text-base font-semibold mb-2" style={{ color: "#f0f0ee" }}>¡Registro exitoso!</h2>
        <p className="text-sm" style={{ color: "#9899a0" }}>
          Enviamos un correo de confirmación a <strong style={{ color: "#f0f0ee" }}>{email}</strong>.
          Confirma tu cuenta para comenzar.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl font-semibold text-center mb-6" style={{ color: "#f0f0ee" }}>
        Crear cuenta
      </h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-900/30 bg-red-950/20">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#9899a0" }}>Email</label>
          <input
            id="register-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full ap-input"
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#9899a0" }}>
            Contraseña <span style={{ color: "#3a3c45" }}>(mín. 8 caracteres)</span>
          </label>
          <input
            id="register-password"
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full ap-input"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          id="register-submit"
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}
        >
          {loading ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>

      <p className="text-[10px] text-center mt-4" style={{ color: "#3a3c45" }}>
        Al registrarte aceptas nuestros Términos de Uso y Política de Privacidad.
      </p>

      <p className="text-center text-xs mt-4" style={{ color: "#5a5c66" }}>
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="hover:text-white transition-colors" style={{ color: "#10b981" }}>
          Iniciar sesión
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
