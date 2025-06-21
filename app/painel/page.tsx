'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Star } from 'lucide-react'

interface Empresa {
  id: string
  nome: string
  cidade: string
  categoria: string
  nota_media: number
}

interface Plano {
  plano: string
  atualizado_em: string
}

export default function DashboardPerfil() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [plano, setPlano] = useState<Plano | null>(null)
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    const carregar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const { data: empresas } = await supabase
        .from('empresas')
        .select('id, nome, cidade, categoria, nota_media')
        .eq('user_id', user.id)

      const { data: planoData } = await supabase
        .from('usuarios_planos')
        .select('plano, atualizado_em')
        .eq('user_id', user.id)
        .single()

      if (empresas) setEmpresas(empresas)
      if (planoData) setPlano(planoData)
    }

    carregar()
  }, [])

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Meu Painel</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Plano Atual</h2>
        {plano ? (
          <div className="border p-4 rounded bg-gray-50">
            <p><strong>Plano:</strong> {plano.plano}</p>
            <p className="text-sm text-gray-500">Atualizado em: {new Date(plano.atualizado_em).toLocaleDateString()}</p>
            <Link
              href="/upgrade"
              className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Alterar Plano
            </Link>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Plano não identificado.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Minhas Empresas</h2>
        {empresas.length === 0 ? (
          <p className="text-sm text-gray-600">Nenhuma empresa cadastrada ainda.</p>
        ) : (
          <ul className="space-y-3">
            {empresas.map((empresa) => (
              <li key={empresa.id} className="border p-4 rounded">
                <Link href={`/empresa/${empresa.id}`} className="text-blue-600 font-semibold hover:underline">
                  {empresa.nome}
                </Link>
                <p className="text-sm text-gray-600">{empresa.cidade} • {empresa.categoria}</p>
                {empresa.nota_media && (
                  <p className="flex items-center gap-1 text-sm text-yellow-600">
                    <Star className="w-4 h-4 fill-yellow-500" /> {empresa.nota_media.toFixed(1)} / 5
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
