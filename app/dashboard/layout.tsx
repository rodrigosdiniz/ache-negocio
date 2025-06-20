// app/dashboard/layout.tsx
'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import LogoutButton from './logout-button'
import Link from 'next/link'
import { Home, Menu, User, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUser(data.user)
        if (pathname === '/dashboard') {
          alert(`Bem-vindo, ${data.user.user_metadata?.nome || data.user.email}!`)
        }
      }
    }
    carregar()
  }, [pathname, supabase])

  const linkClass = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 ${
      pathname === path ? 'bg-gray-800 font-semibold' : ''
    }`

  const Sidebar = () => (
    <nav className="w-64 bg-gray-900 text-white flex-col py-6 px-4 space-y-4 h-full">
      <h2 className="text-xl font-semibold mb-6">Ache Negócio</h2>
      <Link href="/dashboard" className={linkClass('/dashboard')} onClick={() => setMobileOpen(false)}>
        <Home size={18} /> Início
      </Link>
      <Link href="/dashboard/perfil" className={linkClass('/dashboard/perfil')} onClick={() => setMobileOpen(false)}>
        <User size={18} /> Perfil
      </Link>
      <div className="mt-auto">
        <LogoutButton />
      </div>
    </nav>
  )

  return (
    <div className="flex min-h-screen">
      {/* Menu lateral fixo para desktop */}
      <aside className="hidden md:flex sticky top-0 h-screen">
        <Sidebar />
      </aside>

      {/* Botão hamburguer no topo para mobile */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md shadow-md"
      >
        <Menu size={20} />
      </button>

      {/* Menu flutuante com animação */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-64 h-full bg-gray-900 text-white p-4 relative"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white absolute top-4 right-4"
              >
                <X size={20} />
              </button>
              <Sidebar />
            </motion.div>
            <div
              className="flex-1 bg-black bg-opacity-50"
              onClick={() => setMobileOpen(false)}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteúdo principal com animação de transição */}
      <main className="flex-1 bg-gray-50 px-6 py-6 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
