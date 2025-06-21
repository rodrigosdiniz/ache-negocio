'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

interface Empresa {
  id: string
  nome: string
  cidade: string
  estado: string
  categoria: string
  nota_media: number | null
}

export default function EmpresasPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroCidade, setFiltroCidade] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const limite = 10

  useEffect(() => {
    const carregarCategorias = async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('categoria')
        .neq('categoria', '')

      if (data) {
        const unicas = [...new Set(data.map((e) => e.categoria))]
        setCategorias(unicas)
      }
    }
    carregarCategorias()
  }, [])

  useEffect(() => {
    const carregarEmpresas = async () => {
      let query = supabase.from('empresas').select('*', { count: 'exact' })

      if (filtroCategoria) query = query.eq('categoria', filtroCategoria)
      if (filtroCidade) query = query.ilike('cidade', `%${filtroCidade}%`)
      if (filtroEstado) query = query.eq('estado', filtroEstado)

      const { data, count } = await query.range((pagina - 1) * limite, pagina * limite - 1)

      if (data) setEmpresas(data)
      if (count) setTotalPaginas(Math.ceil(count / limite))
    }
    carregarEmpresas()
  }, [filtroCategoria, filtroCidade, filtroEstado, pagina])

  const ufs = [
    '', 'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ',
    'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'
  ]

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Empresas Cadastradas</h1>

      <div className="mb-6 grid md:grid-cols-4 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Filtrar por cidade"
          className="border p-2 rounded w-full"
          value={filtroCidade}
          onChange={(e) => setFiltroCidade(e.target.value)}
        />
        <select
          className="border p-2 rounded w-full"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="">Todas as Categorias</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          className="border p-2 rounded w-full"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos os Estados</option>
          {ufs.map((uf) => (
            <option key={uf} value={uf}>{uf}</option>
          ))}
        </select>
        <Link href="/painel/nova" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center">Nova Empresa</Link>
      </div>

      {empresas.length === 0 ? (
        <p className="text-gray-500">Nenhuma empresa encontrada com os filtros selecionados.</p>
      ) : (
        <ul className="space-y-4">
          {empresas.map((empresa) => (
            <li key={empresa.id} className="border p-4 rounded">
              <Link href={`/empresa/${empresa.id}`} className="text-blue-600 font-semibold text-lg hover:underline">
                {empresa.nome}
              </Link>
              <p className="text-sm text-gray-600">{empresa.cidade}, {empresa.estado} • {empresa.categoria}</p>
              {empresa.nota_media !== null && (
                <p className="flex items-center gap-1 text-sm text-yellow-600">
                  <Star className="w-4 h-4 fill-yellow-500" /> {empresa.nota_media.toFixed(1)} / 5
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {totalPaginas > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPaginas }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setPagina(i + 1)}
              className={`px-3 py-1 rounded ${pagina === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </main>
  )
}
