'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface Props {
  empresaId: string
  userId: string
  onAvaliado?: () => void // opcional: função chamada após avaliação enviada
}

export default function FormAvaliacao({ empresaId, userId, onAvaliado }: Props) {
  const [nota, setNota] = useState(5)
  const [comentario, setComentario] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [tipoMsg, setTipoMsg] = useState<'erro' | 'sucesso' | ''>('')
  const [carregando, setCarregando] = useState(false)

  const enviarAvaliacao = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setMensagem('')
    setTipoMsg('')

    const resposta = await fetch('/api/avaliacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empresa_id: empresaId, user_id: userId, nota, comentario }),
    })

    const resultado = await resposta.json()

    if (resposta.ok) {
      setMensagem('Avaliação enviada com sucesso! 🎉')
      setTipoMsg('sucesso')
      setComentario('')
      setNota(5)
      if (onAvaliado) onAvaliado()
    } else {
      setMensagem(resultado.erro || 'Erro ao enviar avaliação.')
      setTipoMsg('erro')
    }

    setCarregando(false)
  }

  return (
    <form onSubmit={enviarAvaliacao} className="bg-white p-4 rounded shadow mt-8 border-t pt-6 space-y-4">
      <h2 className="text-xl font-bold">Deixe sua avaliação</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Nota:</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNota(n)}
              className={`transition ${n <= nota ? 'text-yellow-500' : 'text-gray-300'}`}
              aria-label={`${n} estrela${n > 1 ? 's' : ''}`}
            >
              <Star className="w-6 h-6 fill-current" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Comentário:</label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="border p-2 rounded w-full"
          rows={3}
          placeholder="Conte como foi sua experiência..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={carregando}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {carregando ? 'Enviando...' : 'Enviar Avaliação'}
      </button>

      {mensagem && (
        <p className={`mt-3 text-sm text-center ${tipoMsg === 'sucesso' ? 'text-green-600' : 'text-red-600'}`}>
          {mensagem}
        </p>
      )}
    </form>
  )
}
