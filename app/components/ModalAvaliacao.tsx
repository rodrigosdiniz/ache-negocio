'use client'

import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { Star } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface ModalAvaliacaoProps {
  isOpen: boolean
  onClose: () => void
  empresaId: string
  avaliacaoExistente?: {
    id: string
    nota: number
    comentario: string
  }
  onSalvar: () => void // callback após salvar
}

export function ModalAvaliacao({
  isOpen,
  onClose,
  empresaId,
  avaliacaoExistente,
  onSalvar
}: ModalAvaliacaoProps) {
  const supabase = createClientComponentClient()
  const [nota, setNota] = useState(0)
  const [comentario, setComentario] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    if (avaliacaoExistente) {
      setNota(avaliacaoExistente.nota)
      setComentario(avaliacaoExistente.comentario)
    } else {
      setNota(0)
      setComentario('')
    }
  }, [avaliacaoExistente])

  const handleSubmit = async () => {
    if (nota === 0 || comentario.trim() === '') return

    setCarregando(true)

    const { data: user } = await supabase.auth.getUser()
    const nome_usuario = user?.user?.user_metadata?.name || 'Usuário'

    if (avaliacaoExistente) {
      // Atualizar
      await supabase
        .from('avaliacoes')
        .update({ nota, comentario })
        .eq('id', avaliacaoExistente.id)
    } else {
      // Criar
      await supabase.from('avaliacoes').insert({
        empresa_id: empresaId,
        user_id: user.user?.id,
        nome_usuario,
        nota,
        comentario
      })
    }

    setCarregando(false)
    onSalvar()
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="bg-white rounded-2xl p-6 z-50 max-w-md w-full shadow-xl">
        <Dialog.Title className="text-xl font-bold mb-4">
          {avaliacaoExistente ? 'Editar Avaliação' : 'Avaliar Empresa'}
        </Dialog.Title>

        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={24}
              className={i <= nota ? 'text-yellow-500 cursor-pointer' : 'text-gray-300 cursor-pointer'}
              onClick={() => setNota(i)}
            />
          ))}
        </div>

        <textarea
          className="w-full border rounded-md p-2 mb-4"
          rows={4}
          placeholder="Escreva seu comentário..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:underline">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={carregando || nota === 0 || comentario.trim() === ''}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {carregando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
