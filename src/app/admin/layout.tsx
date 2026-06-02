import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'لوحة التحكم | مكتب د. طلحة غوث',
  robots: { index: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" style={{ background: '#F8F5EF', color: '#1A160F', minHeight: '100vh' }}>
      {children}
    </div>
  )
}
