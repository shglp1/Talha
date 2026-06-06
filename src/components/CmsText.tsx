'use client'
import type { ElementType, ReactNode } from 'react'
import { useContent } from '@/components/ContentProvider'

type CmsTextProps = {
  section: string
  fieldKey: string
  fallback: string
  as?: ElementType
  className?: string
  style?: React.CSSProperties
  children?: ReactNode
  /** data-cms-item id for list card title/desc styling */
  itemId?: string
  itemPart?: 'title' | 'desc'
  dir?: 'ltr' | 'rtl' | 'auto'
}

/** Renders CMS text with data-cms hooks for admin color/size overrides. */
export default function CmsText({
  section,
  fieldKey,
  fallback,
  as: Tag = 'span',
  className,
  style,
  children,
  itemId,
  itemPart,
  dir,
}: CmsTextProps) {
  const { ov } = useContent()
  const text = children ?? ov(section, fieldKey, fallback)
  if (text === '' || text === null || text === undefined) return null

  const attrs: Record<string, string> = {}
  if (itemId && itemPart) {
    attrs['data-cms-item'] = itemId
    attrs['data-cms-part'] = itemPart
  } else {
    attrs['data-cms'] = `${section}.${fieldKey}`
  }

  return (
    <Tag className={className} style={style} dir={dir} {...attrs}>
      {text}
    </Tag>
  )
}
