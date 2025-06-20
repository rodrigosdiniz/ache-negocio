'use client'

import { useState } from 'react'

export default function ContatoPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [status, setStatus] = useState<'idle' | 'enviando' | 'sucesso' | 'erro'>('idle')
  const [erroMsg, setErroMsg] = useState('')

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('enviando')
    setErroMsg('')

    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, mensagem })
      })

      if (res.ok) {
        setStatus('sucesso')
        setNome('')
        setEmail('')
        setMensagem('')
      } else {
        const data = await res.json()
        setErroMsg(data?.error || 'Erro ao enviar. Tente novamente.')
        setStatus('erro')
      }
    } catch (err) {
      setErroMsg('Erro de conexão. Tente novamente mais tarde.')
      setStatus('erro')
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Fale Conosco</h1>

      {status === 'sucesso' ? (
        <p className="text-green-600 text-center font-medium">
          ✅ Mensagem enviada com sucesso! Entraremos em contato em breve.
        </p>
      ) : (
        <form onSubmit={enviar} className="space-y-4 bg-white p-6 rounded shadow-md">
          <input
            type="text"
            required
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            required
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <textarea
            required
            placeholder="Sua mensagem"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            className="w-full border p-2 rounded h-32"
          />
          <button
            type="submit"
            disabled={status === 'enviando'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          >
            {status === 'enviando' ? 'Enviando...' : 'Enviar'}
          </button>
          {status === 'erro' && <p className="text-red-600 text-sm text-center">{erroMsg}</p>}
        </form>
      )}
    </main>
  )
}
