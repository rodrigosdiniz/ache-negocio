// app/empresa/cadastrar/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/context/toast-context'

export default function CadastrarEmpresaPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [form, setForm] = useState({
    nome: '',
    responsavel: '',
    email: '',
    telefone: '',
    cidade: '',
    categoria: '',
    descricao: '',
    website: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('empresas').insert([form])

    if (error) {
      showToast('Erro ao cadastrar empresa', 'error')
    } else {
      showToast('Empresa cadastrada com sucesso!', 'success')
      router.push('/')
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Cadastrar Empresa</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input name="nome" placeholder="Nome da empresa" value={form.nome} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        <input name="responsavel" placeholder="Responsável" value={form.responsavel} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        <input name="cidade" placeholder="Cidade" value={form.cidade} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        <input name="categoria" placeholder="Categoria" value={form.categoria} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        <textarea name="descricao" placeholder="Descrição da empresa" value={form.descricao} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        <input name="website" placeholder="Website (opcional)" value={form.website} onChange={handleChange} className="w-full border rounded px-3 py-2" />

        <div className="flex flex-col md:flex-row justify-between gap-4 mt-6">
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">
            Cadastrar
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={() => router.push('/')} className="border px-4 py-2 rounded hover:bg-gray-100">
              Voltar ao início
            </button>
            <button type="button" onClick={() => router.push('/empresas')} className="border px-4 py-2 rounded hover:bg-gray-100">
              Ver empresas
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}
