// ============================================================
// lib/security/url-validator.ts
// Utility for validating and normalizing external URLs.
// ============================================================

/**
 * Validates a URL and ensures it uses HTTP or HTTPS.
 * Prevents javascript: or other potentially dangerous protocols.
 * 
 * @param urlString The URL to validate
 * @returns The normalized URL string, or null if invalid
 */
export function validateUrl(urlString: string | null | undefined): string | null {
  if (!urlString) return null;
  
  try {
    const url = new URL(urlString);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return url.toString();
  } catch (e) {
    return null;
  }
}

/**
 * Returns security props for external links.
 * Always includes target="_blank" and rel="noopener noreferrer".
 */
export function getExternalLinkProps() {
  return {
    target: '_blank',
    rel: 'noopener noreferrer',
  };
}
