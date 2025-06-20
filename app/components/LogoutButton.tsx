// components/LogoutButton.tsx
'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Toast from '@/components/Toast'

export default function LogoutButton() {
  const router = useRouter()
  const [mensagem, setMensagem] = useState('')
  const [tipo, setTipo] = useState<'success' | 'error'>('success')

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      setMensagem('Erro ao sair')
      setTipo('error')
    } else {
      setMensagem('Você saiu com sucesso')
      setTipo('success')
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
      >
        Sair
      </button>
      {mensagem && (
        <Toast message={mensagem} type={tipo} onClose={() => setMensagem('')} />
      )}
    </div>
  )
}
