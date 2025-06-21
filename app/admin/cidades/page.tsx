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
    if (!novaCidade.trim()) return
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

  if (!sessionChecked) return <div className="p-8">Verificando permissão...</div>
  if (!isAdmin) return <div className="p-8 text-red-600 font-semibold">Acesso restrito.</div>

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Cidades</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={novaCidade}
          onChange={(e) => setNovaCidade(e.target.value)}
          placeholder="Nova cidade"
          className="border rounded px-3 py-2 w-full"
        />
        <button onClick={adicionarCidade} className="bg-blue-600 text-white px-4 rounded">Adicionar</button>
      </div>

      <ul className="divide-y">
        {cidades.map((cidade) => (
          <li key={cidade.id} className="py-2 flex justify-between items-center">
            <span>{cidade.nome}</span>
            <button onClick={() => excluirCidade(cidade.id)} className="text-red-600 hover:underline text-sm">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
