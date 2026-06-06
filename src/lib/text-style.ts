/** Per-field text styling stored in site_content as JSON. */

export type FieldTextStyle = {
  color?: string
  fontSize?: string
  descColor?: string
  descFontSize?: string
}

export const STYLE_KEY_SUFFIX = '__style'
export const ITEM_STYLE_SECTION = 'item_style'

const HEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/

export function parseFieldStyle(raw?: string | null): FieldTextStyle {
  if (!raw?.trim()) return {}
  try {
    const o = JSON.parse(raw) as Record<string, unknown>
    const out: FieldTextStyle = {}
    if (typeof o.color === 'string' && HEX.test(o.color.trim())) out.color = o.color.trim()
    if (typeof o.fontSize === 'string' && o.fontSize.trim()) out.fontSize = o.fontSize.trim()
    if (typeof o.descColor === 'string' && HEX.test(o.descColor.trim())) out.descColor = o.descColor.trim()
    if (typeof o.descFontSize === 'string' && o.descFontSize.trim()) out.descFontSize = o.descFontSize.trim()
    return out
  } catch {
    return {}
  }
}

export function serializeFieldStyle(style: FieldTextStyle): string {
  const payload: FieldTextStyle = {}
  if (style.color?.trim()) payload.color = style.color.trim()
  if (style.fontSize?.trim()) payload.fontSize = style.fontSize.trim()
  if (style.descColor?.trim()) payload.descColor = style.descColor.trim()
  if (style.descFontSize?.trim()) payload.descFontSize = style.descFontSize.trim()
  return JSON.stringify(payload)
}

export function isEmptyStyle(style?: FieldTextStyle | null): boolean {
  if (!style) return true
  return !style.color && !style.fontSize && !style.descColor && !style.descFontSize
}

/** Track which site_content keys exist after admin save (incl. __style / __vis / item_style). */
export function buildAdminDbKeys(
  content: { section: string; key: string; hidden?: boolean; style?: FieldTextStyle }[],
  itemStyles: Record<string, FieldTextStyle>,
): Set<string> {
  const keys = new Set<string>()
  for (const c of content) {
    keys.add(`${c.section}.${c.key}`)
    if (c.hidden) keys.add(`${c.section}.${c.key}__vis`)
    if (c.style && !isEmptyStyle(c.style)) {
      keys.add(`${c.section}.${c.key}${STYLE_KEY_SUFFIX}`)
    }
  }
  for (const [id, st] of Object.entries(itemStyles)) {
    if (!isEmptyStyle(st)) keys.add(`${ITEM_STYLE_SECTION}.${id}`)
  }
  return keys
}

export function scalarFieldKey(section: string, key: string): string {
  return `${section}.${key}`
}

function pushColorDecl(decl: string[], color: string) {
  decl.push('background:none!important')
  decl.push('-webkit-background-clip:border-box!important')
  decl.push(`-webkit-text-fill-color:${color}!important`)
  decl.push('background-clip:border-box!important')
  decl.push(`color:${color}!important`)
}

/** CSS rules for [data-cms] scalar fields and [data-cms-item] list cards. */
export function buildCmsStyleCss(
  rows: { section: string; key: string; value_ar: string }[],
): string {
  const rules: string[] = []

  for (const row of rows) {
    if (row.key.endsWith(STYLE_KEY_SUFFIX)) {
      const baseKey = row.key.slice(0, -STYLE_KEY_SUFFIX.length)
      const style = parseFieldStyle(row.value_ar)
      const sel = `[data-cms="${row.section}.${baseKey}"]`
      const decl: string[] = []
      if (style.color) pushColorDecl(decl, style.color)
      if (style.fontSize) decl.push(`font-size:${style.fontSize}!important`)
      if (decl.length) rules.push(`${sel}{${decl.join(';')}}`)
      continue
    }

    if (row.section === ITEM_STYLE_SECTION) {
      const style = parseFieldStyle(row.value_ar)
      const id = row.key
      if (style.color || style.fontSize) {
        const decl: string[] = []
        if (style.color) pushColorDecl(decl, style.color)
        if (style.fontSize) decl.push(`font-size:${style.fontSize}!important`)
        rules.push(`[data-cms-item="${id}"][data-cms-part="title"]{${decl.join(';')}}`)
      }
      if (style.descColor || style.descFontSize) {
        const decl: string[] = []
        if (style.descColor) pushColorDecl(decl, style.descColor)
        else if (style.color) pushColorDecl(decl, style.color)
        if (style.descFontSize) decl.push(`font-size:${style.descFontSize}!important`)
        if (decl.length) rules.push(`[data-cms-item="${id}"][data-cms-part="desc"]{${decl.join(';')}}`)
      }
    }
  }

  return rules.join('')
}

export const FONT_SIZE_PRESETS = [
  { value: '', labelAr: 'افتراضي (من التصميم)' },
  { value: '12px', labelAr: '12px — صغير' },
  { value: '14px', labelAr: '14px' },
  { value: '16px', labelAr: '16px — عادي' },
  { value: '18px', labelAr: '18px' },
  { value: '20px', labelAr: '20px' },
  { value: '24px', labelAr: '24px — كبير' },
  { value: '28px', labelAr: '28px' },
  { value: '32px', labelAr: '32px — عنوان' },
  { value: '36px', labelAr: '36px' },
  { value: '48px', labelAr: '48px — بارز' },
  { value: '64px', labelAr: '64px — ضخم' },
] as const
