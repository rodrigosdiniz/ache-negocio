'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  User,
  CreditCard,
  Settings,
  LogOut
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
    <div className="flex min-h-screen">
      {/* Menu lateral */}
      <aside className="w-64 bg-gray-100 border-r p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Painel</h2>
        <nav className="space-y-2">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setAba(item.id)}
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
      <main className="flex-1 p-6">
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
