import Hero            from '@/components/Hero'
import About           from '@/components/About'
import Services        from '@/components/Services'
import VisionMission   from '@/components/VisionMission'
import WhyUs           from '@/components/WhyUs'
import StrategicGoals  from '@/components/StrategicGoals'
import Team            from '@/components/Team'
import Clients         from '@/components/Clients'
import Partners        from '@/components/Partners'
import ClosingStatement from '@/components/ClosingStatement'
import Contact         from '@/components/Contact'
import type { Lang }   from '@/lib/translations'

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const l = lang as Lang

  return (
    <>
      <Hero           lang={l} />
      <About          lang={l} />
      <Services       lang={l} />
      <VisionMission  lang={l} />
      <WhyUs          lang={l} />
      <StrategicGoals lang={l} />
      <Team           lang={l} />
      <Clients        lang={l} />
      <Partners       lang={l} />
      <ClosingStatement lang={l} />
      <Contact        lang={l} />
    </>
  )
}
