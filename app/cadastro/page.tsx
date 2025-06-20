// app/cadastro/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/context/toast-context'

export default function CadastroPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const router = useRouter()
  const { showToast } = useToast()

  const cadastrar = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome }
      }
    })

    if (error) {
      showToast('Erro ao cadastrar: ' + error.message, 'error')
    } else {
      showToast('Cadastro realizado com sucesso! Verifique seu email.', 'success')
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  return (
    <main className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Cadastro</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          onClick={cadastrar}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          Criar conta
        </button>
      </div>
    </
