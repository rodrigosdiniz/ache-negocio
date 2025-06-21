'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CadastrarEmpresa() {
  const [nome, setNome] = useState('')
  const [cidade, setCidade] = useState('')
  const [categoria, setCategoria] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [descricao, setDescricao] = useState('')
  const [imagemUrl, setImagemUrl] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      setErro('Usuário não autenticado.')
      setCarregando(false)
      return
    }

    const { error } = await supabase.from('empresas').insert({
      nome,
      cidade,
      categoria,
      telefone,
      email,
      website,
      descricao,
      imagem_url: imagemUrl,
      user_id: user.id,
    })

    if (error) {
      setErro('Erro ao cadastrar a empresa.')
      setCarregando(false)
    } else {
      router.push('/painel')
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Cadastrar Nova Empresa</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome da empresa" required className="w-full p-2 border rounded" />
        <input value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Cidade" required className="w-full p-2 border rounded" />
        <input value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Categoria (ex: Clínica, Loja...)" required className="w-full p-2 border rounded" />
        <input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="Telefone" className="w-full p-2 border rounded" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
        <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="Website (ex: https://empresa.com)" className="w-full p-2 border rounded" />
        <input value={imagemUrl} onChange={e => setImagemUrl(e.target.value)} placeholder="URL da imagem (opcional)" className="w-full p-2 border rounded" />
        <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição" className="w-full p-2 border rounded h-32" />
        {erro && <p className="text-red-600 text-sm">{erro}</p>}
        <button type="submit" disabled={carregando} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {carregando ? 'Salvando...' : 'Cadastrar Empresa'}
        </button>
      </form>
    </main>
  )
}
