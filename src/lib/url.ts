/**
 * Normalizes a user-entered link so it works as an anchor href regardless of
 * how it was typed. Preserves explicit schemes (mailto:, tel:, whatsapp:,
 * http(s)://, etc.) and prepends https:// for bare domains like "example.com".
 */
export function normalizeUrl(input?: string | null): string | null {
  if (!input) return null
  const value = input.trim()
  if (!value) return null

  // In-page anchor or site-relative path
  if (value.startsWith('#') || value.startsWith('/')) return value

  // Already has a scheme (http://, mailto:, tel:, whatsapp:, ftp:, etc.)
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return value

  // Protocol-relative URL
  if (value.startsWith('//')) return `https:${value}`

  return `https://${value}`
}

/** Resolves admin-entered nav/menu links (anchors, paths, or full URLs). */
export function resolveNavHref(input?: string | null, fallback = '#'): string {
  const value = input?.trim()
  if (!value) return fallback
  if (value.startsWith('#') || value.startsWith('/')) return value
  return normalizeUrl(value) ?? fallback
}
