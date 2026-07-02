/**
 * Format external URLs to prepend https:// if missing
 * to avoid relative link redirection issues in browsers.
 */
export function formatExternalUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
