'use client'
import { useMemo, useState } from 'react'
import { ExternalLink, LayoutGrid } from 'lucide-react'
import {
  findNavDestinationByHref,
  getNavDestinationOptions,
  isCustomNavHref,
} from '@/lib/nav-destinations'

const C = {
  border: '#ECE6DA',
  muted: '#5A5149',
  dim: '#9B9387',
  gold: '#C4973A',
  goldSoft: 'rgba(196,151,58,0.10)',
}

type Props = {
  value: string
  defaultAnchor: string
  onChange: (href: string) => void
}

export default function NavLinkPicker({ value, defaultAnchor, onChange }: Props) {
  const options = useMemo(() => getNavDestinationOptions(), [])
  const effective = value.trim() || defaultAnchor
  const matched = findNavDestinationByHref(effective)
  const [customMode, setCustomMode] = useState(() => isCustomNavHref(effective))

  const selectSection = (anchor: string) => {
    setCustomMode(false)
    onChange(anchor)
  }

  return (
    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <LayoutGrid size={14} style={{ color: C.gold, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>إلى أي قسم ينتقل الزائر؟</span>
      </div>

      {!customMode && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 8,
          }}
        >
          {options.map(opt => {
            const selected = !customMode && matched?.sectionId === opt.sectionId
            return (
              <button
                key={opt.sectionId}
                type="button"
                onClick={() => selectSection(opt.anchor)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: selected ? `2px solid ${C.gold}` : `1px solid ${C.border}`,
                  background: selected ? C.goldSoft : '#fff',
                  color: selected ? C.muted : C.muted,
                  fontFamily: 'inherit',
                  fontSize: 12,
                  fontWeight: selected ? 700 : 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                  lineHeight: 1.45,
                  boxShadow: selected ? '0 2px 8px rgba(196,151,58,0.15)' : 'none',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                {opt.labelAr}
              </button>
            )
          })}
        </div>
      )}

      {customMode && (
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 11, color: C.dim, marginBottom: 6 }}>
            الرابط (موقع خارجي أو رابط مخصص)
          </label>
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{
              width: '100%',
              maxWidth: 480,
              padding: '8px 10px',
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              fontFamily: 'inherit',
              fontSize: 12,
            }}
            dir="ltr"
            placeholder="https://example.com"
          />
        </div>
      )}

      <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => {
            if (customMode) {
              setCustomMode(false)
              onChange(matched?.anchor ?? defaultAnchor)
            } else {
              setCustomMode(true)
              if (!isCustomNavHref(value)) onChange('')
            }
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            borderRadius: 8,
            border: `1px solid ${customMode ? C.gold : C.border}`,
            background: customMode ? C.goldSoft : '#fff',
            color: C.muted,
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <ExternalLink size={12} />
          {customMode ? 'اختيار قسم من الصفحة' : 'رابط خارجي (متقدم)'}
        </button>
        {!customMode && matched && (
          <span style={{ fontSize: 11, color: C.dim }}>
            عند النقر ينتقل إلى: <strong style={{ color: C.muted }}>{matched.labelAr}</strong>
          </span>
        )}
      </div>
    </div>
  )
}
