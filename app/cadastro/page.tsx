'use client'

import { useState } from 'react'

export default function CadastroPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome || !email || !senha) {
      setMensagem('Por favor, preencha todos os campos.')
      return
    }

    setMensagem('Enviando...')

    // Aqui você pode conectar com Supabase ou outro backend
    setTimeout(() => {
      setMensagem('Conta criada com sucesso! 🚀')
      setNome('')
      setEmail('')
      setSenha('')
    }, 1500)
  }

  return (
    <main className="max-w-md mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Criar conta gratuita</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Criar Conta
        </button>
      </form>

      {mensagem && (
        <p className="mt-4 text-center text-sm text-gray-700">{mensagem}</p>
      )}
    </main>
  )
}
