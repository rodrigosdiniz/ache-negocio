'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const EMAIL_ADMIN = 'contato@achenegocio.com.br'

export default function AdminPlanosPage() {
  const supabase = createClientComponentClient()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [usuariosPlanos, setUsuariosPlanos] = useState<any[]>([])
  const [filtroPlano, setFiltroPlano] = useState('')

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

  const planosFiltrados = usuariosPlanos.filter((u) =>
    filtroPlano ? u.plano === filtroPlano : true
  )

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Planos e Assinaturas</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por plano:</label>
        <select
          value={filtroPlano}
          onChange={(e) => setFiltroPlano(e.target.value)}
          className="border rounded-md p-2 w-full max-w-xs"
        >
          <option value="">Todos</option>
          <option value="Gratuito">Gratuito</option>
          <option value="Essencial">Essencial</option>
          <option value="Profissional">Profissional</option>
          <option value="Elite">Elite</option>
        </select>
      </div>

      {planosFiltrados.length === 0 ? (
        <p className="text-gray-500">Nenhuma assinatura encontrada.</p>
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
            {planosFiltrados.map((u) => (
              <tr key={u.id}>
                <td className="p-2 border text-blue-700">{u.email}</td>
                <td className="p-2 border">{u.plano}</td>
