'use client'
import { Target } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useContent } from '@/components/ContentProvider'
import { getIcon } from '@/lib/iconMap'
import SectionExtras from '@/components/SectionExtras'
import { cmsField, cmsItemPart } from '@/lib/cms-attrs'

export default function WhyUs({ lang }: { lang: Lang }) {
  const tr = t[lang]
  useScrollReveal()
  const { ov, list, hidden, enabled, itemHideDesc } = useContent()

  const showSectionDesc = enabled('whyUs', 'show_card_desc', true)

  const items = list(
    'whyUs',
    tr.whyUs.items.map(s => ({ title: s.title, desc: s.desc, icon: s.icon })),
  )

  return (
    <section id="whyus" className="section-padding bg-obsidian" dir={tr.dir}>
      <div className="section-container">
        <div className="text-center mb-12 sm:mb-16 reveal">
          {!hidden('whyUs', 'badge') && <span className="section-badge mb-6 inline-flex" {...cmsField('whyUs', 'badge')}>{ov('whyUs', 'badge', tr.whyUs.badge)}</span>}
          {!hidden('whyUs', 'title') && <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4" {...cmsField('whyUs', 'title')}>{ov('whyUs', 'title', tr.whyUs.title)}</h2>}
          <div className="gold-divider mb-6" />
          {!hidden('whyUs', 'subtitle') && <p className="text-cream-muted text-base sm:text-lg max-w-2xl mx-auto" {...cmsField('whyUs', 'subtitle')}>{ov('whyUs', 'subtitle', tr.whyUs.subtitle)}</p>}
        </div>

        {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map((item, i) => {
            const Icon = getIcon(item.icon) ?? Target
            const showDesc = showSectionDesc && !itemHideDesc(item.id) && Boolean(item.desc?.trim())
            return (
              <article
                key={item.id ?? item.title}
                className={`group relative reveal rounded-2xl bg-white border border-obsidian-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(26,22,15,0.10)] hover:border-gold/40 ${showDesc ? 'p-6 sm:p-7' : 'p-4 sm:p-5'}`}
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                <span className="absolute top-0 bottom-0 start-0 w-1 bg-gradient-to-b from-gold to-gold-dark scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />

                {showDesc ? (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold-soft border border-gold/25 flex items-center justify-center flex-shrink-0 group-hover:bg-gold group-hover:border-gold transition-colors duration-300">
                      <Icon size={22} className="text-gold-dark group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-black text-gold/50 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                        <h3 className="text-base sm:text-lg font-bold text-cream" {...cmsItemPart(item.id, 'title')}>{item.title}</h3>
                      </div>
                      <p className="text-cream-muted text-sm leading-relaxed" {...cmsItemPart(item.id, 'desc')}>{item.desc}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gold-soft border border-gold/25 flex items-center justify-center flex-shrink-0 group-hover:bg-gold group-hover:border-gold transition-colors duration-300">
                      <Icon size={20} className="text-gold-dark group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-black text-gold/50 tabular-nums flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="text-base sm:text-lg font-bold text-cream leading-snug" {...cmsItemPart(item.id, 'title')}>{item.title}</h3>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
        )}

        <SectionExtras section="whyUs" />
      </div>
    </section>
  )
}
