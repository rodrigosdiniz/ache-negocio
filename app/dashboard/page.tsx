'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  User,
  CreditCard,
  Settings,
  LogOut,
  Menu
} from 'lucide-react'

const menu = [
  { id: 'dados', nome: 'Meus Dados', icon: User },
  { id: 'assinatura', nome: 'Assinatura', icon: CreditCard },
  { id: 'config', nome: 'Configurações', icon: Settings }
]

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<any>(null)
  const [carregando, setCarregando] = useState(true)
  const [aba, setAba] = useState('dados')
  const [menuAberto, setMenuAberto] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const verificarUsuario = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        router.push('/login')
      } else {
        setUsuario(data.user)
      }
      setCarregando(false)
    }

    verificarUsuario()
  }, [router])

  const sair = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (carregando) return <p className="text-center mt-10">Carregando...</p>

  return (
    <div className="flex min-h-screen relative">
      {/* Botão hambúrguer no mobile */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 bg-white p-2 rounded shadow"
        onClick={() => setMenuAberto(!menuAberto)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Menu lateral */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-100 border-r p-4 z-40 transform transition-transform duration-200 ${
          menuAberto ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-6">Painel</h2>
        <nav className="space-y-2">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setAba(item.id)
                setMenuAberto(false)
              }}
              className={`flex items-center w-full px-3 py-2 rounded-md text-left hover:bg-blue-100 ${
                aba === item.id ? 'bg-blue-200' : ''
              }`}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.nome}
            </button>
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
      <main className="flex-1 p-6 md:ml-64">
        <h1 className="text-2xl font-bold mb-4">
          {menu.find((m) => m.id === aba)?.nome}
        </h1>

        {aba === 'dados' && (
          <div>
            <p><strong>Nome:</strong> {usuario?.user_metadata?.nome || '—'}</p>
            <p><strong>Email:</strong> {usuario?.email}</p>
          </div>
        )}

        {aba === 'assinatura' && (
          <p className="text-gray-700">Funcionalidade de assinatura em breve.</p>
        )}

        {aba === 'config' && (
          <p className="text-gray-700">Configurações disponíveis em breve.</p>
        )}
      </main>
    </div>
  )
}
