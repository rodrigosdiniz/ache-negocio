'use client'

import { useState } from 'react'

export default function FormContato() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sucesso' | 'erro'>('idle')
  const [erroMsg, setErroMsg] = useState('')

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErroMsg('')

    const res = await fetch('/api/contato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, mensagem }),
    })

    if (res.ok) {
      setStatus('sucesso')
      setNome('')
      setEmail('')
      setMensagem('')
    } else {
      const body = await res.json()
      setErroMsg(body?.error || 'Erro ao enviar mensagem.')
      setStatus('erro')
    }
  }

  return (
    <form onSubmit={enviar} className="bg-white p-6 rounded shadow-md space-y-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-center">Fale Conosco</h2>

      <div>
        <label className="block mb-1 font-medium">Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Mensagem *</label>
        <textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          required
          rows={5}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {status === 'loading' ? 'Enviando...' : 'Enviar Mensagem'}
      </button>

      {status === 'sucesso' && (
        <p className="text-green-600 text-center">Mensagem enviada com sucesso! ✅</p>
      )}
      {status === 'erro' && (
        <p className="text-red-600 text-center">{erroMsg}</p>
      )}
    </form>
  )
}
