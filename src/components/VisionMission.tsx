'use client'
import { Telescope, Compass, Scale } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useContent } from '@/components/ContentProvider'
import SectionExtras from '@/components/SectionExtras'

export default function VisionMission({ lang }: { lang: Lang }) {
  const tr = t[lang]
  useScrollReveal()
  const { ov, hidden } = useContent()

  return (
    <section
      id="vision"
      className="section-padding relative overflow-hidden"
      dir={tr.dir}
      style={{ background: 'linear-gradient(135deg, #1A160F 0%, #25201733 0%, #1F1A12 55%, #15110B 100%)' }}
    >
      {/* Decorative gold orbs — sized down on mobile to avoid overflow */}
      <div className="absolute top-0 start-0 w-48 sm:w-72 lg:w-[28rem] h-48 sm:h-72 lg:h-[28rem] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(196,151,58,0.18), transparent 70%)' }} />
      <div className="absolute bottom-0 end-0 w-40 sm:w-64 lg:w-[24rem] h-40 sm:h-64 lg:h-[24rem] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(196,151,58,0.14), transparent 70%)' }} />
      {/* Top & bottom gold hairlines to frame the band */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,151,58,0.6), transparent)' }} />
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,151,58,0.6), transparent)' }} />

      <div className="relative z-10 section-container">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-14 reveal">
          {!hidden('visionMission', 'badge') && <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold tracking-wide"
            style={{ border: '1px solid rgba(196,151,58,0.40)', background: 'rgba(196,151,58,0.12)', color: '#E2C485' }}
          >
            {ov('visionMission', 'badge', tr.visionMission.badge)}
          </span>}
          <div className="mx-auto mt-5 h-[3px] w-16 rounded-full" style={{ background: 'linear-gradient(90deg, #C4973A, #E2C485)' }} />
        </div>

        {/* Vision — Hub — Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-stretch gap-6 lg:gap-0">
          {/* Vision */}
          <article
            className="reveal reveal-left flex flex-col rounded-3xl p-7 sm:p-9 lg:p-10"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(196,151,58,0.22)', backdropFilter: 'blur(6px)' }}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(196,151,58,0.14)', border: '1px solid rgba(196,151,58,0.35)' }}>
                <Telescope size={26} style={{ color: '#E2C485' }} />
              </div>
              <div>
                {!hidden('visionMission', 'visionTitle') && <h3 className="text-2xl sm:text-3xl font-black leading-none" style={{ color: '#FFFFFF' }}>{ov('visionMission', 'visionTitle', tr.visionMission.visionTitle)}</h3>}
                <div className="mt-2.5 h-[3px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, #C4973A, #E2C485)' }} />
              </div>
            </div>
            {!hidden('visionMission', 'visionText') && <p className="text-[15px] sm:text-base leading-loose" style={{ color: 'rgba(245,239,222,0.86)' }}>{ov('visionMission', 'visionText', tr.visionMission.visionText)}</p>}
          </article>

          {/* Connecting hub */}
          <div className="flex items-center justify-center lg:flex-col lg:px-3" aria-hidden>
            <span className="h-px w-12 lg:w-px lg:h-20" style={{ background: 'linear-gradient(to right, transparent, rgba(196,151,58,0.6))' }} />
            <div className="relative flex-shrink-0 mx-1 lg:mx-0 lg:my-1">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #C4973A, #A27849)', boxShadow: '0 10px 30px rgba(196,151,58,0.40)' }}>
                <Scale size={26} color="#FFFFFF" />
              </div>
              <span className="absolute inset-0 -m-1.5 rounded-full pointer-events-none" style={{ border: '1px solid rgba(196,151,58,0.30)' }} />
            </div>
            <span className="h-px w-12 lg:w-px lg:h-20" style={{ background: 'linear-gradient(to left, transparent, rgba(196,151,58,0.6))' }} />
          </div>

          {/* Mission */}
          <article
            className="reveal reveal-right flex flex-col rounded-3xl p-7 sm:p-9 lg:p-10"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(196,151,58,0.22)', backdropFilter: 'blur(6px)' }}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(196,151,58,0.14)', border: '1px solid rgba(196,151,58,0.35)' }}>
                <Compass size={26} style={{ color: '#E2C485' }} />
              </div>
              <div>
                {!hidden('visionMission', 'missionTitle') && <h3 className="text-2xl sm:text-3xl font-black leading-none" style={{ color: '#FFFFFF' }}>{ov('visionMission', 'missionTitle', tr.visionMission.missionTitle)}</h3>}
                <div className="mt-2.5 h-[3px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, #C4973A, #E2C485)' }} />
              </div>
            </div>
            {!hidden('visionMission', 'missionText') && <p className="text-[15px] sm:text-base leading-loose" style={{ color: 'rgba(245,239,222,0.86)' }}>{ov('visionMission', 'missionText', tr.visionMission.missionText)}</p>}
          </article>
        </div>

        <SectionExtras section="visionMission" />
      </div>
    </section>
  )
}
