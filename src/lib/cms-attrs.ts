/** Helpers for admin-controlled text styling via data attributes. */
export function cmsField(section: string, key: string) {
  return { 'data-cms': `${section}.${key}` } as const
}

export function cmsItemPart(id: string | undefined, part: 'title' | 'desc') {
  if (!id) return {}
  return { 'data-cms-item': id, 'data-cms-part': part } as const
}
