// app/dashboard/layout.tsx
'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import LogoutButton from './logout-button'
import Link from 'next/link'
import { Home, User } from 'lucide-react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUser(data.user)
        if (pathname === '/dashboard') {
          alert(`Bem-vindo, ${data.user.user_metadata?.nome || data.user.email}!`)
        }
      }
    }
    carregar()
  }, [pathname, supabase])

  const linkClass = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 ${
      pathname === path ? 'bg-gray-800 font-semibold' : ''
    }`

  return (
    <div className="flex min-h-screen">
      {/* Menu lateral fixo */}
      <aside className="hidden md:flex w-64 bg-gray-900 text-white flex-col py-6 px-4 space-y-4 sticky top-0 h-screen">
        <h2 className="text-xl font-semibold mb-6">Ache Negócio</h2>
        <Link href="/dashboard" className={linkClass('/dashboard')}>
          <Home size={18} /> Início
        </Link>
        <Link href="/dashboard/perfil" className={linkClass('/dashboard/perfil')}>
          <User size={18} /> Perfil
        </Link>
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 bg-gray-50 px-6 py-6">
        {children}
      </main>
    </div>
  )
}
