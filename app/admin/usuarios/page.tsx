'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const EMAIL_ADMIN = 'contato@achenegocio.com.br'

export default function AdminUsuariosPage() {
  const supabase = createClientComponentClient()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [usuarios, setUsuarios] = useState<any[]>([])

  useEffect(() => {
    const checarAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const email = session?.user?.email
      setIsAdmin(email === EMAIL_ADMIN)
      setSessionChecked(true)
    }
    checarAdmin()
  }, [])

  useEffect(() => {
    const carregarUsuarios = async () => {
      const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 })
      if (!error) setUsuarios(data?.users || [])
    }
    if (isAdmin) carregarUsuarios()
  }, [isAdmin])

  if (!sessionChecked) return <div className="p-8">Verificando permissão...</div>
  if (!isAdmin) return <div className="p-8 text-red-600 font-semibold">Acesso restrito.</div>

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Usuários Registrados</h1>

      {usuarios.length === 0 ? (
        <p className="text-gray-500">Nenhum usuário encontrado.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Data de Criação</th>
              <th className="p-2 border">ID</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td className="p-2 border text-blue-700">{u.email}</td>
                <td className="p-2 border">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-2 border text-gray-500">{u.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
