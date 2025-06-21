// app/empresas/page.tsx (continua)
// Adicionando filtros por data e ordenação por mais avaliadas

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Star } from 'lucide-react'
import Link from 'next/link'

interface Empresa {
  id: string
  nome: string
  cidade: string
  categoria: string
  nota_media: number | null
  criada_em: string
}

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [filtroNome, setFiltroNome] = useState('')
  const [notaMinima, setNotaMinima] = useState(0)
  const [dataInicio, setDataInicio] = useState('')
  const [ordenacao, setOrdenacao] = useState('recentes')

  useEffect(() => {
    const carregar = async () => {
      let query = supabase
        .from('empresas')
        .select('*')

      if (filtroNome) {
        query = query.ilike('nome', `%${filtroNome}%`)
      }

      if (notaMinima > 0) {
        query = query.gte('nota_media', notaMinima)
      }

      if (dataInicio) {
        query = query.gte('criada_em', dataInicio)
      }

      if (ordenacao === 'avaliadas') {
        query = query.order('nota_media', { ascending: false })
      } else {
        query = query.order('criada_em', { ascending: false })
      }

      const { data } = await query
      if (data) setEmpresas(data)
    }

    carregar()
  }, [filtroNome, notaMinima, dataInicio, ordenacao])

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Empresas Cadastradas</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="Buscar por nome"
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          min={0}
          max={5}
          placeholder="Nota mínima"
          value={notaMinima}
          onChange={(e) => setNotaMinima(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="recentes">Mais Recentes</option>
          <option value="avaliadas">Mais Bem Avaliadas</option>
        </select>
      </div>

      {empresas.length === 0 ? (
        <p className="text-sm text-gray-600">Nenhuma empresa encontrada.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {empresas.map((empresa) => (
            <li key={empresa.id} className="border p-4 rounded bg-white shadow">
              <Link href={`/empresa/${empresa.id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                {empresa.nome}
              </Link>
              <p className="text-sm text-gray-600">{empresa.cidade} • {empresa.categoria}</p>
              {empresa.nota_media !== null && (
                <p className="flex items-center gap-1 text-sm text-yellow-600 mt-1">
                  <Star className="w-4 h-4 fill-yellow-500" /> {empresa.nota_media.toFixed(1)} / 5
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">Cadastrada em {new Date(empresa.criada_em).toLocaleDateString('pt-BR')}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
