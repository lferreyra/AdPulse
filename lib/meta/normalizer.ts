// ============================================================
// lib/meta/normalizer.ts
// Normalizes and sanitizes data from the Meta API or manual input
// before it hits our internal components or database.
// ============================================================

import { sanitizeText } from '../security/sanitize';

export function normalizeSearchTerm(term: string): string {
  if (!term) return '';
  return sanitizeText(term.trim().toLowerCase());
}

export function normalizeCountryCode(code: string): string {
  if (!code) return '';
  return code.trim().toUpperCase();
}
