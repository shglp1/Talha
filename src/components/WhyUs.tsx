'use client'
import { Target, Eye, Brain, Zap, Lock, Award, Handshake } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const ICON_MAP: Record<string, React.ElementType> = {
  Target, Eye, Brain, Zap, Lock, Award, Handshake,
}

export default function WhyUs({ lang }: { lang: Lang }) {
  const tr = t[lang]
  useScrollReveal()

  return (
    <section id="whyus" className="section-padding bg-obsidian" dir={tr.dir}>
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="section-badge mb-6 inline-flex">{tr.whyUs.badge}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">{tr.whyUs.title}</h2>
          <div className="gold-divider mb-6" />
          <p className="text-cream-muted text-lg max-w-2xl mx-auto">{tr.whyUs.subtitle}</p>
        </div>

        {/* 7 pillars grid: 4 top + 3 bottom centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {tr.whyUs.items.slice(0, 4).map((item, i) => {
            const Icon = ICON_MAP[item.icon] ?? Target
            return (
              <PillarCard key={item.title} item={item} Icon={Icon} index={i} lang={lang} />
            )
          })}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:max-w-[75%] mx-auto">
          {tr.whyUs.items.slice(4).map((item, i) => {
            const Icon = ICON_MAP[item.icon] ?? Target
            return (
              <PillarCard key={item.title} item={item} Icon={Icon} index={i + 4} lang={lang} />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function PillarCard({
  item, Icon, index,
}: {
  item: { icon: string; title: string; desc: string }
  Icon: React.ElementType
  index: number
  lang: Lang
}) {
  return (
    <div
      className="glass-card p-7 reveal text-center group"
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      {/* Number */}
      <div className="text-5xl font-black text-gold/10 leading-none mb-3 group-hover:text-gold/20 transition-colors">
        {String(index + 1).padStart(2, '0')}
      </div>
      {/* Icon */}
      <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 group-hover:border-gold/40 transition-all">
        <Icon size={20} className="text-gold" />
      </div>
      <h3 className="text-base font-bold text-cream mb-2">{item.title}</h3>
      <p className="text-cream-muted text-sm leading-relaxed">{item.desc}</p>
    </div>
  )
}
