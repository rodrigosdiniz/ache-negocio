// app/empresa/cadastrar/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { uploadImagemEmpresa } from '@/lib/uploadImagem'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

export default function CadastrarEmpresa() {
  const router = useRouter()
  const [form, setForm] = useState({
    nome: '',
    cidade: '',
    telefone: '',
    email: '',
    website: '',
    categoria: '',
    descricao: ''
  })
  const [imagem, setImagem] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.from('empresas').insert({ ...form }).select().single()

    if (error) {
      toast({ title: 'Erro', description: 'Erro ao salvar empresa', variant: 'destructive' })
      setLoading(false)
      return
    }

    let imagemUrl = ''
    if (imagem) {
      try {
        imagemUrl = await uploadImagemEmpresa(data.id, imagem)
        await supabase.from('empresas').update({ imagem_url: imagemUrl }).eq('id', data.id)
      } catch (err) {
        toast({ title: 'Erro na imagem', description: 'Erro ao enviar a imagem' })
      }
    }

    toast({ title: 'Sucesso', description: 'Empresa cadastrada com sucesso!' })
    router.push('/empresas')
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Cadastrar Empresa</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="nome" placeholder="Nome" className="input" onChange={handleChange} required />
        <input type="text" name="cidade" placeholder="Cidade" className="input" onChange={handleChange} required />
        <input type="text" name="telefone" placeholder="Telefone" className="input" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className="input" onChange={handleChange} required />
        <input type="text" name="website" placeholder="Website" className="input" onChange={handleChange} />
        <input type="text" name="categoria" placeholder="Categoria" className="input" onChange={handleChange} required />
        <textarea name="descricao" placeholder="Descrição" className="input" rows={4} onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={(e) => e.target.files && setImagem(e.target.files[0])} />
        <button disabled={loading} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          {loading ? 'Salvando...' : 'Cadastrar'}
        </button>
      </form>
    </main>
  )
}
