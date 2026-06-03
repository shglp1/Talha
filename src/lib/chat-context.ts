import { getAdminClient } from '@/lib/supabase'
import { ALL_FIELDS, defaultFor, defaultListItems } from '@/lib/contentSchema'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'

type ScalarRow = { section: string; key: string; value_ar: string; value_en: string }
type ItemRow = { section: string; title_ar: string; title_en: string; desc_ar: string; desc_en: string; active: boolean }

function pickScalar(rows: Map<string, ScalarRow>, section: string, key: string, lang: Lang): string {
  const row = rows.get(`${section}.${key}`)
  const val = lang === 'ar' ? row?.value_ar : row?.value_en
  if (val && val.trim()) return val.trim()
  return defaultFor(section, key, lang)
}

function isHidden(rows: Map<string, ScalarRow>, section: string, key: string): boolean {
  return rows.get(`${section}.${key}__vis`)?.value_ar === '0'
}

/** Build a live snapshot of the public website for the AI assistant. */
export async function buildSiteChatContext(lang: Lang = 'ar'): Promise<string> {
  const tr = t[lang]
  const lines: string[] = []

  try {
    const supabase = getAdminClient()
    const [contentRes, itemsRes] = await Promise.all([
      supabase.from('site_content').select('section, key, value_ar, value_en'),
      supabase
        .from('content_items')
        .select('section, title_ar, title_en, desc_ar, desc_en, active')
        .eq('active', true)
        .order('sort_order', { ascending: true }),
    ])

    const scalarMap = new Map<string, ScalarRow>()
    for (const row of contentRes.data ?? []) {
      scalarMap.set(`${row.section}.${row.key}`, row as ScalarRow)
    }

    const itemsBySection = new Map<string, ItemRow[]>()
    for (const row of itemsRes.data ?? []) {
      ;(itemsBySection.get(row.section) ?? itemsBySection.set(row.section, []).get(row.section)!).push(row as ItemRow)
    }

    const text = (section: string, key: string) => {
      if (isHidden(scalarMap, section, key)) return null
      return pickScalar(scalarMap, section, key, lang)
    }

    lines.push('== معلومات المكتب (محدّثة من الموقع) ==')
    lines.push(`الاسم: ${text('hero', 'title2') ?? tr.hero.title2} — ${text('hero', 'title3') ?? tr.hero.title3}`)
    lines.push(`الهاتف: ${text('hero', 'phone') ?? tr.contact.phone}`)
    lines.push(`البريد: ${text('hero', 'email') ?? tr.contact.email}`)
    lines.push(`العنوان: ${text('hero', 'address') ?? tr.contact.address}`)
    lines.push(`ساعات العمل: ${text('hero', 'hours') ?? tr.contact.hours}`)

    const appendStats = (section: string, heading: string) => {
      const dbItems = itemsBySection.get(section)
      const items = dbItems && dbItems.length > 0
        ? dbItems.map(r => ({
            value: lang === 'ar' ? r.title_ar : r.title_en,
            label: lang === 'ar' ? r.desc_ar : r.desc_en,
          }))
        : defaultListItems(section).map(r => ({
            value: lang === 'ar' ? r.title_ar : r.title_en,
            label: lang === 'ar' ? r.desc_ar : r.desc_en,
          }))

      if (!items.length) return
      lines.push(`\n== ${heading} ==`)
      lines.push(lang === 'ar'
        ? '(استخدم هذه الأرقام عند سؤال الزائر عن الخبرة أو العملاء أو القضايا)'
        : '(Use these figures when the visitor asks about experience, clients, or cases)')
      for (const it of items) {
        if (!it.value?.trim()) continue
        lines.push(it.label?.trim() ? `• ${it.value} ${it.label}` : `• ${it.value}`)
      }
    }

    appendStats('hero_stats', lang === 'ar' ? 'إحصائيات المكتب — الواجهة الرئيسية' : 'Office statistics — Hero section')
    appendStats('clients_stats', lang === 'ar' ? 'إحصائيات المكتب — قسم العملاء' : 'Office statistics — Clients section')

    const yearsValue = text('about', 'years_value')
    const yearsCaption = text('about', 'years_caption')
    if (yearsValue || yearsCaption) {
      lines.push(`\n== ${lang === 'ar' ? 'سنوات الخبرة (قسم من نحن)' : 'Years of experience (About section)'} ==`)
      lines.push(`• ${yearsValue ?? '15+'} ${yearsCaption ?? (lang === 'ar' ? 'سنوات من الخبرة القانونية المتخصصة' : 'years of specialized legal expertise')}`)
    }

    const aboutTitle = text('about', 'title')
    if (aboutTitle) {
      lines.push('\n== من نحن ==')
      lines.push(aboutTitle)
      for (const k of ['body1', 'body2', 'body3'] as const) {
        const p = text('about', k)
        if (p) lines.push(p)
      }
    }

    const visionTitle = text('visionMission', 'visionTitle')
    if (visionTitle) {
      lines.push('\n== الرؤية والرسالة ==')
      const vt = text('visionMission', 'visionText')
      const mt = text('visionMission', 'missionText')
      if (vt) lines.push(`${visionTitle}: ${vt}`)
      if (mt) lines.push(`${text('visionMission', 'missionTitle') ?? ''}: ${mt}`)
    }

    const appendList = (section: string, heading: string) => {
      const dbItems = itemsBySection.get(section)
      const items = dbItems && dbItems.length > 0
        ? dbItems.map(r => ({
            title: lang === 'ar' ? r.title_ar : r.title_en,
            desc: lang === 'ar' ? r.desc_ar : r.desc_en,
          }))
        : defaultListItems(section).map(r => ({
            title: lang === 'ar' ? r.title_ar : r.title_en,
            desc: lang === 'ar' ? r.desc_ar : r.desc_en,
          }))

      if (!items.length) return
      lines.push(`\n== ${heading} ==`)
      for (const it of items) {
        if (!it.title?.trim()) continue
        lines.push(it.desc?.trim() ? `• ${it.title}: ${it.desc}` : `• ${it.title}`)
      }
    }

    appendList('services', lang === 'ar' ? 'خدماتنا' : 'Our Services')
    appendList('whyUs', lang === 'ar' ? 'لماذا نحن' : 'Why Us')
    appendList('goals', lang === 'ar' ? 'أهدافنا الاستراتيجية' : 'Strategic Goals')
    appendList('team_specializations', lang === 'ar' ? 'تخصصات الفريق' : 'Team Specializations')
    appendList('clients_sectors', lang === 'ar' ? 'القطاعات التي نخدمها' : 'Client Sectors')

    const closing = text('closing', 'quote')
    if (closing) {
      lines.push(`\n== رسالة ختامية ==`)
      lines.push(closing)
    }

    // Include scalar fields from schema that have live values (skip photos & visibility keys)
    const extraScalars = ALL_FIELDS.filter(f => {
      const v = text(f.section, f.key)
      return v && v.length > 0
    })
    if (extraScalars.length) {
      lines.push(`\n== نصوص إضافية من الموقع ==`)
      for (const f of extraScalars.slice(0, 24)) {
        const v = text(f.section, f.key)
        if (v) lines.push(`- ${f.labelAr}: ${v}`)
      }
    }
  } catch {
    lines.push('(تعذّر تحميل بيانات الموقع — استخدم المعلومات الافتراضية.)')
    lines.push(`\n== إحصائيات المكتب ==`)
    lines.push(`• 15+ ${tr.hero.stat1}`)
    lines.push(`• 500+ ${tr.hero.stat2}`)
    lines.push(`• 1000+ ${tr.hero.stat3}`)
    lines.push(t[lang].services.items.map(s => `• ${s.title}: ${s.desc}`).join('\n'))
  }

  return lines.join('\n')
}
