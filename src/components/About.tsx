'use client'
import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const PILLARS = {
  ar: ['الثقة والأمانة', 'الاحترافية العالية', 'الشفافية التامة', 'الحلول المبتكرة'],
  en: ['Trust & Integrity', 'High Professionalism', 'Complete Transparency', 'Innovative Solutions'],
}

export default function About({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const isAr = lang === 'ar'
  useScrollReveal()

  return (
    <section id="about" className="section-padding bg-obsidian" dir={tr.dir}>
      <div className="section-container">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${isAr ? '' : ''}`}>
          {/* Image side */}
          <div className={`reveal ${isAr ? 'reveal-right order-last lg:order-first' : 'reveal-left'}`}>
            <div className="relative">
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] max-h-[600px]">
                <Image
                  src="/assets/team-lawyer.jpg"
                  alt={isAr ? 'محامي متخصص' : 'Specialist Lawyer'}
                  fill
                  quality={90}
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
              </div>

              {/* Floating accent card */}
              <div className={`absolute -bottom-6 ${isAr ? '-left-6' : '-right-6'} bg-obsidian-card border border-obsidian-border rounded-xl p-5 shadow-2xl backdrop-blur-sm max-w-[200px]`}>
                <div className="text-4xl font-black text-gold-gradient leading-none">15+</div>
                <div className="text-xs text-cream-muted mt-1">
                  {isAr ? 'سنوات من الخبرة القانونية المتخصصة' : 'Years of specialized legal expertise'}
                </div>
              </div>

              {/* Gold corner accent */}
              <div className={`absolute -top-3 ${isAr ? '-right-3' : '-left-3'} w-16 h-16 border-t-2 border-gold ${isAr ? 'border-r-2' : 'border-l-2'} rounded-tl-none`} />
            </div>
          </div>

          {/* Text side */}
          <div className={`reveal ${isAr ? 'reveal-left order-first lg:order-last' : 'reveal-right'}`}>
            <span className="section-badge mb-6 inline-flex">{tr.about.badge}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight">
              {tr.about.title}
            </h2>
            <div className="gold-divider-start mb-8" />

            <div className="space-y-4 text-cream-muted text-base leading-relaxed mb-8">
              <p>{tr.about.body1}</p>
              <p>{tr.about.body2}</p>
              <p>{tr.about.body3}</p>
            </div>

            {/* Pillars */}
            <div className="grid grid-cols-2 gap-3">
              {PILLARS[lang].map(pillar => (
                <div key={pillar} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-gold flex-shrink-0" />
                  <span className="text-sm font-medium text-cream">{pillar}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a href="#contact" className="btn-gold">
                {tr.nav.contact}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
