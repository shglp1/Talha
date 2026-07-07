'use client'
import { useEffect, useRef } from 'react'
import { ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useContent } from '@/components/ContentProvider'
import HeroCarousel from '@/components/HeroCarousel'
import { cmsField, cmsItemPart } from '@/lib/cms-attrs'

const HERO_HEIGHT: React.CSSProperties = {
  height: '100svh',
  minHeight: '100dvh',
}

export default function Hero({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const isAr = lang === 'ar'
  const Arrow = isAr ? ArrowLeft : ArrowRight
  const titleRef = useRef<HTMLDivElement>(null)
  const { ov, hidden, list, heroCarousel } = useContent()

  const stats = list('hero_stats', [
    { title: '15+', desc: tr.hero.stat1, icon: null },
    { title: '500+', desc: tr.hero.stat2, icon: null },
    { title: '1000+', desc: tr.hero.stat3, icon: null },
  ])

  const hideBadge    = hidden('hero', 'badge')
  const hideTitle1   = hidden('hero', 'title1')
  const hideTitle2   = hidden('hero', 'title2')
  const hideTitle3   = hidden('hero', 'title3')
  const hideSubtitle = hidden('hero', 'subtitle')
  const hideCta1     = hidden('hero', 'cta1')
  const hideCta2     = hidden('hero', 'cta2')

  const hasVisibleContent =
    !hideBadge ||
    !hideTitle1 ||
    !hideTitle2 ||
    !hideTitle3 ||
    !hideSubtitle ||
    !hideCta1 ||
    !hideCta2 ||
    stats.length > 0

  const title1   = ov('hero', 'title1', tr.hero.title1)
  const title2   = ov('hero', 'title2', tr.hero.title2)
  const title3   = ov('hero', 'title3', tr.hero.title3)
  const subtitle = ov('hero', 'subtitle', tr.hero.subtitle)

  useEffect(() => {
    if (!hasVisibleContent) return
    const timer = setTimeout(() => {
      if (titleRef.current) titleRef.current.classList.add('visible')
    }, 100)
    return () => clearTimeout(timer)
  }, [hasVisibleContent])

  return (
    <section
      id="home"
      dir={tr.dir}
      className="relative isolate w-full overflow-hidden bg-[#1a160f]"
      style={HERO_HEIGHT}
    >
      <HeroCarousel
        slides={heroCarousel('/assets/hero-banner.jpg')}
        fallback="/assets/hero-banner.jpg"
        alt="مكتب د. طلحة غوث للمحاماة"
      />

      <div className="pointer-events-none absolute top-0 inset-x-0 z-20 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      {hasVisibleContent && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-y-auto">
          <div className="section-container flex w-full flex-col items-center text-center px-4 pb-20 pt-20 sm:pt-28">
            {!hideBadge && (
              <div className="reveal visible mb-8" style={{ transitionDelay: '0.1s' }}>
                <span className="section-badge" {...cmsField('hero', 'badge')}>{ov('hero', 'badge', tr.hero.badge)}</span>
              </div>
            )}

            <div ref={titleRef} className="reveal mb-6 max-w-4xl" style={{ transitionDelay: '0.25s' }}>
              {isAr ? (
                <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-black" style={{ lineHeight: 1.32 }}>
                  {!hideTitle1 && <span className="block text-white" {...cmsField('hero', 'title1')}>{title1}</span>}
                  {!hideTitle2 && (
                    <span className="block text-gold-gradient" {...cmsField('hero', 'title2')} style={{ lineHeight: 1.4, paddingBottom: '0.18em', letterSpacing: '0.01em', overflow: 'visible' }}>
                      {title2}
                    </span>
                  )}
                  {!hideTitle3 && <span className="block text-white text-3xl sm:text-4xl lg:text-5xl font-bold mt-1" {...cmsField('hero', 'title3')} style={{ lineHeight: 1.4 }}>{title3}</span>}
                </h1>
              ) : (
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight font-english">
                  {!hideTitle1 && <span className="block text-gold-gradient" {...cmsField('hero', 'title1')} style={{ lineHeight: 1.3, paddingBottom: '0.12em' }}>{title1}</span>}
                  {!hideTitle3 && <span className="block text-white text-3xl sm:text-4xl lg:text-5xl font-bold mt-2" {...cmsField('hero', 'title3')}>{title3}</span>}
                </h1>
              )}
            </div>

            {!hideSubtitle && <div className="reveal visible gold-divider mb-6" style={{ transitionDelay: '0.4s' }} />}

            {!hideSubtitle && (
              <p className="reveal visible text-lg sm:text-xl max-w-2xl leading-relaxed mb-10 font-semibold text-white/90" {...cmsField('hero', 'subtitle')} style={{ transitionDelay: '0.5s' }}>
                {subtitle}
              </p>
            )}

            {(!hideCta1 || !hideCta2) && (
              <div className="reveal visible flex flex-wrap items-center justify-center gap-4 mb-16" style={{ transitionDelay: '0.65s' }}>
                {!hideCta1 && (
                  <a href="#contact" className="btn-gold gap-2" {...cmsField('hero', 'cta1')}>
                    {ov('hero', 'cta1', tr.hero.cta1)}
                    <Arrow size={18} />
                  </a>
                )}
                {!hideCta2 && (
                  <a href="#about" className="btn-outline" {...cmsField('hero', 'cta2')} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.45)' }}>
                    {ov('hero', 'cta2', tr.hero.cta2)}
                  </a>
                )}
              </div>
            )}

            {stats.length > 0 && (
              <div
                className="reveal visible w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 border border-gold/20 rounded-2xl bg-black/30 backdrop-blur-md shadow-lg p-6"
                style={{ transitionDelay: '0.8s' }}
              >
                {stats.map((s, i) => (
                  <div
                    key={s.id ?? `${s.title}-${i}`}
                    className={`text-center ${i < stats.length - 1 ? (isAr ? 'sm:border-l sm:border-obsidian-border' : 'sm:border-r sm:border-obsidian-border') : ''}`}
                  >
                    <div className="text-3xl sm:text-4xl font-black text-gold-gradient leading-none mb-1" {...cmsItemPart(s.id, 'title')}>{s.title}</div>
                    <div className="text-xs sm:text-sm text-white/70" {...cmsItemPart(s.id, 'desc')}>{s.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {hasVisibleContent && (
        <a
          href="#about"
          className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-white/40 transition-colors hover:text-gold group"
          aria-label="Scroll down"
        >
          <ChevronDown size={28} className="animate-bounce" />
        </a>
      )}
    </section>
  )
}
