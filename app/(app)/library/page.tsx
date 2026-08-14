import { Suspense } from "react";
import { createServerSupabaseClient, hasPro } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product-card";
import { LibraryFilters } from "@/components/library-filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biblioteca de Ofertas",
  description: "Explora productos digitales con actividad publicitaria observable en Meta Ads.",
};

interface PageProps {
  searchParams: Promise<{
    country?: string;
    signal?: string;
    niche?: string;
    checkout?: string;
    media?: string;
    sort?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 24;

async function getLibraryData(params: Awaited<PageProps["searchParams"]>, isPro: boolean) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("is_active", true);

  if (params.country) query = query.eq("country_name", params.country);
  if (params.signal) query = query.eq("signal", params.signal);
  if (params.niche) query = query.eq("niche", params.niche);
  if (params.checkout) query = query.eq("checkout_platform", params.checkout);
  if (params.media) query = query.eq("media_type", params.media);

  const [sortField, sortDir] = (params.sort ?? "active_ads_count.desc").split(".");
  query = query.order(sortField as "active_ads_count" | "first_seen_at", {
    ascending: sortDir === "asc",
  });

  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  query = query.range(from, from + PAGE_SIZE - 1);

  const { data: products, count, error } = await query;

  if (error) return { products: [], count: 0, error: error.message };
  return { products: products ?? [], count: count ?? 0, error: null };
}

async function getFilterOptions() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("products")
    .select("country_name, niche, checkout_platform")
    .eq("is_active", true);

  const countries = [...new Set((data ?? []).map((d) => d.country_name).filter(Boolean))].sort();
  const niches = [...new Set((data ?? []).map((d) => d.niche).filter(Boolean))].sort();
  const checkouts = [...new Set((data ?? []).map((d) => d.checkout_platform).filter(Boolean))].sort();

  return { countries, niches, checkouts };
}

export default async function LibraryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pro = await hasPro();
  const { products, count, error } = await getLibraryData(params, pro);
  const { countries, niches, checkouts } = await getFilterOptions();

  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <div className="min-h-full">
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-6 py-4 border-b"
        style={{
          background: "rgba(13,15,20,0.9)",
          backdropFilter: "blur(12px)",
          borderColor: "#1f2128",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 max-w-7xl mx-auto">
          <div className="flex-1">
            <h1 className="text-lg font-semibold" style={{ color: "#f0f0ee" }}>
              Biblioteca de ofertas
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#5a5c66" }}>
              {count} productos en catálogo con actividad publicitaria activa
            </p>
          </div>
          <Suspense fallback={null}>
            <LibraryFilters
              countries={countries as string[]}
              niches={niches as string[]}
              checkouts={checkouts as string[]}
            />
          </Suspense>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {error && (
          <div className="rounded-xl p-4 mb-6 border border-red-900/30 bg-red-950/20">
            <p className="text-sm text-red-400">Error al cargar productos: {error}</p>
          </div>
        )}

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isPro={true}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {page > 1 && (
                  <a
                    href={`/library?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
                    className="px-3 py-1.5 rounded-lg text-xs border transition-all hover:bg-white/5"
                    style={{ borderColor: "#1f2128", color: "#9899a0" }}
                  >
                    ← Anterior
                  </a>
                )}
                <span className="text-xs" style={{ color: "#5a5c66" }}>
                  {page} / {totalPages}
                </span>
                {page < totalPages && (
                  <a
                    href={`/library?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
                    className="px-3 py-1.5 rounded-lg text-xs border transition-all hover:bg-white/5"
                    style={{ borderColor: "#1f2128", color: "#9899a0" }}
                  >
                    Siguiente →
                  </a>
                )}
              </div>
            )}
          </>
        ) : (
          <div
            className="text-center py-20 rounded-2xl border border-dashed"
            style={{ borderColor: "#1f2128" }}
          >
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="text-sm font-medium mb-1" style={{ color: "#9899a0" }}>
              Sin resultados
            </h3>
            <p className="text-xs" style={{ color: "#5a5c66" }}>
              Prueba ajustando los filtros o espera la próxima sincronización.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
