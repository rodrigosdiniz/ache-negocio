// app/dashboard/perfil/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null)
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(true)
  const [salvo, setSalvo] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const carregar = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
        setNome(data.user.user_metadata?.nome || '')
      }
      setLoading(false)
    }
    carregar()
  }, [router, supabase])

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvo(false)
    await supabase.auth.updateUser({ data: { nome } })
    setSalvo(true)
  }

  if (loading) return <p>Carregando...</p>

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Perfil do Usuário</h1>

      <form onSubmit={salvar} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email:</label>
          <p className="text-gray-900">{user.email}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Digite seu nome"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Salvar alterações
        </button>

        {salvo && <p className="text-green-600 mt-3">Nome atualizado com sucesso.</p>}
      </form>
    </main>
  )
}
