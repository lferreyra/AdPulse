"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  niche: z.string().optional(),
  country_code: z.string().length(2, "Código de país de 2 letras"),
  country_name: z.string().min(2),
  checkout_platform: z.string().optional(),
  media_type: z.enum(["video", "image", "mixed", "unknown"]),
  landing_url: z.string().url("URL inválida").optional().or(z.literal("")),
  meta_ads_url: z.string().url("URL inválida").optional().or(z.literal("")),
  checkout_url: z.string().url("URL inválida").optional().or(z.literal("")),
  active_ads_count: z.coerce.number().min(0),
});

type ProductForm = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<ProductForm>>({ media_type: "video", active_ads_count: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const parsed = productSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear producto");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (key: keyof ProductForm, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-10 px-6 py-4 border-b"
        style={{ background: "rgba(14,16,24,0.9)", backdropFilter: "blur(12px)", borderColor: "#1f2128" }}>
        <h1 className="text-lg font-semibold" style={{ color: "#f0f0ee" }}>Nuevo producto</h1>
        <p className="text-xs mt-0.5" style={{ color: "#5a5c66" }}>Carga manual — auditada y no confundida con sync automático</p>
      </div>

      <div className="p-6 max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {serverError && (
            <div className="rounded-lg p-3 border border-red-900/30 bg-red-950/20">
              <p className="text-sm text-red-400">{serverError}</p>
            </div>
          )}

          <Field label="Nombre *" error={errors.name}>
            <input value={form.name ?? ""} onChange={e => set("name", e.target.value)}
              className="w-full ap-input" placeholder="Ej: Curso de Email Marketing" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Código de país *" error={errors.country_code}>
              <input value={form.country_code ?? ""} onChange={e => set("country_code", e.target.value.toUpperCase())}
                maxLength={2} className="w-full ap-input" placeholder="AR" />
            </Field>
            <Field label="Nombre del país *" error={errors.country_name}>
              <input value={form.country_name ?? ""} onChange={e => set("country_name", e.target.value)}
                className="w-full ap-input" placeholder="Argentina" />
            </Field>
          </div>

          <Field label="Nicho" error={errors.niche}>
            <input value={form.niche ?? ""} onChange={e => set("niche", e.target.value)}
              className="w-full ap-input" placeholder="Ej: Educación online" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Checkout" error={errors.checkout_platform}>
              <input value={form.checkout_platform ?? ""} onChange={e => set("checkout_platform", e.target.value)}
                className="w-full ap-input" placeholder="Hotmart, Tienda…" />
            </Field>
            <Field label="Tipo de media *" error={errors.media_type}>
              <select value={form.media_type ?? "video"} onChange={e => set("media_type", e.target.value as any)}
                className="w-full ap-input">
                {["video", "image", "mixed", "unknown"].map(m => (
                  <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Anuncios activos *" error={errors.active_ads_count}>
            <input type="number" min={0} value={form.active_ads_count ?? 0}
              onChange={e => set("active_ads_count", parseInt(e.target.value, 10))}
              className="w-full ap-input" />
          </Field>

          <Field label="Landing URL" error={errors.landing_url}>
            <input value={form.landing_url ?? ""} onChange={e => set("landing_url", e.target.value)}
              className="w-full ap-input" placeholder="https://…" />
          </Field>
          <Field label="Meta Ads Library URL" error={errors.meta_ads_url}>
            <input value={form.meta_ads_url ?? ""} onChange={e => set("meta_ads_url", e.target.value)}
              className="w-full ap-input" placeholder="https://facebook.com/ads/library/…" />
          </Field>
          <Field label="Checkout URL" error={errors.checkout_url}>
            <input value={form.checkout_url ?? ""} onChange={e => set("checkout_url", e.target.value)}
              className="w-full ap-input" placeholder="https://…" />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.back()}
              className="flex-1 py-2.5 rounded-xl text-sm border transition-all hover:bg-white/5"
              style={{ borderColor: "#1f2128", color: "#9899a0" }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}>
              {loading ? "Creando…" : "Crear producto"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .ap-input {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #f0f0ee;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          transition: border-color 0.15s;
          outline: none;
        }
        .ap-input:focus {
          border-color: rgba(5,150,105,0.5);
        }
        .ap-input option {
          background: #161820;
        }
      `}</style>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "#9899a0" }}>{label}</label>
      {children}
      {error && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{error}</p>}
    </div>
  );
}
