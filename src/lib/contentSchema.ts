import { t } from '@/lib/translations'
import type { Lang } from '@/lib/translations'
import type { ContentItem } from '@/lib/supabase'

/**
 * Single source of truth for every editable scalar text on the site and for the
 * repeating list sections. The admin panel and the live-site resolver both read
 * from here so there is exactly one place to maintain.
 *
 * Scalar overrides are stored in the `site_content` table keyed by (section, key).
 * Repeating list items live in the `content_items` table keyed by `section`.
 */

export type ScalarField = {
  section: string
  key: string
  labelAr: string
  labelEn: string
  multiline?: boolean
  def: { ar: string; en: string }
  /** When set, admin shows a destination URL stored as `{key}_href`. */
  linkDef?: { ar: string; en: string }
  /** Auto-generated companion row for linkDef — not shown as its own card in admin. */
  isLinkField?: boolean
}

export function linkFieldKey(baseKey: string): string {
  return `${baseKey}_href`
}

function expandFieldsWithLinks(fields: ScalarField[]): ScalarField[] {
  const out: ScalarField[] = []
  for (const f of fields) {
    out.push(f)
    if (f.linkDef) {
      out.push({
        section: f.section,
        key: linkFieldKey(f.key),
        labelAr: `${f.labelAr} — الرابط`,
        labelEn: `${f.labelEn} — Link`,
        def: f.linkDef,
        isLinkField: true,
      })
    }
  }
  return out
}

/** Default nav anchor / URL for a menu item key (about, services, …). */
export function navHrefDefault(navKey: string, lang: Lang = 'ar'): string {
  const parent = FIELD_GROUPS.find(g => g.id === 'nav')?.fields.find(f => f.key === navKey)
  return parent?.linkDef?.[lang] ?? parent?.linkDef?.ar ?? `#${navKey.toLowerCase()}`
}

export type FieldGroup = {
  id: string
  titleAr: string
  titleEn: string
  fields: ScalarField[]
}

// Note: contact details are stored under section `hero` (keys phone/email/address/hours)
// for backward compatibility with existing rows, but their defaults come from `contact`.
export const FIELD_GROUPS: FieldGroup[] = [
  {
    id: 'nav',
    titleAr: 'القائمة العلوية',
    titleEn: 'Navigation Menu',
    fields: [
      { section: 'nav', key: 'about',    labelAr: 'من نحن',     labelEn: 'About',    def: { ar: t.ar.nav.about,    en: t.en.nav.about },    linkDef: { ar: '#about',    en: '#about' } },
      { section: 'nav', key: 'services', labelAr: 'خدماتنا',    labelEn: 'Services', def: { ar: t.ar.nav.services, en: t.en.nav.services }, linkDef: { ar: '#services', en: '#services' } },
      { section: 'nav', key: 'vision',   labelAr: 'رؤيتنا',     labelEn: 'Vision',   def: { ar: t.ar.nav.vision,   en: t.en.nav.vision },   linkDef: { ar: '#vision',   en: '#vision' } },
      { section: 'nav', key: 'whyUs',    labelAr: 'لماذا نحن',  labelEn: 'Why Us',   def: { ar: t.ar.nav.whyUs,    en: t.en.nav.whyUs },    linkDef: { ar: '#whyus',    en: '#whyus' } },
      { section: 'nav', key: 'team',     labelAr: 'فريقنا',     labelEn: 'Team',     def: { ar: t.ar.nav.team,     en: t.en.nav.team },     linkDef: { ar: '#team',     en: '#team' } },
      { section: 'nav', key: 'clients',  labelAr: 'عملاؤنا',    labelEn: 'Clients',  def: { ar: t.ar.nav.clients,  en: t.en.nav.clients },  linkDef: { ar: '#clients',  en: '#clients' } },
      { section: 'nav', key: 'contact',  labelAr: 'تواصل معنا', labelEn: 'Contact',  def: { ar: t.ar.nav.contact,  en: t.en.nav.contact },  linkDef: { ar: '#contact',  en: '#contact' } },
    ],
  },
  {
    id: 'hero',
    titleAr: 'الواجهة الرئيسية',
    titleEn: 'Hero',
    fields: [
      { section: 'hero', key: 'badge',    labelAr: 'الشريط العلوي',        labelEn: 'Top Badge',    multiline: true, def: { ar: t.ar.hero.badge,    en: t.en.hero.badge } },
      { section: 'hero', key: 'title1',   labelAr: 'العنوان — السطر الأول', labelEn: 'Title line 1', def: { ar: t.ar.hero.title1,   en: t.en.hero.title1 } },
      { section: 'hero', key: 'title2',   labelAr: 'العنوان — السطر الذهبي', labelEn: 'Title line 2', def: { ar: t.ar.hero.title2,   en: t.en.hero.title2 } },
      { section: 'hero', key: 'title3',   labelAr: 'العنوان — السطر الثالث', labelEn: 'Title line 3', def: { ar: t.ar.hero.title3,   en: t.en.hero.title3 } },
      { section: 'hero', key: 'subtitle', labelAr: 'النص التعريفي',        labelEn: 'Subtitle',     multiline: true, def: { ar: t.ar.hero.subtitle, en: t.en.hero.subtitle } },
      { section: 'hero', key: 'cta1',     labelAr: 'الزر الأول',           labelEn: 'Button 1',     def: { ar: t.ar.hero.cta1,     en: t.en.hero.cta1 } },
      { section: 'hero', key: 'cta2',     labelAr: 'الزر الثاني',          labelEn: 'Button 2',     def: { ar: t.ar.hero.cta2,     en: t.en.hero.cta2 } },
    ],
  },
  {
    id: 'about',
    titleAr: 'قسم: من نحن',
    titleEn: 'About Section',
    fields: [
      { section: 'about', key: 'badge', labelAr: 'الشارة',    labelEn: 'Badge',       def: { ar: t.ar.about.badge, en: t.en.about.badge } },
      { section: 'about', key: 'title', labelAr: 'العنوان',   labelEn: 'Title',       def: { ar: t.ar.about.title, en: t.en.about.title } },
      { section: 'about', key: 'body1', labelAr: 'الفقرة 1',  labelEn: 'Paragraph 1', multiline: true, def: { ar: t.ar.about.body1, en: t.en.about.body1 } },
      { section: 'about', key: 'body2', labelAr: 'الفقرة 2',  labelEn: 'Paragraph 2', multiline: true, def: { ar: t.ar.about.body2, en: t.en.about.body2 } },
      { section: 'about', key: 'body3', labelAr: 'الفقرة 3',  labelEn: 'Paragraph 3', multiline: true, def: { ar: t.ar.about.body3, en: t.en.about.body3 } },
      { section: 'about', key: 'years_value',   labelAr: 'بطاقة الخبرة — الرقم (مثل 15+)',     labelEn: 'Experience badge — number', def: { ar: '15+', en: '15+' } },
      { section: 'about', key: 'years_caption', labelAr: 'بطاقة الخبرة — النص',               labelEn: 'Experience badge — text',   multiline: true, def: { ar: 'سنوات من الخبرة القانونية المتخصصة', en: 'Years of specialized legal expertise' } },
    ],
  },
  {
    id: 'visionMission',
    titleAr: 'قسم: الرؤية والرسالة',
    titleEn: 'Vision & Mission',
    fields: [
      { section: 'visionMission', key: 'badge',        labelAr: 'الشارة',         labelEn: 'Badge',         def: { ar: t.ar.visionMission.badge,        en: t.en.visionMission.badge } },
      { section: 'visionMission', key: 'visionTitle',  labelAr: 'عنوان الرؤية',   labelEn: 'Vision Title',  def: { ar: t.ar.visionMission.visionTitle,  en: t.en.visionMission.visionTitle } },
      { section: 'visionMission', key: 'visionText',   labelAr: 'نص الرؤية',      labelEn: 'Vision Text',   multiline: true, def: { ar: t.ar.visionMission.visionText,   en: t.en.visionMission.visionText } },
      { section: 'visionMission', key: 'missionTitle', labelAr: 'عنوان الرسالة',  labelEn: 'Mission Title', def: { ar: t.ar.visionMission.missionTitle, en: t.en.visionMission.missionTitle } },
      { section: 'visionMission', key: 'missionText',  labelAr: 'نص الرسالة',     labelEn: 'Mission Text',  multiline: true, def: { ar: t.ar.visionMission.missionText,  en: t.en.visionMission.missionText } },
    ],
  },
  {
    id: 'services',
    titleAr: 'قسم: خدماتنا (العناوين)',
    titleEn: 'Services Section (Headings)',
    fields: [
      { section: 'services', key: 'badge',    labelAr: 'الشارة',       labelEn: 'Badge',    def: { ar: t.ar.services.badge,    en: t.en.services.badge } },
      { section: 'services', key: 'title',    labelAr: 'العنوان',      labelEn: 'Title',    def: { ar: t.ar.services.title,    en: t.en.services.title } },
      { section: 'services', key: 'subtitle', labelAr: 'النص الفرعي',  labelEn: 'Subtitle', multiline: true, def: { ar: t.ar.services.subtitle, en: t.en.services.subtitle } },
    ],
  },
  {
    id: 'whyUs',
    titleAr: 'قسم: لماذا نحن (العناوين)',
    titleEn: 'Why Us Section (Headings)',
    fields: [
      { section: 'whyUs', key: 'badge',    labelAr: 'الشارة',      labelEn: 'Badge',    def: { ar: t.ar.whyUs.badge,    en: t.en.whyUs.badge } },
      { section: 'whyUs', key: 'title',    labelAr: 'العنوان',     labelEn: 'Title',    def: { ar: t.ar.whyUs.title,    en: t.en.whyUs.title } },
      { section: 'whyUs', key: 'subtitle', labelAr: 'النص الفرعي', labelEn: 'Subtitle', multiline: true, def: { ar: t.ar.whyUs.subtitle, en: t.en.whyUs.subtitle } },
    ],
  },
  {
    id: 'clients',
    titleAr: 'قسم: عملاؤنا',
    titleEn: 'Clients Section',
    fields: [
      { section: 'clients', key: 'badge', labelAr: 'الشارة',  labelEn: 'Badge', def: { ar: t.ar.clients.badge, en: t.en.clients.badge } },
      { section: 'clients', key: 'title', labelAr: 'العنوان', labelEn: 'Title', def: { ar: t.ar.clients.title, en: t.en.clients.title } },
      { section: 'clients', key: 'body',  labelAr: 'النص',    labelEn: 'Body',  multiline: true, def: { ar: t.ar.clients.body, en: t.en.clients.body } },
      { section: 'clients', key: 'show_bg', labelAr: 'إظهار صورة الخلفية', labelEn: 'Show background photo', def: { ar: '1', en: '1' } },
    ],
  },
  {
    id: 'partners',
    titleAr: 'قسم: شركاء النجاح (العناوين)',
    titleEn: 'Partners Section (Headings)',
    fields: [
      { section: 'partners', key: 'badge',    labelAr: 'الشارة',      labelEn: 'Badge',    def: { ar: t.ar.partners.badge,    en: t.en.partners.badge } },
      { section: 'partners', key: 'title',    labelAr: 'العنوان',     labelEn: 'Title',    def: { ar: t.ar.partners.title,    en: t.en.partners.title } },
      { section: 'partners', key: 'subtitle', labelAr: 'النص الفرعي', labelEn: 'Subtitle', multiline: true, def: { ar: t.ar.partners.subtitle, en: t.en.partners.subtitle } },
    ],
  },
  {
    id: 'contact',
    titleAr: 'نموذج التواصل',
    titleEn: 'Contact Form',
    fields: [
      { section: 'contact', key: 'badge',              labelAr: 'الشارة',                labelEn: 'Badge',              def: { ar: t.ar.contact.badge,              en: t.en.contact.badge } },
      { section: 'contact', key: 'title',              labelAr: 'العنوان',               labelEn: 'Title',              def: { ar: t.ar.contact.title,              en: t.en.contact.title } },
      { section: 'contact', key: 'subtitle',           labelAr: 'النص الفرعي',           labelEn: 'Subtitle',           multiline: true, def: { ar: t.ar.contact.subtitle,           en: t.en.contact.subtitle } },
      { section: 'contact', key: 'namePlaceholder',    labelAr: 'حقل الاسم',             labelEn: 'Name field',         def: { ar: t.ar.contact.namePlaceholder,    en: t.en.contact.namePlaceholder } },
      { section: 'contact', key: 'phonePlaceholder',   labelAr: 'حقل الجوال',            labelEn: 'Phone field',        def: { ar: t.ar.contact.phonePlaceholder,   en: t.en.contact.phonePlaceholder } },
      { section: 'contact', key: 'emailPlaceholder',   labelAr: 'حقل البريد',            labelEn: 'Email field',        def: { ar: t.ar.contact.emailPlaceholder,   en: t.en.contact.emailPlaceholder } },
      { section: 'contact', key: 'messagePlaceholder', labelAr: 'حقل الرسالة',           labelEn: 'Message field',      def: { ar: t.ar.contact.messagePlaceholder, en: t.en.contact.messagePlaceholder } },
      { section: 'contact', key: 'send',               labelAr: 'زر الإرسال',            labelEn: 'Send button',        def: { ar: t.ar.contact.send,               en: t.en.contact.send } },
      { section: 'contact', key: 'sending',            labelAr: 'نص أثناء الإرسال',      labelEn: 'Sending text',       def: { ar: t.ar.contact.sending,            en: t.en.contact.sending } },
      { section: 'contact', key: 'success',            labelAr: 'رسالة النجاح',          labelEn: 'Success message',    multiline: true, def: { ar: t.ar.contact.success,            en: t.en.contact.success } },
      { section: 'contact', key: 'error',              labelAr: 'رسالة الخطأ',           labelEn: 'Error message',      multiline: true, def: { ar: t.ar.contact.error,              en: t.en.contact.error } },
      { section: 'contact', key: 'mapTitle',           labelAr: 'عنوان الخريطة',         labelEn: 'Map title',          def: { ar: t.ar.contact.mapTitle,           en: t.en.contact.mapTitle } },
      { section: 'hero', key: 'phone',   labelAr: 'رقم الهاتف (بطاقات التواصل)', labelEn: 'Phone (contact cards)',  def: { ar: t.ar.contact.phone,   en: t.en.contact.phone } },
      { section: 'hero', key: 'email',   labelAr: 'البريد (بطاقات التواصل)',    labelEn: 'Email (contact cards)',  def: { ar: t.ar.contact.email,   en: t.en.contact.email } },
      { section: 'hero', key: 'hours',   labelAr: 'ساعات العمل (بطاقة التواصل)', labelEn: 'Working hours (contact card)', def: { ar: t.ar.contact.hours, en: t.en.contact.hours } },
    ],
  },
  {
    id: 'goals',
    titleAr: 'قسم: أهدافنا الاستراتيجية (العناوين)',
    titleEn: 'Strategic Goals (Headings)',
    fields: [
      { section: 'goals', key: 'badge',    labelAr: 'الشارة',      labelEn: 'Badge',    def: { ar: t.ar.goals.badge,    en: t.en.goals.badge } },
      { section: 'goals', key: 'title',    labelAr: 'العنوان',     labelEn: 'Title',    def: { ar: t.ar.goals.title,    en: t.en.goals.title } },
      { section: 'goals', key: 'subtitle', labelAr: 'النص الفرعي', labelEn: 'Subtitle', multiline: true, def: { ar: t.ar.goals.subtitle, en: t.en.goals.subtitle } },
    ],
  },
  {
    id: 'team',
    titleAr: 'قسم: فريقنا',
    titleEn: 'Team Section',
    fields: [
      { section: 'team', key: 'badge', labelAr: 'الشارة',  labelEn: 'Badge', def: { ar: t.ar.team.badge, en: t.en.team.badge } },
      { section: 'team', key: 'title', labelAr: 'العنوان', labelEn: 'Title', def: { ar: t.ar.team.title, en: t.en.team.title } },
      { section: 'team', key: 'body',  labelAr: 'النص',    labelEn: 'Body',  multiline: true, def: { ar: t.ar.team.body, en: t.en.team.body } },
      { section: 'team', key: 'specTitle', labelAr: 'عنوان «مجالات تخصصنا»', labelEn: 'Specializations heading', def: { ar: 'مجالات تخصصنا', en: 'Our Specializations' } },
    ],
  },
  {
    id: 'closing',
    titleAr: 'الاقتباس الختامي',
    titleEn: 'Closing Statement',
    fields: [
      { section: 'closing', key: 'quote',  labelAr: 'الاقتباس', labelEn: 'Quote', multiline: true, def: { ar: t.ar.closing.quote, en: t.en.closing.quote } },
      { section: 'closing', key: 'author', labelAr: 'الاسم',    labelEn: 'Author', def: { ar: t.ar.closing.author, en: t.en.closing.author } },
      { section: 'closing', key: 'role',   labelAr: 'الصفة',    labelEn: 'Role',   def: { ar: t.ar.closing.role,   en: t.en.closing.role } },
      { section: 'closing', key: 'show_bg', labelAr: 'إظهار صورة الخلفية', labelEn: 'Show background photo', def: { ar: '1', en: '1' } },
      { section: 'closing', key: 'show_portrait', labelAr: 'إظهار الصورة بجانب الاسم', labelEn: 'Show portrait near name', def: { ar: '0', en: '0' } },
    ],
  },
  {
    id: 'footer',
    titleAr: 'التذييل',
    titleEn: 'Footer',
    fields: [
      { section: 'footer', key: 'phone',   labelAr: 'رقم الهاتف',        labelEn: 'Phone number',  def: { ar: t.ar.contact.phone,   en: t.en.contact.phone } },
      { section: 'footer', key: 'email',   labelAr: 'البريد الإلكتروني', labelEn: 'Email address', def: { ar: t.ar.contact.email,   en: t.en.contact.email } },
      { section: 'footer', key: 'address', labelAr: 'العنوان',           labelEn: 'Address',       multiline: true, def: { ar: t.ar.contact.address, en: t.en.contact.address } },
      { section: 'footer', key: 'whatsapp', labelAr: 'رابط واتساب', labelEn: 'WhatsApp link', def: { ar: 'https://api.whatsapp.com/send/?phone=966148444555&text&type=phone_number&app_absent=0', en: 'https://api.whatsapp.com/send/?phone=966148444555&text&type=phone_number&app_absent=0' } },
      { section: 'footer', key: 'tagline', labelAr: 'الجملة في التذييل (وسط التذييل)', labelEn: 'Footer tagline (centered)', multiline: true, def: { ar: t.ar.footer.tagline, en: t.en.footer.tagline } },
      { section: 'footer', key: 'officeName', labelAr: 'اسم المكتب (سطر حقوق النشر)', labelEn: 'Office name (copyright line)', def: { ar: 'مكتب د. طلحة غوث للمحاماة والاستشارات القانونية.', en: 'Dr. Talha Ghawth Law Office.' } },
      { section: 'footer', key: 'rights',  labelAr: 'حقوق النشر', labelEn: 'Rights', def: { ar: t.ar.footer.rights, en: t.en.footer.rights } },
    ],
  },
  {
    id: 'chat',
    titleAr: 'المساعد الذكي',
    titleEn: 'Chat Assistant',
    fields: [
      { section: 'chat', key: 'title',       labelAr: 'العنوان',          labelEn: 'Title',       def: { ar: t.ar.chat.title,       en: t.en.chat.title } },
      { section: 'chat', key: 'subtitle',    labelAr: 'النص الفرعي',      labelEn: 'Subtitle',    def: { ar: t.ar.chat.subtitle,    en: t.en.chat.subtitle } },
      { section: 'chat', key: 'placeholder', labelAr: 'نص حقل الكتابة',   labelEn: 'Placeholder', def: { ar: t.ar.chat.placeholder, en: t.en.chat.placeholder } },
      { section: 'chat', key: 'welcome',     labelAr: 'رسالة الترحيب',    labelEn: 'Welcome',     multiline: true, def: { ar: t.ar.chat.welcome,     en: t.en.chat.welcome } },
    ],
  },
]

// Flat list for quick iteration / saving.
export const ALL_FIELDS: ScalarField[] = FIELD_GROUPS.flatMap(g => expandFieldsWithLinks(g.fields))

export function defaultFor(section: string, key: string, lang: Lang): string {
  const f = ALL_FIELDS.find(x => x.section === section && x.key === key)
  return f ? f.def[lang] : ''
}

// ── Repeating list sections (stored in content_items) ──
export type ListVariant = 'card' | 'stat' | 'chip'

export type ListSection = {
  section: string
  titleAr: string
  titleEn: string
  hintAr: string
  hasDesc: boolean
  variant: ListVariant
  recommendedIcons: string[]
  addLabelAr: string
}

/** Each admin accordion group can have one or more list editors (cards, stats, chips). */
export const GROUP_INLINE_LISTS: Record<string, string[]> = {
  hero:     ['hero_stats'],
  about:    ['about_pillars'],
  services: ['services'],
  whyUs:    ['whyUs'],
  goals:    ['goals'],
  team:     ['team_specializations'],
  clients:  ['clients_stats', 'clients_sectors'],
}

export function listSectionsForGroup(groupId: string): ListSection[] {
  const keys = GROUP_INLINE_LISTS[groupId] ?? []
  return LIST_SECTIONS.filter(s => keys.includes(s.section))
}

export type DefaultListItem = {
  title_ar: string
  title_en: string
  desc_ar: string
  desc_en: string
  icon: string | null
}

// Bilingual seed/fallback data for each repeating list, derived from translations.
// Used by the admin "import defaults" action and the server seed endpoint.
export function defaultListItems(section: string): DefaultListItem[] {
  switch (section) {
    case 'services':
      return t.ar.services.items.map((it, i) => ({
        title_ar: it.title, title_en: t.en.services.items[i]?.title ?? '',
        desc_ar: it.desc, desc_en: t.en.services.items[i]?.desc ?? '',
        icon: it.icon ?? null,
      }))
    case 'whyUs':
      return t.ar.whyUs.items.map((it, i) => ({
        title_ar: it.title, title_en: t.en.whyUs.items[i]?.title ?? '',
        desc_ar: it.desc, desc_en: t.en.whyUs.items[i]?.desc ?? '',
        icon: it.icon ?? null,
      }))
    case 'goals':
      return t.ar.goals.items.map((it, i) => ({
        title_ar: it.title, title_en: t.en.goals.items[i]?.title ?? '',
        desc_ar: it.desc, desc_en: t.en.goals.items[i]?.desc ?? '',
        icon: ['Award', 'UserCheck', 'Lightbulb', 'TrendingUp', 'BookOpen', 'Brain', 'Gem'][i] ?? null,
      }))
    case 'team_specializations':
      return t.ar.team.specializations.map((label, i) => ({
        title_ar: label, title_en: t.en.team.specializations[i] ?? '',
        desc_ar: '', desc_en: '', icon: ['Building2', 'Landmark', 'Scroll', 'Users', 'Gavel', 'TrendingUp'][i] ?? null,
      }))
    case 'clients_sectors':
      return t.ar.clients.sectors.map((s, i) => ({
        title_ar: s.label, title_en: t.en.clients.sectors[i]?.label ?? '',
        desc_ar: '', desc_en: '', icon: s.icon ?? null,
      }))
    case 'hero_stats':
      return [
        { title_ar: '15+', title_en: '15+', desc_ar: t.ar.hero.stat1, desc_en: t.en.hero.stat1, icon: null },
        { title_ar: '500+', title_en: '500+', desc_ar: t.ar.hero.stat2, desc_en: t.en.hero.stat2, icon: null },
        { title_ar: '1000+', title_en: '1000+', desc_ar: t.ar.hero.stat3, desc_en: t.en.hero.stat3, icon: null },
      ]
    case 'clients_stats':
      return [
        { title_ar: '500+', title_en: '500+', desc_ar: 'عميل راضٍ', desc_en: 'Satisfied Clients', icon: null },
        { title_ar: '8+', title_en: '8+', desc_ar: 'قطاعات خدمية', desc_en: 'Service Sectors', icon: null },
        { title_ar: '15+', title_en: '15+', desc_ar: 'سنة خبرة', desc_en: 'Years Experience', icon: null },
        { title_ar: '100%', title_en: '100%', desc_ar: 'سرية تامة', desc_en: 'Full Confidentiality', icon: null },
      ]
    case 'about_pillars':
      return [
        { title_ar: 'الثقة والأمانة', title_en: 'Trust & Integrity', desc_ar: '', desc_en: '', icon: 'ShieldCheck' },
        { title_ar: 'الاحترافية العالية', title_en: 'High Professionalism', desc_ar: '', desc_en: '', icon: 'Award' },
        { title_ar: 'الشفافية التامة', title_en: 'Complete Transparency', desc_ar: '', desc_en: '', icon: 'ScanEye' },
        { title_ar: 'الحلول المبتكرة', title_en: 'Innovative Solutions', desc_ar: '', desc_en: '', icon: 'Lightbulb' },
      ]
    default:
      return []
  }
}

/** Group API rows by section (sorted). Empty sections start as []. */
export function groupContentItems(rows: ContentItem[]): Record<string, ContentItem[]> {
  const grouped: Record<string, ContentItem[]> = {}
  for (const s of LIST_SECTIONS) grouped[s.section] = []
  for (const it of rows) {
    ;(grouped[it.section] ??= []).push(it)
  }
  for (const s of LIST_SECTIONS) {
    grouped[s.section].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  }
  return grouped
}

/** Sections with no rows in the database (site still shows translation fallbacks). */
export function emptyListSections(grouped: Record<string, ContentItem[]>): string[] {
  return LIST_SECTIONS.filter(s => !(grouped[s.section]?.length)).map(s => s.section)
}

/** Build grouped state from DB, or translation defaults when a section is empty (admin preview). */
export function groupContentItemsWithDefaults(rows: ContentItem[]): Record<string, ContentItem[]> {
  const grouped = groupContentItems(rows)
  for (const s of LIST_SECTIONS) {
    if (grouped[s.section].length) continue
    grouped[s.section] = defaultListItems(s.section).map((it, i) => ({
      section: s.section,
      title_ar: it.title_ar,
      title_en: it.title_en,
      desc_ar: it.desc_ar,
      desc_en: it.desc_en,
      icon: it.icon,
      sort_order: i,
      active: true,
    }))
  }
  return grouped
}

/** Template for a newly added list row (same card/stat/chip shape as existing items). */
export function newListItemTemplate(
  section: string,
  order: number,
  existing: ContentItem[],
): Omit<ContentItem, 'id' | 'created_at'> {
  const meta = LIST_SECTIONS.find(s => s.section === section)
  const defaults = defaultListItems(section)
  const last = existing[existing.length - 1]

  if (last) {
    return {
      section,
      title_ar: '',
      title_en: '',
      desc_ar: '',
      desc_en: '',
      icon: last.icon ?? defaults[0]?.icon ?? meta?.recommendedIcons[0] ?? null,
      sort_order: order,
      active: true,
    }
  }

  const sample = defaults[defaults.length - 1] ?? defaults[0]
  if (sample) {
    return { section, ...sample, sort_order: order, active: true }
  }

  const isStat = meta?.variant === 'stat'
  const isChip = meta?.variant === 'chip'
  return {
    section,
    title_ar: isStat ? '0+' : isChip ? 'عنوان جديد' : 'بطاقة جديدة',
    title_en: isStat ? '0+' : isChip ? 'New item' : 'New card',
    desc_ar: isStat ? 'وصف' : '',
    desc_en: isStat ? 'Description' : '',
    icon: meta?.recommendedIcons[0] ?? null,
    sort_order: order,
    active: true,
  }
}

export const LIST_SECTIONS: ListSection[] = [
  {
    section: 'hero_stats',
    titleAr: 'إحصائيات الواجهة الرئيسية',
    titleEn: 'Hero Statistics',
    hintAr: 'كل عنصر: الرقم الكبير (15+) في «العنوان»، والوصف (سنة خبرة) في «الوصف». يمكنك إضافة أو حذف إحصائيات.',
    hasDesc: true,
    variant: 'stat',
    addLabelAr: 'إضافة إحصائية جديدة',
    recommendedIcons: [],
  },
  {
    section: 'about_pillars',
    titleAr: 'ركائز «من نحن»',
    titleEn: 'About Pillars',
    hintAr: 'المربعات الصغيرة بجانب النص (عنوان + أيقونة).',
    hasDesc: false,
    variant: 'chip',
    addLabelAr: 'إضافة ركيزة جديدة',
    recommendedIcons: ['ShieldCheck', 'Award', 'ScanEye', 'Lightbulb', 'Target', 'Handshake'],
  },
  {
    section: 'services',
    titleAr: 'بطاقات الخدمات',
    titleEn: 'Service Cards',
    hintAr: 'كل بطاقة تظهر في قسم «خدماتنا» بعنوان ووصف وأيقونة.',
    hasDesc: true,
    variant: 'card',
    addLabelAr: 'إضافة بطاقة خدمة',
    recommendedIcons: ['Building2', 'Landmark', 'Scale', 'Users', 'FileText', 'ShieldCheck'],
  },
  {
    section: 'whyUs',
    titleAr: 'بطاقات «لماذا نحن»',
    titleEn: 'Why Us Cards',
    hintAr: 'مميزات المكتب التي تظهر في قسم «لماذا نحن».',
    hasDesc: true,
    variant: 'card',
    addLabelAr: 'إضافة بطاقة',
    recommendedIcons: ['Target', 'Eye', 'Brain', 'Zap', 'Lock', 'Award', 'Handshake'],
  },
  {
    section: 'clients_stats',
    titleAr: 'أرقام قسم «عملاؤنا»',
    titleEn: 'Client Section Stats',
    hintAr: 'الأرقام الكبيرة في قسم عملاؤنا (500+، 15+، إلخ). الرقم في «العنوان»، الوصف في «الوصف».',
    hasDesc: true,
    variant: 'stat',
    addLabelAr: 'إضافة رقم إحصائي',
    recommendedIcons: [],
  },
  {
    section: 'clients_sectors',
    titleAr: 'القطاعات التي نخدمها',
    titleEn: 'Client Sectors',
    hintAr: 'القطاعات التي تظهر في قسم «عملاؤنا» (عنوان وأيقونة فقط).',
    hasDesc: false,
    variant: 'chip',
    addLabelAr: 'إضافة قطاع',
    recommendedIcons: ['Crown', 'Users', 'Landmark', 'GitBranch', 'Briefcase', 'Globe', 'Hotel', 'BarChart2'],
  },
  {
    section: 'team_specializations',
    titleAr: 'مجالات تخصص الفريق',
    titleEn: 'Team Specializations',
    hintAr: 'التخصصات التي تظهر في قسم «فريقنا» (عنوان وأيقونة فقط).',
    hasDesc: false,
    variant: 'chip',
    addLabelAr: 'إضافة تخصص',
    recommendedIcons: ['Building2', 'Landmark', 'Scroll', 'Users', 'Gavel', 'TrendingUp'],
  },
  {
    section: 'goals',
    titleAr: 'بطاقات الأهداف الاستراتيجية',
    titleEn: 'Strategic Goal Cards',
    hintAr: 'الأهداف التي تظهر في قسم «أهدافنا الاستراتيجية».',
    hasDesc: true,
    variant: 'card',
    addLabelAr: 'إضافة بطاقة هدف',
    recommendedIcons: ['Award', 'UserCheck', 'Lightbulb', 'TrendingUp', 'BookOpen', 'Brain', 'Gem'],
  },
]

// ─── Homepage section ordering ───────────────────────────────────────────────

export type HomepageSectionDef = {
  id: string
  titleAr: string
  titleEn: string
  defaultOrder: number
  defaultVisible: boolean
}

export const HOMEPAGE_SECTIONS: HomepageSectionDef[] = [
  { id: 'hero',          titleAr: 'الواجهة الرئيسية',     titleEn: 'Hero',              defaultOrder: 1,  defaultVisible: true },
  { id: 'about',         titleAr: 'من نحن',               titleEn: 'About',             defaultOrder: 2,  defaultVisible: true },
  { id: 'visionMission', titleAr: 'رؤية ورسالة',          titleEn: 'Vision & Mission',  defaultOrder: 3,  defaultVisible: true },
  { id: 'services',      titleAr: 'خدماتنا',              titleEn: 'Services',          defaultOrder: 4,  defaultVisible: true },
  { id: 'whyUs',         titleAr: 'لماذا نحن',            titleEn: 'Why Us',            defaultOrder: 5,  defaultVisible: true },
  { id: 'clients',       titleAr: 'عملاؤنا',              titleEn: 'Clients',           defaultOrder: 6,  defaultVisible: true },
  { id: 'partners',      titleAr: 'شركاء النجاح',         titleEn: 'Partners',          defaultOrder: 7,  defaultVisible: true },
  { id: 'contact',       titleAr: 'تواصل معنا',           titleEn: 'Contact',           defaultOrder: 8,  defaultVisible: true },
  { id: 'goals',         titleAr: 'أهدافنا الاستراتيجية', titleEn: 'Strategic Goals',   defaultOrder: 9,  defaultVisible: true },
  { id: 'team',          titleAr: 'فريقنا',               titleEn: 'Team',              defaultOrder: 10, defaultVisible: true },
  { id: 'closing',       titleAr: 'الاقتباس الختامي',     titleEn: 'Closing Statement', defaultOrder: 11, defaultVisible: true },
]

export function defaultHomepageLayout(): { id: string; order: number; visible: boolean }[] {
  return HOMEPAGE_SECTIONS.map(s => ({
    id: s.id,
    order: s.defaultOrder,
    visible: s.defaultVisible,
  }))
}

export function parseHomepageLayout(raw: string): { id: string; order: number; visible: boolean }[] {
  const defaults = defaultHomepageLayout()
  if (!raw.trim()) return defaults.sort((a, b) => a.order - b.order)
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return defaults.sort((a, b) => a.order - b.order)
    const map = new Map<string, { order: number; visible: boolean }>()
    for (const entry of parsed) {
      if (entry && typeof entry === 'object' && 'id' in entry) {
        const id = String((entry as { id: unknown }).id)
        const order = Number((entry as { order?: unknown }).order)
        const visible = (entry as { visible?: unknown }).visible !== false
        if (HOMEPAGE_SECTIONS.some(s => s.id === id)) {
          map.set(id, { order: Number.isFinite(order) ? order : 99, visible })
        }
      }
    }
    return HOMEPAGE_SECTIONS.map(s => {
      const o = map.get(s.id)
      return {
        id: s.id,
        order: o?.order ?? s.defaultOrder,
        visible: o?.visible ?? s.defaultVisible,
      }
    }).sort((a, b) => a.order - b.order)
  } catch {
    return defaults.sort((a, b) => a.order - b.order)
  }
}

export function serializeHomepageLayout(
  layout: { id: string; order: number; visible: boolean }[],
): string {
  return JSON.stringify(layout.map(({ id, order, visible }) => ({ id, order, visible })))
}
