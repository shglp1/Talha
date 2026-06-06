'use client'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useContent } from '@/components/ContentProvider'
import SitePhoto from '@/components/SitePhoto'
import SectionExtras from '@/components/SectionExtras'

export default function ClosingStatement({ lang }: { lang: Lang }) {
  const tr = t[lang]
  useScrollReveal()
  const { ov, photoUrl, enabled } = useContent()

  const showBg = enabled('closing', 'show_bg', true)
  const showPortrait = enabled('closing', 'show_portrait', false)
  const defaultBg = '/assets/scales-dramatic.jpg'
  const bgUrl = photoUrl('closing-bg', defaultBg)
  const portraitUrl = photoUrl('closing-portrait', '')
  const isCustomBg = bgUrl.startsWith('http')

  return (
    <section className="section-padding relative overflow-hidden bg-obsidian" dir={tr.dir}>
      {showBg && (
        <div className="absolute inset-0 z-0">
          <SitePhoto
            src={bgUrl}
            fallback="/assets/scales-dramatic.jpg"
            alt=""
            fill
            quality={90}
            className={`object-cover object-center ${isCustomBg ? 'opacity-[0.55]' : 'opacity-25'}`}
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${isCustomBg ? 'from-white/45 via-white/35 to-white/65' : 'from-white/70 via-white/55 to-white/85'}`} />
        </div>
      )}

      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent z-10 opacity-70" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent z-10 opacity-70" />

      <div className="relative z-10 section-container">
        <div className="max-w-3xl mx-auto text-center reveal">
          <div
            className="closing-quote-mark text-6xl sm:text-7xl font-black font-display text-chatbot-gold leading-none mb-4 select-none"
            style={{ lineHeight: 1.15, paddingBottom: '0.06em' }}
            aria-hidden
          >
            {lang === 'ar' ? '،،' : '"'}
          </div>

          <blockquote className="text-lg sm:text-xl lg:text-2xl text-cream leading-relaxed font-medium mb-8">
            {ov('closing', 'quote', tr.closing.quote)}
          </blockquote>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px flex-1 max-w-20 bg-gold-gradient opacity-70" />
            <div className="w-2 h-2 rounded-full bg-gold-gradient shadow-[0_0_8px_rgba(196,151,58,0.45)]" />
            <div className="h-px flex-1 max-w-20 bg-gold-gradient opacity-70" />
          </div>

          <div className="flex flex-col items-center gap-4">
            {showPortrait && portraitUrl && (
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-gold/60 shadow-xl ring-4 ring-gold/20 bg-white">
                <SitePhoto
                  src={portraitUrl}
                  fallback={portraitUrl}
                  alt={ov('closing', 'author', tr.closing.author)}
                  fill
                  quality={95}
                  className="object-cover object-top"
                  sizes="112px"
                />
              </div>
            )}
            <div>
              <p
                className="font-display text-chatbot-gold font-bold text-xl sm:text-2xl tracking-wide"
                style={{ lineHeight: 1.45, paddingBottom: '0.12em' }}
              >
                {ov('closing', 'author', tr.closing.author)}
              </p>
              <p className="text-cream-muted text-sm mt-1.5">{ov('closing', 'role', tr.closing.role)}</p>
            </div>
          </div>

          <SectionExtras section="closing" align="center" />
        </div>
      </div>
    </section>
  )
}
