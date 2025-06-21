// app/empresa/[id]/page.tsx

import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { AvaliacaoCard } from '@/components/AvaliacaoCard'
import { getSession } from '@supabase/auth-helpers-nextjs'

interface PageProps {
  params: { id: string }
}

export default async function EmpresaPage({ params }: PageProps) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Busca os dados da empresa
  const { data: empresa, error: erroEmpresa } = await supabase
    .from('empresas')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!empresa) return notFound()

  // Busca o usuário logado
  const session = await getSession()
  const userId = session?.user?.id

  // Busca as avaliações dessa empresa
  const { data: avaliacoes, error: erroAvaliacoes } = await supabase
    .from('avaliacoes')
    .select('*')
    .eq('empresa_id', params.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{empresa.nome}</h1>
      <p className="text-gray-600 mb-6">{empresa.descricao}</p>

      {/* Avaliações */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Avaliações</h2>

        {avaliacoes?.length === 0 && (
          <p className="text-gray-500">Ainda não há avaliações para esta empresa.</p>
        )}

        <div className="space-y-4">
          {avaliacoes?.map((avaliacao) => (
            <AvaliacaoCard
              key={avaliacao.id}
              avaliacao={avaliacao}
              isAutor={avaliacao.user_id === userId}
              isDono={empresa.user_id === userId}
              onEditar={() => {
                // Lógica para abrir modal ou redirecionar para editar
              }}
              onExcluir={() => {
                // Lógica para confirmar e excluir avaliação
              }}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
