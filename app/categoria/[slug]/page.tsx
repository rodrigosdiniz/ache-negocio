'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useParams } from 'next/navigation'
import EmpresaCard from '@/components/EmpresaCard'
import { supabase } from '@/lib/supabase'

export default function CategoriaSlugPage() {
  const { slug } = useParams()
  const searchParams = useSearchParams()
  const cidadeFiltro = searchParams.get('cidade') || ''
  const notaMinimaFiltro = Number(searchParams.get('nota') || '0')
  const pagina = Number(searchParams.get('pagina') || '1')

  const [empresas, setEmpresas] = useState<any[]>([])
  const [cidades, setCidades] = useState<string[]>([])
  const [totalPaginas, setTotalPaginas] = useState(1)
  const limite = 12

  useEffect(() => {
    const carregarEmpresas = async () => {
      let query = supabase
        .from('empresas')
        .select('*', { count: 'exact' })
        .ilike('categoria', `%${slug}%`)

      if (cidadeFiltro) query = query.ilike('cidade', `%${cidadeFiltro}%`)
      if (notaMinimaFiltro) query = query.gte('nota_media', notaMinimaFiltro)

      const { data, count } = await query
        .range((pagina - 1) * limite, pagina * limite - 1)

      if (data) setEmpresas(data)
      if (count) setTotalPaginas(Math.ceil(count / limite))
    }

    const carregarCidades = async () => {
      const { data } = await supabase
        .from('empresas')
        .select('cidade')
        .ilike('categoria', `%${slug}%`)

      if (data) {
        const unicas = [...new Set(data.map(e => e.cidade))]
        setCidades(unicas.sort())
      }
    }

    carregarEmpresas()
    carregarCidades()
  }, [slug, cidadeFiltro, notaMinimaFiltro, pagina])

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 capitalize">Empresas de {slug}</h1>

      <form className="mb-6 flex flex-wrap gap-4">
        <select
          name="cidade"
          defaultValue={cidadeFiltro}
          className="border p-2 rounded"
          onChange={(e) => {
            const url = new URL(window.location.href)
            if (e.target.value) url.searchParams.set('cidade', e.target.value)
            else url.searchParams.delete('cidade')
            window.location.href = url.toString()
          }}
        >
          <option value="">Todas as cidades</option>
          {cidades.map((cidade) => (
            <option key={cidade} value={cidade}>{cidade}</option>
          ))}
        </select>

        <select
          name="nota"
          defaultValue={notaMinimaFiltro.toString()}
          className="border p-2 rounded"
          onChange={(e) => {
            const url = new URL(window.location.href)
            if (e.target.value) url.searchParams.set('nota', e.target.value)
            else url.searchParams.delete('nota')
            window.location.href = url.toString()
          }}
        >
          <option value="0">Todas as notas</option>
          <option value="3">Nota mínima 3</option>
          <option value="4">Nota mínima 4</option>
          <option value="4.5">Nota mínima 4.5</option>
        </select>
      </form>

      {empresas.length === 0 ? (
        <p className="text-gray-600">Nenhuma empresa encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {empresas.map((empresa) => (
            <EmpresaCard key={empresa.id} empresa={empresa} />
          ))}
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="flex justify-center mt-10 gap-2 flex-wrap">
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => {
                const url = new URL(window.location.href)
                url.searchParams.set('pagina', String(i + 1))
                window.location.href = url.toString()
              }}
              className={`px-4 py-2 rounded border ${pagina === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </main>
  )
}
