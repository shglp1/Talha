'use client'
import Image from 'next/image'
import { ShieldCheck } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useContent } from '@/components/ContentProvider'
import { getIcon } from '@/lib/iconMap'

const DEFAULT_PILLARS = {
  ar: [
    { icon: 'ShieldCheck', label: 'الثقة والأمانة' },
    { icon: 'Award', label: 'الاحترافية العالية' },
    { icon: 'ScanEye', label: 'الشفافية التامة' },
    { icon: 'Lightbulb', label: 'الحلول المبتكرة' },
  ],
  en: [
    { icon: 'ShieldCheck', label: 'Trust & Integrity' },
    { icon: 'Award', label: 'High Professionalism' },
    { icon: 'ScanEye', label: 'Complete Transparency' },
    { icon: 'Lightbulb', label: 'Innovative Solutions' },
  ],
}

export default function About({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const isAr = lang === 'ar'
  useScrollReveal()
  const { ov, list } = useContent()

  const pillars = list(
    'about_pillars',
    DEFAULT_PILLARS[lang].map(p => ({ title: p.label, desc: '', icon: p.icon })),
  )

  const yearsValue = ov('about', 'years_value', '15+')
  const yearsCaption = ov(
    'about',
    'years_caption',
    isAr ? 'سنوات من الخبرة القانونية المتخصصة' : 'Years of specialized legal expertise',
  )

  return (
    <section id="about" className="section-padding bg-obsidian" dir={tr.dir}>
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className={`reveal ${isAr ? 'reveal-right order-first lg:order-first' : 'reveal-left'}`}>
            <div className="relative mx-auto max-w-[420px] lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[3/4] shadow-2xl">
                <Image
                  src="/assets/team-lawyer.jpg"
                  alt={isAr ? 'مبنى مكتب القانوني' : 'Law Office Building'}
                  fill
                  quality={90}
                  sizes="(max-width: 1024px) 420px, 50vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 via-transparent to-transparent" />
              </div>

              <div className={`absolute -bottom-5 ${isAr ? '-left-4 sm:-left-6' : '-right-4 sm:-right-6'} bg-white border border-obsidian-border rounded-2xl px-5 py-4 shadow-2xl max-w-[190px]`}>
                <div className="text-4xl font-black text-gold-gradient leading-none" style={{ paddingBottom: '0.08em' }}>{yearsValue}</div>
                <div className="text-xs text-cream-muted mt-1.5 leading-snug">{yearsCaption}</div>
              </div>

              <div className={`absolute -top-3 ${isAr ? '-right-3' : '-left-3'} w-16 h-16 border-t-2 border-gold ${isAr ? 'border-r-2' : 'border-l-2'}`} />
            </div>
          </div>

          <div className={`reveal ${isAr ? 'reveal-left order-last' : 'reveal-right'}`}>
            <span className="section-badge mb-5 inline-flex">{ov('about', 'badge', tr.about.badge)}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight">
              {ov('about', 'title', tr.about.title)}
            </h2>
            <div className="gold-divider-start mb-7" />

            <div className="space-y-4 text-cream-muted text-[15px] sm:text-base leading-loose mb-8" style={{ textAlign: 'justify' }}>
              <p>{ov('about', 'body1', tr.about.body1)}</p>
              <p>{ov('about', 'body2', tr.about.body2)}</p>
              <p>{ov('about', 'body3', tr.about.body3)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {pillars.map((p, i) => {
                const Icon = getIcon(p.icon) ?? ShieldCheck
                return (
                  <div key={p.id ?? `${p.title}-${i}`} className="flex items-center gap-3 bg-gold-soft/50 border border-gold/15 rounded-xl px-4 py-3">
                    <span className="w-9 h-9 rounded-lg bg-white border border-gold/25 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-gold-dark" />
                    </span>
                    <span className="text-sm font-semibold text-cream leading-tight">{p.title}</span>
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
