'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Star } from 'lucide-react'
import Image from 'next/image'
import AvaliarEmpresa from '@/components/AvaliarEmpresa'

interface Empresa {
  id: string
  nome: string
  descricao?: string
  cidade?: string
  categoria?: string
  endereco?: string
  imagem?: string
  nota_media?: number | null
}

export default function EmpresaPage({ params }: { params: { id: string } }) {
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', params.id)
        .single()

      if (!data) return notFound()
      setEmpresa(data)
      setLoading(false)
    }

    carregar()
  }, [params.id])

  if (loading) {
    return <p className="text-center text-gray-600 py-10">Carregando...</p>
  }

  if (!empresa) {
    return <p className="text-center text-red-600 py-10">Empresa não encontrada.</p>
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{empresa.nome}</h1>

      {empresa.imagem && (
        <div className="mb-6">
          <Image
            src={empresa.imagem}
            alt={empresa.nome}
            width={800}
            height={400}
            className="rounded shadow"
          />
        </div>
      )}

      <div className="mb-4 space-y-1">
        {empresa.endereco && <p><strong>Endereço:</strong> {empresa.endereco}</p>}
        {empresa.cidade && <p><strong>Cidade:</strong> {empresa.cidade}</p>}
        {empresa.categoria && <p><strong>Categoria:</strong> {empresa.categoria}</p>}
      </div>

      {empresa.descricao && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Descrição</h2>
          <p className="text-gray-700 whitespace-pre-line">{empresa.descricao}</p>
        </div>
      )}

      {empresa.nota_media !== null && (
        <div className="mb-4 text-yellow-600 flex items-center gap-1">
          <Star className="w-5 h-5 fill-yellow-500" />
          <span className="font-medium">{empresa.nota_media.toFixed(1)} / 5</span>
        </div>
      )}

      <AvaliarEmpresa empresaId={empresa.id} />
    </main>
  )
}
