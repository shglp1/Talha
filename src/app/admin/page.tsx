'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  MessageSquare, Settings, LogOut, Handshake, Plus, Trash2, Save,
  CheckCircle2, AlertCircle, RefreshCw, Mail, Phone, Globe, Pen,
  Upload, Loader2, LayoutList, ChevronDown, ArrowUp, ArrowDown, Search, Sparkles, X,
  Eye, EyeOff, ImageIcon, RotateCcw, LayoutGrid,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { ContactMessage, SiteContent, Partner, ContentItem } from '@/lib/supabase'
import { adminApi, AdminApiError } from '@/lib/adminApi'
import IconPicker from '@/components/IconPicker'
import { getIcon } from '@/lib/iconMap'
import {
  FIELD_GROUPS, ALL_FIELDS, LIST_SECTIONS, listSectionsForGroup,
  groupContentItems, groupContentItemsWithDefaults, emptyListSections, newListItemTemplate,
  HOMEPAGE_SECTIONS, serializeHomepageLayout, parseHomepageLayout, defaultHomepageLayout,
} from '@/lib/contentSchema'
import type { ListSection } from '@/lib/contentSchema'
import FieldStyleControls from '@/components/admin/FieldStyleControls'
import {
  STYLE_KEY_SUFFIX, ITEM_STYLE_SECTION, parseFieldStyle, serializeFieldStyle, isEmptyStyle, buildAdminDbKeys,
} from '@/lib/text-style'
import type { FieldTextStyle } from '@/lib/text-style'

type Tab = 'messages' | 'content' | 'lists' | 'layout' | 'partners' | 'photos'

const C = {
  bg: '#F8F5EF', panel: '#FFFFFF', soft: '#FBF9F4', border: '#ECE6DA',
  text: '#1A160F', muted: '#5A5149', dim: '#9B9387',
  gold: '#C4973A', goldDark: '#A27849', goldSoft: '#F6EFDE',
}

type ContentRow = { section: string; key: string; value_ar: string; value_en: string; hidden?: boolean; style?: FieldTextStyle }
type CustomField = {
  section: string; key: string
  label_ar: string; label_en: string
  value_ar: string; value_en: string
  slot: string; display_order: number
}

const emptyDraft: Partner = { name: '', logo_url: '', website: '', icon: null, active: true, sort_order: 0 }
const DEFAULT_CONTENT_ROWS: ContentRow[] = ALL_FIELDS.map(f => ({
  section: f.section,
  key: f.key,
  value_ar: f.def.ar,
  value_en: f.def.en,
}))

const GROUP_HELP: Record<string, string> = {
  nav: 'يظهر في شريط التنقل أعلى الموقع.',
  hero: 'نصوص البانر + إحصائيات الأرقام (15+، 500+…) — أضف إحصائية من الأسفل.',
  about: 'نصوص «من نحن» + بطاقة سنوات الخبرة + ركائز (ثقة، احترافية…).',
  services: 'عناوين قسم «خدماتنا». البطاقات تُدار من هنا مباشرةً بالأسفل.',
  visionMission: 'يظهر في قسم «الرؤية والرسالة».',
  whyUs: 'عناوين قسم «لماذا نحن». البطاقات تُدار من هنا مباشرةً بالأسفل.',
  goals: 'عناوين قسم «أهدافنا الاستراتيجية». البطاقات تُدار من هنا مباشرةً بالأسفل.',
  team: 'النص الرئيسي لقسم «فريقنا». التخصصات تُدار من هنا مباشرةً بالأسفل.',
  clients: 'نصوص القسم + أرقام الإحصائيات (500+، 15+…) + قطاعات العملاء.',
  partners: 'عناوين قسم «شركاء النجاح». الشركاء (شعار/حذف/إضافة) في تبويب «شركاء النجاح».',
  closing: 'الاقتباس الختامي قبل قسم التواصل.',
  contact: 'حقول ونصوص نموذج التواصل.',
  footer: 'رقم الهاتف، البريد، العنوان، واتساب، والجملة الوسطى وحقوق النشر. كل حقل مستقل — «مخفي» يخفيه من التذييل فقط. اضغط «حفظ كل التعديلات» بعد التعديل.',
  chat: 'يظهر في نافذة المساعد الذكي.',
}

const ADMIN_BACKUP_KEY = 'talha-admin-backup-v1'

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab]             = useState<Tab>('messages')
  const [messages, setMessages]   = useState<ContactMessage[]>([])
  const [content, setContent]     = useState<ContentRow[]>(DEFAULT_CONTENT_ROWS)
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const [contentSearch, setContentSearch] = useState('')
  const [items, setItems]         = useState<Record<string, ContentItem[]>>({})
  const [partners, setPartners]   = useState<Partner[]>([])
  const [draft, setDraft]         = useState<Partner>(emptyDraft)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [listStatus, setListStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [savingId, setSavingId]   = useState<string | null>(null)
  const [pStatus, setPStatus]     = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [uploadingFor, setUploadingFor] = useState<string | null>(null)
  const [uploadError, setUploadError]   = useState('')
  const [loading, setLoading]     = useState(true)
  const [authReady, setAuthReady] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [isMobile, setIsMobile]   = useState(false)
  const [backupStatus, setBackupStatus] = useState<'idle' | 'saved' | 'restored' | 'error'>('idle')
  const [apiError, setApiError]   = useState('')
  const [seeding, setSeeding]     = useState(false)
  const [previewSections, setPreviewSections] = useState<Set<string>>(new Set())
  const [dbKeys, setDbKeys]       = useState<Set<string>>(new Set())
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const [photoUrls, setPhotoUrls]     = useState<Record<string, string>>({})
  const [heroSlides, setHeroSlides]   = useState<string[]>([])
  const [photoUploading, setPhotoUploading] = useState<string | null>(null)
  const [photoError, setPhotoError]   = useState('')
  const [photoSuccess, setPhotoSuccess] = useState('')
  const [homepageLayout, setHomepageLayout] = useState(defaultHomepageLayout())
  const [layoutStatus, setLayoutStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [itemStyles, setItemStyles] = useState<Record<string, FieldTextStyle>>({})

  // Centralized handling of API failures: 401/403 means the session is bad.
  const handleApiError = useCallback((err: unknown) => {
    if (err instanceof AdminApiError) {
      setApiError(err.message)
      if (err.status === 401) {
        setTimeout(() => router.push('/admin/login'), 1500)
      }
    } else {
      setApiError('تعذّر الاتصال بالخادم — تحقّق من الإنترنت وحاول مجددًا')
    }
  }, [router])

  const splitContent = useCallback((rows: SiteContent[]) => {
    const map = new Map<string, SiteContent>()
    rows.forEach(d => map.set(`${d.section}.${d.key}`, d))
    const merged: ContentRow[] = ALL_FIELDS.map(f => {
      const row = map.get(`${f.section}.${f.key}`)
      const ar = row?.value_ar && row.value_ar.trim() ? row.value_ar : f.def.ar
      const en = row?.value_en && row.value_en.trim() ? row.value_en : f.def.en
      const visRow = map.get(`${f.section}.${f.key}__vis`)
      const isHidden = visRow?.value_ar === '0'
      const styleRow = map.get(`${f.section}.${f.key}${STYLE_KEY_SUFFIX}`)
      const style = parseFieldStyle(styleRow?.value_ar)
      return { section: f.section, key: f.key, value_ar: ar, value_en: en, hidden: isHidden, style }
    })
    setContent(merged)
    setDbKeys(new Set(rows.filter(r => !r.is_custom).map(r => `${r.section}.${r.key}`)))
    const nextItemStyles: Record<string, FieldTextStyle> = {}
    rows.filter(r => r.section === ITEM_STYLE_SECTION).forEach(r => {
      const parsed = parseFieldStyle(r.value_ar)
      if (!isEmptyStyle(parsed)) nextItemStyles[r.key] = parsed
    })
    setItemStyles(nextItemStyles)
    // Load photo overrides
    const photos: Record<string, string> = {}
    let slides: string[] = []
    rows.filter(r => r.section === 'photos').forEach(r => {
      if (r.key === 'hero-carousel' && r.value_ar) {
        try {
          const parsed = JSON.parse(r.value_ar)
          if (Array.isArray(parsed)) slides = parsed.filter((u: unknown) => typeof u === 'string' && u)
        } catch { /* ignore */ }
      } else if (r.value_ar && r.key !== 'hero-carousel') {
        photos[r.key] = r.value_ar
      }
    })
    setPhotoUrls(photos)
    setHeroSlides(slides)
    const custom: CustomField[] = rows
      .filter(r => r.is_custom)
      .map(r => ({
        section: r.section, key: r.key,
        label_ar: r.label_ar ?? '', label_en: r.label_en ?? '',
        value_ar: r.value_ar ?? '', value_en: r.value_en ?? '',
        slot: r.slot ?? 'body', display_order: r.display_order ?? 0,
      }))
      .sort((a, b) => a.display_order - b.display_order)
    setCustomFields(custom)
    const layoutRow = map.get('layout.homepage_sections')
    setHomepageLayout(parseHomepageLayout(layoutRow?.value_ar || layoutRow?.value_en || ''))
  }, [])

  const loadAll = useCallback(async () => {
    setLoading(true)
    setApiError('')
    const errors: string[] = []

    const [msgR, cntR, itsR, prtR] = await Promise.allSettled([
      adminApi.getMessages(),
      adminApi.getContent(),
      adminApi.getItems(),
      adminApi.getPartners(),
    ])

    if (msgR.status === 'fulfilled') {
      setMessages((msgR.value.data ?? []) as ContactMessage[])
    } else {
      errors.push(msgR.reason instanceof AdminApiError ? msgR.reason.message : 'رسائل التواصل')
    }

    if (cntR.status === 'fulfilled') {
      splitContent((cntR.value.data ?? []) as SiteContent[])
    } else {
      errors.push(cntR.reason instanceof AdminApiError ? cntR.reason.message : 'نصوص الموقع')
      setContent(DEFAULT_CONTENT_ROWS)
    }

    if (itsR.status === 'fulfilled') {
      const dbRows = (itsR.value.data ?? []) as ContentItem[]
      const grouped = groupContentItems(dbRows)
      setPreviewSections(new Set(emptyListSections(grouped)))
      setItems(groupContentItemsWithDefaults(dbRows))
    } else {
      errors.push(itsR.reason instanceof AdminApiError ? itsR.reason.message : 'البطاقات')
      setItems(groupContentItemsWithDefaults([]))
      setPreviewSections(new Set(LIST_SECTIONS.map(s => s.section)))
    }

    if (prtR.status === 'fulfilled') {
      setPartners((prtR.value.data ?? []) as Partner[])
    } else {
      const msg = prtR.reason instanceof AdminApiError ? prtR.reason.message : 'الشركاء'
      errors.push(msg)
      if (String(msg).includes('permission denied')) {
        errors.push('شغّل ملف الهجرة 007_table_grants.sql في Supabase SQL Editor')
      }
    }

    if (errors.length) setApiError(errors.join(' · '))
    setLoading(false)
  }, [splitContent])

  // Session bootstrap: refresh once so a stale token never causes a silent 401.
  useEffect(() => {
    let mounted = true
    ;(async () => {
      await supabase.auth.refreshSession().catch(() => {})
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return
      if (!session) { router.push('/admin/login'); return }
      setUserEmail(session.user.email ?? '')
      setAuthReady(true)
      const allOpen: Record<string, boolean> = {}
      FIELD_GROUPS.forEach(g => { allOpen[g.id] = true })
      setOpenGroups(allOpen)
      loadAll()
    })()

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) router.push('/admin/login')
    })
    return () => { mounted = false; sub.subscription.unsubscribe() }
  }, [router, loadAll])

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 980)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // ─── Scalar content ───
  const getAuthHeader = async (): Promise<Record<string, string>> => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const saveHeroCarousel = async (slides: string[]) => {
    await adminApi.saveContent([{
      section: 'photos', key: 'hero-carousel',
      value_ar: JSON.stringify(slides),
      value_en: JSON.stringify(slides),
    }])
    setHeroSlides(slides)
  }

  const addHeroSlide = async (file: File) => {
    setPhotoUploading('hero-carousel')
    setPhotoError('')
    setPhotoSuccess('')
    try {
      const auth = await getAuthHeader()
      const form = new FormData()
      form.append('file', file)
      form.append('key', `hero-slide-${Date.now()}`)
      const res = await fetch('/api/admin/photos', { method: 'POST', headers: auth, body: form })
      const data = await res.json()
      if (!res.ok) { setPhotoError(data.error || 'فشل الرفع'); return }
      const next = [...heroSlides, data.url as string]
      await saveHeroCarousel(next)
      setPhotoSuccess('تمت إضافة صورة للواجهة الرئيسية ✓')
      setTimeout(() => setPhotoSuccess(''), 3000)
    } catch { setPhotoError('تعذّر الاتصال بالخادم') }
    finally { setPhotoUploading(null) }
  }

  const removeHeroSlide = async (index: number) => {
    if (!window.confirm('حذف هذه الصورة من عرض الواجهة؟')) return
    const next = heroSlides.filter((_, i) => i !== index)
    try {
      await saveHeroCarousel(next)
      setPhotoSuccess('تم حذف الصورة ✓')
      setTimeout(() => setPhotoSuccess(''), 3000)
    } catch { setPhotoError('تعذّر حذف الصورة') }
  }

  const setClosingPhotoFlag = async (key: 'show_bg' | 'show_portrait', on: boolean) => {
    const val = on ? '1' : '0'
    setContent(prev => prev.map(c =>
      c.section === 'closing' && c.key === key ? { ...c, value_ar: val, value_en: val } : c,
    ))
    try {
      await adminApi.saveContent([{ section: 'closing', key, value_ar: val, value_en: val }])
      setPhotoSuccess(on ? 'تم تفعيل العرض ✓' : 'تم إخفاء العنصر ✓')
      setTimeout(() => setPhotoSuccess(''), 2500)
    } catch (err) { handleApiError(err) }
  }

  const closingFlag = (key: 'show_bg' | 'show_portrait', defaultOn: boolean) => {
    const row = content.find(c => c.section === 'closing' && c.key === key)
    const v = (row?.value_ar ?? '').trim()
    if (v === '0') return false
    if (v === '1') return true
    return defaultOn
  }

  const clientsBgFlag = () => {
    const row = content.find(c => c.section === 'clients' && c.key === 'show_bg')
    const v = (row?.value_ar ?? '').trim()
    if (v === '0') return false
    if (v === '1') return true
    return true
  }

  const setClientsPhotoFlag = async (on: boolean) => {
    const val = on ? '1' : '0'
    setContent(prev => prev.map(c =>
      c.section === 'clients' && c.key === 'show_bg' ? { ...c, value_ar: val, value_en: val } : c,
    ))
    try {
      await adminApi.saveContent([{ section: 'clients', key: 'show_bg', value_ar: val, value_en: val }])
      setPhotoSuccess(on ? 'تم تفعيل خلفية عملاؤنا ✓' : 'تم إخفاء خلفية عملاؤنا ✓')
      setTimeout(() => setPhotoSuccess(''), 2500)
    } catch (err) { handleApiError(err) }
  }

  const patchLayoutEntry = (id: string, patch: Partial<{ order: number; visible: boolean }>) => {
    setHomepageLayout(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }

  const moveLayoutEntry = (index: number, dir: -1 | 1) => {
    setHomepageLayout(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order)
      const target = index + dir
      if (target < 0 || target >= sorted.length) return prev
      const next = [...sorted]
      const a = next[index]
      const b = next[target]
      next[index] = { ...b, order: a.order }
      next[target] = { ...a, order: b.order }
      return next.sort((x, y) => x.order - y.order)
    })
  }

  const saveHomepageLayout = async () => {
    setLayoutStatus('saving')
    try {
      const sorted = [...homepageLayout].sort((a, b) => a.order - b.order)
      const json = serializeHomepageLayout(sorted)
      await adminApi.saveContent([{ section: 'layout', key: 'homepage_sections', value_ar: json, value_en: json }])
      setLayoutStatus('saved')
      setTimeout(() => setLayoutStatus('idle'), 2500)
    } catch (err) {
      handleApiError(err)
      setLayoutStatus('error')
    }
  }

  const uploadPhoto = async (photoKey: string, file: File) => {
    setPhotoUploading(photoKey)
    setPhotoError('')
    setPhotoSuccess('')
    try {
      const auth = await getAuthHeader()
      const form = new FormData()
      form.append('file', file)
      form.append('key', photoKey)
      const res = await fetch('/api/admin/photos', { method: 'POST', headers: auth, body: form })
      const data = await res.json()
      if (!res.ok) { setPhotoError(data.error || 'فشل الرفع'); return }
      setPhotoUrls(prev => ({ ...prev, [photoKey]: data.url }))
      if (photoKey === 'closing-bg') {
        await adminApi.saveContent([{ section: 'closing', key: 'show_bg', value_ar: '1', value_en: '1' }])
        setContent(prev => prev.map(c =>
          c.section === 'closing' && c.key === 'show_bg' ? { ...c, value_ar: '1', value_en: '1' } : c,
        ))
      }
      if (photoKey === 'closing-portrait') {
        await adminApi.saveContent([{ section: 'closing', key: 'show_portrait', value_ar: '1', value_en: '1' }])
        setContent(prev => prev.map(c =>
          c.section === 'closing' && c.key === 'show_portrait' ? { ...c, value_ar: '1', value_en: '1' } : c,
        ))
      }
      if (photoKey === 'clients-bg') {
        await adminApi.saveContent([{ section: 'clients', key: 'show_bg', value_ar: '1', value_en: '1' }])
        setContent(prev => prev.map(c =>
          c.section === 'clients' && c.key === 'show_bg' ? { ...c, value_ar: '1', value_en: '1' } : c,
        ))
      }
      setPhotoSuccess('تم رفع الصورة بنجاح — سيظهر التحديث على الموقع خلال ثوانٍ ✓')
      setTimeout(() => setPhotoSuccess(''), 3000)
    } catch { setPhotoError('تعذّر الاتصال بالخادم') }
    finally { setPhotoUploading(null) }
  }

  const restorePhoto = async (photoKey: string) => {
    if (!window.confirm('هل تريد استعادة الصورة الأصلية؟')) return
    setPhotoUploading(photoKey)
    setPhotoError('')
    try {
      const auth = await getAuthHeader()
      await fetch(`/api/admin/photos?key=${photoKey}`, { method: 'DELETE', headers: auth })
      setPhotoUrls(prev => { const n = { ...prev }; delete n[photoKey]; return n })
      setPhotoSuccess('تمت استعادة الصورة الأصلية ✓')
      setTimeout(() => setPhotoSuccess(''), 3000)
    } catch { setPhotoError('تعذّر استعادة الصورة') }
    finally { setPhotoUploading(null) }
  }

  const toggleFieldVisibility = (section: string, key: string) => {
    setContent(prev => prev.map(c =>
      c.section === section && c.key === key ? { ...c, hidden: !c.hidden } : c
    ))
  }

  const handleContentChange = (section: string, key: string, field: 'value_ar' | 'value_en', val: string) => {
    setContent(prev => prev.map(c =>
      c.section === section && c.key === key ? { ...c, [field]: val } : c
    ))
  }

  const clearField = (section: string, key: string) => {
    if (!window.confirm('هل أنت متأكد من مسح هذا الحقل؟')) return
    setContent(prev => prev.map(c =>
      c.section === section && c.key === key ? { ...c, value_ar: '', value_en: '' } : c,
    ))
  }

  const restoreDefaultField = (section: string, key: string) => {
    const def = ALL_FIELDS.find(f => f.section === section && f.key === key)
    if (!def) return
    setContent(prev => prev.map(c =>
      c.section === section && c.key === key ? { ...c, value_ar: def.def.ar, value_en: def.def.en } : c,
    ))
  }

  const patchFieldStyle = (section: string, key: string, patch: Partial<FieldTextStyle>) => {
    setContent(prev => prev.map(c => {
      if (c.section !== section || c.key !== key) return c
      const next: FieldTextStyle = { ...c.style }
      for (const [k, v] of Object.entries(patch)) {
        if (v === undefined || v === '') delete next[k as keyof FieldTextStyle]
        else next[k as keyof FieldTextStyle] = v as string
      }
      return { ...c, style: isEmptyStyle(next) ? undefined : next }
    }))
  }

  const patchItemStyle = (itemId: string, patch: Partial<FieldTextStyle>) => {
    setItemStyles(prev => {
      const next: FieldTextStyle = { ...prev[itemId] }
      for (const [k, v] of Object.entries(patch)) {
        if (v === undefined || v === '') delete next[k as keyof FieldTextStyle]
        else next[k as keyof FieldTextStyle] = v as string
      }
      if (isEmptyStyle(next)) {
        const copy = { ...prev }
        delete copy[itemId]
        return copy
      }
      return { ...prev, [itemId]: next }
    })
  }

  const persistItemStyleToDb = async (itemId: string) => {
    const st = itemStyles[itemId]
    if (st && !isEmptyStyle(st)) {
      await adminApi.saveContent([{
        section: ITEM_STYLE_SECTION,
        key: itemId,
        value_ar: serializeFieldStyle(st),
        value_en: serializeFieldStyle(st),
      }])
      setDbKeys(prev => new Set(prev).add(`${ITEM_STYLE_SECTION}.${itemId}`))
    } else {
      await adminApi.deleteContentField(ITEM_STYLE_SECTION, itemId)
      setDbKeys(prev => {
        const next = new Set(prev)
        next.delete(`${ITEM_STYLE_SECTION}.${itemId}`)
        return next
      })
    }
  }

  const handleSaveContent = async () => {
    setSaveStatus('saving')
    setApiError('')
    try {
      const scalarRows = content.map(item => ({
        section: item.section, key: item.key,
        value_ar: item.value_ar, value_en: item.value_en,
      }))
      const visRows = content
        .filter(item => item.hidden)
        .map(item => ({
          section: item.section, key: item.key + '__vis',
          value_ar: '0', value_en: '0',
        }))
      const styleRows = content
        .filter(item => item.style && !isEmptyStyle(item.style))
        .map(item => ({
          section: item.section,
          key: item.key + STYLE_KEY_SUFFIX,
          value_ar: serializeFieldStyle(item.style!),
          value_en: serializeFieldStyle(item.style!),
        }))
      const itemStyleRows = Object.entries(itemStyles)
        .filter(([, st]) => !isEmptyStyle(st))
        .map(([id, st]) => ({
          section: ITEM_STYLE_SECTION,
          key: id,
          value_ar: serializeFieldStyle(st),
          value_en: serializeFieldStyle(st),
        }))
      await adminApi.saveContent([...scalarRows, ...visRows, ...styleRows, ...itemStyleRows])
      const toClearVis = content.filter(
        item => !item.hidden && dbKeys.has(`${item.section}.${item.key}__vis`),
      )
      await Promise.all(
        toClearVis.map(item => adminApi.deleteContentField(item.section, `${item.key}__vis`)),
      )
      // Remove style rows when admin chose "افتراضي" (cleared color/size in UI)
      await Promise.all(
        content
          .filter(item => isEmptyStyle(item.style))
          .map(item => adminApi.deleteContentField(item.section, `${item.key}${STYLE_KEY_SUFFIX}`)),
      )
      const staleItemStyleIds = new Set<string>([
        ...Object.keys(itemStyles),
        ...[...dbKeys]
          .filter(k => k.startsWith(`${ITEM_STYLE_SECTION}.`))
          .map(k => k.slice(ITEM_STYLE_SECTION.length + 1)),
      ])
      await Promise.all(
        [...staleItemStyleIds]
          .filter(id => !itemStyles[id] || isEmptyStyle(itemStyles[id]))
          .map(id => adminApi.deleteContentField(ITEM_STYLE_SECTION, id)),
      )
      setLastSavedAt(new Date().toLocaleTimeString('ar-SA'))
      setSaveStatus('saved')
      setDbKeys(buildAdminDbKeys(content, itemStyles))
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (err) {
      handleApiError(err)
      setSaveStatus('error')
    }
  }

  // ─── Repeating list items (content_items) CRUD ───
  const reloadItemsFromDb = useCallback(async () => {
    const reload = await adminApi.getItems()
    const dbRows = (reload.data ?? []) as ContentItem[]
    const grouped = groupContentItems(dbRows)
    setItems(groupContentItemsWithDefaults(dbRows))
    setPreviewSections(new Set(emptyListSections(grouped)))
    return dbRows
  }, [])

  const syncSectionFromAdminState = async (section: string, sectionRows: ContentItem[]) => {
    const payload = sectionRows.map((it, i) => ({
      title_ar: it.title_ar ?? '',
      title_en: it.title_en ?? '',
      desc_ar: it.desc_ar ?? '',
      desc_en: it.desc_en ?? '',
      icon: it.icon ?? null,
      active: it.active ?? true,
      sort_order: i,
    }))
    await adminApi.syncSectionItems(section, payload)
    await reloadItemsFromDb()
    setPreviewSections(prev => {
      const next = new Set(prev)
      next.delete(section)
      return next
    })
  }

  const addItem = async (section: string) => {
    setListStatus('saving')
    setApiError('')
    try {
      if (previewSections.has(section)) {
        await syncSectionFromAdminState(section, items[section] ?? [])
        setListStatus('idle')
        return
      }

      const sectionRows = items[section] ?? []
      const order = sectionRows.length
      const body = newListItemTemplate(section, order, sectionRows.filter(it => !!it.id))
      const { data } = await adminApi.addItem(body)
      const created = data as ContentItem
      setItems(prev => ({
        ...prev,
        [section]: [...(prev[section] ?? []), created],
      }))
      setPreviewSections(prev => {
        const next = new Set(prev)
        next.delete(section)
        return next
      })
      setListStatus('idle')
    } catch (err) {
      handleApiError(err)
      setListStatus('error')
    }
  }

  const patchItem = (section: string, rowKey: string, field: keyof ContentItem, val: ContentItem[keyof ContentItem]) =>
    setItems(prev => ({
      ...prev,
      [section]: prev[section].map((it, i) => {
        const key = it.id ?? `__row_${i}`
        return key === rowKey ? { ...it, [field]: val } : it
      }),
    }))

  const saveItem = async (item: ContentItem, rowKey: string) => {
    setSavingId(rowKey)
    setListStatus('saving')
    setApiError('')
    try {
      if (!item.id) {
        const sectionRows = (items[item.section] ?? []).map((it, i) =>
          (it.id ?? `__row_${i}`) === rowKey ? item : it,
        )
        if (previewSections.has(item.section)) {
          await syncSectionFromAdminState(item.section, sectionRows)
        } else {
          const { data } = await adminApi.addItem({
            section: item.section,
            title_ar: item.title_ar, title_en: item.title_en,
            desc_ar: item.desc_ar, desc_en: item.desc_en,
            icon: item.icon ?? null, active: item.active ?? true,
            sort_order: item.sort_order ?? 0,
          })
          const created = data as ContentItem
          setItems(prev => ({
            ...prev,
            [item.section]: (prev[item.section] ?? []).map((it, i) =>
              (it.id ?? `__row_${i}`) === rowKey ? created : it,
            ),
          }))
        }
      } else {
        await adminApi.updateItem({
          id: item.id,
          title_ar: item.title_ar, title_en: item.title_en,
          desc_ar: item.desc_ar, desc_en: item.desc_en,
          icon: item.icon || null, active: item.active, sort_order: item.sort_order,
        })
        await persistItemStyleToDb(item.id)
      }
      setPreviewSections(prev => {
        const next = new Set(prev)
        next.delete(item.section)
        return next
      })
      setListStatus('saved')
      setTimeout(() => setListStatus('idle'), 2500)
    } catch (err) {
      handleApiError(err)
      setListStatus('error')
    } finally {
      setSavingId(null)
    }
  }

  const toggleItemActive = async (item: ContentItem, rowKey: string, active: boolean) => {
    const section = item.section
    const nextRows = (items[section] ?? []).map((it, i) => {
      const key = it.id ?? `__row_${i}`
      return key === rowKey ? { ...it, active } : it
    })
    setItems(prev => ({ ...prev, [section]: nextRows }))

    setSavingId(rowKey)
    setListStatus('saving')
    setApiError('')
    try {
      const updated = nextRows.find((it, i) => (it.id ?? `__row_${i}`) === rowKey) ?? { ...item, active }
      const isPreview = previewSections.has(section) || nextRows.every(it => !it.id)
      if (!updated.id || isPreview) {
        await syncSectionFromAdminState(section, nextRows)
      } else {
        await adminApi.updateItem({
          id: updated.id,
          title_ar: updated.title_ar, title_en: updated.title_en,
          desc_ar: updated.desc_ar, desc_en: updated.desc_en,
          icon: updated.icon || null, active: updated.active, sort_order: updated.sort_order,
        })
      }
      setListStatus('saved')
      setTimeout(() => setListStatus('idle'), 1500)
    } catch (err) {
      handleApiError(err)
      setListStatus('error')
    } finally {
      setSavingId(null)
    }
  }

  const deleteItem = async (id?: string) => {
    if (!id) return
    if (!window.confirm('هل تريد حذف هذه البطاقة؟ لا يمكن التراجع إلا من النسخة الاحتياطية.')) return
    try {
      await adminApi.deleteItem(id)
      if (dbKeys.has(`${ITEM_STYLE_SECTION}.${id}`)) {
        await adminApi.deleteContentField(ITEM_STYLE_SECTION, id)
      }
      setItemStyles(prev => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      await reloadItemsFromDb()
    } catch (err) {
      handleApiError(err)
    }
  }

  const moveItem = async (section: string, index: number, dir: 'up' | 'down') => {
    const arr = [...(items[section] ?? [])]
    const j = dir === 'up' ? index - 1 : index + 1
    if (j < 0 || j >= arr.length) return
    ;[arr[index], arr[j]] = [arr[j], arr[index]]
    const updated = arr.map((it, i) => ({ ...it, sort_order: i }))
    setItems(prev => ({ ...prev, [section]: updated }))
    try {
      await adminApi.reorderItems(updated.map(it => ({ id: it.id!, sort_order: it.sort_order! })))
    } catch (err) {
      handleApiError(err)
    }
  }

  const seedDefaults = async () => {
    setSeeding(true)
    setApiError('')
    try {
      const res = await adminApi.seedDefaults()
      const its = await adminApi.getItems()
      const grouped = groupContentItems((its.data ?? []) as ContentItem[])
      setItems(grouped)
      setPreviewSections(new Set(emptyListSections(grouped)))
      alert(res.inserted > 0 ? `تم استيراد ${res.inserted} عنصرًا (الأقسام الفارغة فقط — لم يُحذف شيء موجود).` : 'كل الأقسام تحتوي على بيانات محفوظة بالفعل.')
    } catch (err) {
      handleApiError(err)
    } finally {
      setSeeding(false)
    }
  }

  const markRead = async (id: string) => {
    try {
      await adminApi.markMessageRead(id)
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
    } catch (err) {
      handleApiError(err)
    }
  }

  // ─── Logo upload (via server API, service role) ───
  const uploadLogo = async (file: File, target: string) => {
    setUploadError('')
    setUploadingFor(target)
    try {
      const { url } = await adminApi.uploadLogo(file)
      if (target === 'draft') {
        setDraft(prev => ({ ...prev, logo_url: url }))
      } else {
        patchPartner(target, 'logo_url', url)
        await adminApi.updatePartner({ ...partners.find(p => p.id === target), id: target, logo_url: url })
      }
    } catch (err) {
      setUploadError(err instanceof AdminApiError ? err.message : 'تعذّر رفع الصورة')
      if (err instanceof AdminApiError && err.status === 401) handleApiError(err)
    } finally {
      setUploadingFor(null)
    }
  }

  // ─── Partners CRUD ───
  const patchPartner = (id: string, field: keyof Partner, val: Partner[keyof Partner]) =>
    setPartners(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p))

  const addPartner = async () => {
    if (!draft.name.trim()) return
    setPStatus('saving')
    setApiError('')
    try {
      await adminApi.addPartner({
        name: draft.name.trim(),
        logo_url: draft.logo_url || null,
        website: draft.website || null,
        icon: draft.icon || null,
        active: draft.active ?? true,
        sort_order: partners.length,
      })
      setDraft(emptyDraft)
      setPStatus('saved')
      setTimeout(() => setPStatus('idle'), 2500)
      const prt = await adminApi.getPartners()
      setPartners((prt.data ?? []) as Partner[])
    } catch (err) {
      handleApiError(err)
      setPStatus('error')
    }
  }

  const savePartner = async (p: Partner) => {
    if (!p.id) return
    setPStatus('saving')
    setApiError('')
    try {
      await adminApi.updatePartner({
        id: p.id, name: p.name, logo_url: p.logo_url || null, website: p.website || null,
        icon: p.icon || null, active: p.active, sort_order: p.sort_order,
      })
      setPStatus('saved')
      setTimeout(() => setPStatus('idle'), 2500)
    } catch (err) {
      handleApiError(err)
      setPStatus('error')
    }
  }

  const deletePartner = async (id?: string) => {
    if (!id) return
    if (!window.confirm('هل تريد حذف هذا الشريك؟ لا يمكن التراجع إلا من النسخة الاحتياطية.')) return
    try {
      await adminApi.deletePartner(id)
      setPartners(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      handleApiError(err)
    }
  }

  const saveBackup = () => {
    try {
      // Only back up items that exist in the DB (have a real id) — skip preview/default placeholders
      // Also deduplicate by section+title_ar to prevent re-saving corrupted data
      const dbItems: Record<string, ContentItem[]> = {}
      Object.entries(items).forEach(([sec, rows]) => {
        const real = rows.filter(r => !!r.id)
        const seen = new Set<string>()
        const deduped = real.filter(r => {
          const k = `${r.section}::${r.title_ar}`
          if (seen.has(k)) return false
          seen.add(k)
          return true
        })
        if (deduped.length) dbItems[sec] = deduped
      })
      const payload = { content, customFields, items: dbItems, partners, savedAt: new Date().toISOString() }
      localStorage.setItem(ADMIN_BACKUP_KEY, JSON.stringify(payload))
      setBackupStatus('saved')
      setTimeout(() => setBackupStatus('idle'), 2500)
    } catch {
      setBackupStatus('error')
    }
  }

  const restoreBackup = async () => {
    const raw = localStorage.getItem(ADMIN_BACKUP_KEY)
    if (!raw) { alert('لا توجد نسخة احتياطية محفوظة بعد.'); return }
    if (!window.confirm('هل تريد استعادة النسخة الاحتياطية؟ سيتم استبدال المحتوى الحالي.')) return
    try {
      const parsed = JSON.parse(raw) as {
        content: ContentRow[]; customFields?: CustomField[]
        items: Record<string, ContentItem[]>; partners: Partner[]
      }
      const backupContent = parsed.content ?? []
      const backupCustom = parsed.customFields ?? []
      const backupItems = Object.values(parsed.items ?? {}).flat()
      const backupPartners = parsed.partners ?? []

      const scalarRows = backupContent.map(item => ({
        section: item.section, key: item.key, value_ar: item.value_ar, value_en: item.value_en,
      }))
      const customRows = backupCustom.map(f => ({
        section: f.section, key: f.key, value_ar: f.value_ar, value_en: f.value_en,
        label_ar: f.label_ar, label_en: f.label_en, is_custom: true, slot: f.slot, display_order: f.display_order,
      }))
      if (scalarRows.length || customRows.length) await adminApi.saveContent([...scalarRows, ...customRows])

      // Replace content_items — section by section (only touches sections present
      // in the backup, leaves all other sections untouched).
      const freshItems = await adminApi.getItems()
      const allDbItems = (freshItems.data ?? []) as ContentItem[]

      // Deduplicate backup items by (section + title_ar)
      const seenKeys = new Set<string>()
      const uniqueItems = backupItems.filter(it => {
        if (!it.id) return false
        const k = `${it.section}::${it.title_ar}`
        if (seenKeys.has(k)) return false
        seenKeys.add(k)
        return true
      })

      // Group backup items by section
      const backupBySec: Record<string, ContentItem[]> = {}
      uniqueItems.forEach(it => { (backupBySec[it.section] ??= []).push(it) })

      // For each section in backup: delete only that section's DB rows, then reinsert
      for (const [section, sectionItems] of Object.entries(backupBySec)) {
        const currentInSection = allDbItems.filter(it => it.section === section)
        await Promise.all(currentInSection.map(it => it.id ? adminApi.deleteItem(it.id) : Promise.resolve()))
        for (const it of sectionItems) {
          await adminApi.addItem({
            section: it.section, title_ar: it.title_ar, title_en: it.title_en,
            desc_ar: it.desc_ar, desc_en: it.desc_en, icon: it.icon ?? null,
            sort_order: it.sort_order ?? 0, active: it.active ?? true,
          })
        }
      }

      // Replace partners
      await Promise.all(partners.map(p => p.id ? adminApi.deletePartner(p.id) : Promise.resolve()))
      for (const p of backupPartners) {
        await adminApi.addPartner({
          name: p.name, logo_url: p.logo_url ?? null, website: p.website ?? null,
          icon: p.icon ?? null, sort_order: p.sort_order ?? 0, active: p.active ?? true,
        })
      }

      await loadAll()
      setBackupStatus('restored')
      setTimeout(() => setBackupStatus('idle'), 2500)
    } catch (err) {
      handleApiError(err)
      setBackupStatus('error')
    }
  }

  const unreadCount = messages.filter(m => !m.read).length

  const navItems: Array<{ id: Tab; label: string; Icon: React.ElementType; badge: number }> = [
    { id: 'messages', label: 'رسائل التواصل', Icon: MessageSquare, badge: unreadCount },
    { id: 'content',  label: 'نصوص الموقع',  Icon: Settings, badge: 0 },
    { id: 'lists',    label: 'إعادة هيكلة البطاقات', Icon: LayoutList, badge: 0 },
    { id: 'layout',   label: 'ترتيب الأقسام', Icon: LayoutGrid, badge: 0 },
    { id: 'partners', label: 'شركاء النجاح',   Icon: Handshake, badge: 0 },
    { id: 'photos',   label: 'صور الموقع',     Icon: ImageIcon, badge: 0 },
  ]

  const titleMap: Record<Tab, string> = {
    messages: 'رسائل التواصل',
    content: 'تعديل نصوص الموقع',
    lists: 'إعادة هيكلة البطاقات',
    layout: 'ترتيب أقسام الصفحة الرئيسية',
    partners: 'إدارة شركاء النجاح',
    photos: 'صور الموقع',
  }

  const contentGroups = FIELD_GROUPS.filter(group => {
    const q = contentSearch.trim().toLowerCase()
    if (!q) return true
    if (group.titleAr.toLowerCase().includes(q) || group.titleEn.toLowerCase().includes(q)) return true
    return group.fields.some(f =>
      f.labelAr.toLowerCase().includes(q) ||
      f.labelEn.toLowerCase().includes(q) ||
      `${f.section}.${f.key}`.toLowerCase().includes(q),
    )
  })

  if (!authReady) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: 14 }}>
        جارٍ التحقق من الجلسة...
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh', direction: 'rtl' }}>
      {/* Sidebar */}
      <aside style={{ width: isMobile ? '100%' : 248, background: C.panel, borderLeft: isMobile ? 'none' : `1px solid ${C.border}`, borderBottom: isMobile ? `1px solid ${C.border}` : 'none', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '22px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image src="/logo.png" alt="الدكتور طلحة غوث للمحاماة | Dr. Talha Ghawth Law Firm" width={160} height={34} style={{ objectFit: 'contain', width: isMobile ? 130 : 150, height: 'auto' }} />
          <div style={{ lineHeight: 1.3 }}>
            <p style={{ color: C.goldDark, fontSize: 11, margin: 0 }}>لوحة التحكم</p>
          </div>
        </div>

        <nav style={{ padding: '12px', flex: 1, display: isMobile ? 'grid' : 'block', gridTemplateColumns: isMobile ? '1fr 1fr' : undefined, gap: isMobile ? 6 : undefined }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: tab === item.id ? 'rgba(196,151,58,0.12)' : 'transparent',
                color: tab === item.id ? C.goldDark : C.muted,
                fontSize: 14, fontFamily: 'inherit',
                fontWeight: tab === item.id ? 700 : 500,
                marginBottom: 2, textAlign: 'right', justifyContent: 'flex-start',
              }}
            >
              <item.Icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge > 0 && (
                <span style={{ background: C.gold, color: '#FFFFFF', borderRadius: 100, padding: '1px 8px', fontSize: 11, fontWeight: 700 }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '12px', borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 11, color: C.dim, padding: '4px 14px', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</p>
          <button
            onClick={handleSignOut}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', color: C.muted, fontSize: 14, fontFamily: 'inherit', justifyContent: 'flex-start' }}
          >
            <LogOut size={16} />
            تسجيل الخروج
          </button>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, color: C.muted, fontSize: 14, textDecoration: 'none', marginTop: 2 }}>
            <Globe size={16} />
            عرض الموقع
          </a>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', background: C.bg }}>
        {/* Top bar */}
        <div style={{ padding: '16px 28px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.panel }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>{titleMap[tab]}</h1>
          <button
            onClick={loadAll}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: C.soft, border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}
          >
            <RefreshCw size={14} />
            تحديث
          </button>
        </div>

        <div style={{ padding: isMobile ? 14 : 28 }}>
          {apiError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, color: '#B91C1C', fontSize: 13.5 }}>
              <AlertCircle size={18} />
              <span style={{ flex: 1 }}>{apiError}</span>
              <button onClick={() => setApiError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B91C1C' }}><X size={16} /></button>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
            <button type="button" onClick={saveBackup} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', color: C.text, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>
              حفظ نسخة احتياطية الآن
            </button>
            <button type="button" onClick={restoreBackup} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #F59E0B', background: '#FFFBEB', color: '#92400E', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>
              استعادة النسخة الاحتياطية
            </button>
            {backupStatus === 'saved' && <StatusOK text="تم حفظ النسخة الاحتياطية" />}
            {backupStatus === 'restored' && <StatusOK text="تمت الاستعادة بنجاح" />}
            {backupStatus === 'error' && <StatusErr text="تعذر تنفيذ العملية" />}
          </div>

          {/* ─── Messages Tab ─── */}
          {tab === 'messages' && (
            <div>
              {messages.length === 0 && !loading && <EmptyState text="لا توجد رسائل حتى الآن" />}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      background: msg.read ? C.panel : 'rgba(196,151,58,0.06)',
                      border: `1px solid ${msg.read ? C.border : 'rgba(196,151,58,0.3)'}`,
                      borderRadius: 12, padding: '16px 20px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{msg.name}</span>
                          {!msg.read && <span style={{ background: C.gold, color: '#FFFFFF', fontSize: 10, borderRadius: 100, padding: '2px 8px', fontWeight: 700 }}>جديد</span>}
                          <span style={{ fontSize: 11, color: C.dim, marginLeft: 'auto', marginRight: 0 }}>
                            {msg.created_at ? new Date(msg.created_at).toLocaleDateString('ar-SA') : ''}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 10 }}>
                          {msg.phone && (
                            <a href={`tel:${msg.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 5, color: C.muted, fontSize: 13, textDecoration: 'none' }}>
                              <Phone size={13} />{msg.phone}
                            </a>
                          )}
                          {msg.email && (
                            <a href={`mailto:${msg.email}`} style={{ display: 'flex', alignItems: 'center', gap: 5, color: C.muted, fontSize: 13, textDecoration: 'none' }}>
                              <Mail size={13} />{msg.email}
                            </a>
                          )}
                        </div>
                        <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{msg.message}</p>
                      </div>
                      {!msg.read && msg.id && (
                        <button
                          onClick={() => markRead(msg.id!)}
                          style={{ flexShrink: 0, padding: '6px 14px', background: 'rgba(196,151,58,0.1)', border: '1px solid rgba(196,151,58,0.3)', borderRadius: 8, color: C.goldDark, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}
                        >
                          <CheckCircle2 size={13} />
                          تمييز كمقروء
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Content Tab (all scalar text + inline cards + custom fields) ─── */}
          {tab === 'content' && (
            <div>
              <div style={{ background: 'rgba(196,151,58,0.08)', border: '1px solid rgba(196,151,58,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 16, fontSize: 13.5, color: C.goldDark, lineHeight: 1.7, maxWidth: 920 }}>
                النصوص والألوان وأحجام الخطوط هنا مطابقة للموقع. استخدم «تنسيق النص» أسفل كل حقل. بعد الحفظ افتح «عرض الموقع» أو حدّث (F5).
              </div>

              <div style={{ maxWidth: 920, marginBottom: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button type="button" onClick={() => { const a: Record<string, boolean> = {}; FIELD_GROUPS.forEach(g => { a[g.id] = true }); setOpenGroups(a) }} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  فتح كل الأقسام
                </button>
                <button type="button" onClick={() => setOpenGroups({})} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  إغلاق الكل
                </button>
                <button type="button" onClick={seedDefaults} disabled={seeding} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.gold}`, background: '#FFFBEB', color: C.goldDark, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>
                  {seeding ? 'جارٍ الاستيراد...' : 'استيراد بطاقات افتراضية (للأقسام الفارغة)'}
                </button>
              </div>

              <div style={{ maxWidth: 920, marginBottom: 14 }}>
                <div style={{ position: 'relative' }}>
                  <Search size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.dim }} />
                  <input
                    value={contentSearch}
                    onChange={e => setContentSearch(e.target.value)}
                    placeholder="ابحث عن القسم أو الحقل (مثال: من نحن / title / contact)"
                    style={{ ...adminInputStyle, paddingRight: 36 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 920 }}>
                {contentGroups.length === 0 && (
                  <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, color: C.muted, fontSize: 13 }}>
                    لا توجد نتائج مطابقة للبحث.
                  </div>
                )}
                {contentGroups.map(group => {
                  const isOpen = openGroups[group.id] ?? false
                  const inlineLists = listSectionsForGroup(group.id)
                  const cardCount = inlineLists.reduce((n, s) => n + (items[s.section]?.length ?? 0), 0)
                  const partnerCount = group.id === 'partners' ? partners.length : 0
                  return (
                    <div key={group.id} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
                      <button
                        onClick={() => setOpenGroups(prev => ({ ...prev, [group.id]: !isOpen }))}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', border: 'none', background: isOpen ? C.goldSoft : C.panel, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'right' }}
                      >
                        <span style={{ width: 4, height: 20, borderRadius: 4, background: C.gold }} />
                        <span style={{ flex: 1, fontSize: 15, fontWeight: 800, color: C.text }}>{group.titleAr}</span>
                        <span style={{ fontSize: 12, color: C.dim }}>
                          {group.fields.length} حقل
                          {cardCount > 0 ? ` · ${cardCount} عنصر` : ''}
                          {partnerCount > 0 ? ` · ${partnerCount} شريك` : ''}
                        </span>
                        <ChevronDown size={18} style={{ color: C.muted, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </button>

                      {isOpen && (
                        <div style={{ padding: '6px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                          <span style={{ fontSize: 12, color: C.muted }}>{GROUP_HELP[group.id] ?? 'هذا القسم يظهر في واجهة الموقع.'}</span>

                          {group.fields.map(field => {
                            const item = content.find(c => c.section === field.section && c.key === field.key)
                            const isHidden = item?.hidden ?? false
                            return (
                              <div key={`${field.section}_${field.key}`} style={{ background: isHidden ? '#F5F5F5' : C.soft, border: `1px solid ${isHidden ? '#DDD' : C.border}`, borderRadius: 12, padding: '16px 18px', opacity: isHidden ? 0.7 : 1, transition: 'all 0.2s' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                  <Pen size={13} style={{ color: isHidden ? C.dim : C.gold, flexShrink: 0 }} />
                                  <span style={{ fontSize: 14, fontWeight: 700, color: isHidden ? C.muted : C.text, textDecoration: isHidden ? 'line-through' : 'none' }}>{field.labelAr}</span>
                                  {dbKeys.has(`${field.section}.${field.key}`) && (
                                    <span style={{ fontSize: 10, background: isHidden ? '#F3F4F6' : '#DCFCE7', color: isHidden ? C.dim : '#166534', padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>محفوظ</span>
                                  )}
                                  {isHidden && (
                                    <span style={{ fontSize: 10, background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>مخفي من الموقع</span>
                                  )}
                                  <span style={{ marginInlineStart: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                                    {/* Visibility Toggle */}
                                    <button
                                      type="button"
                                      onClick={() => toggleFieldVisibility(field.section, field.key)}
                                      title={isHidden ? 'إظهار في الموقع' : 'إخفاء من الموقع'}
                                      style={{
                                        padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
                                        display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700,
                                        border: isHidden ? '1px solid #F59E0B' : `1px solid ${C.border}`,
                                        background: isHidden ? '#FFFBEB' : '#fff',
                                        color: isHidden ? '#92400E' : C.muted,
                                      }}
                                    >
                                      {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                                      {isHidden ? 'مخفي' : 'ظاهر'}
                                    </button>
                                    <button type="button" onClick={() => restoreDefaultField(field.section, field.key)} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                                      استعادة النص الافتراضي
                                    </button>
                                    <button type="button" onClick={() => clearField(field.section, field.key)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>
                                      مسح الحقل
                                    </button>
                                  </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                                  <div>
                                    <label style={{ display: 'block', fontSize: 11, color: C.muted, marginBottom: 6, letterSpacing: '0.05em' }}>بالعربية</label>
                                    {field.multiline ? (
                                      <textarea value={item?.value_ar ?? ''} onChange={e => handleContentChange(field.section, field.key, 'value_ar', e.target.value)} style={{ ...adminInputStyle, minHeight: 88, resize: 'vertical', lineHeight: 1.6, opacity: isHidden ? 0.5 : 1 }} dir="rtl" placeholder={field.labelAr} disabled={isHidden} />
                                    ) : (
                                      <input value={item?.value_ar ?? ''} onChange={e => handleContentChange(field.section, field.key, 'value_ar', e.target.value)} style={{ ...adminInputStyle, opacity: isHidden ? 0.5 : 1 }} dir="rtl" placeholder={field.labelAr} disabled={isHidden} />
                                    )}
                                  </div>
                                  <div>
                                    <label style={{ display: 'block', fontSize: 11, color: C.muted, marginBottom: 6, letterSpacing: '0.05em' }}>English</label>
                                    {field.multiline ? (
                                      <textarea value={item?.value_en ?? ''} onChange={e => handleContentChange(field.section, field.key, 'value_en', e.target.value)} style={{ ...adminInputStyle, minHeight: 88, resize: 'vertical', lineHeight: 1.6, opacity: isHidden ? 0.5 : 1 }} dir="ltr" placeholder={field.labelEn} disabled={isHidden} />
                                    ) : (
                                      <input value={item?.value_en ?? ''} onChange={e => handleContentChange(field.section, field.key, 'value_en', e.target.value)} style={{ ...adminInputStyle, opacity: isHidden ? 0.5 : 1 }} dir="ltr" placeholder={field.labelEn} disabled={isHidden} />
                                    )}
                                  </div>
                                </div>
                                {!isHidden && (
                                  <FieldStyleControls
                                    style={item?.style}
                                    onChange={patch => patchFieldStyle(field.section, field.key, patch)}
                                    onReset={() => patchFieldStyle(field.section, field.key, { color: undefined, fontSize: undefined, descColor: undefined, descFontSize: undefined })}
                                  />
                                )}
                              </div>
                            )
                          })}

                          {group.id === 'partners' && (
                            <div style={{ marginTop: 8, padding: 16, background: C.soft, border: `1px solid ${C.border}`, borderRadius: 12 }}>
                              <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: C.text }}>
                                شركاء النجاح ({partners.length}) — يظهرون في الشريط المتحرك
                              </p>
                              {partners.length === 0 && (
                                <p style={{ margin: '0 0 10px', fontSize: 12, color: C.muted }}>لا يوجد شركاء بعد. أضفهم من تبويب «شركاء النجاح» أو بالزر أدناه.</p>
                              )}
                              {partners.slice(0, 6).map(p => (
                                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                                  {p.logo_url
                                    // eslint-disable-next-line @next/next/no-img-element
                                    ? <img src={p.logo_url} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                                    : <span style={{ width: 32, height: 32, borderRadius: 8, background: C.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{p.name.charAt(0)}</span>}
                                  <span style={{ flex: 1, fontSize: 13 }}>{p.name}</span>
                                  <span style={{ fontSize: 11, color: p.active ? '#166534' : C.dim }}>{p.active ? 'ظاهر' : 'مخفي'}</span>
                                </div>
                              ))}
                              {partners.length > 6 && <p style={{ fontSize: 11, color: C.dim, margin: '8px 0 0' }}>+ {partners.length - 6} شركاء آخرين في التبويب المخصص</p>}
                              <button type="button" onClick={() => setTab('partners')} style={{ marginTop: 12, padding: '8px 14px', borderRadius: 8, border: `1px solid ${C.gold}`, background: '#fff', color: C.goldDark, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                إضافة / تعديل الشركاء
                              </button>
                            </div>
                          )}

                          {inlineLists.map(sec => (
                            <div key={sec.section} style={{ marginTop: 6 }}>
                              <ListSectionEditor
                                sec={sec}
                                rows={items[sec.section] ?? []}
                                isPreview={previewSections.has(sec.section)}
                                isMobile={isMobile}
                                savingId={savingId}
                                itemStyles={itemStyles}
                                onPatchItemStyle={patchItemStyle}
                                onAdd={() => addItem(sec.section)}
                                onPatch={(id, f, v) => patchItem(sec.section, id, f, v)}
                                onSave={(item, key) => saveItem(item, key)}
                                onToggleActive={(item, key, active) => toggleItemActive(item, key, active)}
                                onDelete={deleteItem}
                                onMove={(index, dir) => moveItem(sec.section, index, dir)}
                              />
                            </div>
                          ))}
                          {inlineLists.length > 0 && (
                            <div style={{ height: 20, marginTop: 6 }}>
                              {listStatus === 'saved' && <StatusOK text="تم الحفظ — حدّث الموقع" />}
                              {listStatus === 'error' && <StatusErr text="حدث خطأ" />}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div style={{ position: 'sticky', bottom: 0, marginTop: 24, padding: '14px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={handleSaveContent} disabled={saveStatus === 'saving'} style={goldBtn(saveStatus === 'saving')}>
                  <Save size={16} />
                  {saveStatus === 'saving' ? 'جارٍ الحفظ...' : 'حفظ كل التعديلات'}
                </button>
                {saveStatus === 'saved' && (
                  <StatusOK text={lastSavedAt ? `تم الحفظ — حدّث الموقع لرؤية التغيير (${lastSavedAt})` : 'تم الحفظ بنجاح'} />
                )}
                {saveStatus === 'error' && <StatusErr text="حدث خطأ أثناء الحفظ" />}
                <a href="/ar" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: C.goldDark, fontWeight: 700, textDecoration: 'none' }}>
                  عرض الموقع بعد الحفظ ↗
                </a>
              </div>
            </div>
          )}

          {/* ─── Lists Tab (repeating cards) ─── */}
          {tab === 'lists' && (
            <div>
              <div style={{ background: 'rgba(196,151,58,0.08)', border: '1px solid rgba(196,151,58,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 18, fontSize: 13.5, color: C.goldDark, lineHeight: 1.7, maxWidth: 920 }}>
                هنا تضيف وتحذف وترتّب بطاقات الأقسام (الخدمات، لماذا نحن، الأهداف، التخصصات، القطاعات). اضغط «حفظ» بعد تعديل أي بطاقة. إذا كانت الأقسام فارغة، استورد البيانات الافتراضية.
              </div>

              <div style={{ marginBottom: 18 }}>
                <button type="button" onClick={seedDefaults} disabled={seeding} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#fff', border: `1px solid ${C.gold}`, borderRadius: 10, color: C.goldDark, fontSize: 13.5, fontWeight: 700, cursor: seeding ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                  {seeding ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                  استيراد البيانات الافتراضية (للأقسام الفارغة)
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 920 }}>
                {LIST_SECTIONS.map(sec => (
                  <ListSectionEditor
                    key={sec.section}
                    sec={sec}
                    rows={items[sec.section] ?? []}
                    isPreview={previewSections.has(sec.section)}
                    isMobile={isMobile}
                    savingId={savingId}
                    itemStyles={itemStyles}
                    onPatchItemStyle={patchItemStyle}
                    onAdd={() => addItem(sec.section)}
                    onPatch={(id, field, val) => patchItem(sec.section, id, field, val)}
                    onSave={(item, key) => saveItem(item, key)}
                    onToggleActive={(item, key, active) => toggleItemActive(item, key, active)}
                    onDelete={deleteItem}
                    onMove={(index, dir) => moveItem(sec.section, index, dir)}
                  />
                ))}
              </div>

              <div style={{ marginTop: 18, height: 22 }}>
                {listStatus === 'saved' && <StatusOK text="تم الحفظ" />}
                {listStatus === 'error' && <StatusErr text="حدث خطأ" />}
              </div>
            </div>
          )}

          {/* ─── Layout Tab (homepage section order) ─── */}
          {tab === 'layout' && (
            <div style={{ maxWidth: 920 }}>
              <div style={{ background: 'rgba(196,151,58,0.08)', border: '1px solid rgba(196,151,58,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 18, fontSize: 13.5, color: C.goldDark, lineHeight: 1.7 }}>
                حدّد ترتيب ظهور أقسام الصفحة الرئيسية بالرقم، وألغِ «ظاهر» لإخفاء قسم بالكامل. اضغط «حفظ الترتيب» بعد التعديل.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[...homepageLayout].sort((a, b) => a.order - b.order).map((entry, index) => {
                  const meta = HOMEPAGE_SECTIONS.find(s => s.id === entry.id)
                  if (!meta) return null
                  return (
                    <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: C.panel, border: `1px solid ${entry.visible ? C.border : '#FECACA'}`, borderRadius: 12, opacity: entry.visible ? 1 : 0.75 }}>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={entry.order}
                        onChange={e => patchLayoutEntry(entry.id, { order: Number(e.target.value) || 1 })}
                        style={{ width: 64, padding: '8px 10px', borderRadius: 8, border: `1px solid ${C.border}`, fontFamily: 'inherit', fontSize: 14, fontWeight: 700, textAlign: 'center' }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.text }}>{meta.titleAr}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: C.dim }}>{meta.titleEn}</p>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.muted, cursor: 'pointer' }}>
                        <input type="checkbox" checked={entry.visible} onChange={e => patchLayoutEntry(entry.id, { visible: e.target.checked })} />
                        ظاهر
                      </label>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" disabled={index === 0} onClick={() => moveLayoutEntry(index, -1)} style={{ padding: 8, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: index === 0 ? 'not-allowed' : 'pointer' }}>
                          <ArrowUp size={14} />
                        </button>
                        <button type="button" disabled={index === homepageLayout.length - 1} onClick={() => moveLayoutEntry(index, 1)} style={{ padding: 8, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: index === homepageLayout.length - 1 ? 'not-allowed' : 'pointer' }}>
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
                <button type="button" onClick={saveHomepageLayout} disabled={layoutStatus === 'saving'}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: C.gold, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: layoutStatus === 'saving' ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                  {layoutStatus === 'saving' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  حفظ الترتيب
                </button>
                {layoutStatus === 'saved' && <StatusOK text="تم حفظ الترتيب" />}
                {layoutStatus === 'error' && <StatusErr text="حدث خطأ" />}
              </div>
            </div>
          )}

          {/* ─── Photos Tab ─── */}
          {tab === 'photos' && (() => {
            const PHOTOS = [
              { key: 'about-lawyer',  labelAr: 'صورة قسم «من نحن»',            section: 'من نحن',               original: '/assets/team-lawyer.jpg' },
              { key: 'team-main',     labelAr: 'الصورة الرئيسية لقسم «فريقنا»', section: 'فريقنا',              original: '/assets/consultation.jpg' },
              { key: 'team-floating', labelAr: 'الصورة الصغيرة العائمة (فريق)', section: 'فريقنا',             original: '/assets/digital-law.jpg' },
              { key: 'goals-bg',      labelAr: 'خلفية الأهداف الاستراتيجية',    section: 'أهدافنا الاستراتيجية', original: '/assets/global-reach.jpg' },
              { key: 'clients-bg',    labelAr: 'خلفية قسم «عملاؤنا»',           section: 'عملاؤنا',            original: '/assets/global-reach.jpg' },
            ]
            const CLOSING_PHOTOS = [
              { key: 'closing-bg', labelAr: 'خلفية القسم (صورة كاملة خلف النص)', original: '/assets/scales-dramatic.jpg', toggleKey: 'show_bg' as const, toggleLabel: '✓ إظهار صورة الخلفية على الموقع', defaultOn: true },
              { key: 'closing-portrait', labelAr: 'صورة دائرية بجانب اسم المؤسس', original: '', toggleKey: 'show_portrait' as const, toggleLabel: '✓ إظهار الصورة بجانب الاسم', defaultOn: false },
            ]
            const defaultHero = photoUrls['hero-banner'] || '/assets/hero-banner.jpg'
            const heroPreview = [
              defaultHero,
              ...heroSlides.filter(s => s !== defaultHero),
            ]
            return (
              <div>
                <div style={{ background: 'rgba(196,151,58,0.08)', border: '1px solid rgba(196,151,58,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 20, fontSize: 13.5, color: C.goldDark, lineHeight: 1.7, maxWidth: 920 }}>
                  ارفع صورًا جديدة لأي قسم — الصورة الافتراضية تبقى دائمًا مع الصور المضافة. الحد الأقصى 8 ميجابايت (JPG, PNG, WEBP).
                </div>
                {photoSuccess && <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 8, padding: '10px 16px', marginBottom: 14, color: '#166534', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}><CheckCircle2 size={16} />{photoSuccess}</div>}
                {photoError  && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 16px', marginBottom: 14, color: '#DC2626', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}><AlertCircle size={16} />{photoError}</div>}

                <div style={{ background: C.panel, border: `1px solid ${C.gold}`, borderRadius: 14, padding: 18, marginBottom: 20, maxWidth: 920 }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 800, color: C.text }}>شعار الموقع (هيدر + تذييل)</h3>
                  <p style={{ margin: '0 0 14px', fontSize: 12.5, color: C.dim, lineHeight: 1.6 }}>
                    يمكنك رفع شعار مختلف لأعلى الصفحة (الهيدر) وأسفلها (التذييل). PNG بخلفية شفافة مُفضّل. بدون رفع مخصّص يُستخدم الشعار الافتراضي.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16 }}>
                    {([
                      { key: 'logo-header', labelAr: 'شعار الهيدر (أعلى الموقع)', hint: 'شريط التنقل' },
                      { key: 'logo-footer', labelAr: 'شعار التذييل (أسفل الموقع)', hint: 'قسم التذييل' },
                    ] as const).map(logo => {
                      const current = photoUrls[logo.key]
                      const isCustom = !!current
                      const isUploading = photoUploading === logo.key
                      const displaySrc = current || '/logo.png'
                      return (
                        <div key={logo.key} style={{ background: C.soft, border: `1px solid ${isCustom ? C.gold : C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                          <div style={{ position: 'relative', height: 120, background: C.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={displaySrc} alt={logo.labelAr} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', opacity: isUploading ? 0.4 : 1 }} />
                            {isUploading && (
                              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.5)' }}>
                                <Loader2 size={24} style={{ color: C.gold, animation: 'spin 1s linear infinite' }} />
                              </div>
                            )}
                            {isCustom && (
                              <span style={{ position: 'absolute', top: 8, right: 8, background: C.gold, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100 }}>مُخصّص</span>
                            )}
                          </div>
                          <div style={{ padding: '12px 14px' }}>
                            <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 2px' }}>{logo.labelAr}</p>
                            <p style={{ fontSize: 11, color: C.dim, margin: '0 0 10px' }}>{logo.hint}</p>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: C.gold, color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: isUploading ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                                <Upload size={14} />
                                {isCustom ? 'تغيير الشعار' : 'رفع شعار'}
                                <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" style={{ display: 'none' }} disabled={isUploading}
                                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadPhoto(logo.key, f); e.target.value = '' }} />
                              </label>
                              {isCustom && (
                                <button type="button" onClick={() => restorePhoto(logo.key)} disabled={isUploading}
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, fontSize: 13, cursor: isUploading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                                  <RotateCcw size={13} /> استعادة الافتراضي
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div style={{ background: C.panel, border: `1px solid ${C.gold}`, borderRadius: 14, padding: 18, marginBottom: 20, maxWidth: 920 }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 800, color: C.text }}>صور الواجهة الرئيسية (عرض متعدد)</h3>
                  <p style={{ margin: '0 0 14px', fontSize: 12.5, color: C.dim, lineHeight: 1.6 }}>
                    الصورة الافتراضية (#1) تبقى دائمًا — أضف صورًا إضافية (#2، #3…) وتتبدّل تلقائيًا في أعلى الموقع.
                  </p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                    {heroPreview.map((src, i) => (
                      <div key={`${src}-${i}`} style={{ position: 'relative', width: 140, height: 88, borderRadius: 10, overflow: 'hidden', border: `1px solid ${i === 0 ? C.gold : C.border}` }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {i > 0 && (
                          <button type="button" onClick={() => removeHeroSlide(i - 1)} title="حذف"
                            style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.65)', border: 'none', borderRadius: 6, padding: 4, cursor: 'pointer', color: '#fff' }}>
                            <Trash2 size={12} />
                          </button>
                        )}
                        {i === 0 && (
                          <span style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 100 }}>افتراضية</span>
                        )}
                        <span style={{ position: 'absolute', bottom: 4, right: 4, background: C.gold, color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 100 }}>{i + 1}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: C.gold, color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: photoUploading === 'hero-carousel' ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                      <Plus size={14} />
                      {photoUploading === 'hero-carousel' ? 'جاري الرفع…' : 'إضافة صورة للواجهة'}
                      <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" style={{ display: 'none' }} disabled={photoUploading === 'hero-carousel'}
                        onChange={e => { const f = e.target.files?.[0]; if (f) addHeroSlide(f); e.target.value = '' }} />
                    </label>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: C.soft, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: C.muted }}>
                      <Upload size={14} />
                      استبدال الصورة الافتراضية
                      <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" style={{ display: 'none' }}
                        onChange={e => { const f = e.target.files?.[0]; if (f) uploadPhoto('hero-banner', f); e.target.value = '' }} />
                    </label>
                  </div>
                </div>

                <div style={{ marginBottom: 20, maxWidth: 920 }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 800, color: C.text }}>الاقتباس الختامي — صورتان منفصلتان</h3>
                  <p style={{ margin: '0 0 10px', fontSize: 12, color: C.dim, lineHeight: 1.6 }}>
                    الخلفية والصورة بجانب الاسم مستقلتان: ارفع كل واحدة في مكانها، ثم فعّل مربع «إظهار» أسفلها.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16 }}>
                    {CLOSING_PHOTOS.map(ph => {
                      const current = photoUrls[ph.key]
                      const isCustom = !!current
                      const isUploading = photoUploading === ph.key
                      const displaySrc = current || ph.original
                      const toggleOn = closingFlag(ph.toggleKey, ph.defaultOn)
                      return (
                        <div key={ph.key} style={{ background: C.panel, border: `1px solid ${toggleOn ? C.gold : C.border}`, borderRadius: 14, overflow: 'hidden' }}>
                          <div style={{ position: 'relative', height: 160, background: '#1A1A1A', overflow: 'hidden' }}>
                            {displaySrc ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={displaySrc} alt={ph.labelAr} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isUploading ? 0.4 : 1 }} />
                            ) : (
                              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.dim, fontSize: 13 }}>لم تُرفع صورة بعد</div>
                            )}
                            {isUploading && (
                              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Loader2 size={28} style={{ color: C.gold, animation: 'spin 1s linear infinite' }} />
                              </div>
                            )}
                          </div>
                          <div style={{ padding: '14px 16px' }}>
                            <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 10px' }}>{ph.labelAr}</p>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, cursor: 'pointer', fontSize: 13, color: C.muted }}>
                              <input type="checkbox" checked={toggleOn} onChange={e => setClosingPhotoFlag(ph.toggleKey, e.target.checked)} />
                              {ph.toggleLabel}
                            </label>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: C.gold, color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: isUploading ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                                <Upload size={14} />
                                {isCustom ? 'تغيير الصورة' : 'رفع صورة'}
                                <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" style={{ display: 'none' }} disabled={isUploading}
                                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadPhoto(ph.key, f); e.target.value = '' }} />
                              </label>
                              {isCustom && (
                                <button type="button" onClick={() => restorePhoto(ph.key)} disabled={isUploading}
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: C.soft, border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, fontSize: 13, cursor: isUploading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                                  <RotateCcw size={13} /> حذف الصورة
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: 20, maxWidth: 920 }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 800, color: C.text }}>خلفية قسم «عملاؤنا»</h3>
                  <p style={{ margin: '0 0 10px', fontSize: 12, color: C.dim, lineHeight: 1.6 }}>
                    ارفع صورة خلفية خفيفة لقسم عملاؤنا، ثم فعّل أو ألغِ إظهارها.
                  </p>
                  {(() => {
                    const key = 'clients-bg'
                    const current = photoUrls[key]
                    const isCustom = !!current
                    const isUploading = photoUploading === key
                    const displaySrc = current || '/assets/global-reach.jpg'
                    const toggleOn = clientsBgFlag()
                    return (
                      <div style={{ background: C.panel, border: `1px solid ${toggleOn ? C.gold : C.border}`, borderRadius: 14, overflow: 'hidden', maxWidth: 460 }}>
                        <div style={{ position: 'relative', height: 160, background: '#1A1A1A', overflow: 'hidden' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={displaySrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isUploading ? 0.4 : 0.85 }} />
                          {isUploading && (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Loader2 size={28} style={{ color: C.gold, animation: 'spin 1s linear infinite' }} />
                            </div>
                          )}
                        </div>
                        <div style={{ padding: '14px 16px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, cursor: 'pointer', fontSize: 13, color: C.muted }}>
                            <input type="checkbox" checked={toggleOn} onChange={e => setClientsPhotoFlag(e.target.checked)} />
                            ✓ إظهار صورة الخلفية على الموقع
                          </label>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: C.gold, color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: isUploading ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                              <Upload size={14} />
                              {isCustom ? 'تغيير الصورة' : 'رفع صورة'}
                              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" style={{ display: 'none' }} disabled={isUploading}
                                onChange={e => { const f = e.target.files?.[0]; if (f) uploadPhoto(key, f); e.target.value = '' }} />
                            </label>
                            {isCustom && (
                              <button type="button" onClick={() => restorePhoto(key)} disabled={isUploading}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: C.soft, border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, fontSize: 13, cursor: isUploading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                                <RotateCcw size={13} /> حذف الصورة
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16, maxWidth: 900 }}>
                  {PHOTOS.map(ph => {
                    const current = photoUrls[ph.key]
                    const isCustom = !!current
                    const isUploading = photoUploading === ph.key
                    const displaySrc = current || ph.original
                    return (
                      <div key={ph.key} style={{ background: C.panel, border: `1px solid ${isCustom ? C.gold : C.border}`, borderRadius: 14, overflow: 'hidden' }}>
                        {/* Preview */}
                        <div style={{ position: 'relative', height: 180, background: '#1A1A1A', overflow: 'hidden' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={displaySrc} alt={ph.labelAr} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isUploading ? 0.4 : 1, transition: 'opacity 0.2s' }} />
                          {isUploading && (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Loader2 size={28} style={{ color: C.gold, animation: 'spin 1s linear infinite' }} />
                            </div>
                          )}
                          {isCustom && (
                            <span style={{ position: 'absolute', top: 8, right: 8, background: C.gold, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100 }}>مُحدَّثة</span>
                          )}
                        </div>
                        {/* Info + actions */}
                        <div style={{ padding: '14px 16px' }}>
                          <div style={{ marginBottom: 4 }}>
                            <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>{ph.labelAr}</p>
                            <p style={{ fontSize: 11, color: C.dim, margin: '2px 0 0' }}>{ph.section}</p>
                          </div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                            {/* Upload new */}
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: C.gold, color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: isUploading ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                              <Upload size={14} />
                              {isCustom ? 'تغيير الصورة' : 'رفع صورة جديدة'}
                              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" style={{ display: 'none' }} disabled={isUploading}
                                onChange={e => { const f = e.target.files?.[0]; if (f) uploadPhoto(ph.key, f); e.target.value = '' }} />
                            </label>
                            {/* Restore original */}
                            {isCustom && (
                              <button onClick={() => restorePhoto(ph.key)} disabled={isUploading}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: C.soft, border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, fontSize: 13, cursor: isUploading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                                <RotateCcw size={13} /> استعادة الأصلية
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}

          {/* ─── Partners Tab ─── */}
          {tab === 'partners' && (
            <div>
              <div style={{ background: 'rgba(196,151,58,0.08)', border: '1px solid rgba(196,151,58,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: C.goldDark, maxWidth: 820 }}>
                أضف شعارات شركاء النجاح. ارفع شعارًا من جهازك، أو اختر أيقونة بديلة، وضع رابط الموقع (أي رابط — سنضيف https تلقائيًا).
              </div>

              {/* Add new partner */}
              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 22, maxWidth: 820 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Plus size={16} style={{ color: C.gold }} /> إضافة شريك جديد
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                  <Field label="اسم الشريك *">
                    <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} style={adminInputStyle} placeholder="اسم الشريك" />
                  </Field>
                  <Field label="شعار الشريك (صورة JPG / PNG)">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {draft.logo_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={draft.logo_url} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'contain', border: `1px solid ${C.border}`, background: '#fff', flexShrink: 0 }} />
                        : null}
                      <UploadButton uploading={uploadingFor === 'draft'} onPick={file => uploadLogo(file, 'draft')} hasImage={!!draft.logo_url} />
                      {draft.logo_url && (
                        <button type="button" onClick={() => setDraft({ ...draft, logo_url: '' })} style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>إزالة</button>
                      )}
                    </div>
                  </Field>
                  <Field label="رابط الموقع (اختياري)">
                    <input value={draft.website ?? ''} onChange={e => setDraft({ ...draft, website: e.target.value })} style={adminInputStyle} placeholder="example.com أو https://..." dir="ltr" />
                  </Field>
                  <Field label="أيقونة بديلة (إن لم يوجد شعار)">
                    <IconPicker value={draft.icon} onChange={icon => setDraft({ ...draft, icon })} />
                  </Field>
                </div>
                {uploadError && <div style={{ marginTop: 12 }}><StatusErr text={uploadError} /></div>}
                <div style={{ marginTop: 16 }}>
                  <button onClick={addPartner} disabled={!draft.name.trim() || pStatus === 'saving'} style={goldBtn(!draft.name.trim() || pStatus === 'saving')}>
                    <Plus size={16} /> إضافة
                  </button>
                </div>
              </div>

              {/* Existing partners */}
              {partners.length === 0 && <EmptyState text="لا يوجد شركاء بعد — أضف أول شريك من الأعلى" />}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 820 }}>
                {partners.map(p => {
                  const Icon = getIcon(p.icon)
                  return (
                    <div key={p.id} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, opacity: p.active ? 1 : 0.6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                        <div style={{ width: 56, height: 56, borderRadius: 12, background: C.goldSoft, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                          {p.logo_url
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={p.logo_url} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            : Icon ? <Icon size={24} style={{ color: C.goldDark }} />
                            : <span style={{ color: C.goldDark, fontWeight: 800, fontSize: 20 }}>{p.name.charAt(0)}</span>}
                        </div>
                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, minWidth: 240 }}>
                          <input value={p.name} onChange={e => patchPartner(p.id!, 'name', e.target.value)} style={adminInputStyle} placeholder="اسم الشريك" />
                          <UploadButton uploading={uploadingFor === p.id} onPick={file => uploadLogo(file, p.id!)} hasImage={!!p.logo_url} />
                          <input value={p.website ?? ''} onChange={e => patchPartner(p.id!, 'website', e.target.value)} style={adminInputStyle} placeholder="example.com أو https://..." dir="ltr" />
                          <IconPicker value={p.icon} onChange={icon => patchPartner(p.id!, 'icon', icon)} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14, flexWrap: 'wrap' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: C.muted, cursor: 'pointer' }}>
                          <input type="checkbox" checked={!!p.active} onChange={e => {
                            const active = e.target.checked
                            patchPartner(p.id!, 'active', active)
                            savePartner({ ...p, active })
                          }} style={{ accentColor: C.gold, width: 16, height: 16 }} />
                          ظاهر في الموقع
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: C.muted }}>
                          الترتيب
                          <input type="number" value={p.sort_order ?? 0} onChange={e => patchPartner(p.id!, 'sort_order', Number(e.target.value))} style={{ ...adminInputStyle, width: 70, padding: '6px 10px' }} />
                        </label>
                        <div style={{ marginInlineStart: 'auto', display: 'flex', gap: 8 }}>
                          <button onClick={() => savePartner(p)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(196,151,58,0.12)', border: '1px solid rgba(196,151,58,0.3)', borderRadius: 8, color: C.goldDark, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                            <Save size={14} /> حفظ
                          </button>
                          <button onClick={() => deletePartner(p.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                            <Trash2 size={14} /> حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ marginTop: 18, height: 22 }}>
                {pStatus === 'saved' && <StatusOK text="تم الحفظ" />}
                {pStatus === 'error' && <StatusErr text="حدث خطأ" />}
              </div>
            </div>
          )}
        </div>
      </main>

    </div>
  )
}

function ListSectionEditor({
  sec, rows, isPreview, isMobile, savingId, itemStyles, onPatchItemStyle, onAdd, onPatch, onSave, onToggleActive, onDelete, onMove,
}: {
  sec: ListSection
  rows: ContentItem[]
  isPreview: boolean
  isMobile: boolean
  savingId: string | null
  itemStyles: Record<string, FieldTextStyle>
  onPatchItemStyle: (itemId: string, patch: Partial<FieldTextStyle>) => void
  onAdd: () => void
  onPatch: (rowKey: string, field: keyof ContentItem, val: ContentItem[keyof ContentItem]) => void
  onSave: (item: ContentItem, rowKey: string) => void
  onToggleActive: (item: ContentItem, rowKey: string, active: boolean) => void
  onDelete: (id?: string) => void
  onMove: (index: number, dir: 'up' | 'down') => void
}) {
  const savedCount = rows.filter(r => r.id).length
  const countLabel = isPreview && savedCount === 0
    ? `${rows.length} عنصر (معاينة — مثل الموقع)`
    : `${rows.length} عنصر`

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <span style={{ width: 4, height: 20, borderRadius: 4, background: C.gold }} />
        <h3 style={{ fontSize: 16, fontWeight: 800, color: C.text, margin: 0, flex: 1 }}>{sec.titleAr}</h3>
        <span style={{ fontSize: 12, color: C.dim }}>{countLabel}</span>
      </div>
      <p style={{ fontSize: 12.5, color: C.muted, margin: '0 0 8px 14px' }}>{sec.hintAr}</p>
      {isPreview && (
        <p style={{ fontSize: 12, color: C.goldDark, margin: '0 0 12px 14px', background: C.goldSoft, padding: '8px 12px', borderRadius: 8 }}>
          هذه العناصر تظهر على الموقع من النصوص الافتراضية. اضغط «{sec.addLabelAr}» أو «حفظ» لنشرها في قاعدة البيانات دون حذف ما هو محفوظ مسبقًا.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rows.map((item, index) => {
          const rowKey = item.id ?? `__row_${index}`
          const Icon = getIcon(item.icon)
          const isStat = sec.variant === 'stat'
          const isChip = sec.variant === 'chip'
          const preview = isStat
            ? `${item.title_ar || '—'} · ${item.desc_ar || '—'}`
            : (item.title_ar || (isChip ? 'عنصر جديد' : 'بطاقة جديدة'))
          return (
            <div key={rowKey} style={{ background: C.soft, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, opacity: item.active ? 1 : 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                {!isStat && (
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: C.goldSoft, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {Icon ? <Icon size={20} style={{ color: C.goldDark }} /> : <span style={{ color: C.dim, fontSize: 18 }}>—</span>}
                  </div>
                )}
                {isStat && (
                  <div style={{ fontSize: 22, fontWeight: 900, color: C.goldDark, minWidth: 48 }}>{item.title_ar || '—'}</div>
                )}
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text, flex: 1 }}>{preview}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => onMove(index, 'up')} disabled={index === 0} title="أعلى" style={iconBtn(index === 0)}><ArrowUp size={15} /></button>
                  <button onClick={() => onMove(index, 'down')} disabled={index === rows.length - 1} title="أسفل" style={iconBtn(index === rows.length - 1)}><ArrowDown size={15} /></button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>{isStat ? 'الرقم (عربي) — مثل 15+' : 'العنوان (عربي)'}</label>
                  <input value={item.title_ar} onChange={e => onPatch(rowKey, 'title_ar', e.target.value)} style={adminInputStyle} dir="rtl" placeholder={isStat ? '15+' : 'العنوان بالعربية'} />
                </div>
                <div>
                  <label style={labelStyle}>{isStat ? 'Number (EN)' : 'Title (English)'}</label>
                  <input value={item.title_en} onChange={e => onPatch(rowKey, 'title_en', e.target.value)} style={adminInputStyle} dir="ltr" placeholder={isStat ? '15+' : 'Title in English'} />
                </div>
                {(sec.hasDesc || isStat) && (
                  <>
                    <div>
                      <label style={labelStyle}>{isStat ? 'الوصف (عربي) — مثل سنة خبرة' : 'الوصف (عربي)'}</label>
                      <textarea value={item.desc_ar} onChange={e => onPatch(rowKey, 'desc_ar', e.target.value)} style={{ ...adminInputStyle, minHeight: 70, resize: 'vertical', lineHeight: 1.6 }} dir="rtl" placeholder={isStat ? 'سنة خبرة' : 'الوصف بالعربية'} />
                    </div>
                    <div>
                      <label style={labelStyle}>{isStat ? 'Description (EN)' : 'Description (EN)'}</label>
                      <textarea value={item.desc_en} onChange={e => onPatch(rowKey, 'desc_en', e.target.value)} style={{ ...adminInputStyle, minHeight: 70, resize: 'vertical', lineHeight: 1.6 }} dir="ltr" placeholder={isStat ? 'Years Experience' : 'Description in English'} />
                    </div>
                  </>
                )}
                {!isStat && (
                  <div>
                    <label style={labelStyle}>الأيقونة</label>
                    <IconPicker value={item.icon} onChange={icon => onPatch(rowKey, 'icon', icon)} recommended={sec.recommendedIcons} />
                  </div>
                )}
              </div>

              {item.id ? (
                <FieldStyleControls
                  compact
                  showDesc={!!(sec.hasDesc || isStat)}
                  style={itemStyles[item.id]}
                  onChange={patch => onPatchItemStyle(item.id!, patch)}
                  onReset={() => onPatchItemStyle(item.id!, { color: undefined, fontSize: undefined, descColor: undefined, descFontSize: undefined })}
                />
              ) : (
                <p style={{ fontSize: 11, color: C.dim, margin: '10px 0 0' }}>احفظ البطاقة أولًا لتفعيل تنسيق اللون والحجم.</p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14, flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: C.muted, cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!item.active} onChange={e => onToggleActive(item, rowKey, e.target.checked)} style={{ accentColor: C.gold, width: 16, height: 16 }} />
                  ظاهر في الموقع
                </label>
                <div style={{ marginInlineStart: 'auto', display: 'flex', gap: 8 }}>
                  <button onClick={() => onSave(item, rowKey)} disabled={savingId === rowKey} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(196,151,58,0.12)', border: '1px solid rgba(196,151,58,0.3)', borderRadius: 8, color: C.goldDark, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                    {savingId === rowKey ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {item.id ? 'حفظ' : 'حفظ في الموقع'}
                  </button>
                  <button onClick={() => onDelete(item.id)} disabled={!item.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 13, cursor: item.id ? 'pointer' : 'not-allowed', fontFamily: 'inherit', opacity: item.id ? 1 : 0.45 }}>
                    <Trash2 size={14} /> حذف
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button onClick={onAdd} style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#FFFFFF', border: `1px dashed ${C.gold}`, borderRadius: 10, color: C.goldDark, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
        <Plus size={16} /> {sec.addLabelAr}
      </button>
    </div>
  )
}

function UploadButton({ uploading, onPick, hasImage }: { uploading: boolean; onPick: (file: File) => void; hasImage: boolean }) {
  return (
    <label
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '10px 14px', background: '#FFFFFF', border: `1px dashed ${C.gold}`,
        borderRadius: 8, color: C.goldDark, fontSize: 13, fontWeight: 600,
        cursor: uploading ? 'wait' : 'pointer', fontFamily: 'inherit', textAlign: 'center',
      }}
    >
      {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
      {uploading ? 'جارٍ الرفع...' : hasImage ? 'تغيير الشعار' : 'رفع شعار'}
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
        style={{ display: 'none' }}
        disabled={uploading}
        onChange={e => { const f = e.target.files?.[0]; if (f) onPick(f); e.target.value = '' }}
      />
    </label>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, color: C.muted, marginBottom: 6, letterSpacing: '0.03em' }}>{label}</label>
      {children}
    </div>
  )
}

function StatusOK({ text }: { text: string }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#16a34a', fontSize: 13 }}><CheckCircle2 size={16} /> {text}</div>
}
function StatusErr({ text }: { text: string }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#dc2626', fontSize: 13 }}><AlertCircle size={16} /> {text}</div>
}

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: C.dim }}>
      <MessageSquare size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
      <p style={{ fontSize: 15 }}>{text}</p>
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, color: C.muted, marginBottom: 6, letterSpacing: '0.05em' }

const adminInputStyle: React.CSSProperties = {
  width: '100%', background: '#FFFFFF', border: `1px solid ${C.border}`,
  borderRadius: 8, padding: '10px 14px', color: C.text, fontSize: 14,
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

function iconBtn(disabled: boolean): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30,
    background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8,
    color: disabled ? C.dim : C.muted, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  }
}

function goldBtn(disabled: boolean): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '13px 30px', background: 'linear-gradient(135deg, #C4973A, #D5B874)',
    color: '#1A160F', fontWeight: 700, fontSize: 15, borderRadius: 10, border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
    fontFamily: 'inherit',
  }
}
