// app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/context/toast-context'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const router = useRouter()
  const { showToast } = useToast()

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    })
    if (error) {
      showToast('Email ou senha incorretos', 'error')
    } else {
      showToast('Login bem-sucedido', 'success')
      setTimeout(() => router.push('/dashboard'), 1000)
    }
  }

  return (
    <main className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
      <div className="space-y-4">
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
          onClick={login}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Entrar
        </button>
      </div>
    </main>
  )
}
