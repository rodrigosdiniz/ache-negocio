// app/cadastro/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function CadastroPage() {
  const [email, setEmail] = useState('')
  const [nome, setNome] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensagem('')

    const { data, error } = await supabase.auth.signUp({
      email,
      options: {
        data: { nome },
        emailRedirectTo: `${location.origin}/login`
      }
    })

    if (error) {
      setMensagem('Erro ao cadastrar: ' + error.message)
    } else {
      setMensagem('Cadastro iniciado! Verifique seu e-mail.')
      setEmail('')
      setNome('')
    }
    setLoading(false)
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <motion.h1
        className="text-3xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Cadastro Gratuito
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 bg-white p-6 rounded-lg shadow-md"
      >
        <div>
          <label className="block font-medium mb-1">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Criar conta gratuita'}
        </motion.button>
        <AnimatePresence>
          {mensagem && (
            <motion.p
              className="text-center mt-4 text-sm text-green-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {mensagem}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.form>
    </main>
  )
}
