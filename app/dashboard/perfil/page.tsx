// app/dashboard/perfil/page.tsx
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'

export default async function PerfilPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  if (!user || error) {
    return redirect('/login')
  }

  const nome = user.user_metadata?.nome || ''
  const email = user.email

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Perfil do Usuário</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4"><strong>Email:</strong> {email}</p>
        <p className="mb-4"><strong>Nome:</strong> {nome || 'Não informado'}</p>
        <p className="text-gray-500 text-sm">(Em breve: formulário para editar seus dados)</p>
      </div>
    </main>
  )
}
