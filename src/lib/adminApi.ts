import { supabase } from '@/lib/supabase'

export class AdminApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

/** Refresh the session and return a Bearer auth header for admin API calls. */
export async function getFreshAuthHeader(): Promise<Record<string, string>> {
  const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
  if (refreshError || !refreshData.session?.access_token) {
    await supabase.auth.signOut().catch(() => {})
    throw new AdminApiError('انتهت الجلسة — أعد تسجيل الدخول', 401)
  }
  return { Authorization: `Bearer ${refreshData.session.access_token}` }
}

async function authHeader(): Promise<Record<string, string>> {
  try {
    return await getFreshAuthHeader()
  } catch {
    return {}
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = await authHeader()
  const res = await fetch(path, {
    ...init,
    headers: {
      ...(init.body && !(init.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
      ...(init.headers ?? {}),
    },
  })

  let payload: unknown = null
  try { payload = await res.json() } catch { /* empty body */ }

  if (!res.ok) {
    const msg = (payload as { error?: string } | null)?.error ?? 'تعذّر تنفيذ الطلب'
    throw new AdminApiError(msg, res.status)
  }
  return payload as T
}

export const adminApi = {
  // ── site_content ──
  getContent: () => request<{ data: unknown[] }>('/api/admin/content'),
  saveContent: (rows: unknown[]) =>
    request('/api/admin/content', { method: 'POST', body: JSON.stringify({ rows }) }),
  deleteContentField: (section: string, key: string) =>
    request(`/api/admin/content?section=${encodeURIComponent(section)}&key=${encodeURIComponent(key)}`, { method: 'DELETE' }),

  // ── content_items ──
  getItems: () => request<{ data: unknown[] }>('/api/admin/items'),
  addItem: (body: Record<string, unknown>) =>
    request<{ data: unknown }>('/api/admin/items', { method: 'POST', body: JSON.stringify(body) }),
  updateItem: (body: Record<string, unknown>) =>
    request('/api/admin/items', { method: 'PATCH', body: JSON.stringify(body) }),
  reorderItems: (reorder: { id: string; sort_order: number }[]) =>
    request('/api/admin/items', { method: 'PATCH', body: JSON.stringify({ reorder }) }),
  deleteItem: (id: string) =>
    request(`/api/admin/items?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // ── partners ──
  getPartners: () => request<{ data: unknown[] }>('/api/admin/partners'),
  addPartner: (body: Record<string, unknown>) =>
    request<{ data: unknown }>('/api/admin/partners', { method: 'POST', body: JSON.stringify(body) }),
  updatePartner: (body: Record<string, unknown>) =>
    request('/api/admin/partners', { method: 'PATCH', body: JSON.stringify(body) }),
  deletePartner: (id: string) =>
    request(`/api/admin/partners?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // ── messages ──
  getMessages: () => request<{ data: unknown[] }>('/api/admin/messages'),
  markMessageRead: (id: string) =>
    request('/api/admin/messages', { method: 'PATCH', body: JSON.stringify({ id, read: true }) }),

  // ── storage / seed ──
  uploadLogo: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return request<{ url: string }>('/api/admin/upload', { method: 'POST', body: fd })
  },
  syncSectionItems: (section: string, items: Record<string, unknown>[]) =>
    request<{ data: unknown[] }>('/api/admin/items', {
      method: 'POST',
      body: JSON.stringify({ syncSection: section, items }),
    }),
  seedDefaults: (section?: string) =>
    request<{ inserted: number }>('/api/admin/seed', {
      method: 'POST',
      body: JSON.stringify(section ? { section } : {}),
    }),
}
