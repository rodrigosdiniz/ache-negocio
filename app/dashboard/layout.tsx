'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, LogOut, User, CreditCard, Settings } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const menu = [
  { id: 'dados', label: 'Meus Dados', href: '/dashboard', icon: User },
  { id: 'assinatura', label: 'Assinatura', href: '/dashboard/assinatura', icon: CreditCard },
  { id: 'config', label: 'Configurações', href: '/dashboard/config', icon: Settings }
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [menuAberto, setMenuAberto] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const sair = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen relative">
      {/* Overlay escurecido no mobile */}
      {menuAberto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* Botão hamburguer */}
      <button
        onClick={() => setMenuAberto(true)}
        className="md:hidden absolute top-4 left-4 z-50 bg-white p-2 rounded shadow"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Menu lateral */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-100 border-r p-4 z-40 transform transition-transform duration-200 ${
          menuAberto ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Painel</h2>
          <button
            className="md:hidden"
            onClick={() => setMenuAberto(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setMenuAberto(false)}
              className={`flex items-center px-3 py-2 rounded-md hover:bg-blue-100 ${
                pathname === item.href ? 'bg-blue-200' : ''
              }`}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Link>
          ))}

          <button
            onClick={sair}
            className="flex items-center w-full px-3 py-2 mt-6 text-red-600 hover:bg-red-100 rounded-md"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </button>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 md:ml-64">{children}</main>
    </div>
  )
}
