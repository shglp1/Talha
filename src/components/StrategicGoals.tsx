'use client'
import { Trophy } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useContent } from '@/components/ContentProvider'
import SitePhoto from '@/components/SitePhoto'
import { getIcon } from '@/lib/iconMap'
import SectionExtras from '@/components/SectionExtras'
import { defaultListItems } from '@/lib/contentSchema'

const GOAL_ICONS = ['Award', 'UserCheck', 'Lightbulb', 'TrendingUp', 'BookOpen', 'Brain', 'Gem']

export default function StrategicGoals({ lang }: { lang: Lang }) {
  const tr = t[lang]
  useScrollReveal()
  const { ov, list, photoUrl } = useContent()

  const iconFallback = defaultListItems('goals')
  const items = list(
    'goals',
    tr.goals.items.map((g, i) => ({
      title: g.title,
      desc: g.desc,
      icon: iconFallback[i]?.icon ?? GOAL_ICONS[i] ?? null,
    })),
  )

  return (
    <section className="section-padding relative overflow-hidden bg-obsidian" dir={tr.dir}>
      {/* Subtle background — earth from space, very faint */}
      <div className="absolute inset-0 z-0">
        <SitePhoto
          src={photoUrl('goals-bg', '/assets/global-reach.jpg')}
          fallback="/assets/global-reach.jpg"
          alt=""
          fill
          quality={70}
          className="object-cover object-center opacity-[0.06]"
        />
      </div>

      <div className="relative z-10 section-container">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 reveal">
          <span className="section-badge mb-6 inline-flex">{ov('goals', 'badge', tr.goals.badge)}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">{ov('goals', 'title', tr.goals.title)}</h2>
          <div className="gold-divider mb-6" />
          <p className="text-cream-muted text-base sm:text-lg max-w-2xl mx-auto">{ov('goals', 'subtitle', tr.goals.subtitle)}</p>
        </div>

        {/* Goals grid */}
        {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map((goal, i) => {
            const Icon = getIcon(goal.icon) ?? getIcon(GOAL_ICONS[i]) ?? Trophy
            return (
              <article
                key={goal.id ?? goal.title}
                className="group reveal relative rounded-2xl bg-white border border-obsidian-border p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(26,22,15,0.10)] hover:border-gold/40"
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                {/* Watermark index */}
                <span className="absolute top-4 end-5 text-4xl font-black text-gold/[0.07] leading-none select-none tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="w-12 h-12 rounded-xl bg-gold-soft border border-gold/25 flex items-center justify-center mb-5 group-hover:bg-gold group-hover:border-gold transition-colors duration-300">
                  <Icon size={22} className="text-gold-dark group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-cream mb-2">{goal.title}</h3>
                <p className="text-sm text-cream-muted leading-relaxed">{goal.desc}</p>
              </article>
            )
          })}
        </div>
        )}

        <SectionExtras section="goals" />
      </div>
    </section>
  )
}
