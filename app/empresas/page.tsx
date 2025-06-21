'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Empresa {
  id: string
  nome: string
  cidade: string
  categoria: string
  imagem_url?: string
  nota_media: number | null
}

const pageSize = 9

export default function EmpresasPage({ searchParams }: { searchParams: { cidade?: string; categoria?: string; page?: string } }) {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const cidade = searchParams.cidade || ''
  const categoria = searchParams.categoria || ''
  const page = Number(searchParams.page || 1)
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  useEffect(() => {
    const carregar = async () => {
      const filtros = [] as string[]
      if (cidade) filtros.push(`cidade.ilike.%${cidade}%`)
      if (categoria) filtros.push(`categoria.ilike.%${categoria}%`)

      const filtroFinal = filtros.length ? filtros.join(',') : ''

      const [listaRes, totalRes] = await Promise.all([
        supabase
          .from('empresas')
          .select('*')
          .range(from, to)
          .order('nota_media', { ascending: false })
          .or(filtroFinal),

        supabase
          .from('empresas')
          .select('id', { count: 'exact', head: true })
          .or(filtroFinal)
      ])

      if (listaRes.data) setEmpresas(listaRes.data)
      if (totalRes.count) setTotal(totalRes.count)
      setLoading(false)
    }

    carregar()
  }, [cidade, categoria, page])

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Empresas Cadastradas</h1>

      <form className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="cidade"
          placeholder="Filtrar por cidade"
          defaultValue={cidade}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          name="categoria"
          placeholder="Filtrar por categoria"
          defaultValue={categoria}
          className="border rounded px-3 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
          Filtrar
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-gray-600">Carregando empresas...</p>
      ) : empresas.length === 0 ? (
        <p className="text-sm text-gray-600">Nenhuma empresa encontrada.</p>
      ) : (
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {empresas.map((empresa) => (
            <motion.li
              key={empresa.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Link href={`/empresa/${empresa.id}`}>
                {empresa.imagem_url && (
                  <Image
                    src={empresa.imagem_url}
                    alt={empresa.nome}
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-blue-600 mb-1 line-clamp-1">{empresa.nome}</h2>
                  <p className="text-sm text-gray-600 line-clamp-1">{empresa.categoria} • {empresa.cidade}</p>
                  {empresa.nota_media !== null && (
                    <p className="flex items-center gap-1 text-sm text-yellow-600 mt-1">
                      <Star className="w-4 h-4 fill-yellow-500" /> {empresa.nota_media.toFixed(1)} / 5
                    </p>
                  )}
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}

      <div className="flex justify-between items-center mt-8">
        {page > 1 ? (
          <Link href={`?cidade=${cidade}&categoria=${categoria}&page=${page - 1}`} className="text-blue-600">← Anterior</Link>
        ) : <span></span>}
        {to + 1 < total && (
          <Link href={`?cidade=${cidade}&categoria=${categoria}&page=${page + 1}`} className="text-blue-600 ml-auto">Próxima →</Link>
        )}
      </div>
    </main>
  )
}

export const metadata = {
  title: 'Empresas | Ache Negócio',
  description: 'Encontre empresas de diversas categorias e cidades no diretório Ache Negócio.',
  openGraph: {
    title: 'Empresas | Ache Negócio',
    description: 'Navegue pelas empresas cadastradas e encontre os melhores serviços.',
    url: 'https://ache-negocio.com.br/empresas',
    siteName: 'Ache Negócio',
    type: 'website'
  }
}
