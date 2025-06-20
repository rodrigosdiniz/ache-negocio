// app/empresa/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MapPin, Phone, Mail, Globe, Building2 } from 'lucide-react'

export default function EmpresaDetalhesPage() {
  const { id } = useParams()
  const router = useRouter()
  const [empresa, setEmpresa] = useState<any>(null)

  useEffect(() => {
    const buscarEmpresa = async () => {
      const { data, error } = await supabase.from('empresas').select('*').eq('id', id).single()
      if (!error) setEmpresa(data)
    }
    if (id) buscarEmpresa()
  }, [id])

  if (!empresa) return <p className="text-center py-10">Carregando...</p>

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-2">{empresa.nome}</h1>
      <span className="inline-block text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded mb-6">{empresa.categoria}</span>

      <div className="space-y-2 text-gray-700 mb-6">
        <p className="flex items-center gap-2"><MapPin size={18} /> {empresa.cidade}</p>
        <p className="flex items-center gap-2"><Phone size={18} /> {empresa.telefone}</p>
        <p className="flex items-center gap-2"><Mail size={18} /> {empresa.email}</p>
        {empresa.website && (
          <p className="flex items-center gap-2">
            <Globe size={18} /> <a href={empresa.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{empresa.website}</a>
          </p>
        )}
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Descrição</h2>
        <p>{empresa.descricao}</p>
      </div>

      <button
        onClick={() => router.back()}
        className="mt-6 inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded"
      >
        Voltar
      </button>
    </main>
  )
}
