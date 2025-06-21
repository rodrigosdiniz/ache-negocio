// components/AvaliacaoCard.tsx
'use client'

import { Star } from 'lucide-react'
import { useSession } from '@supabase/auth-helpers-react'

interface AvaliacaoCardProps {
  avaliacao: {
    id: string
    nome_usuario: string
    nota: number
    comentario: string
    resposta_dono?: string
    created_at: string
    user_id: string
  }
  onEditar?: () => void
  onExcluir?: () => void
  isDono?: boolean
  isAutor?: boolean
}

export function AvaliacaoCard({
  avaliacao,
  onEditar,
  onExcluir,
  isDono = false,
  isAutor = false
}: AvaliacaoCardProps) {
  const estrelas = Array.from({ length: 5 }, (_, i) => (
    <Star key={i} size={16} className={i < avaliacao.nota ? 'text-yellow-500' : 'text-gray-300'} />
  ))

  return (
    <div className="border p-4 rounded-2xl shadow-md bg-white space-y-2">
      <div className="flex justify-between items-center">
        <div className="font-semibold">{avaliacao.nome_usuario}</div>
        <div className="flex gap-1">{estrelas}</div>
      </div>
      <p className="text-gray-800">{avaliacao.comentario}</p>
      <p className="text-xs text-gray-500">Enviado em {new Date(avaliacao.created_at).toLocaleDateString()}</p>

      {avaliacao.resposta_dono && (
        <div className="mt-2 border-l-4 border-blue-500 pl-3 text-sm bg-blue-50 text-blue-800">
          <strong>Resposta do dono:</strong> {avaliacao.resposta_dono}
        </div>
      )}

      <div className="flex gap-2 text-sm mt-2">
        {isAutor && (
          <>
            <button onClick={onEditar} className="text-blue-600 hover:underline">Editar</button>
            <button onClick={onExcluir} className="text-red-600 hover:underline">Excluir</button>
          </>
        )}
      </div>
    </div>
  )
}
