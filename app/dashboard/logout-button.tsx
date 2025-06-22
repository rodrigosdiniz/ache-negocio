// app/dashboard/logout-button.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
    >
      Sair
    </button>
  )
}
