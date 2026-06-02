import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'لوحة التحكم | مكتب د. طلحة غوث',
  robots: { index: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ background: '#F8F5EF', color: '#1A160F', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
