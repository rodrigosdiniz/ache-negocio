// app/dashboard/page.tsx
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './logout-button'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  if (!user || error) {
    return redirect('/login')
  }

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Olá, {user.email}</h1>
      <p className="text-gray-700 mb-6">Você está logado com sucesso.</p>

      <Link
        href="/dashboard/perfil"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mb-4"
      >
        Acessar perfil
      </Link>

      <LogoutButton />
    </main>
  )
}
