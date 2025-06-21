'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'

interface Empresa {
  id: string
  nome: string
  cidade: string
  categoria: string
  nota_media: number | null
}

const pageSize = 8
const categoriasDisponiveis = ['Advocacia', 'Engenharia', 'Saúde', 'Educação', 'Comércio', 'Serviços']

export default function ListaEmpresas() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const cidade = searchParams.get('cidade') || ''
  const categoria = searchParams.get('categoria') || ''
  const page = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    const carregarEmpresas = async () => {
      setLoading(true)
      let query = supabase.from('empresas').select('*', { count: 'exact' })

      if (cidade) query = query.ilike('cidade', `%${cidade}%`)
      if (categoria) query = query.eq('categoria', categoria)

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, count } = await query.range(from, to).order('nome', { ascending: true })

      if (data) setEmpresas(data)
      if (typeof count === 'number') setTotal(count)
      setLoading(false)
    }

    carregarEmpresas()
  }, [cidade, categoria, page])

  const handleFiltro = (campo: string, valor: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (valor) {
      params.set(campo, valor)
    } else {
      params.delete(campo)
    }
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Empresas Cadastradas</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Filtrar por cidade"
          value={cidade}
          onChange={(e) => handleFiltro('cidade', e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64"
        />

        <select
          value={categoria}
          onChange={(e) => handleFiltro('categoria', e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64"
        >
          <option value="">Todas as categorias</option>
          {categoriasDisponiveis.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-sm text-gray-600 py-10">Carregando empresas...</p>
      ) : empresas.length === 0 ? (
        <p className="text-center text-sm text-gray-600">Nenhuma empresa encontrada com os filtros selecionados.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {empresas.map((empresa, i) => (
            <motion.li
              key={empresa.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border p-4 rounded shadow-sm hover:shadow-md transition"
            >
              <Link href={`/empresa/${empresa.id}`} className="block">
                <h2 className="text-xl font-semibold text-blue-600 mb-1">{empresa.nome}</h2>
                <p className="text-sm text-gray-600">{empresa.cidade} • {empresa.categoria}</p>
                {empresa.nota_media !== null && (
                  <p className="flex items-center gap-1 text-sm text-yellow-600 mt-1">
                    <Star className="w-4 h-4 fill-yellow-500" /> {empresa.nota_media.toFixed(1)} / 5
                  </p>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      )}

      {total > pageSize && (
        <div className="flex justify-between mt-10">
          {page > 1 && (
            <button
              onClick={() => handleFiltro('page', String(page - 1))}
              className="text-blue-600 hover:underline"
            >
              ← Anterior
            </button>
          )}

          {(page * pageSize) < total && (
            <button
              onClick={() => handleFiltro('page', String(page + 1))}
              className="ml-auto text-blue-600 hover:underline"
            >
              Próxima →
            </button>
          )}
        </div>
      )}
    </main>
  )
}
