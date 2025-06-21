'use client'

import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import FormAvaliacao from '@/components/FormAvaliacao'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient(cookies())
  const { data } = await supabase.from('empresas').select('nome, cidade, descricao').eq('id', params.id).single()
  return {
    title: `${data?.nome} em ${data?.cidade} | Ache Negócio`,
    description: data?.descricao || `Encontre informações sobre ${data?.nome} em ${data?.cidade}.`,
    openGraph: {
      title: `${data?.nome} em ${data?.cidade} | Ache Negócio`,
      description: data?.descricao || '',
      type: 'website',
    },
  }
}

const renderStars = (nota: number) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }, (_, i) => (
      <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}>
        <Star className={`w-5 h-5 ${i < nota ? 'fill-yellow-400 stroke-yellow-500' : 'stroke-gray-300'}`} />
      </motion.div>
    ))}
  </div>
)

export default async function EmpresaPage({ params }: { params: { id: string } }) {
  const supabase = createClient(cookies())
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  const { data: empresa } = await supabase.from('empresas').select('*').eq('id', params.id).single()
  if (!empresa) return notFound()

  const { data: avaliacoes } = await supabase
    .from('avaliacoes')
    .select('*, user:auth.users(full_name)')
    .eq('empresa_id', empresa.id)
    .order('created_at', { ascending: false })

  const total = avaliacoes?.length || 0
  const media = avaliacoes && total > 0
    ? (avaliacoes.reduce((acc, cur) => acc + cur.nota, 0) / total).toFixed(1)
    : null

  const whatsappLink = empresa.telefone?.replace(/\D/g, '').length >= 11
    ? `https://wa.me/55${empresa.telefone.replace(/\D/g, '')}`
    : null

  const enderecoCompleto = `${empresa.endereco || ''}, ${empresa.cidade || ''}`
  const Mapa = dynamic(() => import('@/components/MapaEmpresa'), { ssr: false })

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        {empresa.nome}
        {media && Number(media) >= 4.5 && (
          <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-0.5 rounded inline-flex items-center gap-1">
            <Award className="w-4 h-4" /> Top Avaliada
          </span>
        )}
      </h1>

      <p className="text-sm text-gray-600 mb-4">{empresa.categoria} • {empresa.cidade}</p>

      {empresa.imagem_url && (
        <Image
          src={empresa.imagem_url}
          alt={empresa.nome}
          width={600}
          height={300}
          className="rounded-xl w-full object-cover mb-6"
        />
      )}

      {media && (
        <div className="flex items-center gap-2 mb-4">
          {renderStars(Number(media))}
          <span className="text-lg font-medium">{media} ({total} avaliações)</span>
        </div>
      )}

      <p className="mb-4">{empresa.descricao}</p>

      <div className="mb-6 space-y-1">
        <p><strong>Telefone:</strong> {empresa.telefone}</p>
        <p><strong>Email:</strong> {empresa.email}</p>
        {empresa.website && (
          <p><strong>Site:</strong> <a href={empresa.website} target="_blank" className="text-blue-600 underline">{empresa.website}</a></p>
        )}
        {whatsappLink && (
          <a href={whatsappLink} target="_blank" className="inline-block mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Falar no WhatsApp
          </a>
        )}
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Localização</h2>
        <Mapa endereco={enderecoCompleto} />
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Avaliações</h2>
        {avaliacoes?.length === 0 ? (
          <p className="text-sm text-gray-600">Nenhuma avaliação ainda.</p>
        ) : (
          <ul className="space-y-3">
            {avaliacoes.map((a) => (
              <li key={a.id} className="border p-4 rounded">
                {renderStars(a.nota)}
                <p className="mt-1">{a.comentario}</p>
                <p className="text-sm text-gray-500">Por {a.user?.full_name || 'usuário'} em {new Date(a.created_at).toLocaleDateString()}</p>
                {a.resposta && (
                  <div className="mt-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                    <p className="font-medium text-blue-700">Resposta do dono:</p>
                    <p>{a.resposta}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {user && (
        <FormAvaliacao empresaId={empresa.id} userId={user.id} onAvaliado={() => location.reload()} />
      )}

      <div className="mt-8">
        <p className="text-center text-sm text-gray-400">Compartilhe: <span className="text-blue-600 underline">{`https://ache-negocio.com.br/empresa/${empresa.id}`}</span></p>
      </div>

      {/* SEO JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: empresa.nome,
            address: enderecoCompleto,
            image: empresa.imagem_url,
            url: `https://ache-negocio.com.br/empresa/${empresa.id}`,
            telephone: empresa.telefone,
            description: empresa.descricao,
            aggregateRating: media
              ? {
                  '@type': 'AggregateRating',
                  ratingValue: media,
                  reviewCount: total,
                }
              : undefined,
          }),
        }}
      />
    </main>
  )
}
