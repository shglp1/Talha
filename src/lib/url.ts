/**
 * Normalizes a user-entered link so it works as an anchor href regardless of
 * how it was typed. Preserves explicit schemes (mailto:, tel:, whatsapp:,
 * http(s)://, etc.) and prepends https:// for bare domains like "example.com".
 */
export function normalizeUrl(input?: string | null): string | null {
  if (!input) return null
  const value = input.trim()
  if (!value) return null

  // Already has a scheme (http://, mailto:, tel:, whatsapp:, ftp:, etc.)
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return value

  // Protocol-relative URL
  if (value.startsWith('//')) return `https:${value}`

  return `https://${value}`
}
