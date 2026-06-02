'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'

const STATS = [
  { value: '15+', key: 'stat1' },
  { value: '500+', key: 'stat2' },
  { value: '1000+', key: 'stat3' },
]

export default function Hero({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const isAr = lang === 'ar'
  const Arrow = isAr ? ArrowLeft : ArrowRight
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (titleRef.current) titleRef.current.classList.add('visible')
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden" dir={tr.dir}>
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero-banner.jpg"
          alt="مكتب د. طلحة غوث للمحاماة"
          fill
          priority
          quality={90}
          className="object-cover object-center"
        />
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/70 to-obsidian/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/40 via-transparent to-obsidian/40" />
      </div>

      {/* Gold top accent line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent z-10" />

      {/* Content */}
      <div className="relative z-10 section-container flex flex-col items-center text-center pt-28 pb-20">
        {/* Badge */}
        <div className="reveal visible mb-8" style={{ transitionDelay: '0.1s' }}>
          <span className="section-badge">{tr.hero.badge}</span>
        </div>

        {/* Title */}
        <div ref={titleRef} className="reveal mb-6 max-w-4xl" style={{ transitionDelay: '0.25s' }}>
          {isAr ? (
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight">
              <span className="block text-cream">{tr.hero.title1}</span>
              <span className="block text-gold-gradient py-1">{tr.hero.title2}</span>
              <span className="block text-cream text-3xl sm:text-4xl lg:text-5xl font-bold mt-1">{tr.hero.title3}</span>
            </h1>
          ) : (
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight font-english">
              <span className="block text-gold-gradient">{tr.hero.title1}</span>
              <span className="block text-cream text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">{tr.hero.title3}</span>
            </h1>
          )}
        </div>

        {/* Gold divider */}
        <div className="reveal visible gold-divider mb-6" style={{ transitionDelay: '0.4s' }} />

        {/* Subtitle */}
        <p
          className="reveal visible text-cream-muted text-lg sm:text-xl max-w-2xl leading-relaxed mb-10"
          style={{ transitionDelay: '0.5s' }}
        >
          {tr.hero.subtitle}
        </p>

        {/* CTAs */}
        <div
          className="reveal visible flex flex-wrap items-center justify-center gap-4 mb-16"
          style={{ transitionDelay: '0.65s' }}
        >
          <a href="#contact" className="btn-gold gap-2">
            {tr.hero.cta1}
            <Arrow size={18} />
          </a>
          <a href="#about" className="btn-outline">
            {tr.hero.cta2}
          </a>
        </div>

        {/* Stats */}
        <div
          className="reveal visible w-full max-w-3xl grid grid-cols-3 gap-4 border border-obsidian-border rounded-2xl bg-obsidian/60 backdrop-blur-sm p-6"
          style={{ transitionDelay: '0.8s' }}
        >
          {STATS.map((s, i) => (
            <div key={s.key} className={`text-center ${i < 2 ? (isAr ? 'border-l border-obsidian-border' : 'border-r border-obsidian-border') : ''}`}>
              <div className="text-3xl sm:text-4xl font-black text-gold-gradient leading-none mb-1">{s.value}</div>
              <div className="text-xs sm:text-sm text-cream-muted">{tr.hero[s.key as keyof typeof tr.hero]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-cream/30 hover:text-gold transition-colors group"
        aria-label="Scroll down"
      >
        <ChevronDown size={28} className="animate-bounce" />
      </a>
    </section>
  )
}
