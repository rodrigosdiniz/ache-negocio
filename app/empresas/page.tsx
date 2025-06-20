// app/empresas/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Building, MapPin, Phone } from 'lucide-react'

interface Empresa {
  id: string
  nome: string
  cidade: string
  categoria: string
  telefone: string
  descricao: string
}

export default function ListaEmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])

  useEffect(() => {
    const carregarEmpresas = async () => {
      const { data, error } = await supabase.from('empresas').select('*').order('created_at', { ascending: false })
      if (!error && data) setEmpresas(data as Empresa[])
    }
    carregarEmpresas()
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Empresas Cadastradas</h1>
      {empresas.length === 0 ? (
        <p className="text-center text-gray-600">Nenhuma empresa cadastrada ainda.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {empresas.map((empresa) => (
            <div key={empresa.id} className="border rounded-xl shadow bg-white p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">{empresa.nome}</h2>
                <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {empresa.categoria}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{empresa.descricao.slice(0, 100)}...</p>
              <div className="flex flex-col gap-1 text-sm text-gray-700">
                <span className="flex items-center gap-1"><MapPin size={16} /> {empresa.cidade}</span>
                <span className="flex items-center gap-1"><Phone size={16} /> {empresa.telefone}</span>
              </div>
              <button className="mt-4 text-blue-600 hover:underline text-sm font-medium">Ver detalhes</button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
