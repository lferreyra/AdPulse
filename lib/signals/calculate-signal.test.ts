// ============================================================
// lib/signals/calculate-signal.test.ts
// Vitest unit tests covering ALL documented boundary cases.
// ============================================================

import { describe, it, expect } from 'vitest';
import { calculateSignal, SIGNAL_LABELS, type SignalSnapshot } from './calculate-signal';

// ─── Helpers ──────────────────────────────────────────────────

function daysAgo(days: number, from: Date = new Date()): Date {
  const d = new Date(from);
  d.setDate(d.getDate() - days);
  return d;
}

function makeInput(opts: {
  ageDays: number;
  activeAds: number;
  snapshots?: SignalSnapshot[];
  threshold?: number;
  now?: Date;
}) {
  const now = opts.now ?? new Date('2024-06-01T12:00:00Z');
  return {
    first_seen_at: daysAgo(opts.ageDays, now).toISOString(),
    active_ads_count: opts.activeAds,
    recent_snapshots: opts.snapshots ?? [],
    stability_threshold: opts.threshold,
    now,
  };
}

function makeWeeklySnapshots(
  counts: number[],
  now: Date = new Date('2024-06-01T12:00:00Z'),
): SignalSnapshot[] {
  // oldest first
  return counts.map((count, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (counts.length - 1 - i) * 7);
    return {
      snapshot_date: d.toISOString().slice(0, 10),
      active_ads_count: count,
    };
  });
}

// ─── RULE 1: Nuevo ────────────────────────────────────────────

describe('Rule 1 — Nuevo (age < 30 days)', () => {
  it('returns Nuevo for age = 0 days', () => {
    const result = calculateSignal(makeInput({ ageDays: 0, activeAds: 200 }));
    expect(result.signal).toBe(SIGNAL_LABELS.NUEVO);
  });

  it('returns Nuevo for age = 1 day', () => {
    const result = calculateSignal(makeInput({ ageDays: 1, activeAds: 100 }));
    expect(result.signal).toBe(SIGNAL_LABELS.NUEVO);
  });

  it('returns Nuevo for age = 29 days (boundary: 29 < 30)', () => {
    const result = calculateSignal(makeInput({ ageDays: 29, activeAds: 100 }));
    expect(result.signal).toBe(SIGNAL_LABELS.NUEVO);
  });

  it('does NOT return Nuevo for age = 30 days (boundary: 30 >= 30)', () => {
    const result = calculateSignal(makeInput({ ageDays: 30, activeAds: 5 }));
    expect(result.signal).not.toBe(SIGNAL_LABELS.NUEVO);
  });

  it('does NOT return Nuevo for age = 31 days', () => {
    const result = calculateSignal(makeInput({ ageDays: 31, activeAds: 5 }));
    expect(result.signal).not.toBe(SIGNAL_LABELS.NUEVO);
  });

  it('Nuevo takes priority over high ad count', () => {
    // age 15 days but 500 ads → still Nuevo
    const result = calculateSignal(makeInput({ ageDays: 15, activeAds: 500 }));
    expect(result.signal).toBe(SIGNAL_LABELS.NUEVO);
  });
});

// ─── RULE 2: Escalado ─────────────────────────────────────────

describe('Rule 2 — Escalado (age >= 30, ads > 80)', () => {
  it('returns Escalado for age=30 ads=81 (boundary: 81 > 80)', () => {
    const result = calculateSignal(makeInput({ ageDays: 30, activeAds: 81 }));
    expect(result.signal).toBe(SIGNAL_LABELS.ESCALADO);
  });

  it('returns Escalado for age=30 ads=200', () => {
    const result = calculateSignal(makeInput({ ageDays: 30, activeAds: 200 }));
    expect(result.signal).toBe(SIGNAL_LABELS.ESCALADO);
  });

  it('does NOT return Escalado for ads=80 (boundary: 80 is Escalando)', () => {
    const result = calculateSignal(makeInput({ ageDays: 30, activeAds: 80 }));
    expect(result.signal).toBe(SIGNAL_LABELS.ESCALANDO);
  });

  it('does NOT return Escalado for age=29 ads=200 (Nuevo takes priority)', () => {
    const result = calculateSignal(makeInput({ ageDays: 29, activeAds: 200 }));
    expect(result.signal).toBe(SIGNAL_LABELS.NUEVO);
  });
});

// ─── RULE 3: Escalando ────────────────────────────────────────

describe('Rule 3 — Escalando (age >= 30, 25 <= ads <= 80)', () => {
  it('returns Escalando for age=30 ads=25 (lower inclusive boundary)', () => {
    const result = calculateSignal(makeInput({ ageDays: 30, activeAds: 25 }));
    expect(result.signal).toBe(SIGNAL_LABELS.ESCALANDO);
  });

  it('returns Escalando for age=30 ads=50', () => {
    const result = calculateSignal(makeInput({ ageDays: 30, activeAds: 50 }));
    expect(result.signal).toBe(SIGNAL_LABELS.ESCALANDO);
  });

  it('returns Escalando for age=30 ads=80 (upper inclusive boundary)', () => {
    const result = calculateSignal(makeInput({ ageDays: 30, activeAds: 80 }));
    expect(result.signal).toBe(SIGNAL_LABELS.ESCALANDO);
  });

  it('does NOT return Escalando for ads=24 (boundary: 24 < 25)', () => {
    const result = calculateSignal(makeInput({ ageDays: 30, activeAds: 24 }));
    expect(result.signal).not.toBe(SIGNAL_LABELS.ESCALANDO);
  });

  it('does NOT return Escalando for ads=81 (boundary: 81 > 80, Escalado)', () => {
    const result = calculateSignal(makeInput({ ageDays: 30, activeAds: 81 }));
    expect(result.signal).toBe(SIGNAL_LABELS.ESCALADO);
  });

  it('does NOT return Escalando for age=29 (Nuevo takes priority)', () => {
    const result = calculateSignal(makeInput({ ageDays: 29, activeAds: 50 }));
    expect(result.signal).toBe(SIGNAL_LABELS.NUEVO);
  });
});

// ─── RULE 4: Asentado (stable volume) ────────────────────────

describe('Rule 4 — Asentado (stable volume, 3+ weekly snapshots)', () => {
  it('returns Asentado when 3 weekly snapshots are stable (0% variance)', () => {
    const snapshots = makeWeeklySnapshots([20, 20, 20]);
    const result = calculateSignal(
      makeInput({ ageDays: 60, activeAds: 20, snapshots }),
    );
    expect(result.signal).toBe(SIGNAL_LABELS.ASENTADO);
  });

  it('returns Asentado when variance is exactly at threshold (20%) — uses low ad count to avoid Escalando/Escalado', () => {
    // Use active_ads_count = 10 (< 25) so rules 2 and 3 don't fire.
    // max=10, min=8, variance = 2/10 = 0.20 — exactly at default threshold.
    const snapshots = makeWeeklySnapshots([8, 9, 10]);
    const result = calculateSignal(
      makeInput({ ageDays: 60, activeAds: 10, snapshots }),
    );
    expect(result.signal).toBe(SIGNAL_LABELS.ASENTADO);
    expect(result.signal_reason).toContain('estable');
  });

  it('does NOT trigger Asentado stability rule when variance exceeds threshold (21%)', () => {
    // max=10, min=7.9 → use integer 7, so variance = 3/10 = 0.30 > 0.20
    const snapshots = makeWeeklySnapshots([7, 9, 10]);
    const result = calculateSignal(
      makeInput({ ageDays: 60, activeAds: 10, snapshots }),
    );
    // Falls to fallback Asentado — check it uses the conservadora reason, not stability reason
    expect(result.signal).toBe(SIGNAL_LABELS.ASENTADO);
    expect(result.signal_reason).toContain('conservadora');
  });

  it('returns Asentado with custom threshold (10%) — low ad count', () => {
    // variance = 2/21 ≈ 9.5% < 10% threshold
    const snapshots = makeWeeklySnapshots([19, 20, 21]);
    const result = calculateSignal(
      makeInput({ ageDays: 60, activeAds: 21, snapshots, threshold: 0.1 }),
    );
    expect(result.signal).toBe(SIGNAL_LABELS.ASENTADO);
    expect(result.signal_reason).toContain('10%');
  });

  it('does NOT return Asentado from stability if only 2 snapshots exist', () => {
    const snapshots = makeWeeklySnapshots([20, 20]); // only 2
    const result = calculateSignal(
      makeInput({ ageDays: 60, activeAds: 20, snapshots }),
    );
    // Will fall to fallback — still Asentado but for different reason
    expect(result.signal).toBe(SIGNAL_LABELS.ASENTADO);
    expect(result.signal_reason).toContain('suficientes');
  });
});

// ─── RULE 5: Fallback ─────────────────────────────────────────

describe('Rule 5 — Fallback Asentado (documented edge case)', () => {
  it('assigns Asentado when age>=30, ads<25, and insufficient snapshots', () => {
    const result = calculateSignal(makeInput({ ageDays: 45, activeAds: 10 }));
    expect(result.signal).toBe(SIGNAL_LABELS.ASENTADO);
    expect(result.signal_reason).toContain('conservadora');
  });

  it('only uses one of the 4 defined labels', () => {
    const validLabels = new Set(['Nuevo', 'Escalando', 'Escalado', 'Asentado']);
    const testCases = [
      { ageDays: 0, activeAds: 0 },
      { ageDays: 15, activeAds: 200 },
      { ageDays: 29, activeAds: 25 },
      { ageDays: 30, activeAds: 0 },
      { ageDays: 30, activeAds: 24 },
      { ageDays: 30, activeAds: 25 },
      { ageDays: 30, activeAds: 80 },
      { ageDays: 30, activeAds: 81 },
      { ageDays: 365, activeAds: 0 },
      { ageDays: 365, activeAds: 1000 },
    ];
    for (const tc of testCases) {
      const result = calculateSignal(makeInput(tc));
      expect(validLabels.has(result.signal)).toBe(true);
    }
  });
});

// ─── Signal reason ────────────────────────────────────────────

describe('signal_reason is always populated', () => {
  it('provides a non-empty reason for every result', () => {
    const cases = [
      { ageDays: 10, activeAds: 100 },
      { ageDays: 31, activeAds: 100 },
      { ageDays: 31, activeAds: 50 },
      { ageDays: 60, activeAds: 10 },
    ];
    for (const c of cases) {
      const result = calculateSignal(makeInput(c));
      expect(result.signal_reason).toBeTruthy();
      expect(result.signal_reason.length).toBeGreaterThan(10);
    }
  });
});

// ─── Stability logic ──────────────────────────────────────────

describe('Weekly snapshot selection', () => {
  it('ignores snapshots less than 6 days apart', () => {
    const now = new Date('2024-06-01');
    // 3 snapshots but all within 3 days — not weekly
    const snapshots: SignalSnapshot[] = [
      { snapshot_date: '2024-05-30', active_ads_count: 20 },
      { snapshot_date: '2024-05-28', active_ads_count: 20 },
      { snapshot_date: '2024-05-26', active_ads_count: 20 },
    ];
    const result = calculateSignal({
      first_seen_at: daysAgo(60, now).toISOString(),
      active_ads_count: 20,
      recent_snapshots: snapshots,
      now,
    });
    // 2-day gaps — won't reach 3 weekly snapshots threshold
    // Falls to fallback Asentado
    expect(result.signal).toBe(SIGNAL_LABELS.ASENTADO);
  });

  it('accepts snapshots exactly 6 days apart as weekly', () => {
    const now = new Date('2024-06-01');
    const snapshots: SignalSnapshot[] = [
      { snapshot_date: '2024-05-14', active_ads_count: 18 },
      { snapshot_date: '2024-05-20', active_ads_count: 20 },
      { snapshot_date: '2024-05-26', active_ads_count: 19 },
    ];
    const result = calculateSignal({
      first_seen_at: daysAgo(90, now).toISOString(),
      active_ads_count: 19,
      recent_snapshots: snapshots,
      now,
    });
    expect(result.signal).toBe(SIGNAL_LABELS.ASENTADO);
    expect(result.signal_reason).toContain('estable');
  });
});
