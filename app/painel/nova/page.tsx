'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NovaEmpresaPage() {
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('')
  const [cidade, setCidade] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [descricao, setDescricao] = useState('')
  const [imagem, setImagem] = useState<File | null>(null)
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let imagem_url = null

    if (imagem) {
      const { data, error } = await supabase.storage
        .from('imagens')
        .upload(`empresas/${Date.now()}-${imagem.name}`, imagem)

      if (error) {
        alert('Erro ao fazer upload da imagem')
        setLoading(false)
        return
      }

      const { data: publicUrl } = supabase.storage
        .from('imagens')
        .getPublicUrl(data.path)

      imagem_url = publicUrl.publicUrl
    }

    const { error } = await supabase.from('empresas').insert({
      nome,
      categoria,
      cidade,
      telefone,
      email,
      website,
      descricao,
      imagem_url,
      user_id: userId,
    })

    setLoading(false)

    if (error) {
      alert('Erro ao cadastrar empresa')
    } else {
      alert('Empresa cadastrada com sucesso')
      router.push('/painel')
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Nova Empresa</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Nome da empresa" value={nome} onChange={e => setNome(e.target.value)} className="w-full border p-2 rounded" />
        <input required placeholder="Categoria" value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full border p-2 rounded" />
        <input required placeholder="Cidade" value={cidade} onChange={e => setCidade(e.target.value)} className="w-full border p-2 rounded" />
        <input required placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} className="w-full border p-2 rounded" />
        <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded" />
        <input placeholder="Website (opcional)" value={website} onChange={e => setWebsite(e.target.value)} className="w-full border p-2 rounded" />
        <textarea placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full border p-2 rounded" />
        <input type="file" accept="image/*" onChange={e => setImagem(e.target.files?.[0] || null)} />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {loading ? 'Salvando...' : 'Cadastrar'}
        </button>
      </form>
    </main>
  )
}
