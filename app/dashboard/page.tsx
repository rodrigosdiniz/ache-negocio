'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<any>(null)
  const [carregando, setCarregando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verificarUsuario = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data.user) {
        router.push('/login')
      } else {
        setUsuario(data.user)
      }

      setCarregando(false)
    }

    verificarUsuario()
  }, [router])

  if (carregando) {
    return <p className="text-center mt-10">Carregando...</p>
  }

  return (
    <main className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Bem-vindo ao seu painel</h1>

      <p className="mb-2">
        <strong>Nome:</strong>{' '}
        {usuario?.user_metadata?.nome || '(não informado)'}
      </p>
      <p className="mb-2">
        <strong>Email:</strong> {usuario?.email}
      </p>

      <button
        onClick={async () => {
          await supabase.auth.signOut()
          router.push('/login')
        }}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md"
      >
        Sair
      </button>
    </main>
  )
}

