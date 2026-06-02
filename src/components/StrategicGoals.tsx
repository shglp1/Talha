'use client'
import Image from 'next/image'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function StrategicGoals({ lang }: { lang: Lang }) {
  const tr = t[lang]
  useScrollReveal()

  return (
    <section className="section-padding relative overflow-hidden" style={{ background: 'var(--surface)' }} dir={tr.dir}>
      {/* Background – earth from space */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/global-reach.jpg"
          alt="global reach"
          fill
          quality={75}
          className="object-cover object-center opacity-20"
        />
        <div className="absolute inset-0 bg-obsidian-surface/90" />
      </div>

      <div className="relative z-10 section-container">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="section-badge mb-6 inline-flex">{tr.goals.badge}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">{tr.goals.title}</h2>
          <div className="gold-divider mb-6" />
          <p className="text-cream-muted text-lg max-w-2xl mx-auto">{tr.goals.subtitle}</p>
        </div>

        {/* Goals list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {tr.goals.items.map((goal, i) => (
            <div
              key={goal.title}
              className="flex items-start gap-5 glass-card p-6 reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {/* Gold number */}
              <span className="text-3xl font-black text-gold/30 leading-none flex-shrink-0 w-10 text-center">
                {i + 1}
              </span>
              <div>
                <h3 className="text-base font-bold text-cream mb-1">{goal.title}</h3>
                <p className="text-sm text-cream-muted leading-relaxed">{goal.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
