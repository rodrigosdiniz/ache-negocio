'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminDenunciasPage() {
  const supabase = createClientComponentClient()
  const [denuncias, setDenuncias] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase
        .from('denuncias')
        .select('id, motivo, created_at, user_id, avaliacao_id, avaliacoes(*, empresas(nome))')
        .order('created_at', { ascending: false })

      setDenuncias(data || [])
    }

    carregar()
  }, [])

  const excluirAvaliacao = async (id: string) => {
    const confirmar = confirm('Tem certeza que deseja excluir essa avaliação denunciada?')
    if (!confirmar) return

    await supabase.from('avaliacoes').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">📢 Denúncias de Avaliações</h1>

      {denuncias.length === 0 && (
        <p className="text-gray-500">Nenhuma denúncia registrada.</p>
      )}

      <div className="space-y-6">
        {denuncias.map((d) => (
          <div key={d.id} className="border p-4 rounded-xl bg-white shadow-md">
            <div className="text-sm text-gray-500 mb-2">
              <strong>Denunciado em:</strong>{' '}
              {new Date(d.created_at).toLocaleString()} <br />
              <strong>Motivo:</strong> {d.motivo}
            </div>

            {d.avaliacoes ? (
              <>
                <div className="font-semibold text-gray-800 mb-1">
                  Avaliação de {d.avaliacoes.nome_usuario} para{' '}
                  <strong>{d.avaliacoes.empresas?.nome}</strong>
                </div>

                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i <= d.avaliacoes.nota
                          ? 'text-yellow-500'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>

                <p className="text-gray-800">{d.avaliacoes.comentario}</p>

                {d.avaliacoes.resposta_dono && (
                  <div className="mt-2 border-l-4 border-blue-500 pl-3 text-sm bg-blue-50 text-blue-800">
                    <strong>Resposta do dono:</strong> {d.avaliacoes.resposta_dono}
                  </div>
                )}

                <div className="mt-4">
                  <button
                    onClick={() => excluirAvaliacao(d.avaliacoes.id)}
                    className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Excluir Avaliação
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-red-600">Avaliação não encontrada (pode ter sido excluída).</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
