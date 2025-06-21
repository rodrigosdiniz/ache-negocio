// Novo arquivo: app/empresas/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Star } from 'lucide-react'

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<any[]>([])
  const [nomeBusca, setNomeBusca] = useState('')
  const [notaMinima, setNotaMinima] = useState<number>(0)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('')
  const [cidadeSelecionada, setCidadeSelecionada] = useState('')
  const [pagina, setPagina] = useState(1)
  const [ordenacao, setOrdenacao] = useState('mais_recentes')
  const [categorias, setCategorias] = useState<string[]>([])
  const [cidades, setCidades] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const porPagina = 6

  useEffect(() => {
    const carregarDados = async () => {
      const { data } = await supabase.from('empresas').select()
      const categoriasUnicas = [...new Set(data?.map((e) => e.categoria))]
      const cidadesUnicas = [...new Set(data?.map((e) => e.cidade))]
      setCategorias(categoriasUnicas)
      setCidades(cidadesUnicas)
    }
    carregarDados()
  }, [])

  useEffect(() => {
    const buscar = async () => {
      let query = supabase.from('empresas').select('*', { count: 'exact' })

      if (nomeBusca) query = query.ilike('nome', `%${nomeBusca}%`)
      if (notaMinima > 0) query = query.gte('nota_media', notaMinima)
      if (categoriaSelecionada) query = query.eq('categoria', categoriaSelecionada)
      if (cidadeSelecionada) query = query.eq('cidade', cidadeSelecionada)

      if (ordenacao === 'mais_recentes') query = query.order('criado_em', { ascending: false })
      if (ordenacao === 'melhores') query = query.order('nota_media', { ascending: false })

      query = query.range((pagina - 1) * porPagina, pagina * porPagina - 1)

      const { data, count } = await query
      if (data) setEmpresas(data)
      if (count !== null) setTotal(count)
    }
    buscar()
  }, [nomeBusca, notaMinima, categoriaSelecionada, cidadeSelecionada, pagina, ordenacao])

  const limparFiltros = () => {
    setNomeBusca('')
    setNotaMinima(0)
    setCategoriaSelecionada('')
    setCidadeSelecionada('')
    setOrdenacao('mais_recentes')
  }

  const totalPaginas = Math.ceil(total / porPagina)

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Empresas Cadastradas</h1>

      <section className="mb-8 grid md:grid-cols-5 gap-4">
        <input
          value={nomeBusca}
          onChange={(e) => setNomeBusca(e.target.value)}
          placeholder="Buscar por nome"
          className="border p-2 rounded col-span-2"
        />
        <select
          value={categoriaSelecionada}
          onChange={(e) => setCategoriaSelecionada(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={cidadeSelecionada}
          onChange={(e) => setCidadeSelecionada(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todas as cidades</option>
          {cidades.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="mais_recentes">Mais recentes</option>
          <option value="melhores">Melhores avaliadas</option>
        </select>
      </section>

      <section className="mb-6 flex gap-4 items-center">
        <label className="text-sm">Nota mínima:</label>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={notaMinima}
          onChange={(e) => setNotaMinima(Number(e.target.value))}
        />
        <span>{notaMinima} ⭐</span>
        <button
          onClick={limparFiltros}
          className="ml-auto text-sm text-gray-600 underline hover:text-black"
        >
          Limpar filtros
        </button>
      </section>

      <p className="text-sm text-gray-500 mb-4">
        Exibindo {empresas.length} de {total} resultados
      </p>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {empresas.map((empresa) => (
          <li key={empresa.id} className="border p-4 rounded shadow">
            <Link href={`/empresa/${empresa.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
              {empresa.nome}
            </Link>
            <p className="text-sm text-gray-600">{empresa.cidade} • {empresa.categoria}</p>
            {empresa.nota_media !== null && (
              <p className="flex items-center gap-1 text-sm text-yellow-600 mt-1">
                <Star className="w-4 h-4 fill-yellow-500" /> {empresa.nota_media.toFixed(1)} / 5
              </p>
            )}
          </li>
        ))}
      </ul>

      {totalPaginas > 1 && (
        <div className="flex justify-center mt-10 gap-2">
          {Array.from({ length: totalPaginas }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPagina(i + 1)}
              className={`px-3 py-1 rounded border ${pagina === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </main>
  )
}
