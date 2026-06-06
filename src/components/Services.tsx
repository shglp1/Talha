'use client'
import { Scale } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useContent } from '@/components/ContentProvider'
import { getIcon } from '@/lib/iconMap'
import SectionExtras from '@/components/SectionExtras'

export default function Services({ lang }: { lang: Lang }) {
  const tr = t[lang]
  useScrollReveal()
  const { ov, list, hidden } = useContent()

  const items = list(
    'services',
    tr.services.items.map(s => ({ title: s.title, desc: s.desc, icon: s.icon })),
  )

  return (
    <section id="services" className="section-padding" style={{ background: 'var(--surface)' }} dir={tr.dir}>
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          {!hidden('services', 'badge') && <span className="section-badge mb-6 inline-flex">{ov('services', 'badge', tr.services.badge)}</span>}
          {!hidden('services', 'title') && <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">{ov('services', 'title', tr.services.title)}</h2>}
          <div className="gold-divider mb-6" />
          {!hidden('services', 'subtitle') && <p className="text-cream-muted text-lg max-w-2xl mx-auto">{ov('services', 'subtitle', tr.services.subtitle)}</p>}
        </div>

        {/* Grid */}
        {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = getIcon(item.icon) ?? Scale
            return (
              <div
                key={item.id ?? item.title}
                className="glass-card p-8 reveal group"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-6 group-hover:bg-gold/20 group-hover:border-gold/40 transition-all duration-300">
                  <Icon size={24} className="text-gold" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-cream mb-3">{item.title}</h3>
                <p className="text-cream-muted text-sm leading-relaxed">{item.desc}</p>

                {/* Bottom gold line */}
                <div className="mt-6 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500 rounded-full" />
              </div>
            )
          })}
        </div>
        )}

        <SectionExtras section="services" />
      </div>
    </section>
  )
}
