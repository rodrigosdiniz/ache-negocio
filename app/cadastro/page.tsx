'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CadastroPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagem('')
    setErro('')

    if (!nome || !email || !senha) {
      setErro('Por favor, preencha todos os campos.')
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome }
      }
    })

    if (error) {
      console.error(error)
      setErro(error.message)
    } else {
      setMensagem('Conta criada com sucesso! Verifique seu e-mail.')
      setNome('')
      setEmail('')
      setSenha('')
    }
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

      {erro && <p className="mt-4 text-center text-sm text-red-600">{erro}</p>}
      {mensagem && <p className="mt-4 text-center text-sm text-green-600">{mensagem}</p>}
    </main>
  )
}
