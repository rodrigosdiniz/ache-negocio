'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
    const { data } = await supabase.from('cidades').select('*').order('nome')
    setCidades(data || [])
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
    await supabase.from('cidades').insert({ nome: novaCidade })
    setNovaCidade('')
    carregarCidades()
  }

  const excluirCidade = async (id: string) => {
    const confirmar = confirm('Tem certeza que deseja excluir esta cidade?')
    if (!confirmar) return
    await supabase.from('cidades').delete().eq('id', id)
    carregarCidades()
  }

  const salvarEdicao = async (id: string) => {
    setErro('')
    if (!novoNome.trim()) return
    const existente = cidades.find(c => c.nome.toLowerCase() === novoNome.trim().toLowerCase() && c.id !== id)
    if (existente) {
      setErro('Já existe uma cidade com esse nome.')
      return
    }
    await supabase.from('cidades').update({ nome: novoNome }).eq('id', id)
    setEditandoId(null)
    setNovoNome('')
    carregarCidades()
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
        />
        <button onClick={adicionarCidade} className="bg-blue-600 text-white px-4 rounded">Adicionar</button>
      </div>

      {erro && <p className="text-red-600 text-sm mb-4">{erro}</p>}

      <ul className="divide-y">
        {cidades.map((cidade) => (
          <li key={cidade.id} className="py-2 flex justify-between items-center">
            {editandoId === cidade.id ? (
              <>
                <input
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="border px-2 py-1 rounded mr-2"
                />
                <button onClick={() => salvarEdicao(cidade.id)} className="text-green-600 mr-2">Salvar</button>
                <button onClick={() => setEditandoId(null)} className="text-gray-500">Cancelar</button>
              </>
            ) : (
              <>
                <span>{cidade.nome}</span>
                <div className="flex gap-3">
                  <button onClick={() => { setEditandoId(cidade.id); setNovoNome(cidade.nome) }} className="text-blue-600 text-sm">Editar</button>
                  <button onClick={() => excluirCidade(cidade.id)} className="text-red-600 hover:underline text-sm">Excluir</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
