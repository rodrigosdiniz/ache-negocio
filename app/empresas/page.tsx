'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Building, MapPin, Phone, Star } from 'lucide-react'

interface Empresa {
  id: string
  nome: string
  cidade: string
  categoria: string
  telefone: string
  descricao: string
  nota_media?: number
}

export default function ListaEmpresasPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [busca, setBusca] = useState(searchParams.get('busca') || '')
  const [cidade, setCidade] = useState(searchParams.get('cidade') || '')
  const [categoria, setCategoria] = useState(searchParams.get('categoria') || '')
  const [notaMin, setNotaMin] = useState(Number(searchParams.get('nota')) || 0)

  useEffect(() => {
    const carregarEmpresas = async () => {
      let query = supabase.from('empresas').select('*')

      const filtros = []
      if (busca) filtros.push(`nome.ilike.%${busca}%`, `cidade.ilike.%${busca}%`, `categoria.ilike.%${busca}%`)
      if (filtros.length > 0) query = query.or(filtros.join(','))

      if (cidade) query = query.eq('cidade', cidade)
      if (categoria) query = query.eq('categoria', categoria)
      if (notaMin) query = query.gte('nota_media', notaMin)

      const { data, error } = await query.order('created_at', { ascending: false })
      if (!error && data) setEmpresas(data as Empresa[])
    }

    carregarEmpresas()
  }, [busca, cidade, categoria, notaMin])

  const aplicarFiltros = () => {
    const params = new URLSearchParams()
    if (busca) params.set('busca', busca)
    if (cidade) params.set('cidade', cidade)
    if (categoria) params.set('categoria', categoria)
    if (notaMin) params.set('nota', notaMin.toString())

    router.push(`/empresas?${params.toString()}`)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-6">Empresas Cadastradas</h1>

      {/* Filtros e busca */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="Buscar por nome, cidade ou categoria"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border p-2 rounded w-full col-span-1 md:col-span-2"
        />

        <select onChange={(e) => setCidade(e.target.value)} value={cidade} className="border p-2 rounded w-full">
          <option value="">Todas as Cidades</option>
          <option value="Rio de Janeiro">Rio de Janeiro</option>
          <option value="São Paulo">São Paulo</option>
        </select>

        <select onChange={(e) => setCategoria(e.target.value)} value={categoria} className="border p-2 rounded w-full">
          <option value="">Todas as Categorias</option>
          <option value="Engenharia">Engenharia</option>
          <option value="Advocacia">Advocacia</option>
          <option value="Contabilidade">Contabilidade</option>
        </select>

        <select onChange={(e) => setNotaMin(Number(e.target.value))} value={notaMin} className="border p-2 rounded w-full">
          <option value={0}>Todas as Notas</option>
          <option value={3}>Nota ≥ 3</option>
          <option value={4}>Nota ≥ 4</option>
          <option value={5}>Nota 5</option>
        </select>

        <button
          onClick={aplicarFiltros}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 col-span-1 md:col-span-1"
        >
          Aplicar Filtros
        </button>
      </div>

      {/* Listagem */}
      {empresas.length === 0 ? (
        <p className="text-center text-gray-600">Nenhuma empresa encontrada.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {empresas.map((empresa) => (
            <div key={empresa.id} className="border rounded-xl shadow bg-white p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">{empresa.nome}</h2>
                <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {empresa.categoria}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{empresa.descricao?.slice(0, 100)}...</p>
              <div className="flex flex-col gap-1 text-sm text-gray-700">
                <span className="flex items-center gap-1"><MapPin size={16} /> {empresa.cidade}</span>
                <span className="flex items-center gap-1"><Phone size={16} /> {empresa.telefone}</span>
                {empresa.nota_media && (
                  <span className="flex items-center gap-1"><Star size={16} className="text-yellow-500" /> {empresa.nota_media.toFixed(1)} / 5</span>
                )}
              </div>
              <button className="mt-4 text-blue-600 hover:underline text-sm font-medium">Ver detalhes</button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
