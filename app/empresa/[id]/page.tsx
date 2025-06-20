// app/empresa/[id]/page.tsx
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Toast } from '@/components/ui/toast'
import { Star } from 'lucide-react'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data } = await supabase.from('empresas').select('nome, cidade').eq('id', params.id).single()
  return {
    title: `${data?.nome} em ${data?.cidade} | Ache Negócio`,
    description: `Encontre ${data?.nome}, localizada em ${data?.cidade}. Veja informações, contato e mais.`
  }
}

function renderStars(nota: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`inline w-5 h-5 ${i < nota ? 'fill-yellow-400 stroke-yellow-500' : 'stroke-gray-400'}`}
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

      <h1 className="text-3xl font-bold mb-2">{empresa.nome}</h1>
      <p className="text-sm text-gray-600 mb-4">{empresa.categoria} • {empresa.cidade}</p>

      <p className="mb-4">{empresa.descricao}</p>

      <div className="mb-4 space-y-1">
        <p><strong>Telefone:</
