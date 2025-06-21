"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function EditarEmpresaPage() {
  const router = useRouter()
  const params = useParams()
  const empresaId = params?.id as string

  const [form, setForm] = useState({
    nome: '',
    cidade: '',
    categoria: '',
    telefone: '',
    email: '',
    website: '',
    descricao: ''
  })
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const carregar = async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', empresaId)
        .single()

      if (error || !data) {
        setErro('Empresa não encontrada.')
        setLoading(false)
        return
      }

      setForm({
        nome: data.nome || '',
        cidade: data.cidade || '',
        categoria: data.categoria || '',
        telefone: data.telefone || '',
        email: data.email || '',
        website: data.website || '',
        descricao: data.descricao || ''
      })

      setLoading(false)
    }

    if (empresaId) carregar()
  }, [empresaId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    const { error } = await supabase
      .from('empresas')
      .update(form)
      .eq('id', empresaId)

    if (error) {
      setErro('Erro ao salvar as alterações.')
    } else {
      alert('Empresa atualizada com sucesso.')
      router.push('/painel')
    }
  }

  if (loading) return <p className="text-center py-10 text-gray-500">Carregando...</p>
  if (erro) return <p className="text-center py-10 text-red-600">{erro}</p>

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Editar Empresa</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nome" value={form.nome} onChange={handleChange} required className="w-full border rounded p-2" placeholder="Nome da empresa" />
        <input name="cidade" value={form.cidade} onChange={handleChange} required className="w-full border rounded p-2" placeholder="Cidade" />
        <input name="categoria" value={form.categoria} onChange={handleChange} required className="w-full border rounded p-2" placeholder="Categoria" />
        <input name="telefone" value={form.telefone} onChange={handleChange} className="w-full border rounded p-2" placeholder="Telefone" />
        <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border rounded p-2" placeholder="Email" />
        <input name="website" value={form.website} onChange={handleChange} className="w-full border rounded p-2" placeholder="Site (opcional)" />
        <textarea name="descricao" value={form.descricao} onChange={handleChange} className="w-full border rounded p-2" placeholder="Descrição" rows={4} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Salvar Alterações</button>
      </form>
    </main>
  )
}
