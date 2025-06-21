'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { saveAs } from 'file-saver'

const EMAIL_ADMIN = 'contato@achenegocio.com.br'

export default function AdminUsuariosPage() {
  const supabase = createClientComponentClient()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [filtroEmail, setFiltroEmail] = useState('')
  const [filtroData, setFiltroData] = useState('')
  const [pagina, setPagina] = useState(1)
  const porPagina = 20

  useEffect(() => {
    const checarAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const email = session?.user?.email
      setIsAdmin(email === EMAIL_ADMIN)
      setSessionChecked(true)
    }
    checarAdmin()
  }, [])

  const carregarUsuarios = async () => {
    const { data, error } = await supabase.auth.admin.listUsers({ page: pagina, perPage: porPagina })
    if (!error) setUsuarios(data?.users || [])
  }

  useEffect(() => {
    if (isAdmin) carregarUsuarios()
  }, [isAdmin, pagina])

  const excluirUsuario = async (id: string) => {
    const confirmar = confirm('Tem certeza que deseja excluir este usuário? Esta ação é permanente.')
    if (!confirmar) return
    const { error } = await supabase.auth.admin.deleteUser(id)
    if (!error) carregarUsuarios()
  }

  const exportarCSV = () => {
    const cabecalho = ['Email', 'Data de Criação', 'ID']
    const linhas = usuariosFiltrados.map(u => [u.email, new Date(u.created_at).toLocaleDateString(), u.id])
    const conteudo = [cabecalho, ...linhas].map(l => l.join(',')).join('\n')
    const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'usuarios.csv')
  }

  const usuariosFiltrados = usuarios.filter((u) => {
    const emailMatch = u.email?.toLowerCase().includes(filtroEmail.toLowerCase())
    const dataMatch = filtroData ? new Date(u.created_at).toISOString().split('T')[0] === filtroData : true
    return emailMatch && dataMatch
  })

  if (!sessionChecked) return <div className="p-8">Verificando permissão...</div>
  if (!isAdmin) return <div className="p-8 text-red-600 font-semibold">Acesso restrito.</div>

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Usuários Registrados</h1>

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Filtrar por e-mail"
          value={filtroEmail}
          onChange={(e) => setFiltroEmail(e.target.value)}
          className="border p-2 rounded-md"
        />
        <input
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
          className="border p-2 rounded-md"
        />
        <button
          onClick={exportarCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Exportar CSV
        </button>
      </div>

      {usuariosFiltrados.length === 0 ? (
        <p className="text-gray-500">Nenhum usuário encontrado.</p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-2">
            Exibindo {usuariosFiltrados.length} usuários nesta página.
          </p>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Data de Criação</th>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u) => (
                <tr key={u.id}>
                  <td className="p-2 border text-blue-700">{u.email}</td>
                  <td className="p-2 border">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="p-2 border text-gray-500">{u.id}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => excluirUsuario(u.id)}
                      className="text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setPagina(Math.max(1, pagina - 1))}
              disabled={pagina === 1}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm">Página {pagina}</span>
            <button
              onClick={() => setPagina(pagina + 1)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  )
}
