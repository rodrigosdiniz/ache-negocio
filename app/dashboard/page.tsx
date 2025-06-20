'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<any>(null)
  const [carregando, setCarregando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const carregar = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        router.push('/login')
      } else {
        setUsuario(data.user)
      }
      setCarregando(false)
    }
    carregar()
  }, [router])

  if (carregando) return <p>Carregando...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Meus Dados</h1>
      <p><strong>Nome:</strong> {usuario?.user_metadata?.nome || '—'}</p>
      <p><strong>Email:</strong> {usuario?.email}</p>
    </div>
  )
}
