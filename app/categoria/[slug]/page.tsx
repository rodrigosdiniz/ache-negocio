'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Star } from 'lucide-react'

interface Empresa {
  id: string
  nome: string
  cidade: string
  estado: string
  categoria: string
  tipo_servico: string
  preco_medio: number | null
  nota_media: number | null
}

export default function CategoriaPage({ params }: { params: { slug: string } }) {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({ cidade: '', estado: '', notaMinima: 0, tipoServico: '', precoMax: 0 })
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const router = useRouter()
  const searchParams = useSearchParams()
  const porPagina = 10

  useEffect(() => {
    const fetchEmpresas = async () => {
      setLoading(true)
      const query = supabase
        .from('empresas')
        .select('*')
        .eq('categoria', decodeURIComponent(params.slug))

      if (filtros.cidade) query.ilike('cidade', `%${filtros.cidade}%`)
      if (filtros.estado) query.eq('estado', filtros.estado)
      if (filtros.tipoServico) query.ilike('tipo_servico', `%${filtros.tipoServico}%`)
      if (filtros.notaMinima) query.gte('nota_media', filtros.notaMinima)
      if (filtros.precoMax) query.lte('preco_medio', filtros.precoMax)

      const { data, count } = await query.range((pagina - 1) * porPagina, pagina * porPagina - 1).order('nota_media', { ascending: false }).select('*', { count: 'exact' })

      if (data) setEmpresas(data)
      setTotalPaginas(Math.ceil((count || 0) / porPagina))
      setLoading(false)
    }

    fetchEmpresas()
  }, [params.slug, pagina, filtros])

  const handleFiltro = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFiltros((f) => ({ ...f, [name]: name === 'notaMinima' || name === 'precoMax' ? Number(value) : value }))
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Empresas de {decodeURIComponent(params.slug)}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input type="text" name="cidade" placeholder="Cidade" onChange={handleFiltro} className="border p-2 rounded w-full" />
        <input type="text" name="estado" placeholder="Estado" onChange={handleFiltro} className="border p-2 rounded w-full" />
        <input type="text" name="tipoServico" placeholder="Tipo de serviço" onChange={handleFiltro} className="border p-2 rounded w-full" />
        <input type="number" name="notaMinima" placeholder="Nota mínima" onChange={handleFiltro} className="border p-2 rounded w-full" />
        <input type="number" name="precoMax" placeholder="Preço máximo (R$)" onChange={handleFiltro} className="border p-2 rounded w-full" />
        <button
          onClick={() => router.push(`https://www.google.com/maps/search/${params.slug}`)}
          className="bg-green-600 text-white rounded px-4 py-2 w-full"
        >
          Ver no mapa
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : empresas.length === 0 ? (
        <p className="text-sm text-gray-600">Nenhuma empresa encontrada.</p>
      ) : (
        <ul className="space-y-4">
          {empresas.map((empresa) => (
            <li key={empresa.id} className="border p-4 rounded">
              <Link href={`/empresa/${empresa.id}`} className="text-blue-600 font-semibold hover:underline">
                {empresa.nome}
              </Link>
              <p className="text-sm text-gray-600">
                {empresa.cidade}, {empresa.estado} • {empresa.tipo_servico} • R$ {empresa.preco_medio?.toFixed(2)}
              </p>
              {empresa.nota_media !== null && (
                <p className="flex items-center gap-1 text-sm text-yellow-600 mt-1">
                  <Star className="w-4 h-4 fill-yellow-500" /> {empresa.nota_media.toFixed(1)} / 5
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-center items-center gap-2 mt-6">
        <button onClick={() => setPagina((p) => Math.max(p - 1, 1))} disabled={pagina === 1} className="px-3 py-1 border rounded">
          Anterior
        </button>
        <span className="text-sm">Página {pagina} de {totalPaginas}</span>
        <button onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))} disabled={pagina === totalPaginas} className="px-3 py-1 border rounded">
          Próxima
        </button>
      </div>
    </main>
  )
}
