// components/LogoutButton.tsx
'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useToast } from '@/context/toast-context'

export default function LogoutButton() {
  const router = useRouter()
  const { showToast } = useToast()

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      showToast('Erro ao sair', 'error')
    } else {
      showToast('Você saiu com sucesso', 'success')
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  return (
    <button
      onClick={logout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
    >
      Sair
    </button>
  )
}
