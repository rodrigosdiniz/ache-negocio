'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function EditarEmpresaPage() {
  const { id } = useParams()
  const router = useRouter()

  const [empresa, setEmpresa] = useState({
    nome: '',
    cidade: '',
    categoria: '',
    telefone: '',
    email: '',
    website: '',
    descricao: ''
  })
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    const carregarEmpresa = async () => {
      const { data } = await supabase.from('empresas').select('*').eq('id', id).single()
      if (data) setEmpresa(data)
      setCarregando(false)
    }
    carregarEmpresa()
  }, [id])

  const atualizarEmpresa = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)

    const { error } = await supabase.from('empresas').update(empresa).eq('id', id)

    setSalvando(false)
    if (!error) {
      alert('Empresa atualizada com sucesso!')
      router.push('/painel')
    } else {
      alert('Erro ao atualizar a empresa.')
    }
  }

  if (carregando) {
    return <p className="text-center py-10 text-gray-600">Carregando...</p>
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Editar Empresa</h1>
      <form onSubmit={atualizarEmpresa} className="space-y-4">
        {['nome', 'cidade', 'categoria', 'telefone', 'email', 'website', 'descricao'].map((campo) => (
          <div key={campo}>
            <label className="block mb-1 font-medium capitalize">{campo}</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={empresa[campo as keyof typeof empresa]}
              onChange={(e) => setEmpresa({ ...empresa, [campo]: e.target.value })}
              required={campo === 'nome'}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={salvando}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {salvando ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </main>
  )
}
