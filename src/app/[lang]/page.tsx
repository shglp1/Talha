import HomeSections from '@/components/HomeSections'
import type { Lang } from '@/lib/translations'

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const l = lang as Lang

  return <HomeSections lang={l} />
}
