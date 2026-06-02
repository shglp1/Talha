'use client'
import { useEffect, useMemo, useState } from 'react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { getIcon } from '@/lib/iconMap'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useContent } from '@/components/ContentProvider'

// Shown until an admin adds real partner logos. Generic, professional wordmarks.
const DEFAULT_PARTNERS: { ar: string; en: string }[] = [
  { ar: 'شركة الرواد', en: 'Al Rawad Co.' },
  { ar: 'مجموعة المدار', en: 'Al Madar Group' },
  { ar: 'بيت الخبرة', en: 'House of Expertise' },
  { ar: 'دار العدالة', en: 'Dar Al Adala' },
  { ar: 'مؤسسة الإتقان', en: 'Al Itqan Est.' },
  { ar: 'مجموعة الصروح', en: 'Al Soroh Group' },
  { ar: 'بيت الأمانة', en: 'Al Amanah House' },
  { ar: 'شركة الاستثمار', en: 'Investment Co.' },
]

function PartnerCard({ name, logo, icon }: { name: string; logo?: string | null; icon?: string | null }) {
  const Icon = getIcon(icon)
  const inner = logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo}
      alt={name}
      loading="lazy"
      className="h-10 sm:h-11 md:h-12 w-auto max-w-[100px] sm:max-w-[120px] md:max-w-[150px] object-contain opacity-100"
    />
  ) : (
    <div className="flex items-center gap-3">
      <span className="w-10 h-10 rounded-full bg-gold-soft border border-gold/30 flex items-center justify-center text-gold-dark font-black text-lg flex-shrink-0">
        {Icon ? <Icon size={20} className="text-gold-dark" /> : name.trim().charAt(0)}
      </span>
      <span className="text-sm font-bold text-cream whitespace-nowrap">{name}</span>
    </div>
  )

  return (
    <div className="group/card mx-2 sm:mx-3 flex items-center justify-center h-16 sm:h-18 md:h-20 min-w-[130px] sm:min-w-[155px] md:min-w-[180px] px-4 sm:px-5 md:px-6 rounded-2xl bg-white border border-obsidian-border shadow-[0_1px_2px_rgba(26,22,15,0.04),0_8px_24px_rgba(26,22,15,0.05)]">
      {inner}
    </div>
  )
}

export default function Partners({ lang }: { lang: Lang }) {
  const tr = t[lang]
  useScrollReveal()
  const { ov, partners } = useContent()
  const [itemsTarget, setItemsTarget] = useState(14)

  // Normalise to a render list (DB partners, else bilingual defaults)
  const base =
    partners.length > 0
      ? partners.map(p => ({ name: p.name, logo: p.logo_url, icon: p.icon }))
      : DEFAULT_PARTNERS.map(p => ({ name: lang === 'ar' ? p.ar : p.en, logo: null, icon: null }))

  // Dynamically target enough cards for large screens so no blank area appears.
  useEffect(() => {
    const calc = () => {
      const estCardWidth = window.innerWidth < 640 ? 142 : window.innerWidth < 1024 ? 168 : 194
      const needed = Math.ceil((window.innerWidth * 1.35) / estCardWidth)
      setItemsTarget(Math.max(14, needed))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const reps = useMemo(() => {
    return Math.max(1, Math.ceil(itemsTarget / Math.max(base.length, 1)))
  }, [itemsTarget, base.length])

  const filled = useMemo(() => Array.from({ length: reps }).flatMap(() => base), [reps, base])
  // Constant visual speed: ~3.5s per item regardless of count.
  const duration = `${filled.length * 3.5}s`

  return (
    <section id="partners" className="section-padding bg-obsidian overflow-hidden" dir={tr.dir}>
      <div className="section-container">
        <div className="text-center mb-12 reveal">
          <span className="section-badge mb-6 inline-flex">{ov('partners', 'badge', tr.partners.badge)}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">{ov('partners', 'title', tr.partners.title)}</h2>
          <div className="gold-divider mb-6" />
          <p className="text-cream-muted text-base sm:text-lg max-w-xl mx-auto">{ov('partners', 'subtitle', tr.partners.subtitle)}</p>
        </div>
      </div>

      {/* Marquee track — full bleed with no clipped edges */}
      <div className="relative reveal w-full overflow-hidden" dir="ltr">
        <div
          className="marquee"
          style={{
            ['--marquee-duration' as string]: duration,
          }}
        >
          <div className="marquee-group py-2">
            {filled.map((p, i) => (
              <PartnerCard key={`a-${i}`} name={p.name} logo={p.logo} icon={p.icon} />
            ))}
          </div>
          <div className="marquee-group py-2" aria-hidden="true">
            {filled.map((p, i) => (
              <PartnerCard key={`b-${i}`} name={p.name} logo={p.logo} icon={p.icon} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
