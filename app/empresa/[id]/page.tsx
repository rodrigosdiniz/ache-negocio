'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Star, MessageSquareReply } from 'lucide-react'

interface Avaliacao {
  id: string
  usuario_nome: string
  nota: number
  comentario: string
  criado_em: string
  resposta?: string
}

export default function AvaliacoesEmpresa() {
  const { id } = useParams()
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [filtroNota, setFiltroNota] = useState<number | null>(null)
  const [busca, setBusca] = useState('')
  const [ordenacao, setOrdenacao] = useState<'data' | 'nota'>('data')

  useEffect(() => {
    const carregarAvaliacoes = async () => {
      let query = supabase
        .from('avaliacoes')
        .select('*')
        .eq('empresa_id', id)

      if (filtroNota) query = query.gte('nota', filtroNota)
      if (ordenacao === 'nota') query = query.order('nota', { ascending: false })
      else query = query.order('criado_em', { ascending: false })

      const { data } = await query
      if (data) {
        setAvaliacoes(
          data.filter((a) =>
            a.comentario.toLowerCase().includes(busca.toLowerCase()) ||
            a.usuario_nome.toLowerCase().includes(busca.toLowerCase())
          )
        )
      }
    }

    carregarAvaliacoes()
  }, [id, filtroNota, busca, ordenacao])

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Avaliações</h2>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={filtroNota || ''}
          onChange={(e) => setFiltroNota(e.target.value ? parseInt(e.target.value) : null)}
          className="border rounded px-3 py-2"
        >
          <option value="">Todas as notas</option>
          <option value="4">Notas 4+</option>
          <option value="3">Notas 3+</option>
        </select>

        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value as 'data' | 'nota')}
          className="border rounded px-3 py-2"
        >
          <option value="data">Mais recentes</option>
          <option value="nota">Mais bem avaliadas</option>
        </select>

        <input
          type="text"
          placeholder="Buscar por comentário ou nome"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
      </div>

      <ul className="space-y-4">
        {avaliacoes.map((a) => (
          <li key={a.id} className="border p-4 rounded bg-white shadow-sm">
            <div className="flex justify-between items-center">
              <p className="font-semibold">{a.usuario_nome}</p>
              <div className="flex items-center text-yellow-600">
                <Star className="w-4 h-4 fill-yellow-500 mr-1" /> {a.nota.toFixed(1)} / 5
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-2">{a.comentario}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(a.criado_em).toLocaleDateString('pt-BR')}</p>

            {a.resposta && (
              <div className="mt-3 border-l-4 border-blue-500 pl-4 text-sm text-blue-700">
                <p className="flex items-center gap-2 font-medium">
                  <MessageSquareReply className="w-4 h-4" /> Resposta do proprietário:
                </p>
                <p className="mt-1">{a.resposta}</p>
              </div>
            )}
          </li>
        ))}

        {avaliacoes.length === 0 && (
          <p className="text-gray-600 text-sm">Nenhuma avaliação encontrada.</p>
        )}
      </ul>
    </section>
  )
}
