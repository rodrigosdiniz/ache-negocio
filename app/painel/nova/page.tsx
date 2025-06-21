'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NovaEmpresaPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    nome: '',
    cidade: '',
    categoria: '',
    descricao: '',
    telefone: '',
    email: '',
    website: '',
  })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setErro('Usuário não autenticado.')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('empresas').insert({
      ...form,
      user_id: user.id,
    })

    if (error) {
      setErro('Erro ao salvar: ' + error.message)
    } else {
      router.push('/painel')
    }

    setLoading(false)
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Nova Empresa</h1>

      {erro && <p className="text-red-600 mb-4">{erro}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nome"
          placeholder="Nome da empresa"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cidade"
          placeholder="Cidade"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="categoria"
          placeholder="Categoria (ex: Advogado, Restaurante...)"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <textarea
          name="descricao"
          placeholder="Descrição da empresa"
          className="w-full p-2 border rounded"
          rows={4}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="telefone"
          placeholder="Telefone (WhatsApp)"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail de contato"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="url"
          name="website"
          placeholder="Website (opcional)"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Cadastrar'}
        </button>
      </form>
    </main>
  )
}
