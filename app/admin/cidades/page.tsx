'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loader2, Pencil, Trash2, Save, XCircle } from 'lucide-react'

const EMAIL_ADMIN = 'contato@achenegocio.com.br'

export default function AdminCidadesPage() {
  const supabase = createClientComponentClient()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [cidades, setCidades] = useState<any[]>([])
  const [novaCidade, setNovaCidade] = useState('')
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

  const carregarCidades = async () => {
    setLoading(true)
    const { data } = await supabase.from('cidades').select('*').order('nome')
    setCidades(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (isAdmin) carregarCidades()
  }, [isAdmin])

  const adicionarCidade = async () => {
    setErro('')
    if (!novaCidade.trim()) return
    const existente = cidades.find(c => c.nome.toLowerCase() === novaCidade.trim().toLowerCase())
    if (existente) {
      setErro('Esta cidade já existe.')
      return
    }
    setLoading(true)
    await supabase.from('cidades').insert({ nome: novaCidade })
    setNovaCidade('')
    await carregarCidades()
  }

  const excluirCidade = async (id: string) => {
    const confirmar = confirm('Tem certeza que deseja excluir esta cidade?')
    if (!confirmar) return
    setLoading(true)
    await supabase.from('cidades').delete().eq('id', id)
    await carregarCidades()
  }

  const salvarEdicao = async (id: string) => {
    setErro('')
    if (!novoNome.trim()) return
    const existente = cidades.find(c => c.nome.toLowerCase() === novoNome.trim().toLowerCase() && c.id !== id)
    if (existente) {
      setErro('Já existe uma cidade com esse nome.')
      return
    }
    setLoading(true)
    await supabase.from('cidades').update({ nome: novoNome }).eq('id', id)
    setEditandoId(null)
    setNovoNome('')
    await carregarCidades()
  }

  if (!sessionChecked) return <div className="p-8">Verificando permissão...</div>
  if (!isAdmin) return <div className="p-8 text-red-600 font-semibold">Acesso restrito.</div>

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Cidades</h1>

      <p className="text-sm text-gray-500 mb-2">Total de cidades: {cidades.length}</p>

      <div className="flex gap-2 mb-4">
        <input
          value={novaCidade}
          onChange={(e) => setNovaCidade(e.target.value)}
          placeholder="Nova cidade"
          className="border rounded px-3 py-2 w-full"
          aria-label="Campo para adicionar nova cidade"
        />
        <button
          onClick={adicionarCidade}
          className="bg-blue-600 text-white px-4 rounded"
          aria-label="Adicionar cidade"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Adicionar'}
        </button>
      </div>

      {erro && <p className="text-red-600 text-sm mb-4">{erro}</p>}

      <ul className="divide-y">
        {loading && cidades.length === 0 ? (
          <div className="flex justify-center items-center h-20">
            <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          </div>
        ) : (
          cidades.map((cidade) => (
            <li key={cidade.id} className="py-2 flex justify-between items-center">
              {editandoId === cidade.id ? (
                <>
                  <input
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    className="border px-2 py-1 rounded mr-2"
                    aria-label="Editar nome da cidade"
                  />
                  <button onClick={() => salvarEdicao(cidade.id)} className="text-green-600 mr-2" aria-label="Salvar edição">
                    <Save size={16} />
                  </button>
                  <button onClick={() => setEditandoId(null)} className="text-gray-500" aria-label="Cancelar edição">
                    <XCircle size={16} />
                  </button>
                </>
              ) : (
                <>
                  <span>{cidade.nome}</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setEditandoId(cidade.id); setNovoNome(cidade.nome) }}
                      className="text-blue-600"
                      aria-label="Editar cidade"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => excluirCidade(cidade.id)}
                      className="text-red-600"
                      aria-label="Excluir cidade"
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
