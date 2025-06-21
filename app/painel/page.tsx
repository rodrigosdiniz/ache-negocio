'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Star, Pencil } from 'lucide-react'

interface Empresa {
  id: string
  nome: string
  cidade: string
  categoria: string
  nota_media: number | null
}

interface Plano {
  plano: string
  atualizado_em: string
}

export default function DashboardPerfil() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [plano, setPlano] = useState<Plano | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return setLoading(false)

      const [empresasRes, planoRes] = await Promise.all([
        supabase
          .from('empresas')
          .select('id, nome, cidade, categoria, nota_media')
          .eq('user_id', user.id),

        supabase
          .from('usuarios_planos')
          .select('plano, atualizado_em')
          .eq('user_id', user.id)
          .single()
      ])

      if (empresasRes.data) setEmpresas(empresasRes.data)
      if (planoRes.data) setPlano(planoRes.data)
      setLoading(false)
    }

    carregar()
  }, [])

  if (loading) {
    return <p className="text-center text-sm text-gray-600 py-10">Carregando dados...</p>
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Meu Painel</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Plano Atual</h2>
        {plano ? (
          <div className="border p-4 rounded bg-gray-50">
            <p><strong>Plano:</strong> {plano.plano}</p>
            <p className="text-sm text-gray-500">
              Atualizado em: {new Date(plano.atualizado_em).toLocaleDateString('pt-BR')}
            </p>
            <Link
              href="/upgrade"
              className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Alterar Plano
            </Link>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Nenhum plano ativo.</p>
        )}
      </section>

      <section>
        <h2 className="text-x
