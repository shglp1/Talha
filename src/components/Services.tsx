'use client'
import {
  Building2, Landmark, Scale, Users, FileText, ShieldCheck,
} from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const ICON_MAP: Record<string, React.ElementType> = {
  Building2, Landmark, Scale, Users, FileText, ShieldCheck,
}

export default function Services({ lang }: { lang: Lang }) {
  const tr = t[lang]
  useScrollReveal()

  return (
    <section id="services" className="section-padding" style={{ background: 'var(--surface)' }} dir={tr.dir}>
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="section-badge mb-6 inline-flex">{tr.services.badge}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">{tr.services.title}</h2>
          <div className="gold-divider mb-6" />
          <p className="text-cream-muted text-lg max-w-2xl mx-auto">{tr.services.subtitle}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tr.services.items.map((item, i) => {
            const Icon = ICON_MAP[item.icon] ?? Scale
            return (
              <div
                key={item.title}
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
      </div>
    </section>
  )
}
