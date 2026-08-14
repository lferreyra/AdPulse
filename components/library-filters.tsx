"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

const SIGNALS = ["Nuevo", "Escalando", "Escalado", "Asentado"];
const MEDIA_TYPES = ["video", "image", "mixed", "unknown"];
const SORT_OPTIONS = [
  { value: "active_ads_count.desc", label: "Más anuncios" },
  { value: "first_seen_at.desc", label: "Más recientes" },
  { value: "first_seen_at.asc", label: "Más antiguos" },
];

interface LibraryFiltersProps {
  countries: string[];
  niches: string[];
  checkouts: string[];
}

export function LibraryFilters({ countries, niches, checkouts }: LibraryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const current = {
    country: searchParams.get("country") ?? "",
    signal: searchParams.get("signal") ?? "",
    niche: searchParams.get("niche") ?? "",
    checkout: searchParams.get("checkout") ?? "",
    media: searchParams.get("media") ?? "",
    sort: searchParams.get("sort") ?? "active_ads_count.desc",
  };

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 on filter change
      params.delete("page");
      startTransition(() => {
        router.push(`/library?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  const hasActiveFilters =
    current.country ||
    current.signal ||
    current.niche ||
    current.checkout ||
    current.media;

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${isPending ? "opacity-60" : ""}`}>
      <FilterSelect
        value={current.sort}
        onChange={(v) => updateFilter("sort", v)}
        options={SORT_OPTIONS}
        placeholder="Ordenar por"
      />
      {countries.length > 0 && (
        <FilterSelect
          value={current.country}
          onChange={(v) => updateFilter("country", v)}
          options={countries.map((c) => ({ value: c, label: c }))}
          placeholder="País"
        />
      )}
      <FilterSelect
        value={current.signal}
        onChange={(v) => updateFilter("signal", v)}
        options={SIGNALS.map((s) => ({ value: s, label: s }))}
        placeholder="Señal"
      />
      {niches.length > 0 && (
        <FilterSelect
          value={current.niche}
          onChange={(v) => updateFilter("niche", v)}
          options={niches.map((n) => ({ value: n, label: n }))}
          placeholder="Nicho"
        />
      )}
      {checkouts.length > 0 && (
        <FilterSelect
          value={current.checkout}
          onChange={(v) => updateFilter("checkout", v)}
          options={checkouts.map((c) => ({ value: c, label: c }))}
          placeholder="Checkout"
        />
      )}
      <FilterSelect
        value={current.media}
        onChange={(v) => updateFilter("media", v)}
        options={MEDIA_TYPES.map((m) => ({ value: m, label: m.charAt(0).toUpperCase() + m.slice(1) }))}
        placeholder="Media"
      />
      {hasActiveFilters && (
        <button
          onClick={() => {
            startTransition(() => {
              router.push("/library", { scroll: false });
            });
          }}
          className="text-xs px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 border"
          style={{ color: "#9899a0", borderColor: "rgba(255,255,255,0.08)" }}
        >
          Limpiar filtros ×
        </button>
      )}
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-xs px-3 py-1.5 rounded-lg border appearance-none cursor-pointer transition-all hover:border-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: "rgba(255,255,255,0.08)",
        color: value ? "#f0f0ee" : "#9899a0",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: "#161820", color: "#f0f0ee" }}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
