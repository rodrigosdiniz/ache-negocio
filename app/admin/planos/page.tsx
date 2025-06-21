'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const EMAIL_ADMIN = 'contato@achenegocio.com.br'

export default function AdminPlanosPage() {
  const supabase = createClientComponentClient()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [usuariosPlanos, setUsuariosPlanos] = useState<any[]>([])

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
    const carregarPlanos = async () => {
      const { data } = await supabase
        .from('usuarios_planos')
        .select('id, plano, email, created_at')
        .order('created_at', { ascending: false })

      setUsuariosPlanos(data || [])
    }
    if (isAdmin) carregarPlanos()
  }, [isAdmin])

  if (!sessionChecked) return <div className="p-8">Verificando permissão...</div>
  if (!isAdmin) return <div className="p-8 text-red-600 font-semibold">Acesso restrito.</div>

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Planos e Assinaturas</h1>

      {usuariosPlanos.length === 0 ? (
        <p className="text-gray-500">Nenhuma assinatura registrada.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Plano</th>
              <th className="p-2 border">Data</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPlanos.map((u) => (
              <tr key={u.id}>
                <td className="p-2 border text-blue-700">{u.email}</td>
                <td className="p-2 border">{u.plano}</td>
                <td className="p-2 border">{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
