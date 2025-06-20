// /contato/page.tsx
'use client'

import { useState } from 'react'

export default function ContatoPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviado, setEnviado] = useState(false)

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/contato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, mensagem })
    })
    setEnviado(true)
    setNome('')
    setEmail('')
    setMensagem('')
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Fale Conosco</h1>
      {enviado ? (
        <p className="text-green-600">Mensagem enviada com sucesso! Entraremos em contato em breve.</p>
      ) : (
        <form onSubmit={enviar} className="space-y-4">
          <input type="text" required placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)} className="w-full border p-2 rounded" />
          <input type="email" required placeholder="Seu email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded" />
          <textarea required placeholder="Sua mensagem" value={mensagem} onChange={e => setMensagem(e.target.value)} className="w-full border p-2 rounded h-32" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Enviar</button>
        </form>
      )}
    </main>
  )
}
