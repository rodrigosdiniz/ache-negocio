'use client'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { Toast } from '@/components/ui/toast'
import { Award, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import FormAvaliacao from '@/components/FormAvaliacao'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient(cookies())
  const { data } = await supabase.from('empresas').select('nome, cidade, categoria, descricao').eq('id', params.id).single()

  return {
    title: `${data?.nome} em ${data?.cidade} | Ache Negócio`,
    description: data?.descricao || `Confira ${data?.nome}, ${data?.categoria} em ${data?.cidade}. Veja avaliações e entre em contato.`,
    openGraph: {
      title: `${data?.nome} | Ache Negócio`,
      description: data?.descricao || '',
      images: data?.imagem_url ? [data.imagem_url] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data?.nome} | Ache Negócio`,
      description: data?.descricao || '',
      images: data?.imagem_url ? [data.imagem_url] : []
    }
  }
}

function renderStars(nota: number, size: string = 'w-5 h-5') {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <Star className={`${size} ${i < nota ? 'fill-yellow-400 stroke-yellow-500' : 'stroke-gray-400'}`} />
        </motion.div>
      ))}
    </div>
  )
}

export default async function EmpresaPage({ params, searchParams }: { params: { id: string }, searchParams: { page?: string } }) {
  const supabase = createClient(cookies())
  const cookieStore = cookies()
  const toastMsg = cookieStore.get('toast')?.value

  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  const { data: empresa } = await supabase.from('empresas').select('*').eq('id', params.id).single()
  if (!empresa) return notFound()

  const page = Number(searchParams.page || 1)
  const pageSize = 5
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data: todasAvaliacoes } = await supabase
    .from('avaliacoes')
    .select('nota')
    .eq('empresa_id', params.id)

  const { data: avaliacoes } = await supabase
    .from('avaliacoes')
    .select('*, user:auth.users(full_name)')
    .eq('empresa_id', params.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  const total = todasAvaliacoes?.length || 0
  const media = todasAvaliacoes && total > 0
    ? (todasAvaliacoes.reduce((acc, cur) => acc + cur.nota, 0) / total).toFixed(1)
    : null

  const whatsappLink = empresa.telefone?.replace(/[^0-9]/g, '').length >= 11
    ? `https://wa.me/55${empresa.telefone.replace(/[^0-9]/g, '')}`
    : null

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {toastMsg && <Toast title="Sucesso" description={toastMsg} variant="success" />}

      <Link href="/empresas" className="text-blue-600 underline mb-4 inline-block">← Voltar</Link>

      {empresa.imagem_url && (
        <Image
          src={empresa.imagem_url}
          alt={`Imagem da empresa ${empresa.nome}`}
          width={800}
          height={400}
          className="rounded-xl mb-6 w-full object-cover shadow-md"
        />
      )}

      <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
        {empresa.nome}
        {media && Number(media) >= 4.5 && (
          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-sm px-2 py-0.5 rounded">
            <Award className="w-4 h-4" /> Top Avaliada
          </span>
        )}
      </h1>
      <p className="text-sm text-gray-600 mb-2">{empresa.categoria} • {empresa.cidade}</p>

      {media && (
        <div className="flex items-center gap-2 mb-4">
          {renderStars(Number(media), 'w-6 h-6')}
          <span className="text-lg font-medium">{media} ({total} avaliações)</span>
        </div>
      )}

      <p className="mb-6 text-gray-800 leading-relaxed whitespace-pre-line">{empresa.descricao}</p>

      <div className="mb-6 space-y-1 text-sm">
        <p><strong>Telefone:</strong> {empresa.telefone}</p>
        <p><strong>Email:</strong> {empresa.email}</p>
        {empresa.website && (
          <p><strong>Site:</strong> <a href={empresa.website} target="_blank" className="text-blue-600 underline">{empresa.website}</a></p>
        )}
        {whatsappLink && (
          <a href={whatsappLink} target="_blank" className="inline-block mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Entrar no WhatsApp
          </a>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Avaliações (página {page})</h2>
        {avaliacoes?.length === 0 ? (
          <p className="text-sm text-gray-600">Nenhuma avaliação ainda.</p>
        ) : (
          <ul className="space-y-3">
            {avaliacoes.map((a, i) => (
              <li key={i} className="border p-4 rounded shadow-sm">
                {renderStars(a.nota)}
                <p className="mt-1 text-gray-800">{a.comentario}</p>
                <p className="text-xs text-gray-500">Avaliado por {a.user?.full_name || 'usuário'} em {new Date(a.created_at).toLocaleDateString()}</p>

                {a.resposta && (
                  <div className="mt-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                    <p className="font-medium text-blue-700">Resposta do dono:</p>
                    <p>{a.resposta}</p>
                  </div>
                )}

                {user?.id === a.user_id && (
                  <div className="flex gap-3 mt-2">
                    <form action="/api/avaliacoes/editar" method="POST">
                      <input type="hidden" name="id" value={a.id} />
                      <button type="submit" className="text-sm text-blue-600 underline">Editar</button>
                    </form>
                    <form action="/api/avaliacoes/excluir" method="POST" onSubmit={(e) => !confirm('Excluir esta avaliação?') && e.preventDefault()}>
                      <input type="hidden" name="id" value={a.id} />
                      <button type="submit" className="text-sm text-red-600 underline">Excluir</button>
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-between mt-4">
          {page > 1 && <Link href={`?page=${page - 1}`} className="text-blue-600">← Anterior</Link>}
          {to + 1 < total && <Link href={`?page=${page + 1}`} className="text-blue-600 ml-auto">Próxima →</Link>}
        </div>
      </div>

      {user && (
        <FormAvaliacao
          empresaId={empresa.id}
          userId={user.id}
          onAvaliado={() => location.reload()}
        />
      )}
    </main>
  )
}
