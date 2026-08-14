import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SignalBadge } from "@/components/signal-badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guardados",
  description: "Tus productos guardados y notas personales.",
};

export default async function SavedPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;
  let favorites: any[] = [];

  if (userId) {
    const { data } = await supabase
      .from("favorites")
      .select("product_id, note, created_at, products(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    favorites = data ?? [];
  }

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-10 px-6 py-4 border-b"
        style={{ background: "rgba(13,15,20,0.9)", backdropFilter: "blur(12px)", borderColor: "#1f2128" }}>
        <h1 className="text-lg font-semibold" style={{ color: "#f0f0ee" }}>Guardados</h1>
        <p className="text-xs mt-0.5" style={{ color: "#5a5c66" }}>
          {(favorites ?? []).length} producto{(favorites ?? []).length !== 1 ? "s" : ""} guardados
        </p>
      </div>

      <div className="p-6">
        {!favorites || favorites.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed" style={{ borderColor: "#1f2128" }}>
            <p className="text-4xl mb-4">❤️</p>
            <h3 className="text-sm font-medium mb-1" style={{ color: "#9899a0" }}>Sin guardados aún</h3>
            <p className="text-xs mb-4" style={{ color: "#5a5c66" }}>
              Guarda productos desde la biblioteca o el modo Match.
            </p>
            <Link href="/library" className="text-xs font-semibold px-4 py-2 rounded-lg text-white"
              style={{ background: "linear-gradient(135deg, #059669, #0d7377)" }}>
              Explorar biblioteca →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((fav: any) => {
              const product = fav.products;
              if (!product) return null;
              return (
                <div key={fav.product_id} className="glass-card p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold truncate" style={{ color: "#f0f0ee" }}>{product.name}</h3>
                      <SignalBadge signal={product.signal} />
                    </div>
                    <p className="text-xs" style={{ color: "#5a5c66" }}>
                      {product.country_name}{product.niche ? ` · ${product.niche}` : ""} · {product.active_ads_count} anuncios
                    </p>
                    {fav.note && (
                      <p className="text-xs mt-1.5 italic" style={{ color: "#9899a0" }}>📝 {fav.note}</p>
                    )}
                  </div>
                  <Link href={`/products/${product.slug}`}
                    className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                    style={{ background: "rgba(5,150,105,0.12)", color: "#10b981" }}>
                    Ver →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
