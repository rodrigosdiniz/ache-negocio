'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const EMAIL_ADMIN = 'contato@achenegocio.com.br'

export default function AdminDashboardPage() {
  const supabase = createClientComponentClient()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checarAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const email = session?.user?.email
      setIsAdmin(email === EMAIL_ADMIN)
      setSessionChecked(true)
    }
    checarAdmin()
  }, [])

  if (!sessionChecked) {
    return <div className="p-8">Verificando permissão...</div>
  }

  if (!isAdmin) {
    return <div className="p-8 text-red-600 font-semibold">Acesso restrito.</div>
  }

  const links = [
    { href: '/admin/denuncias', label: 'Denúncias de Avaliações' },
    { href: '/admin/avaliacoes', label: 'Todas as Avaliações' },
    { href: '/admin/empresas', label: 'Empresas Cadastradas' },
    { href: '/admin/planos', label: 'Planos e Assinaturas' },
    { href: '/admin/usuarios', label: 'Usuários (futuro)' }
  ]

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <div className="border rounded-xl p-6 bg-white shadow hover:shadow-md hover:bg-gray-50 cursor-pointer transition">
              <h2 className="text-lg font-semibold text-blue-600">{link.label}</h2>
              <p className="text-sm text-gray-500 mt-1">Acessar {link.label.toLowerCase()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
