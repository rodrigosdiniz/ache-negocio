'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ExcluirEmpresa({ params }: { params: { id: string } }) {
  const [empresaNome, setEmpresaNome] = useState<string>('')
  const [carregando, setCarregando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase.from('empresas').select('nome').eq('id', params.id).single()
      if (data?.nome) setEmpresaNome(data.nome)
      setCarregando(false)
    }
    carregar()
  }, [params.id])

  const excluir = async () => {
    const res = await fetch('/api/empresa/excluir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: params.id })
    })

    if (res.ok) {
      alert('Empresa excluída com sucesso.')
      router.push('/painel')
    } else {
      alert('Erro ao excluir a empresa.')
    }
  }

  if (carregando) {
    return <p className="text-center text-sm text-gray-600 py-10">Carregando...</p>
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Excluir Empresa</h1>
      <p className="mb-6">Tem certeza que deseja excluir a empresa <strong>{empresaNome}</strong>? Esta ação é irreversível.</p>

      <button
        onClick={excluir}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mr-4"
      >
        Confirmar Exclusão
      </button>
      <button
        onClick={() => router.push('/painel')}
        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
      >
        Cancelar
      </button>
    </main>
  )
}
