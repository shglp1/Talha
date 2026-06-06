import { HOMEPAGE_SECTIONS } from '@/lib/contentSchema'

/** DOM anchor for each homepage section (used in nav href="#…"). */
export const SECTION_ANCHORS: Record<string, string> = {
  hero: '#home',
  about: '#about',
  visionMission: '#vision',
  services: '#services',
  whyUs: '#whyus',
  clients: '#clients',
  partners: '#partners',
  contact: '#contact',
  goals: '#goals',
  team: '#team',
  closing: '#closing',
}

export type NavDestinationOption = {
  sectionId: string
  labelAr: string
  labelEn: string
  anchor: string
}

export function getNavDestinationOptions(): NavDestinationOption[] {
  return HOMEPAGE_SECTIONS.map(s => ({
    sectionId: s.id,
    labelAr: s.titleAr,
    labelEn: s.titleEn,
    anchor: SECTION_ANCHORS[s.id] ?? `#${s.id.toLowerCase()}`,
  }))
}

export function findNavDestinationByHref(href?: string | null): NavDestinationOption | undefined {
  const v = href?.trim().toLowerCase()
  if (!v) return undefined
  return getNavDestinationOptions().find(d => d.anchor.toLowerCase() === v)
}

export function isCustomNavHref(href?: string | null): boolean {
  const v = href?.trim()
  if (!v) return false
  return !findNavDestinationByHref(v)
}
