'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { AvaliacaoCard } from '@/components/AvaliacaoCard'
import { ModalAvaliacao } from '@/components/ModalAvaliacao'

export default function EmpresaPage({ params }: { params: { id: string } }) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [empresa, setEmpresa] = useState<any>(null)
  const [avaliacoes, setAvaliacoes] = useState<any[]>([])
  const [session, setSession] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const carregarDados = async () => {
      const { data: { session: sess } } = await supabase.auth.getSession()
      setSession(sess)

      const { data: empresaData } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', params.id)
        .single()

      setEmpresa(empresaData)

      const { data: avaliacoesData } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('empresa_id', params.id)
        .order('created_at', { ascending: false })

      setAvaliacoes(avaliacoesData)
    }

    carregarDados()
  }, [params.id, showModal])

  if (!empresa) return <div className="p-8">Carregando empresa...</div>

  const userId = session?.user?.id
  const isDono = empresa.user_id === userId
  const avaliacaoDoUsuario = avaliacoes.find((a) => a.user_id === userId)

  const handleExcluir = async (id: string) => {
    const confirmar = confirm('Deseja excluir sua avaliação?')
    if (!confirmar) return

    await supabase.from('avaliacoes').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">{empresa.nome}</h1>
      <p className="text-gray-600 mb-6">{empresa.descricao}</p>

      {/* Botão de Avaliação */}
      {userId && !isDono && (
        <div className="mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {avaliacaoDoUsuario ? 'Editar sua Avaliação' : 'Avaliar Empresa'}
          </button>
        </div>
      )}

      {/* Avaliações */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Avaliações</h2>

        {avaliacoes.length === 0 && (
          <p className="text-gray-500">Ainda não há avaliações para esta empresa.</p>
        )}

        <div className="space-y-4">
          {avaliacoes.map((avaliacao) => (
            <AvaliacaoCard
              key={avaliacao.id}
              avaliacao={avaliacao}
              isAutor={avaliacao.user_id === userId}
              isDono={isDono}
              onEditar={() => setShowModal(true)}
              onExcluir={() => handleExcluir(avaliacao.id)}
            />
          ))}
        </div>
      </section>

      {/* Modal de Avaliação */}
      <ModalAvaliacao
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        empresaId={params.id}
        avaliacaoExistente={avaliacaoDoUsuario}
        onSalvar={() => router.refresh()}
      />
    </div>
  )
}
