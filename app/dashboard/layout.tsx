// app/dashboard/layout.tsx
'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import LogoutButton from './logout-button'
import Link from 'next/link'

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

  return (
    <div>
      <header className="bg-gray-100 border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-lg font-semibold text-gray-800">Painel do Usuário</div>
        {user && (
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="text-sm text-gray-700 font-medium focus:outline-none">
                {user.user_metadata?.nome || user.email}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block z-10">
                <Link href="/dashboard/perfil" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Meu perfil
                </Link>
                <div className="px-4 py-2">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>
    </div>
  )
}
