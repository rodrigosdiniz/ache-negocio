'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion } from 'framer-motion'

interface Avaliacao {
  id: string
  nome_usuario: string
  nota: number
  comentario: string
  resposta_dono?: string
  created_at: string
  user_id: string
}

interface AvaliacaoCardProps {
  avaliacao: Avaliacao
  isAutor?: boolean
  isDono?: boolean
  onEditar?: () => void
  onExcluir?: () => void
}

export function AvaliacaoCard({
  avaliacao,
  isAutor = false,
  isDono = false,
  onEditar,
  onExcluir
}: AvaliacaoCardProps) {
  const supabase = createClientComponentClient()

  const [resposta, setResposta] = useState(avaliacao.resposta_dono || '')
  const [salvando, setSalvando] = useState(false)

  const estrelas = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      size={16}
      className={i < avaliacao.nota ? 'text-yellow-500' : 'text-gray-300'}
    />
  ))

  const handleResponder = async () => {
    setSalvando(true)
    await supabase
      .from('avaliacoes')
      .update({ resposta_dono: resposta })
      .eq('id', avaliacao.id)
    setSalvando(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border p-4 rounded-2xl shadow-md bg-white space-y-2"
    >
      <div className="flex justify-between items-center">
        <div className="font-semibold">{avaliacao.nome_usuario}</div>
        <div className="flex gap-1">{estrelas}</div>
      </div>

      <p className="text-gray-800">{avaliacao.comentario}</p>
      <p className="text-xs text-gray-500">
        Enviado em {new Date(avaliacao.created_at).toLocaleDateString()}
      </p>

      {avaliacao.resposta_dono && !isDono && (
        <div className="mt-2 border-l-4 border-blue-500 pl-3 text-sm bg-blue-50 text-blue-800">
          <strong>Resposta do dono:</strong> {avaliacao.resposta_dono}
        </div>
      )}

      {isDono && (
        <div className="mt-2">
          <textarea
            rows={2}
            placeholder="Responder avaliação..."
            className="w-full border rounded-md p-2 text-sm"
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
          />
          <button
            onClick={handleResponder}
            disabled={salvando}
            className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            {salvando ? 'Salvando...' : 'Responder'}
          </button>
        </div>
      )}

      {isAutor && (
        <div className="flex gap-3 text-sm mt-2">
          <button
            onClick={onEditar}
            className="text-blue-600 hover:underline"
          >
            Editar
          </button>
          <button
            onClick={onExcluir}
            className="text-red-600 hover:underline"
          >
            Excluir
          </button>
        </div>
      )}
    </motion.div>
  )
}
