'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EditarEmpresa() {
  const { id } = useParams()
  const router = useRouter()
  const [form, setForm] = useState({ nome: '', cidade: '', categoria: '', descricao: '', telefone: '', email: '', website: '' })
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const carregarEmpresa = async () => {
      const { data, error } = await supabase.from('empresas').select('*').eq('id', id).single()
      if (error) {
        setErro('Erro ao carregar empresa.')
        return
      }
      setForm({
        nome: data.nome || '',
        cidade: data.cidade || '',
        categoria: data.categoria || '',
        descricao: data.descricao || '',
        telefone: data.telefone || '',
        email: data.email || '',
        website: data.website || ''
      })
      setCarregando(false)
    }
    carregarEmpresa()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('empresas').update(form).eq('id', id)
    if (error) {
      setErro('Erro ao atualizar empresa.')
    } else {
      router.push('/painel')
    }
  }

  if (carregando) return <p className="text-center py-10 text-gray-600">Carregando...</p>

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Editar Empresa</h1>
      {erro && <p className="text-red-600 mb-4">{erro}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome da empresa" className="w-full p-2 border rounded" required />
        <input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" className="w-full p-2 border rounded" required />
        <input name="categoria" value={form.categoria} onChange={handleChange} placeholder="Categoria" className="w-full p-2 border rounded" required />
        <textarea name="descricao" value={form.descricao} onChange={handleChange} placeholder="Descrição" className="w-full p-2 border rounded h-24" />
        <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="Telefone" className="w-full p-2 border rounded" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="E-mail" className="w-full p-2 border rounded" />
        <input name="website" value={form.website} onChange={handleChange} placeholder="Website" className="w-full p-2 border rounded" />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Salvar Alterações</button>
      </form>
    </main>
  )
}
