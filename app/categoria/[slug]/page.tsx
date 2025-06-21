'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import EmpresaCard from '@/components/EmpresaCard'
import FiltroEmpresas from '@/components/FiltroEmpresas'
import Paginacao from '@/components/Paginacao'

interface Empresa {
  id: string
  nome: string
  cidade: string
  categoria: string
  nota_media: number | null
  imagem_url?: string | null
}

export default function CategoriaPage() {
  const params = useParams()
  const categoriaSlug = params?.slug as string

  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [cidadeFiltro, setCidadeFiltro] = useState('')
  const [notaFiltro, setNotaFiltro] = useState(0)
  const itensPorPagina = 10

  useEffect(() => {
    const carregarEmpresas = async () => {
      let query = supabase
        .from('empresas')
        .select('*', { count: 'exact' })
        .ilike('categoria', `%${categoriaSlug}%`)

      if (cidadeFiltro) {
        query = query.ilike('cidade', `%${cidadeFiltro}%`)
      }

      if (notaFiltro > 0) {
        query = query.gte('nota_media', notaFiltro)
      }

      const { data, count } = await query
        .range((pagina - 1) * itensPorPagina, pagina * itensPorPagina - 1)

      if (data) setEmpresas(data)
      if (count !== null) setTotal(count)
    }

    carregarEmpresas()
  }, [pagina, cidadeFiltro, notaFiltro, categoriaSlug])

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 capitalize">Categoria: {categoriaSlug.replace(/-/g, ' ')}</h1>

      <FiltroEmpresas
        cidadeFiltro={cidadeFiltro}
        setCidadeFiltro={setCidadeFiltro}
        notaFiltro={notaFiltro}
        setNotaFiltro={setNotaFiltro}
      />

      {empresas.length === 0 ? (
        <p className="text-gray-600 mt-4">Nenhuma empresa encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {empresas.map((empresa) => (
            <EmpresaCard key={empresa.id} empresa={empresa} />
          ))}
        </div>
      )}

      <Paginacao
        total={total}
        atual={pagina}
        porPagina={itensPorPagina}
        onChange={setPagina}
      />
    </main>
  )
}
