'use client'
import type { FieldTextStyle } from '@/lib/text-style'
import { FONT_SIZE_PRESETS, isEmptyStyle } from '@/lib/text-style'

const C = {
  border: '#ECE6DA',
  muted: '#5A5149',
  dim: '#9B9387',
  gold: '#C4973A',
}

type Props = {
  style?: FieldTextStyle
  onChange: (patch: Partial<FieldTextStyle>) => void
  onReset: () => void
  compact?: boolean
  showDesc?: boolean
}

export default function FieldStyleControls({ style, onChange, onReset, compact, showDesc }: Props) {
  const s = style ?? {}
  const labelStyle = { display: 'block' as const, fontSize: 10, color: C.dim, marginBottom: 4 }
  const inputStyle = {
    width: '100%',
    padding: compact ? '5px 8px' : '6px 10px',
    borderRadius: 8,
    border: `1px solid ${C.border}`,
    fontFamily: 'inherit',
    fontSize: 12,
  }

  return (
    <div style={{
      gridColumn: compact ? undefined : '1 / -1',
      marginTop: compact ? 8 : 10,
      paddingTop: compact ? 8 : 10,
      borderTop: `1px dashed ${C.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>تنسيق النص (لون + حجم)</span>
        {!isEmptyStyle(s) && (
          <button type="button" onClick={onReset} style={{ marginInlineStart: 'auto', padding: '3px 8px', borderRadius: 6, border: `1px solid ${C.border}`, background: '#fff', color: C.dim, fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
            إعادة الافتراضي
          </button>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: showDesc ? 'repeat(2, 1fr)' : '1fr 1fr', gap: 8 }}>
        <div>
          <label style={labelStyle}>{showDesc ? 'لون العنوان' : 'لون النص'}</label>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="color" value={s.color || '#1A160F'} onChange={e => onChange({ color: e.target.value })} style={{ width: 36, height: 32, padding: 2, border: `1px solid ${C.border}`, borderRadius: 6, cursor: 'pointer' }} />
            <input value={s.color || ''} onChange={e => onChange({ color: e.target.value })} placeholder="#1A160F" dir="ltr" style={{ ...inputStyle, flex: 1 }} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>{showDesc ? 'حجم العنوان' : 'حجم الخط'}</label>
          <select value={s.fontSize || ''} onChange={e => onChange({ fontSize: e.target.value || undefined })} style={inputStyle}>
            {FONT_SIZE_PRESETS.map(p => (
              <option key={p.value || 'default'} value={p.value}>{p.labelAr}</option>
            ))}
          </select>
        </div>
        {showDesc && (
          <>
            <div>
              <label style={labelStyle}>لون الوصف</label>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="color" value={s.descColor || '#5A5149'} onChange={e => onChange({ descColor: e.target.value })} style={{ width: 36, height: 32, padding: 2, border: `1px solid ${C.border}`, borderRadius: 6, cursor: 'pointer' }} />
                <input value={s.descColor || ''} onChange={e => onChange({ descColor: e.target.value })} placeholder="#5A5149" dir="ltr" style={{ ...inputStyle, flex: 1 }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>حجم الوصف</label>
              <select value={s.descFontSize || ''} onChange={e => onChange({ descFontSize: e.target.value || undefined })} style={inputStyle}>
                {FONT_SIZE_PRESETS.map(p => (
                  <option key={`d-${p.value || 'default'}`} value={p.value}>{p.labelAr}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
