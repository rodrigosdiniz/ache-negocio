'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MenuSuperior() {
  const pathname = usePathname()
  const supabase = createClient()
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    const verificarLogin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLogged(!!user)
    }
    verificarLogin()
  }, [supabase])

  const linkClass = (href: string) =>
    pathname === href
      ? 'text-blue-600 font-semibold underline'
      : 'text-gray-700 hover:text-blue-600'

  return (
    <header className="border-b bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-700">Ache Negócio</Link>

        <div className="flex items-center gap-6">
          <Link href="/empresas" className={linkClass('/empresas')}>Empresas</Link>
          <Link href="/categorias" className={linkClass('/categorias')}>Categorias</Link>
          <Link href="/contato" className={linkClass('/contato')}>Fale Conosco</Link>
          {isLogged ? (
            <Link href="/painel" className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700">
              Painel
            </Link>
          ) : (
            <Link href="/login" className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700">
              Entrar
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
