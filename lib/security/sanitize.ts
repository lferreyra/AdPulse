// ============================================================
// lib/security/sanitize.ts
// Utility functions to sanitize potentially malicious inputs.
// ============================================================

/**
 * Removes dangerous HTML tags and attributes from a string.
 * This is a basic implementation. For complex HTML sanitization,
 * consider using a library like DOMPurify or sanitize-html.
 * However, since we are mostly dealing with text from Meta API,
 * simple escaping is usually sufficient before rendering in React.
 */
export function sanitizeText(text: string | null | undefined): string {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
