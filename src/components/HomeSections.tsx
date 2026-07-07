'use client'
import type { ComponentType } from 'react'
import type { Lang } from '@/lib/translations'
import { useContent } from '@/components/ContentProvider'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import VisionMission from '@/components/VisionMission'
import WhyUs from '@/components/WhyUs'
import StrategicGoals from '@/components/StrategicGoals'
import Team from '@/components/Team'
import Clients from '@/components/Clients'
import Partners from '@/components/Partners'
import ClosingStatement from '@/components/ClosingStatement'
import Contact from '@/components/Contact'

const SECTION_COMPONENTS: Record<string, ComponentType<{ lang: Lang }>> = {
  hero: Hero,
  about: About,
  visionMission: VisionMission,
  services: Services,
  whyUs: WhyUs,
  clients: Clients,
  partners: Partners,
  contact: Contact,
  goals: StrategicGoals,
  team: Team,
  closing: ClosingStatement,
}

export default function HomeSections({ lang }: { lang: Lang }) {
  const { sectionLayout } = useContent()
  const layout = sectionLayout()
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order)

  const heroFirst = [
    ...layout.filter(s => s.id === 'hero'),
    ...layout.filter(s => s.id !== 'hero'),
  ]

  return (
    <>
      {heroFirst.map(s => {
        const Component = SECTION_COMPONENTS[s.id]
        if (!Component) return null
        return <Component key={s.id} lang={lang} />
      })}
    </>
  )
}
