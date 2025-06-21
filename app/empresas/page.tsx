'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Star } from 'lucide-react'

interface Empresa {
  id: string
  nome: string
  cidade: string
  estado: string
  categoria: string
  preco_medio: number | null
  nota_media: number | null
  latitude?: number
  longitude?: number
}

const categorias = ['Restaurante', 'Mercado', 'Clínica', 'Oficina', 'Hotel']
const estados = ['RJ', 'SP', 'MG', 'RS', 'BA']
const precos = [
  { label: 'Até R$ 50', min: 0, max: 50 },
  { label: 'R$ 50 a R$ 100', min: 50, max: 100 },
  { label: 'Acima de R$ 100', min: 100, max: Infinity }
]

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroPreco, setFiltroPreco] = useState('')
  const [pagina, setPagina] = useState(1)
  const porPagina = 10

  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const estado = params.get('estado') || ''
    const categoria = params.get('categoria') || ''
    const preco = params.get('preco') || ''
    const paginaAtual = parseInt(params.get('pagina') || '1')
    setFiltroEstado(estado)
    setFiltroCategoria(categoria)
    setFiltroPreco(preco)
    setPagina(paginaAtual)
  }, [params])

  useEffect(() => {
    const carregar = async () => {
      let query = supabase
        .from('empresas')
        .select('*')
        .order('nota_media', { ascending: false })
        .range((pagina - 1) * porPagina, pagina * porPagina - 1)

      if (filtroEstado) query = query.eq('estado', filtroEstado)
      if (filtroCategoria) query = query.eq('categoria', filtroCategoria)
      if (filtroPreco) {
        const faixa = precos.find(p => p.label === filtroPreco)
        if (faixa) query = query.gte('preco_medio', faixa.min).lte('preco_medio', faixa.max)
      }

      const { data } = await query
      if (data) setEmpresas(data)
      setLoading(false)
    }
    carregar()
  }, [filtroEstado, filtroCategoria, filtroPreco, pagina])

  const atualizarFiltros = (estado: string, categoria: string, preco: string, novaPagina: number = 1) => {
    const query = new URLSearchParams()
    if (estado) query.set('estado', estado)
    if (categoria) query.set('categoria', categoria)
    if (preco) query.set('preco', preco)
    if (novaPagina > 1) query.set('pagina', novaPagina.toString())
    router.push(`/empresas?${query.toString()}`)
  }

  if (loading) {
    return <p className="text-center text-sm text-gray-600 py-10">Carregando empresas...</p>
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Empresas</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={filtroEstado}
          onChange={(e) => atualizarFiltros(e.target.value, filtroCategoria, filtroPreco)}
          className="border p-2 rounded"
        >
          <option value="">Estado</option>
          {estados.map((e) => <option key={e}>{e}</option>)}
        </select>

        <select
          value={filtroCategoria}
          onChange={(e) => atualizarFiltros(filtroEstado, e.target.value, filtroPreco)}
          className="border p-2 rounded"
        >
          <option value="">Categoria</option>
          {categorias.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select
          value={filtroPreco}
          onChange={(e) => atualizarFiltros(filtroEstado, filtroCategoria, e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Faixa de preço</option>
          {precos.map((p) => <option key={p.label}>{p.label}</option>)}
        </select>

        <button
          className="ml-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => router.push(`/mapa?estado=${filtroEstado}&categoria=${filtroCategoria}&preco=${filtroPreco}`)}
        >
          Ver no Mapa
        </button>
      </div>

      {empresas.length === 0 ? (
        <p className="text-sm text-gray-600">Nenhuma empresa encontrada.</p>
      ) : (
        <ul className="space-y-4">
          {empresas.map((empresa) => (
            <li key={empresa.id} className="border p-4 rounded">
              <Link href={`/empresa/${empresa.id}`} className="text-blue-600 font-semibold hover:underline">
                {empresa.nome}
              </Link>
              <p className="text-sm text-gray-600">{empresa.cidade} • {empresa.estado} • {empresa.categoria}</p>
              {empresa.nota_media !== null && (
                <p className="text-sm text-yellow-600 flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 fill-yellow-500" /> {empresa.nota_media.toFixed(1)} / 5
                </p>
              )}
              {empresa.preco_medio !== null && (
                <p className="text-sm text-gray-500 mt-1">Preço médio: R$ {empresa.preco_medio.toFixed(2)}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-center mt-8 gap-2">
        {pagina > 1 && (
          <button
            onClick={() => atualizarFiltros(filtroEstado, filtroCategoria, filtroPreco, pagina - 1)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Anterior
          </button>
        )}
        <button
          onClick={() => atualizarFiltros(filtroEstado, filtroCategoria, filtroPreco, pagina + 1)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Próxima
        </button>
      </div>
    </main>
  )
}
