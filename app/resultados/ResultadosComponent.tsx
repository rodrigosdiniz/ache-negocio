'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Empresa = {
  id: number
  nome: string
  categoria: string
  cidade: string
  descricao: string
}

export default function ResultadosComponent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmpresas = async () => {
      if (query.trim()) {
        const { data, error } = await supabase.rpc('buscar_empresas', {
          termo: query
        })

        if (error) {
          console.error('Erro ao buscar empresas:', error.message)
        } else {
          setEmpresas(data || [])
        }
        setLoading(false)
      }
    }

    fetchEmpresas()
  }, [query])

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Resultados para: "{query}"</h1>

      {loading ? (
        <p className="text-gray-600">Carregando...</p>
      ) : empresas.length === 0 ? (
        <p className="text-gray-600">Nenhuma empresa encontrada.</p>
      ) : (
        <ul className="space-y-4">
          {empresas.map((empresa) => (
            <li key={empresa.id} className="p-4 border rounded-md shadow-sm bg-white">
              <h2 className="text-xl font-semibold">{empresa.nome}</h2>
              <p className="text-sm text-gray-600">{empresa.categoria} - {empresa.cidade}</p>
              <p className="mt-2 text-gray-800">{empresa.descricao}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
