import { redirect } from 'next/navigation'

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

interface Avaliacao {
  id: string
  nota: number
  comentario: string
  created_at: string
  empresa: {
    id: string
    nome: string
  }
}

export default function DashboardPerfil() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
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

      const { data: avaliacoes } = await supabase
        .from('avaliacoes')
        .select('id, nota, comentario, created_at, empresa(id, nome)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (empresas) setEmpresas(empresas)
      if (avaliacoes) setAvaliacoes(avaliacoes)
    }

    carregar()
  }, [])

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

      <section className="mb-10">
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

      <section>
        <h2 className="text-xl font-semibold mb-4">Minhas Avaliações</h2>
        {avaliacoes.length === 0 ? (
          <p className="text-sm text-gray-600">Você ainda não avaliou nenhuma empresa.</p>
        ) : (
          <ul className="space-y-3">
            {avaliacoes.map((a) => (
              <li key={a.id} className="border p-4 rounded">
                <Link href={`/empresa/${a.empresa.id}`} className="text-blue-600 font-semibold hover:underline">
                  {a.empresa.nome}
                </Link>
                <p className="text-sm">Nota: {a.nota}</p>
                <p className="text-sm italic">"{a.comentario}"</p>
                <p className="text-xs text-gray-500">{new Date(a.created_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
