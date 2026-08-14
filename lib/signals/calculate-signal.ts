// ============================================================
// lib/signals/calculate-signal.ts
// Pure, testable signal calculation function.
// No side effects. No external dependencies.
// ============================================================

export const SIGNAL_LABELS = {
  NUEVO: 'Nuevo',
  ESCALANDO: 'Escalando',
  ESCALADO: 'Escalado',
  ASENTADO: 'Asentado',
} as const;

export type SignalLabel = (typeof SIGNAL_LABELS)[keyof typeof SIGNAL_LABELS];

export interface SignalSnapshot {
  /** ISO date string (YYYY-MM-DD) */
  snapshot_date: string;
  active_ads_count: number;
}

export interface SignalInput {
  /** ISO timestamp string of first_seen_at */
  first_seen_at: string;
  /** Current active ads count */
  active_ads_count: number;
  /**
   * Recent snapshots ordered by date ascending.
   * Used to evaluate weekly stability.
   */
  recent_snapshots?: SignalSnapshot[];
  /**
   * Stability threshold (max relative variance between snapshots).
   * Defaults to 0.20 (20%). Configurable by owner.
   */
  stability_threshold?: number;
  /**
   * Reference "now" for deterministic testing.
   * Defaults to new Date().
   */
  now?: Date;
}

export interface SignalOutput {
  signal: SignalLabel;
  signal_reason: string;
}

/**
 * Calculate the signal label for a product.
 *
 * Priority (deterministic, no ambiguity):
 * 1. age_days < 30  → Nuevo
 * 2. age_days >= 30 AND active_ads_count > 80  → Escalado
 * 3. age_days >= 30 AND 25 <= active_ads_count <= 80  → Escalando
 * 4. age_days >= 30 AND stable volume (3+ weekly snapshots, ≤ threshold variance) → Asentado
 * 5. Fallback: Asentado (documented edge case, see signal_reason)
 *
 * Boundary behaviour (inclusive/exclusive):
 * - age_days is floor(milliseconds / 86_400_000). Exactly 30 days → 30 days → NOT Nuevo.
 * - ads_count === 25 → Escalando (25 is the lower inclusive bound).
 * - ads_count === 80 → Escalando (80 is the upper inclusive bound).
 * - ads_count === 81 → Escalado.
 * - age_days === 29 → Nuevo.
 * - age_days === 30 → applies rules 2-5.
 *
 * "Stable volume" definition:
 * - Requires at least 3 snapshots spaced ≥ 6 days apart (weekly snapshots).
 * - Relative variance = (max - min) / max among those 3 snapshots.
 * - Stable if variance ≤ stability_threshold (default 0.20).
 *
 * @pure No side effects, no I/O.
 */
export function calculateSignal(input: SignalInput): SignalOutput {
  const {
    first_seen_at,
    active_ads_count,
    recent_snapshots = [],
    stability_threshold = 0.2,
    now = new Date(),
  } = input;

  const firstSeenDate = new Date(first_seen_at);
  const msPerDay = 86_400_000;
  const ageDays = Math.floor(
    (now.getTime() - firstSeenDate.getTime()) / msPerDay,
  );

  // Rule 1: Nuevo — strictly less than 30 days
  if (ageDays < 30) {
    return {
      signal: SIGNAL_LABELS.NUEVO,
      signal_reason: `Producto detectado hace ${ageDays} días (menos de 30 días desde su primera aparición).`,
    };
  }

  // Rules 2-5: product is 30+ days old

  // Rule 2: Escalado — more than 80 active ads
  if (active_ads_count > 80) {
    return {
      signal: SIGNAL_LABELS.ESCALADO,
      signal_reason: `${active_ads_count} anuncios activos (más de 80) con más de 30 días activo.`,
    };
  }

  // Rule 3: Escalando — between 25 and 80 active ads (inclusive)
  if (active_ads_count >= 25 && active_ads_count <= 80) {
    return {
      signal: SIGNAL_LABELS.ESCALANDO,
      signal_reason: `${active_ads_count} anuncios activos (entre 25 y 80) con más de 30 días activo.`,
    };
  }

  // Rule 4: Asentado — stable volume across 3+ weekly snapshots
  const weeklySnapshots = pickWeeklySnapshots(recent_snapshots, 3);
  if (weeklySnapshots.length >= 3) {
    const counts = weeklySnapshots.map((s) => s.active_ads_count);
    const maxCount = Math.max(...counts);
    const minCount = Math.min(...counts);
    const relativeVariance = maxCount > 0 ? (maxCount - minCount) / maxCount : 0;

    if (relativeVariance <= stability_threshold) {
      return {
        signal: SIGNAL_LABELS.ASENTADO,
        signal_reason: `Volumen estable durante los últimos 3 snapshots semanales (variación relativa ${(relativeVariance * 100).toFixed(1)}% ≤ ${(stability_threshold * 100).toFixed(0)}%). Anuncios activos: ${active_ads_count}.`,
      };
    }
  }

  // Rule 5: Fallback — product is old but outside all defined ranges.
  // Use Asentado with a documented reason (consistent, no invented label).
  return {
    signal: SIGNAL_LABELS.ASENTADO,
    signal_reason: `Producto con ${ageDays} días de antigüedad y ${active_ads_count} anuncios activos. No alcanza los umbrales de Escalando (25+) ni Escalado (80+), y no hay suficientes snapshots semanales para confirmar estabilidad. Se asigna Asentado como etiqueta conservadora.`,
  };
}

// ─── Internal helpers ─────────────────────────────────────────

/**
 * From a list of snapshots ordered by date ASC, pick up to `count`
 * snapshots that are at least 6 days apart (weekly cadence).
 * Returns the selected snapshots ordered by date ascending.
 */
function pickWeeklySnapshots(
  snapshots: SignalSnapshot[],
  count: number,
): SignalSnapshot[] {
  if (snapshots.length === 0) return [];

  const msPerDay = 86_400_000;
  const minGapMs = 6 * msPerDay; // 6 days = "weekly" tolerance

  // Sort descending (most recent first) to pick from newest
  const sorted = [...snapshots].sort(
    (a, b) =>
      new Date(b.snapshot_date).getTime() - new Date(a.snapshot_date).getTime(),
  );

  const selected: SignalSnapshot[] = [];
  let lastTimestamp: number | null = null;

  for (const snap of sorted) {
    const ts = new Date(snap.snapshot_date).getTime();
    if (lastTimestamp === null || lastTimestamp - ts >= minGapMs) {
      selected.push(snap);
      lastTimestamp = ts;
      if (selected.length >= count) break;
    }
  }

  // Return in ascending order
  return selected.reverse();
}
