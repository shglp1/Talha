'use client'
import { Users } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useContent } from '@/components/ContentProvider'
import { getIcon } from '@/lib/iconMap'

export default function Clients({ lang }: { lang: Lang }) {
  const tr = t[lang]
  useScrollReveal()
  const { ov, list, hidden } = useContent()

  const sectors = list(
    'clients_sectors',
    tr.clients.sectors.map(s => ({ title: s.label, desc: '', icon: s.icon })),
  )

  return (
    <section id="clients" className="section-padding" style={{ background: 'var(--surface)' }} dir={tr.dir}>
      <div className="section-container">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="reveal">
            {!hidden('clients', 'badge') && <span className="section-badge mb-6 inline-flex">{ov('clients', 'badge', tr.clients.badge)}</span>}
            {!hidden('clients', 'title') && <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">{ov('clients', 'title', tr.clients.title)}</h2>}
            <div className="gold-divider-start mb-6" />
            {!hidden('clients', 'body') && <p className="text-cream-muted text-base leading-relaxed">{ov('clients', 'body', tr.clients.body)}</p>}
          </div>
          {/* Decorative stat */}
          <div className="reveal grid grid-cols-2 gap-4">
            {list('clients_stats', [
              { title: '500+', desc: lang === 'ar' ? 'عميل راضٍ' : 'Satisfied Clients', icon: null },
              { title: '8+', desc: lang === 'ar' ? 'قطاعات خدمية' : 'Service Sectors', icon: null },
              { title: '15+', desc: lang === 'ar' ? 'سنة خبرة' : 'Years Experience', icon: null },
              { title: '100%', desc: lang === 'ar' ? 'سرية تامة' : 'Full Confidentiality', icon: null },
            ]).map((s, i) => (
              <div key={s.id ?? `${s.title}-${i}`} className="glass-card p-6 text-center">
                <div className="text-3xl font-black text-gold-gradient mb-1">{s.title}</div>
                <div className="text-xs text-cream-muted">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Client sectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {sectors.map((sector, i) => {
            const Icon = getIcon(sector.icon) ?? Users
            return (
              <div
                key={sector.id ?? `${sector.title}-${i}`}
                className="glass-card p-6 text-center reveal group"
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 group-hover:border-gold/40 transition-all">
                  <Icon size={20} className="text-gold" />
                </div>
                <p className="text-sm font-medium text-cream-muted group-hover:text-cream transition-colors">{sector.title}</p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
