'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Metadata } from 'next'
import { Star } from 'lucide-react'
import Link from 'next/link'

interface Empresa {
  id: string
  nome: string
  cidade: string
  estado: string
  categoria: string
  descricao?: string
  endereco?: string
  nota_media: number | null
}

export const metadata: Metadata = {
  title: 'Perfil da Empresa | Ache Negócio',
  description: 'Detalhes e avaliações de empresas cadastradas no Ache Negócio.',
  openGraph: {
    title: 'Perfil da Empresa | Ache Negócio',
    type: 'website'
  }
}

export default function EmpresaPage() {
  const params = useParams()
  const id = params?.id as string
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', id)
        .single()

      setEmpresa(data)
      setLoading(false)
    }

    if (id) carregar()
  }, [id])

  if (loading) {
    return <p className="text-center py-10 text-sm text-gray-600">Carregando empresa...</p>
  }

  if (!empresa) {
    return <p className="text-center py-10 text-sm text-red-600">Empresa não encontrada.</p>
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{empresa.nome}</h1>
      <p className="text-gray-600 text-sm mb-2">
        {empresa.cidade}, {empresa.estado} · {empresa.categoria}
      </p>
      {empresa.nota_media !== null && (
        <p className="flex items-center gap-1 text-yellow-600 mb-4">
          <Star className="w-5 h-5 fill-yellow-500" /> {empresa.nota_media.toFixed(1)} / 5
        </p>
      )}

      {empresa.descricao && (
        <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
          {empresa.descricao}
        </p>
      )}

      {empresa.endereco && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-1">Endereço</h2>
          <p className="text-gray-700 text-sm mb-2">{empresa.endereco}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(empresa.endereco)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            Ver no mapa
          </a>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <Link
          href={`/empresa/${empresa.id}/avaliar`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Avaliar esta empresa
        </Link>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(`Conheça a empresa ${empresa.nome} em ${empresa.cidade}/${empresa.estado}: https://ache-negocio.com.br/empresa/${empresa.id}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
        >
          Compartilhar no WhatsApp
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=https://ache-negocio.com.br/empresa/${empresa.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 text-sm"
        >
          Compartilhar no Facebook
        </a>
      </div>

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: empresa.nome,
          address: empresa.endereco,
          aggregateRating: empresa.nota_media && {
            '@type': 'AggregateRating',
            ratingValue: empresa.nota_media.toFixed(1),
            bestRating: '5',
            worstRating: '1'
          },
          url: `https://ache-negocio.com.br/empresa/${empresa.id}`,
          image: `https://ache-negocio.com.br/api/og?title=${encodeURIComponent(empresa.nome)}`
        })}
      </script>
    </main>
  )
}
