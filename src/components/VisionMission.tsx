'use client'
import Image from 'next/image'
import { Eye, Target } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function VisionMission({ lang }: { lang: Lang }) {
  const tr = t[lang]
  useScrollReveal()

  return (
    <section id="vision" className="section-padding bg-obsidian relative overflow-hidden" dir={tr.dir}>
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/scales-golden.jpg"
          alt="scales of justice"
          fill
          quality={80}
          className="object-cover object-center opacity-8"
        />
        <div className="absolute inset-0 bg-obsidian/92" />
      </div>

      {/* Decorative gold orbs */}
      <div className="absolute top-1/4 start-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 end-1/4 w-80 h-80 rounded-full bg-gold/4 blur-3xl pointer-events-none" />

      <div className="relative z-10 section-container">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="section-badge mb-6 inline-flex">{tr.visionMission.badge}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vision */}
          <div className="glass-card p-10 reveal reveal-left">
            <div className="flex items-start gap-5 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                <Eye size={26} className="text-gold" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-cream">{tr.visionMission.visionTitle}</h3>
                <div className="gold-divider-start mt-2 w-12" />
              </div>
            </div>
            <p className="text-cream-muted text-base leading-relaxed">{tr.visionMission.visionText}</p>

            {/* Decorative quote mark */}
            <div className="mt-6 text-6xl font-black text-gold/10 leading-none select-none" aria-hidden>
              {lang === 'ar' ? '،،' : '"'}
            </div>
          </div>

          {/* Mission */}
          <div className="glass-card p-10 reveal reveal-right">
            <div className="flex items-start gap-5 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                <Target size={26} className="text-gold" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-cream">{tr.visionMission.missionTitle}</h3>
                <div className="gold-divider-start mt-2 w-12" />
              </div>
            </div>
            <p className="text-cream-muted text-base leading-relaxed">{tr.visionMission.missionText}</p>

            <div className="mt-6 text-6xl font-black text-gold/10 leading-none select-none" aria-hidden>
              {lang === 'ar' ? '،،' : '"'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
