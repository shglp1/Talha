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
import { cmsField, cmsItemPart } from '@/lib/cms-attrs'

const GOAL_ICONS = ['Award', 'UserCheck', 'Lightbulb', 'TrendingUp', 'BookOpen', 'Brain', 'Gem']

export default function StrategicGoals({ lang }: { lang: Lang }) {
  const tr = t[lang]
  useScrollReveal()
  const { ov, list, photoUrl, enabled, itemHideDesc } = useContent()

  const showSectionDesc = enabled('goals', 'show_card_desc', true)

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
    <section id="goals" className="section-padding relative overflow-hidden bg-obsidian" dir={tr.dir}>
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
        <div className="text-center mb-12 sm:mb-16 reveal">
          <span className="section-badge mb-6 inline-flex" {...cmsField('goals', 'badge')}>{ov('goals', 'badge', tr.goals.badge)}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4" {...cmsField('goals', 'title')}>{ov('goals', 'title', tr.goals.title)}</h2>
          <div className="gold-divider mb-6" />
          <p className="text-cream-muted text-base sm:text-lg max-w-2xl mx-auto" {...cmsField('goals', 'subtitle')}>{ov('goals', 'subtitle', tr.goals.subtitle)}</p>
        </div>

        {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map((goal, i) => {
            const Icon = getIcon(goal.icon) ?? getIcon(GOAL_ICONS[i]) ?? Trophy
            const showDesc = showSectionDesc && !itemHideDesc(goal.id) && Boolean(goal.desc?.trim())
            return (
              <article
                key={goal.id ?? goal.title}
                className={`group reveal relative rounded-2xl bg-white border border-obsidian-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(26,22,15,0.10)] hover:border-gold/40 ${showDesc ? 'p-6 sm:p-7' : 'p-4 sm:p-5'}`}
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                <span className="absolute top-4 end-5 text-4xl font-black text-gold/[0.07] leading-none select-none tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {showDesc ? (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-gold-soft border border-gold/25 flex items-center justify-center mb-5 group-hover:bg-gold group-hover:border-gold transition-colors duration-300">
                      <Icon size={22} className="text-gold-dark group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-cream mb-2" {...cmsItemPart(goal.id, 'title')}>{goal.title}</h3>
                    <p className="text-sm text-cream-muted leading-relaxed" {...cmsItemPart(goal.id, 'desc')}>{goal.desc}</p>
                  </>
                ) : (
                  <div className="flex items-center gap-3 pe-8">
                    <div className="w-11 h-11 rounded-xl bg-gold-soft border border-gold/25 flex items-center justify-center flex-shrink-0 group-hover:bg-gold group-hover:border-gold transition-colors duration-300">
                      <Icon size={20} className="text-gold-dark group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-cream leading-snug min-w-0" {...cmsItemPart(goal.id, 'title')}>{goal.title}</h3>
                  </div>
                )}
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
