// app/empresa/[id]/page.tsx
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Toast } from '@/components/ui/toast'
import { Star, Award } from 'lucide-react'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data } = await supabase.from('empresas').select('nome, cidade').eq('id', params.id).single()
  return {
    title: `${data?.nome} em ${data?.cidade} | Ache Negócio`,
    description: `Encontre ${data?.nome}, localizada em ${data?.cidade}. Veja informações, contato e mais.`
  }
}

function renderStars(nota: number, tamanho: string = 'w-5 h-5') {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`inline ${tamanho} ${i < nota ? 'fill-yellow-400 stroke-yellow-500' : 'stroke-gray-400'}`}
    />
  ))
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

  const { data: todasAvaliacoes } = await supabase.from('avaliacoes')
    .select('nota')
    .eq('empresa_id', params.id)

  const { data: avaliacoes } = await supabase.from('avaliacoes')
    .select('nota, comentario, created_at')
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
        <Image src={empresa.imagem_url} alt={empresa.nome} width={600} height={300} className="rounded-xl mb-6 w-full object-cover" />
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

      <p className="mb-4">{empresa.descricao}</p>

      <div className="mb-4 space-y-1">
        <p><strong>Telefone:</strong> {empresa.telefone}</p>
        <p><strong>Email:</strong> {empresa.email}</p>
        {empresa.website && (
          <p><strong>Site:</strong> <a href={empresa.website} target="_blank" className="text-blue-600 underline">{empresa.website}</a></p>
        )}
        {whatsappLink && (
          <a href={whatsappLink} target="_blank" className="inline-block mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Entrar no WhatsApp</a>
        )}
      </div>

      {media && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Avaliações (página {page})</h2>
          <ul className="space-y-2">
            {avaliacoes!.map((a, i) => (
              <li key={i} className="border p-4 rounded">
                <div className="flex items-center gap-2">{renderStars(a.nota)}</div>
                <p className="mt-1">{a.comentario}</p>
                <p className="text-sm text-gray-500 mt-1">{new Date(a.created_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>

          <div className="flex justify-between mt-4">
            {page > 1 && <Link href={`?page=${page - 1}`} className="text-blue-600">← Anterior</Link>}
            {to + 1 < total && <Link href={`?page=${page + 1}`} className="text-blue-600 ml-auto">Próxima →</Link>}
          </div>
        </div>
      )}

      {user && (
        <form action="/api/avaliar" method="POST" className="mt-8 border-t pt-6 space-y-4">
          <h2 className="text-xl font-bold">Deixe sua avaliação</h2>
          <input type="hidden" name="empresa_id" value={empresa.id} />
          <input type="number" name="nota" min={1} max={5} required className="w-20 border rounded px-2 py-1" placeholder="Nota (1 a 5)" />
          <textarea name="comentario" required placeholder="Comentário" className="w-full border rounded px-3 py-2" rows={3}></textarea>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Enviar Avaliação</button>
        </form>
      )}
    </main>
  )
}
