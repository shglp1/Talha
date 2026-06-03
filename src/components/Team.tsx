'use client'
import { Building2 } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useContent } from '@/components/ContentProvider'
import SitePhoto from '@/components/SitePhoto'
import { getIcon } from '@/lib/iconMap'
import SectionExtras from '@/components/SectionExtras'

// Fallback icon names matching each default specialization, in order.
const SPEC_ICON_NAMES = ['Building2', 'Landmark', 'Scroll', 'Users', 'Gavel', 'TrendingUp']

export default function Team({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const isAr = lang === 'ar'
  useScrollReveal()
  const { ov, list, hidden, photoUrl } = useContent()

  const specializations = list(
    'team_specializations',
    tr.team.specializations.map((s, i) => ({ title: s, desc: '', icon: SPEC_ICON_NAMES[i] ?? 'Building2' })),
  )

  return (
    <section id="team" className="section-padding relative overflow-hidden" style={{ background: 'var(--surface)' }} dir={tr.dir}>
      {/* Subtle gold glow */}
      <div className="absolute top-0 start-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gold/5 blur-[80px] pointer-events-none" />

      <div className="relative z-10 section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text side */}
          <div className={`reveal ${isAr ? 'reveal-left' : 'reveal-right'}`}>
            {!hidden('team', 'badge') && <span className="section-badge mb-6 inline-flex">{ov('team', 'badge', tr.team.badge)}</span>}
            {!hidden('team', 'title') && <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight">{ov('team', 'title', tr.team.title)}</h2>}
            <div className="gold-divider-start mb-7" />
            {!hidden('team', 'body') && <p className="text-cream-muted text-base leading-relaxed mb-8" style={{ textAlign: 'justify' }}>{ov('team', 'body', tr.team.body)}</p>}

            {/* Specializations */}
            <h4 className="text-cream font-bold mb-4 text-sm tracking-wider flex items-center gap-2">
              <span className="w-6 h-px bg-gold" />
              {isAr ? 'مجالات تخصصنا' : 'Our Specializations'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {specializations.map((s, i) => {
                const Icon = getIcon(s.icon) ?? Building2
                return (
                  <div key={s.id ?? `${s.title}-${i}`} className="group flex items-center gap-3 bg-white border border-obsidian-border rounded-xl px-4 py-3 transition-all hover:border-gold/40 hover:shadow-[0_8px_20px_rgba(26,22,15,0.06)]">
                    <span className="w-9 h-9 rounded-lg bg-gold-soft border border-gold/25 flex items-center justify-center flex-shrink-0 group-hover:bg-gold transition-colors">
                      <Icon size={17} className="text-gold-dark group-hover:text-white transition-colors" />
                    </span>
                    <span className="text-sm font-medium text-cream">{s.title}</span>
                  </div>
                )
              })}
            </div>

            <SectionExtras section="team" align="start" />
          </div>

          {/* Image side */}
          <div className={`reveal ${isAr ? 'reveal-right' : 'reveal-left'}`}>
            <div className="relative">
              {/* Team consultation image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
                <SitePhoto
                  src={photoUrl('team-main', '/assets/consultation.jpg')}
                  fallback="/assets/consultation.jpg"
                  alt={isAr ? 'مكتب د. طلحة غوث للمحاماة' : 'Dr. Talha Ghouth Law Office'}
                  fill
                  quality={95}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/30 via-transparent to-transparent" />
              </div>

              {/* Floating digital-law image */}
              <div className={`absolute -bottom-8 ${isAr ? 'left-2 sm:-left-6' : 'right-2 sm:-right-6'} w-28 h-36 sm:w-36 sm:h-44 rounded-xl overflow-hidden border-4 border-white shadow-2xl`}>
                <SitePhoto
                  src={photoUrl('team-floating', '/assets/digital-law.jpg')}
                  fallback="/assets/digital-law.jpg"
                  alt={isAr ? 'الخدمات الرقمية' : 'Digital services'}
                  fill
                  quality={80}
                  className="object-cover"
                />
              </div>

              {/* Corner decoration */}
              <div className={`absolute -top-3 ${isAr ? '-left-3' : '-right-3'} w-16 h-16 border-t-2 border-gold ${isAr ? 'border-l-2' : 'border-r-2'}`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
