'use client'

import { useState } from 'react'

interface Props {
  empresaId: string
  userId: string
}

export default function FormAvaliacao({ empresaId, userId }: Props) {
  const [nota, setNota] = useState(5)
  const [comentario, setComentario] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  const enviarAvaliacao = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setMensagem('')

    const resposta = await fetch('/api/avaliacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empresa_id: empresaId, user_id: userId, nota, comentario }),
    })

    if (resposta.ok) {
      setMensagem('Avaliação enviada com sucesso! 🎉')
      setComentario('')
      setNota(5)
    } else {
      setMensagem('Erro ao enviar avaliação. Tente novamente.')
    }

    setCarregando(false)
  }

  return (
    <form onSubmit={enviarAvaliacao} className="bg-white p-4 rounded shadow mt-8">
      <h3 className="text-lg font-bold mb-2">Deixe sua avaliação</h3>

      <label className="block text-sm mb-1">Nota:</label>
      <select
        value={nota}
        onChange={(e) => setNota(Number(e.target.value))}
        className="border p-2 rounded w-full mb-3"
      >
        <option value={5}>5 - Excelente</option>
        <option value={4}>4 - Muito bom</option>
        <option value={3}>3 - Regular</option>
        <option value={2}>2 - Ruim</option>
        <option value={1}>1 - Péssimo</option>
      </select>

      <label className="block text-sm mb-1">Comentário (opcional):</label>
      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        className="border p-2 rounded w-full mb-3"
        rows={3}
        placeholder="Conte como foi sua experiência..."
      />

      <button
        type="submit"
        disabled={carregando}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {carregando ? 'Enviando...' : 'Enviar Avaliação'}
      </button>

      {mensagem && <p className="mt-3 text-sm text-center">{mensagem}</p>}
    </form>
  )
}
