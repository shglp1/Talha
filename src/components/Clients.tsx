'use client'
import { Crown, Users, Landmark, GitBranch, Briefcase, Globe, Hotel, BarChart2 } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const ICON_MAP: Record<string, React.ElementType> = {
  Crown, Users, Landmark, GitBranch, Briefcase, Globe, Hotel, BarChart2,
}

export default function Clients({ lang }: { lang: Lang }) {
  const tr = t[lang]
  useScrollReveal()

  return (
    <section id="clients" className="section-padding" style={{ background: 'var(--surface)' }} dir={tr.dir}>
      <div className="section-container">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="reveal">
            <span className="section-badge mb-6 inline-flex">{tr.clients.badge}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">{tr.clients.title}</h2>
            <div className="gold-divider-start mb-6" />
            <p className="text-cream-muted text-base leading-relaxed">{tr.clients.body}</p>
          </div>
          {/* Decorative stat */}
          <div className="reveal grid grid-cols-2 gap-4">
            {[
              { n: '500+', label: lang === 'ar' ? 'عميل راضٍ' : 'Satisfied Clients' },
              { n: '8+',   label: lang === 'ar' ? 'قطاعات خدمية' : 'Service Sectors' },
              { n: '15+',  label: lang === 'ar' ? 'سنة خبرة' : 'Years Experience' },
              { n: '100%', label: lang === 'ar' ? 'سرية تامة' : 'Full Confidentiality' },
            ].map(s => (
              <div key={s.label} className="glass-card p-6 text-center">
                <div className="text-3xl font-black text-gold-gradient mb-1">{s.n}</div>
                <div className="text-xs text-cream-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Client sectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {tr.clients.sectors.map((sector, i) => {
            const Icon = ICON_MAP[sector.icon] ?? Users
            return (
              <div
                key={sector.label}
                className="glass-card p-6 text-center reveal group"
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 group-hover:border-gold/40 transition-all">
                  <Icon size={20} className="text-gold" />
                </div>
                <p className="text-sm font-medium text-cream-muted group-hover:text-cream transition-colors">{sector.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
