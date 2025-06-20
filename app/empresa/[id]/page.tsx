// app/empresa/[id]/page.tsx
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Toast } from '@/components/ui/toast'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data } = await supabase.from('empresas').select('nome, cidade').eq('id', params.id).single()
  return {
    title: `${data?.nome} em ${data?.cidade} | Ache Negócio`,
    description: `Encontre ${data?.nome}, localizada em ${data?.cidade}. Veja informações, contato e mais.`
  }
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

  const { data: allAvaliacoes } = await supabase.from('avaliacoes').select('*', { count: 'exact', head: true }).eq('empresa_id', params.id)
  const total = allAvaliacoes?.length || 0

  const { data: avaliacoes } = await supabase.from('avaliacoes')
    .select('nota, comentario, created_at')
    .eq('empresa_id', params.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  const media = avaliacoes && avaliacoes.length > 0
    ? (avaliacoes.reduce((acc, cur) => acc + cur.nota, 0) / avaliacoes.length).toFixed(1)
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

      <h1 className="text-3xl font-bold mb-2">{empresa.nome}</h1>
      <p className="text-sm text-gray-600 mb-4">{empresa.categoria} • {empresa.cidade}</p>

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
          <p className="mb-2">Nota média: ⭐ {media}</p>
          <ul className="space-y-2">
            {avaliacoes!.map((a, i) => (
              <li key={i} className="border p-4 rounded">
                <p>⭐ {a.nota}</p>
                <p>{a.comentario}</p>
                <p className="text-sm text-gray-500">{new Dat
