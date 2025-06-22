'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

interface Empresa {
  id: string
  nome: string
  cidade: string
  categoria: string
  descricao: string
  telefone: string
  email: string
  website: string
  imagem_url: string | null
}

export default function EditarEmpresaPage({ params }: { params: { id: string } }) {
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [novaImagem, setNovaImagem] = useState<File | null>(null)
  const [previewImagem, setPreviewImagem] = useState<string>('')
  const [sugestaoCidade, setSugestaoCidade] = useState('')
  const [sugestaoCategoria, setSugestaoCategoria] = useState('')
  const router = useRouter()

  useEffect(() => {
    const carregarEmpresa = async () => {
      const { data } = await supabase.from('empresas').select('*').eq('id', params.id).single()
      if (data) setEmpresa(data)
    }
    carregarEmpresa()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!empresa) return

    let imagem_url = empresa.imagem_url

    if (novaImagem) {
      const fileExt = novaImagem.name.split('.').pop()
      const fileName = `${empresa.id}.${fileExt}`
      const filePath = `empresas/${fileName}`

      const { error: uploadError } = await supabase.storage.from('public').upload(filePath, novaImagem, {
        upsert: true
      })

      if (uploadError) {
        alert('Erro ao fazer upload da imagem.')
        return
      }

      const { data: publicUrl } = supabase.storage.from('public').getPublicUrl(filePath)
      imagem_url = publicUrl.publicUrl
    }

    const { error } = await supabase.from('empresas').update({ ...empresa, imagem_url }).eq('id', empresa.id)

    if (error) {
      alert('Erro ao atualizar os dados.')
      return
    }

    // Enviar sugestões se preenchidas
    if (sugestaoCidade.trim()) {
      await supabase.from('sugestoes').insert({
        tipo: 'cidade',
        valor: sugestaoCidade.trim(),
        usuario_id: (await supabase.auth.getUser()).data?.user?.id
      })
    }

    if (sugestaoCategoria.trim()) {
      await supabase.from('sugestoes').insert({
        tipo: 'categoria',
        valor: sugestaoCategoria.trim(),
        usuario_id: (await supabase.auth.getUser()).data?.user?.id
      })
    }

    alert('Empresa atualizada com sucesso.')
    router.push('/painel')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!empresa) return
    setEmpresa({ ...empresa, [e.target.name]: e.target.value })
  }

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setNovaImagem(file)
      setPreviewImagem(URL.createObjectURL(file))
    }
  }

  if (!empresa) return <p className="text-center py-10">Carregando...</p>

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Editar Empresa</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nome" value={empresa.nome} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="Nome" />
        <input name="cidade" value={empresa.cidade} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="Cidade" />
        <input name="categoria" value={empresa.categoria} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="Categoria" />
        <textarea name="descricao" value={empresa.descricao} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="Descrição" />
        <input name="telefone" value={empresa.telefone} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="Telefone" />
        <input name="email" value={empresa.email} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="Email" />
        <input name="website" value={empresa.website} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="Website" />

        {/* Sugestões */}
        <hr className="my-4" />
        <h2 className="font-semibold text-gray-700">Não encontrou sua cidade ou categoria?</h2>
        <input
          value={sugestaoCidade}
          onChange={(e) => setSugestaoCidade(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Sugira uma nova cidade"
        />
        <input
          value={sugestaoCategoria}
          onChange={(e) => setSugestaoCategoria(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Sugira uma nova categoria"
        />

        {/* Imagem */}
        {empresa.imagem_url && !previewImagem && (
          <Image src={empresa.imagem_url} alt="Imagem atual" width={300} height={200} className="rounded" />
        )}

        {previewImagem && (
          <Image src={previewImagem} alt="Nova imagem" width={300} height={200} className="rounded" />
        )}

        <input type="file" accept="image/*" onChange={handleImagemChange} />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Salvar Alterações
        </button>
      </form>
    </main>
  )
}
