'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loader2, Pencil, Trash2, Save, XCircle } from 'lucide-react'

const EMAIL_ADMIN = 'contato@achenegocio.com.br'

export default function AdminCategoriasPage() {
  const supabase = createClientComponentClient()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [categorias, setCategorias] = useState<any[]>([])
  const [novaCategoria, setNovaCategoria] = useState('')
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [novoNome, setNovoNome] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
    const { data } = await supabase.from('categorias').select('*').order('nome')
    setCategorias(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (isAdmin) carregarCategorias()
  }, [isAdmin])

  const adicionarCategoria = async () => {
    setErro('')
    if (!novaCategoria.trim()) return
    const existente = categorias.find(c => c.nome.toLowerCase() === novaCategoria.trim().toLowerCase())
    if (existente) {
      setErro('Esta categoria já existe.')
      return
    }
    setLoading(true)
    await supabase.from('categorias').insert({ nome: novaCategoria })
    setNovaCategoria('')
    await carregarCategorias()
  }

  const excluirCategoria = async (id: string) => {
    const confirmar = confirm('Tem certeza que deseja excluir esta categoria?')
    if (!confirmar) return
    setLoading(true)
    await supabase.from('categorias').delete().eq('id', id)
    await carregarCategorias()
  }

  const salvarEdicao = async (id: string) => {
    setErro('')
    if (!novoNome.trim()) return
    const existente = categorias.find(c => c.nome.toLowerCase() === novoNome.trim().toLowerCase() && c.id !== id)
    if (existente) {
      setErro('Já existe uma categoria com esse nome.')
      return
    }
    setLoading(true)
    await supabase.from('categorias').update({ nome: novoNome }).eq('id', id)
    setEditandoId(null)
    setNovoNome('')
    await carregarCategorias()
  }

  if (!sessionChecked) return <div className="p-8">Verificando permissão...</div>
  if (!isAdmin) return <div className="p-8 text-red-600 font-semibold">Acesso restrito.</div>

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Categorias</h1>

      <p className="text-sm text-gray-500 mb-2">Total de categorias: {categorias.length}</p>

      <div className="flex gap-2 mb-4">
        <input
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          placeholder="Nova categoria"
          className="border rounded px-3 py-2 w-full"
          aria-label="Campo para adicionar nova categoria"
        />
        <button
          onClick={adicionarCategoria}
          className="bg-blue-600 text-white px-4 rounded"
          aria-label="Adicionar categoria"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Adicionar'}
        </button>
      </div>

      {erro && <p className="text-red-600 text-sm mb-4">{erro}</p>}

      <ul className="divide-y">
        {loading && categorias.length === 0 ? (
          <div className="flex justify-center items-center h-20">
            <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          </div>
        ) : (
          categorias.map((cat) => (
            <li key={cat.id} className="py-2 flex justify-between items-center">
              {editandoId === cat.id ? (
                <>
                  <input
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    className="border px-2 py-1 rounded mr-2"
                    aria-label="Editar nome da categoria"
                  />
                  <button onClick={() => salvarEdicao(cat.id)} className="text-green-600 mr-2" aria-label="Salvar edição">
                    <Save size={16} />
                  </button>
                  <button onClick={() => setEditandoId(null)} className="text-gray-500" aria-label="Cancelar edição">
                    <XCircle size={16} />
                  </button>
                </>
              ) : (
                <>
                  <span>{cat.nome}</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setEditandoId(cat.id); setNovoNome(cat.nome) }}
                      className="text-blue-600"
                      aria-label="Editar categoria"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => excluirCategoria(cat.id)}
                      className="text-red-600"
                      aria-label="Excluir categoria"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
