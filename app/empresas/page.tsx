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
  nota_media: number | null
}

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [busca, setBusca] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [cidadeFiltro, setCidadeFiltro] = useState('')
  const [categorias, setCategorias] = useState<string[]>([])
  const [cidades, setCidades] = useState<string[]>([])

  useEffect(() => {
    const carregarEmpresas = async () => {
      const { data } = await supabase.from('empresas').select('id, nome, cidade, categoria, nota_media')
      if (data) {
        setEmpresas(data)
        const unicasCategorias = Array.from(new Set(data.map(e => e.categoria).filter(Boolean)))
        const unicasCidades = Array.from(new Set(data.map(e => e.cidade).filter(Boolean)))
        setCategorias(unicasCategorias)
        setCidades(unicasCidades)
      }
    }

    carregarEmpresas()
  }, [])

  const empresasFiltradas = empresas.filter((e) => {
    const nomeMatch = e.nome.toLowerCase().includes(busca.toLowerCase())
    const categoriaMatch = categoriaFiltro ? e.categoria === categoriaFiltro : true
    const cidadeMatch = cidadeFiltro ? e.cidade === cidadeFiltro : true
    return nomeMatch && categoriaMatch && cidadeMatch
  })

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Empresas Cadastradas</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={cidadeFiltro}
          onChange={(e) => setCidadeFiltro(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">Todas as cidades</option>
          {cidades.map((cidade, i) => (
            <option key={i} value={cidade}>{cidade}</option>
          ))}
        </select>
      </div>

      {empresasFiltradas.length === 0 ? (
        <p className="text-gray-600">Nenhuma empresa encontrada.</p>
      ) : (
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {empresasFiltradas.map((empresa) => (
            <li key={empresa.id} className="border p-4 rounded shadow-sm hover:shadow-md transition">
              <Link href={`/empresa/${empresa.id}`} className="text-blue-600 font-semibold hover:underline">
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
      )}
    </main>
  )
}
