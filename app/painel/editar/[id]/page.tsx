'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EditarEmpresaPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [form, setForm] = useState({
    nome: '',
    cidade: '',
    categoria: '',
    telefone: '',
    email: '',
    descricao: '',
    website: '',
    imagem_url: '',
  })
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    const carregarEmpresa = async () => {
      const { data } = await supabase.from('empresas').select('*').eq('id', params.id).single()
      if (data) setForm(data)
    }
    carregarEmpresa()
  }, [params.id])

  const atualizar = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('empresas').update(form).eq('id', params.id)
    if (!error) {
      setMensagem('Dados atualizados com sucesso!')
      router.push('/painel')
    } else {
      setMensagem('Erro ao atualizar os dados.')
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Editar Empresa</h1>
      <form onSubmit={atualizar} className="space-y-4">
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            type="text"
            placeholder={key}
            value={value ?? ''}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="w-full border p-2 rounded"
          />
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Salvar Alterações</button>
      </form>
      {mensagem && <p className="mt-4 text-sm text-center">{mensagem}</p>}
    </main>
  )
}
