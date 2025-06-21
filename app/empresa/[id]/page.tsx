// Caminho: app/empresa/[id]/page.tsx

import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import { Star } from 'lucide-react'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data } = await supabase.from('empresas').select('nome, cidade').eq('id', params.id).single()
  return {
    title: `${data?.nome} em ${data?.cidade} | Ache Negócio`,
    description: `Veja informações da empresa ${data?.nome} localizada em ${data?.cidade}.`
  }
}

export default async function EmpresaPage({ params }: { params: { id: string } }) {
  const { data: empresa } = await supabase
    .from('empresas')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!empresa) return notFound()

  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    `${empresa.endereco || ''}, ${empresa.cidade || ''}`
  )}`

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{empresa.nome}</h1>
      <p className="text-gray-600">{empresa.categoria} em {empresa.cidade}</p>

      {empresa.nota_media && (
        <div className="mt-2 flex items-center text-yellow-600 text-sm">
          <Star className="w-4 h-4 fill-yellow-500" />
          <span className="ml-1">{empresa.nota_media.toFixed(1)} / 5</span>
        </div>
      )}

      {empresa.imagem_url && (
        <Image
          src={empresa.imagem_url}
          alt={empresa.nome}
          width={600}
          height={400}
          className="rounded mt-6"
        />
      )}

      <div className="mt-6 space-y-2 text-sm">
        {empresa.descricao && <p><strong>Sobre:</strong> {empresa.descricao}</p>}
        {empresa.telefone && <p><strong>Telefone:</strong> {empresa.telefone}</p>}
        {empresa.email && <p><strong>Email:</strong> {empresa.email}</p>}
        {empresa.endereco && <p><strong>Endereço:</strong> {empresa.endereco}</p>}
      </div>

      <div className="mt-6">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ver no mapa
        </a>
      </div>
    </main>
  )
}
