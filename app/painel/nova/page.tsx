'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function NovaEmpresaPage() {
  const [empresa, setEmpresa] = useState({
    nome: '', cidade: '', categoria: '', descricao: '', telefone: '', email: '', website: ''
  })
  const [imagem, setImagem] = useState<File | null>(null)
  const [previewImagem, setPreviewImagem] = useState('')
  const [sugestaoCidade, setSugestaoCidade] = useState('')
  const [sugestaoCategoria, setSugestaoCategoria] = useState('')
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEmpresa({ ...empresa, [e.target.name]: e.target.value })
  }

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setImagem(file)
      setPreviewImagem(URL.createObjectURL(file))
    }
  }

  const enviarSugestao = async (tipo: 'cidade' | 'categoria', valor: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.id) return
    await supabase.from('sugestoes').insert({ usuario_id: session.user.id, tipo, valor })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.id) return alert('Você precisa estar logado.')

    const { data, error } = await supabase
      .from('empresas')
      .insert({ ...empresa, usuario_id: session.user.id })
      .select()
      .single()

    if (error || !data) {
      alert('Erro ao cadastrar empresa.')
      return
    }

    if (imagem) {
      const ext = imagem.name.split('.').pop()
      const fileName = `${data.id}.${ext}`
      const path = `empresas/${fileName}`

      const { error: uploadError } = await supabase.storage.from('public').upload(path, imagem, { upsert: true })
      if (!uploadError) {
        const { data: publicUrl } = supabase.storage.from('public').getPublicUrl(path)
        await supabase.from('empresas').update({ imagem_url: publicUrl.publicUrl }).eq('id', data.id)
      }
    }

    if (sugestaoCidade.trim()) await enviarSugestao('cidade', sugestaoCidade.trim())
    if (sugestaoCategoria.trim()) await enviarSugestao('categoria', sugestaoCategoria.trim())

    alert('Empresa cadastrada com sucesso.')
    router.push('/painel')
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Nova Empresa</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nome" value={empresa.nome} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="Nome" required />
        <input name="cidade" value={empresa.cidade} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="Cidade" required />
        <input name="categoria" value={empresa.categoria} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="Categoria" required />

        <div className="bg-gray-50 p-3 rounded border text-sm">
          <p className="mb-2 font-medium">Não encontrou sua cidade ou categoria?</p>
          <input
            value={sugestaoCidade}
            onChange={(e) => setSugestaoCidade(e.target.value)}
            placeholder="Sugerir nova cidade (opcional)"
            className="w-full mb-2 border p-2 rounded"
          />
          <input
            value={sugestaoCategoria}
            onChange={(e) => setSugestaoCategoria(e.target.value)}
            placeholder="Sugerir nova categoria (opcional)"
            className="w-full border p-2 rounded"
          />
        </div>

        <textarea name="descricao" value={empresa.descricao} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="Descrição" />
        <input name="telefone" value={empresa.telefone} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="Telefone" />
        <input name="email" value={empresa.email} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="Email" />
        <input name="website" value={empresa.website} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="Website" />

        {previewImagem && (
          <Image src={previewImagem} alt="Pré-visualização" width={300} height={200} className="rounded" />
        )}

        <input type="file" accept="image/*" onChange={handleImagemChange} />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cadastrar Empresa
        </button>
      </form>
    </main>
  )
}
