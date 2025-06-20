// app/dashboard/perfil/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import Toast from '@/components/Toast'

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<any>(null)
  const [nome, setNome] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [tipo, setTipo] = useState<'success' | 'error'>('success')
  const router = useRouter()

  useEffect(() => {
    const carregar = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        router.push('/login')
      } else {
        setUsuario(data.user)
        setNome(data.user.user_metadata?.nome || '')
      }
    }
    carregar()
  }, [router])

  const salvar = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { nome }
    })
    if (error) {
      setMensagem('Erro ao salvar')
      setTipo('error')
    } else {
      setMensagem('Salvo com sucesso')
      setTipo('success')
    }
    setTimeout(() => setMensagem(''), 3000)
  }

  return (
    <motion.div
      className="max-w-xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-6">Perfil</h1>
      <div className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-medium mb-1">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            value={usuario?.email || ''}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600"
          />
        </div>
        <motion.button
          onClick={salvar}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Salvar
        </motion.button>
      </div>
      {mensagem && (
        <Toast message={mensagem} type={tipo} onClose={() => setMensagem('')} />
      )}
    </motion.div>
  )
}
