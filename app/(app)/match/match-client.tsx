"use client";

import { useState, useCallback } from "react";
import { MatchCard } from "@/components/match-card";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/supabase/types";

interface MatchClientPageProps {
  initialProducts: Product[];
  userId: string;
}

export function MatchClientPage({ initialProducts, userId }: MatchClientPageProps) {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [history, setHistory] = useState<{ productId: string; decision: "saved" | "dismissed" }[]>([]);

  const recordDecision = useCallback(async (productId: string, decision: "saved" | "dismissed") => {
    setHistory((h) => [...h, { productId, decision }]);
    setProducts((prev) => prev.filter((p) => p.id !== productId));

    await supabase.from("match_decisions").upsert(
      { user_id: userId, product_id: productId, decision },
      { onConflict: "user_id,product_id" }
    );

    if (decision === "saved") {
      await supabase.from("favorites")
        .upsert({ user_id: userId, product_id: productId }, { onConflict: "user_id,product_id" });
    }
  }, [supabase, userId]);

  const handleUndo = useCallback(async () => {
    const last = history[history.length - 1];
    if (!last) return;

    setHistory((h) => h.slice(0, -1));

    // Remove the decision
    await supabase.from("match_decisions")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", last.productId);

    if (last.decision === "saved") {
      await supabase.from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", last.productId);
    }

    // Re-fetch the product
    const { data } = await supabase.from("products").select("*").eq("id", last.productId).single();
    if (data) setProducts((prev) => [data, ...prev]);
  }, [history, supabase, userId]);

  const current = products[0];

  return (
    <div className="min-h-full flex flex-col">
      <div className="sticky top-0 z-10 px-6 py-4 border-b"
        style={{ background: "rgba(13,15,20,0.9)", backdropFilter: "blur(12px)", borderColor: "#1f2128" }}>
        <h1 className="text-lg font-semibold" style={{ color: "#f0f0ee" }}>Match</h1>
        <p className="text-xs mt-0.5" style={{ color: "#5a5c66" }}>
          {products.length} producto{products.length !== 1 ? "s" : ""} por revisar
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {current ? (
          <MatchCard
            product={current}
            onSave={(id) => recordDecision(id, "saved")}
            onDismiss={(id) => recordDecision(id, "dismissed")}
            onUndo={handleUndo}
            canUndo={history.length > 0}
          />
        ) : (
          <div className="text-center">
            <p className="text-5xl mb-4">✨</p>
            <h2 className="text-base font-semibold mb-1" style={{ color: "#f0f0ee" }}>
              Todo revisado
            </h2>
            <p className="text-sm" style={{ color: "#9899a0" }}>
              Has revisado todos los productos disponibles.
              Vuelve mañana o revisa tus guardados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
