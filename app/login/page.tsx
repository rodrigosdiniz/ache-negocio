'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setMensagem('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    })

    if (error) {
      setErro('E-mail ou senha inválidos.')
      console.error(error)
    } else {
      setMensagem('Login realizado com sucesso!')
      setTimeout(() => {
        router.push('/dashboard') // redireciona para o painel
      }, 1000)
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Entrar na sua conta</h1>

      <form onSubmit={handleLogin} className="space-y-4">
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Entrar
        </button>
      </form>

      {erro && <p className="mt-4 text-center text-sm text-red-600">{erro}</p>}
      {mensagem && <p className="mt-4 text-center text-sm text-green-600">{mensagem}</p>}
    </main>
  )
}
