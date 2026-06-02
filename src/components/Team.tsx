'use client'
import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function Team({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const isAr = lang === 'ar'
  useScrollReveal()

  return (
    <section id="team" className="section-padding bg-obsidian relative overflow-hidden" dir={tr.dir}>
      {/* Subtle gold glow */}
      <div className="absolute top-0 start-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gold/5 blur-[80px] pointer-events-none" />

      <div className="relative z-10 section-container">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center`}>
          {/* Text side */}
          <div className={`reveal ${isAr ? 'reveal-left' : 'reveal-right'}`}>
            <span className="section-badge mb-6 inline-flex">{tr.team.badge}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight">{tr.team.title}</h2>
            <div className="gold-divider-start mb-7" />
            <p className="text-cream-muted text-base leading-relaxed mb-8">{tr.team.body}</p>

            {/* Specializations */}
            <h4 className="text-cream font-semibold mb-4 text-sm uppercase tracking-wider">
              {isAr ? 'تخصصاتنا' : 'Our Specializations'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tr.team.specializations.map(s => (
                <div key={s} className="flex items-center gap-3 bg-obsidian-card border border-obsidian-border rounded-lg px-4 py-3">
                  <CheckCircle2 size={16} className="text-gold flex-shrink-0" />
                  <span className="text-sm text-cream-muted">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image side */}
          <div className={`reveal ${isAr ? 'reveal-right' : 'reveal-left'}`}>
            <div className="relative">
              {/* Team consultation image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9]">
                <Image
                  src="/assets/consultation.jpg"
                  alt={isAr ? 'فريق المحامين' : 'Legal team'}
                  fill
                  quality={90}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
              </div>

              {/* Floating digital-law image */}
              <div className={`absolute -bottom-8 ${isAr ? '-left-6' : '-right-6'} w-36 h-44 rounded-xl overflow-hidden border-2 border-obsidian-border shadow-2xl`}>
                <Image
                  src="/assets/digital-law.jpg"
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
