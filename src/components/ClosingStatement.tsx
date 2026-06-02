'use client'
import Image from 'next/image'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useContent } from '@/components/ContentProvider'
import SectionExtras from '@/components/SectionExtras'

export default function ClosingStatement({ lang }: { lang: Lang }) {
  const tr = t[lang]
  useScrollReveal()
  const { ov } = useContent()

  return (
    <section className="section-padding relative overflow-hidden bg-obsidian" dir={tr.dir}>
      {/* Background — scales dramatic dark */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/scales-dramatic.jpg"
          alt="scales of justice"
          fill
          quality={70}
          className="object-cover object-center opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/95 to-obsidian" />
      </div>

      {/* Gold accent lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent z-10" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent z-10" />

      <div className="relative z-10 section-container">
        <div className="max-w-3xl mx-auto text-center reveal">
          {/* Decorative quote marks */}
          <div className="text-8xl font-black text-gold/20 leading-none mb-4 select-none" aria-hidden>
            {lang === 'ar' ? '،،' : '"'}
          </div>

          <blockquote className="text-lg sm:text-xl lg:text-2xl text-cream leading-relaxed font-medium mb-8">
            {ov('closing', 'quote', tr.closing.quote)}
          </blockquote>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px flex-1 max-w-20 bg-gold/30" />
            <div className="w-2 h-2 rounded-full bg-gold" />
            <div className="h-px flex-1 max-w-20 bg-gold/30" />
          </div>

          {/* Author */}
          <div>
            <p className="text-gold font-bold text-lg">{ov('closing', 'author', tr.closing.author)}</p>
            <p className="text-cream-muted text-sm mt-1">{ov('closing', 'role', tr.closing.role)}</p>
          </div>

          {/* CTA */}
          <SectionExtras section="closing" align="center" />

        </div>
      </div>
    </section>
  )
}
