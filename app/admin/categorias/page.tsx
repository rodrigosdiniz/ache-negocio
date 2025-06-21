'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const EMAIL_ADMIN = 'contato@achenegocio.com.br'

export default function AdminCategoriasPage() {
  const supabase = createClientComponentClient()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [categorias, setCategorias] = useState<any[]>([])
  const [novaCategoria, setNovaCategoria] = useState('')

  useEffect(() => {
    const checarAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const email = session?.user?.email
      setIsAdmin(email === EMAIL_ADMIN)
      setSessionChecked(true)
    }
    checarAdmin()
  }, [])

  const carregarCategorias = async () => {
    const { data } = await supabase.from('categorias').select('*').order('nome')
    setCategorias(data || [])
  }

  useEffect(() => {
    if (isAdmin) carregarCategorias()
  }, [isAdmin])

  const adicionarCategoria = async () => {
    if (!novaCategoria.trim()) return
    await supabase.from('categorias').insert({ nome: novaCategoria })
    setNovaCategoria('')
    carregarCategorias()
  }

  const excluirCategoria = async (id: string) => {
    const confirmar = confirm('Tem certeza que deseja excluir esta categoria?')
    if (!confirmar) return
    await supabase.from('categorias').delete().eq('id', id)
    carregarCategorias()
  }

  if (!sessionChecked) return <div className="p-8">Verificando permissão...</div>
  if (!isAdmin) return <div className="p-8 text-red-600 font-semibold">Acesso restrito.</div>

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Categorias</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          placeholder="Nova categoria"
          className="border rounded px-3 py-2 w-full"
        />
        <button onClick={adicionarCategoria} className="bg-blue-600 text-white px-4 rounded">Adicionar</button>
      </div>

      <ul className="divide-y">
        {categorias.map((cat) => (
          <li key={cat.id} className="py-2 flex justify-between items-center">
            <span>{cat.nome}</span>
            <button onClick={() => excluirCategoria(cat.id)} className="text-red-600 hover:underline text-sm">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
