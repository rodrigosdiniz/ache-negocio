'use client'

import { useState } from 'react'

interface Props {
  avaliacaoId: string
  respostaAtual?: string
  onRespostaEnviada: () => void
}

export default function RespostaAvaliacao({ avaliacaoId, respostaAtual = '', onRespostaEnviada }: Props) {
  const [resposta, setResposta] = useState(respostaAtual)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  const enviarResposta = async () => {
    if (!resposta.trim()) return

    setEnviando(true)
    setErro('')

    try {
      const res = await fetch('/api/avaliacoes/responder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: avaliacaoId, resposta }),
      })

      if (res.ok) {
        onRespostaEnviada()
      } else {
        const data = await res.json()
        setErro(data.error || 'Erro ao enviar resposta.')
      }
    } catch (e) {
      setErro('Erro ao conectar com o servidor.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mt-3 border-t pt-3">
      <textarea
        value={resposta}
        onChange={(e) => setResposta(e.target.value)}
        rows={3}
        placeholder="Responder esta avaliação..."
        className="w-full border rounded p-2 text-sm"
      />
      {erro && <p className="text-red-600 text-sm mt-1">{erro}</p>}
      <button
        onClick={enviarResposta}
        disabled={enviando || !resposta.trim()}
        className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm disabled:opacity-50"
      >
        {enviando ? 'Enviando...' : 'Responder'}
      </button>
    </div>
  )
}
