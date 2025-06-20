// app/dashboard/layout.tsx
import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import LogoutButton from './logout-button'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user }
  } = await supabase.auth.getUser()

  return (
    <div>
      <header className="bg-gray-100 border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-lg font-semibold text-gray-800">
          Painel do Usuário
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              {user.user_metadata?.nome || user.email}
            </span>
            <LogoutButton />
          </div>
        )}
      </header>

      <main>{children}</main>
    </div>
  )
}
