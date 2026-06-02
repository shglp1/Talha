'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useContent } from '@/components/ContentProvider'

export default function Hero({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const isAr = lang === 'ar'
  const Arrow = isAr ? ArrowLeft : ArrowRight
  const titleRef = useRef<HTMLDivElement>(null)
  const { ov, list } = useContent()

  const stats = list('hero_stats', [
    { title: '15+', desc: tr.hero.stat1, icon: null },
    { title: '500+', desc: tr.hero.stat2, icon: null },
    { title: '1000+', desc: tr.hero.stat3, icon: null },
  ])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (titleRef.current) titleRef.current.classList.add('visible')
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const title1   = ov('hero', 'title1', tr.hero.title1)
  const title2   = ov('hero', 'title2', tr.hero.title2)
  const title3   = ov('hero', 'title3', tr.hero.title3)
  const subtitle = ov('hero', 'subtitle', tr.hero.subtitle)

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden" dir={tr.dir}>
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero-banner.jpg"
          alt="مكتب د. طلحة غوث للمحاماة"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />
      </div>

      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent z-10" />

      <div className="relative z-10 section-container flex flex-col items-center text-center pt-28 pb-20">
        <div className="reveal visible mb-8" style={{ transitionDelay: '0.1s' }}>
          <span className="section-badge">{ov('hero', 'badge', tr.hero.badge)}</span>
        </div>

        <div ref={titleRef} className="reveal mb-6 max-w-4xl" style={{ transitionDelay: '0.25s' }}>
          {isAr ? (
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-black" style={{ lineHeight: 1.32 }}>
              <span className="block text-white">{title1}</span>
              <span
                className="block text-gold-gradient"
                style={{ lineHeight: 1.4, paddingBottom: '0.18em', letterSpacing: '0.01em', overflow: 'visible' }}
              >
                {title2}
              </span>
              <span className="block text-white text-3xl sm:text-4xl lg:text-5xl font-bold mt-1" style={{ lineHeight: 1.4 }}>{title3}</span>
            </h1>
          ) : (
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight font-english">
              <span className="block text-gold-gradient" style={{ lineHeight: 1.3, paddingBottom: '0.12em' }}>{title1}</span>
              <span className="block text-white text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">{title3}</span>
            </h1>
          )}
        </div>

        <div className="reveal visible gold-divider mb-6" style={{ transitionDelay: '0.4s' }} />

        <p
          className="reveal visible text-lg sm:text-xl max-w-2xl leading-relaxed mb-10 font-semibold text-white/90"
          style={{ transitionDelay: '0.5s' }}
        >
          {subtitle}
        </p>

        <div
          className="reveal visible flex flex-wrap items-center justify-center gap-4 mb-16"
          style={{ transitionDelay: '0.65s' }}
        >
          <a href="#contact" className="btn-gold gap-2">
            {ov('hero', 'cta1', tr.hero.cta1)}
            <Arrow size={18} />
          </a>
          <a href="#about" className="btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.45)' }}>
            {ov('hero', 'cta2', tr.hero.cta2)}
          </a>
        </div>

        <div
          className={`reveal visible w-full max-w-3xl grid gap-4 border border-gold/20 rounded-2xl bg-black/40 backdrop-blur-md shadow-lg p-6`}
          style={{
            transitionDelay: '0.8s',
            gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))`,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.id ?? `${s.title}-${i}`}
              className={`text-center ${i < stats.length - 1 ? (isAr ? 'border-l border-obsidian-border' : 'border-r border-obsidian-border') : ''}`}
            >
              <div className="text-3xl sm:text-4xl font-black text-gold-gradient leading-none mb-1">{s.title}</div>
              <div className="text-xs sm:text-sm text-white/70">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40 hover:text-gold transition-colors group"
        aria-label="Scroll down"
      >
        <ChevronDown size={28} className="animate-bounce" />
      </a>
    </section>
  )
}
