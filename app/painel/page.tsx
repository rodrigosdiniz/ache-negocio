'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface Avaliacao {
  id: string
  comentario: string
  nota: number
  resposta: string | null
  created_at: string
  user: {
    full_name: string | null
  }
}

interface Props {
  empresaId: string
  userId: string
}

export default function AvaliacoesPainel({ empresaId, userId }: Props) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [loading, setLoading] = useState(true)
  const [respostas, setRespostas] = useState<{ [id: string]: string }>({})
  const [salvando, setSalvando] = useState<string>('')

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase
        .from('avaliacoes')
        .select('id, comentario, nota, resposta, created_at, user:auth.users(full_name)')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false })

      if (data) {
        setAvaliacoes(data)
        const respObj: { [id: string]: string } = {}
        data.forEach((a) => respObj[a.id] = a.resposta || '')
        setRespostas(respObj)
      }
      setLoading(false)
    }

    carregar()
  }, [empresaId])

  const salvarResposta = async (id: string) => {
    setSalvando(id)
    const { error } = await supabase
      .from('avaliacoes')
      .update({ resposta: respostas[id] })
      .eq('id', id)

    if (!error) alert('Resposta salva com sucesso.')
    else alert('Erro ao salvar resposta.')

    setSalvando('')
  }

  if (loading) return <p className="text-sm text-gray-600">Carregando avaliações...</p>

  return (
    <div className="space-y-6">
      {avaliacoes.length === 0 ? (
        <p className="text-sm text-gray-600">Nenhuma avaliação recebida ainda.</p>
      ) : (
        avaliacoes.map((a) => (
          <div key={a.id} className="border p-4 rounded">
            <p className="font-medium text-yellow-700">Nota: {a.nota}</p>
            <p className="text-sm text-gray-800">{a.comentario}</p>
            <p className="text-sm text-gray-500">por {a.user?.full_name || 'usuário'} em {new Date(a.created_at).toLocaleDateString()}</p>

            <div className="mt-3">
              <label className="text-sm font-medium text-gray-700 block mb-1">Responder:</label>
              <Textarea
                rows={3}
                value={respostas[a.id]}
                onChange={(e) => setRespostas({ ...respostas, [a.id]: e.target.value })}
              />
              <Button
                onClick={() => salvarResposta(a.id)}
                className="mt-2"
                disabled={salvando === a.id}
              >
                {salvando === a.id ? (
                  <><Loader2 className="w-4 h-4 animate-spin inline mr-2" /> Salvando...</>
                ) : 'Salvar Resposta'}
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
